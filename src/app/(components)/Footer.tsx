"use client";

import Reveal from './Reveal';

export default function Footer() {

  const contacts = [
    {
      icon: (
        <svg className="w-6 h-6" fill="url(#emailGradient)" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="emailGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#FF9A3C" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      label: 'Email',
      value: 'info@banemzi.ru',
      href: 'mailto:info@banemzi.ru',
      color: 'text-orange-400'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="url(#phoneGradient)" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#FF9A3C" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      ),
      label: 'Телефон',
      value: '+7 (___) ___‑__‑__',
      href: 'tel:+7',
      color: 'text-orange-400'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="url(#telegramGradient)" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="telegramGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#FF9A3C" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      label: 'Telegram',
      value: '@banemzi',
      href: 'https://t.me/banemzi',
      color: 'text-orange-400'
    }
  ];


  return (
    <>
      <footer className="border-t border-white/10 bg-[#0A0A0A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          {/* Логотип и описание */}
          <Reveal>
            <div className="text-center mb-8">
              <img 
                src="/BANEMZI.png" 
                alt="BANEMZI" 
                className="h-20 w-auto mx-auto mb-4 opacity-80"
              />
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00] text-lg font-bold whitespace-nowrap">
                Создаем мероприятия, которые запоминаются. От идеи до шоу.
              </p>
            </div>
          </Reveal>

          {/* Контакты */}
          <Reveal delay={0.1}>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {contacts.map((contact, index) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  className="group flex items-center space-x-3 p-4 rounded-xl border border-white/10 bg-[#111] hover:border-white/20 transition-all duration-300 hover:bg-[#1a1a1a]"
                >
                  <div className={`${contact.color} group-hover:scale-110 transition-transform duration-300`}>
                    {contact.icon}
                  </div>
                  <div>
                    <div className="text-white/60 text-xs uppercase tracking-wide">
                      {contact.label}
                    </div>
                    <div className="text-white font-medium">
                      {contact.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Документы */}
          <Reveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
              <a
                href="/documents/privacy-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Политика конфиденциальности
              </a>
              <span className="text-white/40">|</span>
              <a
                href="/documents/cookies-policy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Правила обработки cookie
              </a>
              <span className="text-white/40">|</span>
              <a
                href="/documents/consent.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Согласие на обработку данных
              </a>
              <span className="text-white/40">|</span>
              <a
                href="/documents/terms-of-service.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Пользовательское соглашение
              </a>
            </div>
          </Reveal>

          {/* Разделитель */}
          <Reveal delay={0.2}>
            <div className="border-t border-white/10 pt-8">
              <div className="text-center">
                {/* Копирайт */}
                <div className="text-white/40 text-sm">
                  © 2024 BANEMZI. Все права защищены.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </footer>

    </>
  );
}
