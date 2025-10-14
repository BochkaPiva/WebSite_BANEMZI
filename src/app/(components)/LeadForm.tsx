"use client";
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RU_CITIES, filterCities } from '@/data/cities';

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
      // Cleanup
      document.body.style.overflow = 'unset';
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
      
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    };
  }, [showPolicy, showConsentDoc]);
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
          <div className="bg-[#111] rounded-2xl p-6 max-w-5xl max-h-[90vh] overflow-y-auto border border-white/10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Политика конфиденциальности</h3>
              <button 
                onClick={() => setShowPolicy(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-white/80 space-y-4 text-sm leading-relaxed modal-content">
              <p><strong>Дата обновления:</strong> 14 октября 2025 г.</p>
              
              <h4 className="text-white font-semibold mt-6">1. Общие положения</h4>
              <p>Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных» (далее — Закон о персональных данных) и определяет порядок сбора и обработки персональных данных пользователей веб-сайта banemzi.ru и меры по обеспечению безопасности персональных данных, предпринимаемые BANEMZI (далее — Оператор).</p>
              
              <p>1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных, в том числе защиты прав на неприкосновенность частной жизни, личную и семейную тайну.</p>
              
              <p>1.2. Настоящая политика Оператора в отношении обработки персональных данных (далее — Политика) применяется ко всей информации, которую Оператор может получить о пользователях веб-сайта banemzi.ru</p>

              <h4 className="text-white font-semibold mt-6">2. Основные понятия, используемые в Политике</h4>
              <p>2.1. <strong>Автоматизированная обработка персональных данных</strong> — обработка персональных данных с помощью средств вычислительной техники.</p>
              <p>2.2. <strong>Блокирование персональных данных</strong> — временное прекращение обработки персональных данных (за исключением случаев, если обработка необходима для уточнения персональных данных).</p>
              <p>2.3. <strong>Обезличивание персональных данных</strong> — действия, в результате которых невозможно определить без использования дополнительной информации принадлежность персональных данных конкретному Пользователю или иному субъекту персональных данных.</p>
              <p>2.4. <strong>Обработка персональных данных</strong> — любое действие (операция) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств с персональными данными, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (распространение, предоставление, доступ), обезличивание, блокирование, удаление, уничтожение персональных данных.</p>
              <p>2.5. <strong>Оператор</strong> — государственный орган, муниципальный орган, юридическое или физическое лицо, самостоятельно или совместно с другими лицами организующие и/или осуществляющие обработку персональных данных, а также определяющие цели обработки персональных данных, состав персональных данных, подлежащих обработке, действия (операции), совершаемые с персональными данными.</p>
              <p>2.6. <strong>Персональные данные</strong> — любая информация, относящаяся прямо или косвенно к определенному или определяемому Пользователю веб-сайта banemzi.ru</p>
              <p>2.7. <strong>Пользователь, субъект персональных данных</strong> — любой посетитель веб-сайта banemzi.ru</p>
              <p>2.8. <strong>Предоставление персональных данных</strong> — действия, направленные на раскрытие персональных данных определенному лицу или определенному кругу лиц.</p>
              <p>2.9. <strong>Распространение персональных данных</strong> — любые действия, направленные на раскрытие персональных данных неопределенному кругу лиц (передача персональных данных) или на ознакомление с персональными данными неограниченного круга лиц.</p>
              <p>2.10. <strong>Уничтожение персональных данных</strong> — любые действия, в результате которых персональные данные уничтожаются безвозвратно с невозможностью дальнейшего восстановления содержания персональных данных в информационной системе персональных данных и/или уничтожаются материальные носители персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">3. Основные права и обязанности Оператора</h4>
              <p>3.1. <strong>Оператор имеет право:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>получать от субъекта персональных данных достоверные информацию и/или документы, содержащие персональные данные;</li>
                <li>в случае отзыва субъектом персональных данных согласия на обработку персональных данных, а также, направления обращения с требованием о прекращении обработки персональных данных, Оператор вправе продолжить обработку персональных данных без согласия субъекта персональных данных при наличии оснований, указанных в Законе о персональных данных;</li>
                <li>самостоятельно определять состав и перечень мер, необходимых и достаточных для обеспечения выполнения обязанностей, предусмотренных Законом о персональных данных.</li>
              </ul>
              
              <p>3.2. <strong>Оператор обязан:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>предоставлять субъекту персональных данных по его просьбе информацию, касающуюся обработки его персональных данных;</li>
                <li>организовывать обработку персональных данных в порядке, установленном действующим законодательством РФ;</li>
                <li>отвечать на обращения и запросы субъектов персональных данных и их законных представителей в соответствии с требованиями Закона о персональных данных;</li>
                <li>сообщать в уполномоченный орган по защите прав субъектов персональных данных по запросу этого органа необходимую информацию в течение 10 (десяти) рабочих дней с даты получения такого запроса;</li>
                <li>публиковать или иным образом обеспечивать неограниченный доступ к настоящей Политике в отношении обработки персональных данных;</li>
                <li>принимать правовые, организационные и технические меры для защиты персональных данных от неправомерного или случайного доступа к ним, уничтожения, изменения, блокирования, копирования, предоставления, распространения персональных данных, а также от иных неправомерных действий в отношении персональных данных;</li>
                <li>прекратить обработку персональных данных в порядке и случаях, предусмотренных Законом о персональных данных;</li>
                <li>исполнять иные обязанности, предусмотренные Законом о персональных данных.</li>
              </ul>

              <h4 className="text-white font-semibold mt-6">4. Основные права и обязанности субъектов персональных данных</h4>
              <p>4.1. <strong>Субъекты персональных данных имеют право:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>получать информацию, касающуюся обработки его персональных данных, за исключением случаев, предусмотренных федеральными законами;</li>
                <li>требовать от оператора уточнения его персональных данных, их блокирования или уничтожения в случае, если персональные данные являются неполными, устаревшими, неточными, незаконно полученными или не являются необходимыми для заявленной цели обработки;</li>
                <li>выдвигать условие предварительного согласия при обработке персональных данных в целях продвижения на рынке товаров, работ и услуг;</li>
                <li>на отзыв согласия на обработку персональных данных, а также, на направление требования о прекращении обработки персональных данных;</li>
                <li>обжаловать в уполномоченный орган по защите прав субъектов персональных данных или в судебном порядке неправомерные действия или бездействие Оператора при обработке его персональных данных;</li>
                <li>на осуществление иных прав, предусмотренных законодательством РФ.</li>
              </ul>
              
              <p>4.2. <strong>Субъекты персональных данных обязаны:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>предоставлять Оператору достоверные данные о себе;</li>
                <li>сообщать Оператору об уточнении (обновлении, изменении) своих персональных данных.</li>
              </ul>

              <h4 className="text-white font-semibold mt-6">5. Принципы обработки персональных данных</h4>
              <p>5.1. Обработка персональных данных осуществляется на законной и справедливой основе.</p>
              <p>5.2. Обработка персональных данных ограничивается достижением конкретных, заранее определенных и законных целей.</p>
              <p>5.3. Не допускается объединение баз данных, содержащих персональные данные, обработка которых осуществляется в целях, несовместимых между собой.</p>
              <p>5.4. Обработке подлежат только персональные данные, которые отвечают целям их обработки.</p>
              <p>5.5. Содержание и объем обрабатываемых персональных данных соответствуют заявленным целям обработки.</p>
              <p>5.6. При обработке персональных данных обеспечивается точность персональных данных, их достаточность, а в необходимых случаях и актуальность по отношению к целям обработки персональных данных.</p>
              <p>5.7. Хранение персональных данных осуществляется в форме, позволяющей определить субъекта персональных данных, не дольше, чем этого требуют цели обработки персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">6. Цели обработки персональных данных</h4>
              <p>6.1. <strong>Оператор обрабатывает персональные данные пользователей с целью:</strong></p>
              
              <p><strong>Предоставления Пользователю консультации об услугах, реализуемых Оператором</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Категория персональных данных: персональные данные, которые не относятся к биометрическим и специальным персональным данным</li>
                <li>Перечень персональных данных: имя, электронный адрес, номер телефона, Telegram-аккаунт</li>
                <li>Способы обработки: сбор, запись, систематизация, накопление, хранение, уничтожение и обезличивание персональных данных</li>
                <li>Срок обработки: до достижения цели или отзыва согласия на обработку</li>
                <li>Правовые основания: согласие на обработку персональных данных</li>
              </ul>

              <p><strong>Обработки заявок на организацию мероприятий</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Категория персональных данных: персональные данные, которые не относятся к биометрическим и специальным персональным данным</li>
                <li>Перечень персональных данных: имя, электронный адрес, номер телефона, информация о мероприятии (тип, количество участников, город)</li>
                <li>Способы обработки: сбор, запись, систематизация, накопление, хранение, уничтожение и обезличивание персональных данных</li>
                <li>Срок обработки: до достижения цели или отзыва согласия на обработку</li>
                <li>Правовые основания: согласие на обработку персональных данных</li>
              </ul>

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
              <p>8.5. Пользователь может в любой момент отозвать свое согласие на обработку персональных данных, направив Оператору уведомление посредством электронной почты на электронный адрес Оператора info@banemzi.ru с пометкой «Отзыв согласия на обработку персональных данных».</p>
              <p>8.6. Оператор осуществляет хранение персональных данных в форме, позволяющей определить субъекта персональных данных, не дольше, чем этого требуют цели обработки персональных данных.</p>
              <p>8.7. Условием прекращения обработки персональных данных может являться достижение целей обработки персональных данных, отзыв согласия субъектом персональных данных или требование о прекращении обработки персональных данных, а также выявление неправомерной обработки персональных данных.</p>

              <h4 className="text-white font-semibold mt-6">9. Перечень действий, производимых Оператором с полученными персональными данными</h4>
              <p>9.1. Оператор осуществляет сбор, запись, систематизацию, накопление, хранение, обезличивание и уничтожение персональных данных.</p>
              <p>9.2. Оператор осуществляет автоматизированную обработку персональных данных с получением и/или передачей полученной информации по информационно-телекоммуникационным сетям или без таковой.</p>

              <h4 className="text-white font-semibold mt-6">10. Конфиденциальность персональных данных</h4>
              <p>Оператор и иные лица, получившие доступ к персональным данным, обязаны не раскрывать третьим лицам и не распространять персональные данные без согласия субъекта персональных данных, если иное не предусмотрено федеральным законом.</p>

              <h4 className="text-white font-semibold mt-6">11. Заключительные положения</h4>
              <p>11.1. Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты info@banemzi.ru</p>
              <p>11.2. В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией.</p>
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
          <div className="bg-[#111] rounded-2xl p-6 max-w-5xl max-h-[90vh] overflow-y-auto border border-white/10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Согласие на обработку персональных данных</h3>
              <button 
                onClick={() => setShowConsentDoc(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-white/80 space-y-4 text-sm leading-relaxed modal-content">
              <p>Я, субъект персональных данных, в соответствии с Федеральным законом от 27 июля 2006 года № 152-ФЗ «О персональных данных» предоставляю согласие на обработку персональных данных, указанных мной на страницах сайта banemzi.ru в сети «Интернет», при заполнении веб-форм, характер информации которых предполагает или допускает включение в них следующих персональных данных: фамилия, имя, отчество, адрес электронной почты, номер телефона, Telegram-аккаунт, с целью получения информации о продуктах и услугах Оператора, специальных предложениях и различных событиях Оператора, хранения данных и администрирования системы.</p>
              
              <p>Согласие предоставляется на совершение следующих действий (операций) с указанными в настоящем согласии персональными данными: сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение, осуществляемых как с использованием средств автоматизации (автоматизированная обработка), так и без использования таких средств (неавтоматизированная обработка).</p>
              
              <p>Я подтверждаю, что ознакомлен с требованиями законодательства Российской Федерации, устанавливающими порядок обработки персональных данных, с политикой Оператора в отношении обработки персональных данных, а также с моими правами и обязанностями в этой области.</p>
              
              <p>Согласие вступает в силу с момента предоставления согласия и действует по достижении целей обработки или случая утраты необходимости в достижении этих целей.</p>
              
              <p>Согласие может быть отозвано мною в любое время на основании моего письменного заявления, направленного на электронный адрес info@banemzi.ru с пометкой «Отзыв согласия на обработку персональных данных».</p>
              
              <p>Я понимаю и соглашаюсь с тем, что предоставленная информация, является полной, точной и достоверной; при предоставлении информации не нарушается действующее законодательство Российской Федерации, законные права и интересы третьих лиц; вся предоставленная информация заполнена мною в отношении себя лично; информация не относится к государственной, банковской и/или коммерческой тайне, информация не относится к информации о расовой и/или национальной принадлежности, политических взглядах, религиозных или философских убеждениях, не относится к информации о состоянии здоровья и интимной жизни.</p>
              
              <p>Я понимаю и соглашаюсь с тем, что Оператор не проверяет достоверность персональных данных, предоставляемых мной, и не имеет возможности оценивать мою дееспособность и исходит из того, что я предоставляю достоверные персональные данные и поддерживаю такие данные в актуальном состоянии.</p>
              
              <p>Я подтверждаю, что ознакомлен с <button onClick={() => {setShowConsentDoc(false); setShowPolicy(true);}} className="text-cyan-400 hover:text-cyan-300 underline">Политикой конфиденциальности</button> и даю согласие на обработку персональных данных.</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}


