"use client";
import { useEffect, useRef, useState } from 'react';
import { RU_CITIES, filterCities } from '@/data/cities';
import LegalModals from './LegalModals';

type Step1 = { eventType: 'corporate' | 'teambuilding'; city: string; guestsBucket: 'lt20' | '20_50' | '50_200' | '200_500' | '500p' };
type Callback = { type: 'asap' | 'slot'; atUtc?: string };

export default function LeadForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [step1, setStep1] = useState<Step1>({ eventType: 'corporate', city: '', guestsBucket: '20_50' });
  const [contact, setContact] = useState('');
  const [callback, setCallback] = useState<Callback>({ type: 'asap' });
  const [message, setMessage] = useState<string | null>(null);
  const [showCities, setShowCities] = useState(false);
  const cityBoxRef = useRef<HTMLDivElement | null>(null);
  const [consent, setConsent] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showConsentDoc, setShowConsentDoc] = useState(false);
  const [utm, setUtm] = useState<string | undefined>(undefined);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entries: string[] = [];
    ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach((k) => {
      const v = params.get(k);
      if (v) entries.push(`${k}=${v}`);
    });
    const ref = document.referrer;
    if (ref && !ref.includes('localhost')) entries.push(`referrer=${encodeURIComponent(ref)}`);
    if (entries.length) setUtm(entries.join('&'));
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) {
        setShowCities(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      if (!consent) {
        setMessage('Поставьте галочку согласия на обработку данных.');
        return;
      }
      let recaptchaToken: string | null = null;
      if ((window as any).grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaToken = await (window as any).grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit' });
      }
      const cityOk = RU_CITIES.includes(step1.city.trim());
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: step1.eventType,
          city: cityOk ? step1.city.trim() : '',
          guestsBucket: step1.guestsBucket,
          contact,
          callback,
          recaptchaToken,
          utm,
          consentAccepted: true,
        }),
      });
      let json: any = {};
      try { json = await res.json(); } catch {}
      if (!res.ok || !json.success) {
        setMessage('Проверьте контакт и город. Если не поможет — попробуйте ещё раз.');
        return;
      }
      setMessage('✅ Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.');
      
      // Сброс формы через 2 секунды, чтобы пользователь успел увидеть сообщение
      setTimeout(() => {
        setStep(1);
        setContact('');
        setStep1({ eventType: 'corporate', city: '', guestsBucket: '20_50' });
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
    <div className="w-full max-w-xl mx-auto p-6 rounded-2xl bg-[#111] border border-white/10 text-white will-change-transform" style={{ transform: 'translateZ(0)' }}>
      {step === 1 ? (
        <div className="space-y-5">
          <div className="text-sm uppercase tracking-widest text-white/60">Шаг 1 из 2</div>
          <div>
            <label className="block mb-2 text-sm text-white/80">Тип</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { k: 'corporate', t: 'Корпоратив' },
                { k: 'teambuilding', t: 'Тимбилдинг' },
              ].map((opt) => (
                <button
                  key={opt.k}
                  type="button"
                  onClick={() => setStep1({ ...step1, eventType: opt.k as any })}
                  className={`py-3 rounded-xl border ${step1.eventType === opt.k ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}
                >
                  {opt.t}
                </button>
              ))}
            </div>
          </div>
          <div ref={cityBoxRef}>
            <label className="block mb-2 text-sm text-white/80">Город</label>
            <div className="relative">
              <input
                value={step1.city}
                onChange={(e) => { setStep1({ ...step1, city: e.target.value }); setShowCities(true); }}
                onFocus={() => setShowCities(true)}
                placeholder="Начните вводить город"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-orange-500"
              />
              {step1.city && showCities && (
                <div className="absolute z-10 mt-1 w-full max-h-56 overflow-auto rounded-xl border border-white/10 bg-[#0F0F0F]">
                  {filterCities(step1.city).map((c) => (
                    <button key={c} type="button" onClick={() => { setStep1({ ...step1, city: c }); setShowCities(false); }} className="w-full text-left px-4 py-2 hover:bg-white/5">
                      {c}
                    </button>
                  ))}
                  {filterCities(step1.city).length === 0 && (
                    <div className="px-4 py-2 text-white/60">Город не найден</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block mb-2 text-sm text-white/80">Количество гостей</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: 'lt20', t: '<20' },
                { k: '20_50', t: '20–50' },
                { k: '50_200', t: '50–200' },
                { k: '200_500', t: '200–500' },
                { k: '500p', t: '500+' },
              ].map((opt) => (
                <button key={opt.k} type="button" onClick={() => setStep1({ ...step1, guestsBucket: opt.k as any })} className={`py-3 rounded-xl border ${step1.guestsBucket === opt.k ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}>
                  {opt.t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => {
                if (!step1.city.trim()) {
                  setMessage('Пожалуйста, выберите город');
                  return;
                }
                setMessage(null); // Очищаем сообщение при успешном переходе
                setStep(2);
              }} 
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00] text-black font-semibold"
            >
              Далее
            </button>
          </div>
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes('✅') 
                ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                : 'text-red-400 bg-red-400/10 border border-red-400/20'
            }`}>
              {message}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          <div className="text-sm uppercase tracking-widest text-white/60">Шаг 2 из 2</div>
          <div>
            <label className="block mb-2 text-sm text-white/80">Контакт (телефон / @telegram / email)</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+7… или @username или email" className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label className="block mb-2 text-sm text-white/80">Когда связаться</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCallback({ type: 'asap' })} className={`px-4 py-2 rounded-xl border ${callback.type === 'asap' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}>Как можно скорее</button>
              <button type="button" onClick={() => setCallback({ type: 'slot', atUtc: new Date().toISOString() })} className={`px-4 py-2 rounded-xl border ${callback.type === 'slot' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 hover:border-white/20'}`}>Выбрать время</button>
            </div>
            {callback.type === 'slot' && (
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
                className="mt-3 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:border-orange-500"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-white/10 text-white/80 hover:border-white/20">Назад</button>
            <button disabled={loading} type="button" onClick={handleSubmit} className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00] text-black font-semibold disabled:opacity-60">
              {loading ? 'Отправка…' : 'Отправить'}
            </button>
          </div>
          <label className="flex items-start gap-3 text-sm text-white/70">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
            <span>
              Согласен с <a href="#" onClick={(e) => { e.preventDefault(); setShowPolicy(true); }} className="underline">политикой конфиденциальности</a> и <a href="#" onClick={(e) => { e.preventDefault(); setShowConsentDoc(true); }} className="underline">согласием на обработку персональных данных</a>.
            </span>
          </label>
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              message.includes('✅') 
                ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                : 'text-white/80'
            }`}>
              {message}
            </div>
          )}
        </div>
      )}
      
      <LegalModals
        showPolicy={showPolicy}
        showConsent={showConsentDoc}
        showCookies={false}
        showTerms={false}
        setShowPolicy={setShowPolicy}
        setShowConsent={setShowConsentDoc}
        setShowCookies={() => {}}
        setShowTerms={() => {}}
      />
    </div>
  );
}


