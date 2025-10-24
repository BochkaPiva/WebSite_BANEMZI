"use client";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { RU_CITIES, filterCities } from '@/data/cities';
import Reveal from './Reveal';

type Step1 = { eventType: 'corporate' | 'teambuilding' | 'presentation' | 'promo' | 'business' };
type Step2 = { city: string; guestsBucket: 'lt20' | '20_50' | '50_200' | '200_500' | '500p' };
type Callback = { type: 'asap' | 'slot'; atUtc?: string };

export default function LeadForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [step1, setStep1] = useState<Step1>({ eventType: 'corporate' });
  const [step2, setStep2] = useState<Step2>({ city: '', guestsBucket: '20_50' });
  const [contact, setContact] = useState('');
  const [callback, setCallback] = useState<Callback>({ type: 'asap' });
  const [message, setMessage] = useState<string | null>(null);
  const [showCities, setShowCities] = useState(false);
  const cityBoxRef = useRef<HTMLDivElement | null>(null);
  const [consent, setConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showConsentDoc, setShowConsentDoc] = useState(false);

  // Simple and reliable scroll blocking
  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    if (showPolicy || showConsentDoc) {
      // Block body scroll
      document.body.style.overflow = 'hidden';
      
      // Prevent scroll events
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('keydown', (e) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      });
      
      // Disable Lenis if available
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Remove scroll event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      
      // Re-enable Lenis if available
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [showPolicy, showConsentDoc]);

  // Hide cities dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(event.target as Node)) {
        setShowCities(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setMessage(null);
    try {
      if (!consent) {
        setMessage('Поставьте галочку согласия на обработку данных.');
        return;
      }
      
      console.log('Form data before submit:', {
        eventType: step1.eventType,
        city: step2.city,
        cityTrimmed: step2.city.trim(),
        cityInList: RU_CITIES.includes(step2.city.trim()),
        guestsBucket: step2.guestsBucket,
        contact: contact,
        callback: callback,
        consent: consent
      });
      
      let recaptchaToken: string | null = null;
      if ((window as any).grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await (window as any).grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
      }
      const cityOk = RU_CITIES.includes(step2.city.trim());
      
      console.log('Sending request to API with data:', {
        eventType: step1.eventType,
        city: cityOk ? step2.city.trim() : '',
        guestsBucket: step2.guestsBucket,
        contact,
        callback,
        recaptchaToken: recaptchaToken ? 'present' : 'missing',
        utm: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || '' : '',
        consentAccepted: true,
      });
      
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: step1.eventType,
          city: cityOk ? step2.city.trim() : '',
          guestsBucket: step2.guestsBucket,
          contact,
          callback,
          recaptchaToken,
          utm: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || '' : '',
          consentAccepted: true,
        }),
      });
      let json: any = {};
      try { json = await res.json(); } catch {}
      
      console.log('Form submission response:', {
        status: res.status,
        ok: res.ok,
        json: json
      });
      
      // Детальный лог ошибки
      if (!res.ok) {
        console.error('API Error Details:', {
          status: res.status,
          statusText: res.statusText,
          error: json.error,
          message: json.message,
          details: json.details
        });
      }
      
      if (!res.ok || !json.success) {
        // Показываем более конкретное сообщение об ошибке
        if (json.error === 'INVALID_CITY') {
          setMessage('Выберите город из списка предложенных вариантов.');
        } else if (json.error === 'VALIDATION_ERROR') {
          setMessage('Проверьте правильность заполнения всех полей.');
        } else if (json.error === 'INVALID_EMAIL_DOMAIN') {
          setMessage('Проверьте правильность email адреса.');
        } else if (json.error === 'RECAPTCHA_FAILED') {
          setMessage('Ошибка проверки безопасности. Попробуйте ещё раз.');
        } else {
          setMessage(`Ошибка: ${json.message || 'Проверьте контакт и город. Если не поможет — попробуйте ещё раз.'}`);
        }
        return;
      }
      setMessage('✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
      
      // Сброс формы через 2 секунды, чтобы пользователь успел увидеть сообщение
      setTimeout(() => {
        setStep(1);
        setContact('');
        setStep1({ eventType: 'corporate' });
        setStep2({ city: '', guestsBucket: '20_50' });
        setCallback({ type: 'asap' });
        setConsent(false);
        setMessage(null);
      }, 2000);
    } catch {
      setMessage('Ошибка отправки. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Reveal className="relative">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Декоративные элементы */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-lg animate-pulse opacity-60"></div>
        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full shadow-lg"></div>
        
        {/* Основной контейнер формы */}
        <motion.div 
          className="relative p-6 sm:p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gray-800/40 via-gray-700/20 to-gray-800/40 border-2 border-orange-400/20 backdrop-blur-sm shadow-2xl text-white"
          style={{ 
            minHeight: 'auto',
            maxHeight: 'calc(100vh - 2rem)',
            overflowY: 'auto'
          }}
          initial={{ opacity: 0, y: 30, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Заголовок формы */}
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500 mb-2">
              Оставить заявку
            </h2>
            <p className="text-gray-300 text-base sm:text-lg">Расскажите о вашем мероприятии</p>
          </motion.div>

          {step === 1 ? (
            <motion.div 
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <span className="text-orange-400 font-semibold text-sm">Тип мероприятия</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
                  <span className="text-gray-400 font-semibold text-sm">Детали</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">3</div>
                  <span className="text-gray-400 font-semibold text-sm">Контакты</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="block mb-4 text-lg font-semibold text-white">Тип мероприятия</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { k: 'corporate', t: 'Корпоративные праздники', icon: '🎉', desc: 'Дни рождения компаний, юбилеи, корпоративы' },
                    { k: 'teambuilding', t: 'Тимбилдинги и квесты', icon: '🤝', desc: 'Сплочение команды через интерактивные активности' },
                    { k: 'presentation', t: 'Презентации и запуски', icon: '🚀', desc: 'Презентации товаров, услуг, новых локаций' },
                    { k: 'promo', t: 'Промо-мероприятия', icon: '📢', desc: 'Знакомство с брендом, рекламные акции' },
                    { k: 'business', t: 'Деловые события', icon: '💼', desc: 'Конференции, семинары, бизнес-встречи' },
                  ].map((opt, index) => (
                    <motion.button
                      key={opt.k}
                      type="button"
                      onClick={() => setStep1({ eventType: opt.k as any })}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group text-left ${
                        step1.eventType === opt.k 
                          ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/10 shadow-lg shadow-orange-500/20' 
                          : 'border-gray-600/50 bg-gray-800/30 hover:border-orange-400/50 hover:bg-gray-700/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                    >
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0">{opt.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-white text-base sm:text-lg mb-1">{opt.t}</div>
                          <div className="text-gray-300 text-xs sm:text-sm leading-relaxed">{opt.desc}</div>
                        </div>
                      </div>
                      {step1.eventType === opt.k && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>


              <motion.div 
                className="flex justify-end mt-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <motion.button 
                  type="button" 
                  onClick={() => {
                    setMessage(null);
                    setStep(2);
                  }} 
                  className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform rotate-1 hover:rotate-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Далее →</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                </motion.button>
              </motion.div>

              {message && (
                <motion.div 
                  className={`text-center p-4 rounded-2xl ${
                    message.includes('✅') 
                      ? 'text-green-400 bg-green-400/10 border-2 border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border-2 border-red-400/20'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {message}
                </motion.div>
              )}
            </motion.div>
          ) : step === 2 ? (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">1</div>
                  <span className="text-gray-400 font-semibold text-sm">Тип мероприятия</span>
                </div>
                <div className="w-8 h-0.5 bg-orange-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <span className="text-orange-400 font-semibold text-sm">Детали</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-600"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">3</div>
                  <span className="text-gray-400 font-semibold text-sm">Контакты</span>
                </div>
              </div>

              <motion.div 
                ref={cityBoxRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block mb-4 text-lg font-semibold text-white">Город проведения</label>
                <div className="relative">
                  <div className="relative">
                    <input
                      value={step2.city}
                      onChange={(e) => { setStep2({ ...step2, city: e.target.value }); setShowCities(true); }}
                      onFocus={() => setShowCities(true)}
                      placeholder="Начните вводить город"
                      className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-2 border-gray-600/50 focus:outline-none focus:border-orange-400 focus:bg-gradient-to-r focus:from-gray-700/50 focus:to-gray-600/30 transition-all duration-300 text-white placeholder-gray-400"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                      📍
                    </div>
                  </div>
                  {step2.city && showCities && (
                    <motion.div 
                      className="absolute z-10 mt-2 w-full max-h-56 overflow-auto rounded-2xl border-2 border-orange-400/30 bg-gradient-to-br from-gray-800/90 to-gray-700/90 backdrop-blur-sm shadow-2xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {filterCities(step2.city).map((c, index) => (
                        <motion.button 
                          key={c} 
                          type="button" 
                          onClick={() => { 
                            console.log('Выбран город:', c);
                            setStep2({ ...step2, city: c }); 
                            setShowCities(false); 
                          }} 
                          className="w-full text-left px-6 py-3 hover:bg-orange-400/10 transition-colors duration-200 border-b border-gray-600/30 last:border-b-0"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <span className="text-white font-medium">{c}</span>
                        </motion.button>
                      ))}
                      {filterCities(step2.city).length === 0 && (
                        <div className="px-6 py-3 text-gray-400">Город не найден</div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block mb-4 text-lg font-semibold text-white">Количество гостей</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { k: 'lt20', t: '<20', icon: '👥' },
                    { k: '20_50', t: '20–50', icon: '👥👥' },
                    { k: '50_200', t: '50–200', icon: '👥👥👥' },
                    { k: '200_500', t: '200–500', icon: '👥👥👥👥' },
                    { k: '500p', t: '500+', icon: '👥👥👥👥👥' },
                  ].map((opt, index) => (
                    <motion.button
                      key={opt.k}
                      type="button"
                      onClick={() => setStep2({ ...step2, guestsBucket: opt.k as any })}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-300 group ${
                        step2.guestsBucket === opt.k 
                          ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/10 shadow-lg shadow-orange-500/20' 
                          : 'border-gray-600/50 bg-gray-800/30 hover:border-orange-400/50 hover:bg-gray-700/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="text-lg mb-1 group-hover:scale-110 transition-transform duration-200">{opt.icon}</div>
                      <div className="font-semibold text-white text-sm">{opt.t}</div>
                      {step2.guestsBucket === opt.k && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-between mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="px-6 py-3 rounded-xl border-2 border-gray-600/50 text-gray-300 hover:border-orange-400/50 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Назад
                </motion.button>
                <motion.button 
                  type="button" 
                  onClick={() => {
                    if (!step2.city.trim()) {
                      setMessage('Пожалуйста, выберите город');
                      return;
                    }
                    setMessage(null);
                    setStep(3);
                  }} 
                  className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform rotate-1 hover:rotate-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Далее →</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                </motion.button>
              </motion.div>

              {message && (
                <motion.div 
                  className={`text-center p-4 rounded-2xl ${
                    message.includes('✅') 
                      ? 'text-green-400 bg-green-400/10 border-2 border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border-2 border-red-400/20'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {message}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">1</div>
                  <span className="text-gray-400 font-semibold text-sm">Тип мероприятия</span>
                </div>
                <div className="w-8 h-0.5 bg-orange-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">2</div>
                  <span className="text-gray-400 font-semibold text-sm">Детали</span>
                </div>
                <div className="w-8 h-0.5 bg-orange-400"></div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <span className="text-orange-400 font-semibold text-sm">Контакты</span>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <label className="block mb-4 text-lg font-semibold text-white">Контакт для связи</label>
                <div className="relative">
                  <input 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    placeholder="+7… или @username или email" 
                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-2 border-gray-600/50 focus:outline-none focus:border-orange-400 focus:bg-gradient-to-r focus:from-gray-700/50 focus:to-gray-600/30 transition-all duration-300 text-white placeholder-gray-400" 
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📞
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block mb-4 text-lg font-semibold text-white">Когда связаться</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { k: 'asap', t: 'Как можно скорее', icon: '⚡' },
                    { k: 'slot', t: 'Выбрать время', icon: '🕐' },
                  ].map((opt, index) => (
                    <motion.button
                      key={opt.k}
                      type="button"
                      onClick={() => setCallback(opt.k === 'asap' ? { type: 'asap' } : { type: 'slot', atUtc: new Date().toISOString() })}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        callback.type === opt.k 
                          ? 'border-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/10 shadow-lg shadow-orange-500/20' 
                          : 'border-gray-600/50 bg-gray-800/30 hover:border-orange-400/50 hover:bg-gray-700/40'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{opt.icon}</div>
                      <div className="font-semibold text-white text-sm">{opt.t}</div>
                      {callback.type === opt.k && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {callback.type === 'slot' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <input
                    type="datetime-local"
                    onChange={(e) => {
                      const dt = new Date(e.target.value);
                      const h = dt.getHours();
                      if (h < 10 || h > 19) {
                        alert('Выберите время с 10:00 до 19:00');
                        return;
                      }
                      setCallback({ type: 'slot', atUtc: dt.toISOString() });
                    }}
                    className="mt-3 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-2 border-gray-600/50 focus:outline-none focus:border-orange-400 focus:bg-gradient-to-r focus:from-gray-700/50 focus:to-gray-600/30 transition-all duration-300 text-white"
                  />
                </motion.div>
              )}

              <motion.div 
                className="flex items-center justify-between mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <motion.button 
                  type="button" 
                  onClick={() => setStep(2)} 
                  className="px-6 py-3 rounded-xl border-2 border-gray-600/50 text-gray-300 hover:border-orange-400/50 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Назад
                </motion.button>
                <motion.button 
                  disabled={loading} 
                  type="button" 
                  onClick={handleSubmit} 
                  className="relative px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 text-white font-bold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-60 transform rotate-1 hover:rotate-0"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{loading ? 'Отправка…' : 'Отправить →'}</span>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full"></div>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <label className="flex items-start gap-3 text-sm text-gray-300">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 w-4 h-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500" />
                  <span>
                    Согласен с <button onClick={() => setShowPolicy(true)} className="text-orange-400 hover:text-orange-300 underline">политикой конфиденциальности</button> и <button onClick={() => setShowConsentDoc(true)} className="text-orange-400 hover:text-orange-300 underline">согласием на обработку персональных данных</button>.
                  </span>
                </label>
              </motion.div>

              {message && (
                <motion.div 
                  className={`text-center p-4 rounded-2xl ${
                    message.includes('✅') 
                      ? 'text-green-400 bg-green-400/10 border-2 border-green-400/20' 
                      : 'text-red-400 bg-red-400/10 border-2 border-red-400/20'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {message}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Policy Modal */}
      {showPolicy && createPortal(
        <div 
          className="modal-overlay bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowPolicy(false);
            }
          }}
        >
          <div className="bg-gray-900 rounded-2xl max-w-5xl max-h-[95vh] overflow-y-auto scrollbar-thin">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Политика конфиденциальности</h3>
              <button 
                onClick={() => setShowPolicy(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-white/80 space-y-4 text-sm leading-relaxed modal-content p-6">
              <p><strong>Дата обновления:</strong> 14 октября 2025 г.</p>
              
              <h4 className="text-white font-semibold mt-6">1. Общие положения</h4>
              <p>1.1. Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки персональных данных пользователей сайта banemzi.ru (далее — «Сайт»), принадлежащего ИП Банемзи (далее — «Оператор»).</p>
              <p>1.2. Использование Сайта означает безоговорочное согласие Пользователя с настоящей Политикой и указанными в ней условиями обработки персональных данных; в случае несогласия с этими условиями Пользователь должен воздержаться от использования Сайта.</p>
              <p>1.3. Оператор обрабатывает персональные данные Пользователей в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных» (далее — «Закон о персональных данных»).</p>

              <h4 className="text-white font-semibold mt-6">2. Основные понятия</h4>
              <p>2.1. <strong>Персональные данные</strong> — любая информация, относящаяся к прямо или косвенно определенному или определяемому физическому лицу (субъекту персональных данных).</p>
              <p>2.2. <strong>Обработка персональных данных</strong> — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.</p>
              <p>2.3. <strong>Автоматизированная обработка персональных данных</strong> — обработка персональных данных с помощью средств вычислительной техники.</p>
              <p>2.4. <strong>Блокирование персональных данных</strong> — временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных).</p>
              <p>2.5. <strong>Уничтожение персональных данных</strong> — действия, в результате которых становится невозможным восстановить содержание персональных данных в информационной системе персональных данных и (или) в результате которых уничтожаются материальные носители персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">3. Цели обработки персональных данных</h4>
              <p>3.1. Оператор обрабатывает персональные данные Пользователей в следующих целях:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Предоставление услуг по организации мероприятий</li>
                <li>Связь с Пользователем для уточнения деталей заказа</li>
                <li>Информирование о новых услугах и специальных предложениях</li>
                <li>Улучшение качества предоставляемых услуг</li>
                <li>Соблюдение требований законодательства Российской Федерации</li>
              </ul>

              <h4 className="text-white font-semibold mt-6">4. Категории обрабатываемых персональных данных</h4>
              <p>4.1. Оператор обрабатывает следующие категории персональных данных Пользователей:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Фамилия, имя, отчество</li>
                <li>Номер телефона</li>
                <li>Адрес электронной почты</li>
                <li>Telegram-аккаунт</li>
                <li>Город проживания</li>
                <li>Информация о предпочтениях в организации мероприятий</li>
              </ul>

              <h4 className="text-white font-semibold mt-6">5. Способы обработки персональных данных</h4>
              <p>5.1. Обработка персональных данных осуществляется с использованием средств автоматизации и без использования таких средств.</p>
              <p>5.2. Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">6. Обработка персональных данных с использованием файлов cookie</h4>
              <p>6.1. Оператор использует файлы cookie для:</p>
              <p><strong>Обеспечения работы сайта, а также сбор статистики посещения сайта</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Категория персональных данных: персональные данные, которые не относятся к биометрическим и специальным персональным данным</li>
                <li>Перечень персональных данных: данные, которые автоматически передаются в процессе их использования с помощью установленного на устройстве пользователя программного обеспечения, в том числе IP-адрес, информация из файлов cookie, информация о браузере пользователя, информация об аппаратном и программном обеспечении устройства пользователя, время доступа, адреса запрашиваемых страниц</li>
                <li>Способы обработки: сбор, запись, систематизация, накопление, хранение, уничтожение и обезличивание персональных данных</li>
                <li>Срок обработки: до достижения цели или отзыва согласия на обработку</li>
                <li>Правовые основания: согласие на обработку персональных данных</li>
              </ul>

              <h4 className="text-white font-semibold mt-6">7. Условия обработки персональных данных</h4>
              <p>7.1. Обработка персональных данных осуществляется с согласия субъекта персональных данных на обработку его персональных данных.</p>
              <p>7.2. Обработка персональных данных необходима для достижения целей, предусмотренных международным договором Российской Федерации или законом.</p>
              <p>7.3. Обработка персональных данных необходима для исполнения договора, стороной которого либо выгодоприобретателем или поручителем по которому является субъект персональных данных.</p>
              <p>7.4. Обработка персональных данных необходима для осуществления прав и законных интересов оператора или третьих лиц либо для достижения общественно значимых целей при условии, что при этом не нарушаются права и свободы субъекта персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">8. Порядок сбора, хранения, передачи и других видов обработки персональных данных</h4>
              <p>Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.</p>
              
              <p>8.1. Оператор обеспечивает сохранность персональных данных и принимает все возможные меры, исключающие доступ к персональным данным неуполномоченных лиц.</p>
              <p>8.2. Персональные данные Пользователя никогда, ни при каких условиях не будут переданы третьим лицам, за исключением случаев, связанных с исполнением действующего законодательства либо в случае, если субъектом персональных данных дано согласие Оператору на передачу данных третьему лицу.</p>
              <p>8.3. В случае выявления неточностей в персональных данных, Пользователь может актуализировать их самостоятельно, путем направления Оператору уведомление на адрес электронной почты Оператора info@banemzi.ru с пометкой «Актуализация персональных данных».</p>
              <p>8.4. Срок обработки персональных данных определяется достижением целей, для которых были собраны персональные данные, если иной срок не предусмотрен договором или действующим законодательством.</p>
              <p>Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору уведомление посредством электронной почты на электронный адрес Оператора info@banemzi.ru с пометкой «Отзыв согласия на обработку персональных данных».</p>

              <h4 className="text-white font-semibold mt-6">9. Трансграничная передача персональных данных</h4>
              <p>9.1. Оператор до начала осуществления трансграничной передачи персональных данных обязан убедиться в том, что иностранным государством, на территорию которого предполагается осуществлять передачу персональных данных, обеспечивается надежная защита прав субъектов персональных данных.</p>
              <p>9.2. Трансграничная передача персональных данных на территории иностранных государств, не отвечающих вышеуказанным требованиям, может осуществляться только в случае наличия согласия в письменной форме субъекта персональных данных на трансграничную передачу его персональных данных и/или исполнения договора, стороной которого является субъект персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">10. Заключительные положения</h4>
              <p>10.1. Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты info@banemzi.ru</p>
              <p>10.2. В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией.</p>
              <p>10.3. Актуальная версия Политики в свободном доступе расположена в сети Интернет по адресу banemzi.ru/privacy-policy</p>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Consent Modal */}
      {showConsentDoc && createPortal(
        <div 
          className="modal-overlay bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConsentDoc(false);
            }
          }}
        >
          <div className="bg-gray-900 rounded-2xl max-w-5xl max-h-[95vh] overflow-y-auto scrollbar-thin">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Согласие на обработку персональных данных</h3>
              <button 
                onClick={() => setShowConsentDoc(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-white/80 space-y-4 text-sm leading-relaxed modal-content p-6">
              <p>Я, субъект персональных данных, в соответствии с Федеральным законом от 27 июля 2006 года № 152-ФЗ «О персональных данных» предоставляю согласие на обработку персональных данных, указанных мной на страницах сайта banemzi.ru в сети «Интернет», при заполнении веб-форм, характер информации которых предполагает или допускает включение в них следующих персональных данных: фамилия, имя, отчество, адрес электронной почты, номер телефона, Telegram-аккаунт, с целью получения информации о продуктах и услугах Оператора, специальных предложениях и различных событиях Оператора, хранения данных и администрирования системы.</p>
              
              <p>Настоящее согласие предоставляется на осуществление любых действий в отношении моих персональных данных, которые необходимы или желаемы для достижения указанных целей, включая (без ограничения) сбор, систематизацию, накопление, хранение, уточнение (обновление, изменение), использование, распространение (в том числе передачу), обезличивание, блокирование, уничтожение персональных данных, а также осуществление любых иных действий, предусмотренных действующим законодательством Российской Федерации.</p>
              
              <p>Я подтверждаю, что ознакомлен с <button onClick={() => {setShowConsentDoc(false); setShowPolicy(true);}} className="text-cyan-400 hover:text-cyan-300 underline">Политикой конфиденциальности</button> и даю согласие на обработку персональных данных.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </Reveal>
  );
}