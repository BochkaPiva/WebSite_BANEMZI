"use client";

import { useState } from 'react';
import Reveal from './Reveal';

export default function Footer() {
  const [showPolicy, setShowPolicy] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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

  const PolicyModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
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
        <div className="text-white/80 space-y-4 text-sm">
          <p><strong>Дата обновления:</strong> 14 октября 2025 г.</p>
          
          <h4 className="text-white font-semibold mt-6">1. Общие положения</h4>
          <p>Настоящая Политика конфиденциальности определяет порядок обработки персональных данных пользователей сайта banemzi.ru в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
          
          <h4 className="text-white font-semibold mt-6">2. Категории персональных данных</h4>
          <p><strong>Мы обрабатываем следующие данные:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Контактная информация (имя, телефон, email, Telegram)</li>
            <li>Информация о мероприятии (тип, количество участников, город)</li>
            <li>Технические данные (IP-адрес, браузер, устройство)</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">3. Цели обработки</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Обработка заявок на мероприятия</li>
            <li>Связь с клиентами</li>
            <li>Предоставление услуг</li>
            <li>Учет и аналитика</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">4. Ваши права</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Получать информацию об обработке данных</li>
            <li>Требовать исправления или удаления</li>
            <li>Отзывать согласие на обработку</li>
          </ul>
          
          <p className="mt-6"><strong>По вопросам:</strong> info@banemzi.ru</p>
        </div>
      </div>
    </div>
  );

  const ConsentModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Согласие на обработку персональных данных</h3>
          <button 
            onClick={() => setShowConsent(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-white/80 space-y-4 text-sm">
          <p>Настоящим я даю согласие на обработку моих персональных данных в соответствии с Федеральным законом № 152-ФЗ «О персональных данных».</p>
          
          <h4 className="text-white font-semibold mt-6">Согласие предоставляется на:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Сбор, хранение и обработку персональных данных</li>
            <li>Использование данных для связи и предоставления услуг</li>
            <li>Передачу данных для обработки заявок</li>
            <li>Отправку уведомлений</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">Срок действия:</h4>
          <p>До отзыва согласия субъектом персональных данных.</p>
          
          <h4 className="text-white font-semibold mt-6">Способы отзыва:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>По email: info@banemzi.ru</li>
            <li>В Telegram: @banemzi</li>
          </ul>
          
          <p className="mt-6">Я подтверждаю, что ознакомлен с Политикой конфиденциальности и даю согласие на обработку персональных данных.</p>
        </div>
      </div>
    </div>
  );

  const CookiesModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Правила обработки cookie</h3>
          <button 
            onClick={() => setShowCookies(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-white/80 space-y-4 text-sm">
          <p>Наш сайт использует файлы cookie для улучшения пользовательского опыта и анализа трафика.</p>
          
          <h4 className="text-white font-semibold mt-6">Типы используемых cookie:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>Необходимые</strong> - обеспечивают базовую функциональность</li>
            <li><strong>Аналитические</strong> - помогают понять использование сайта</li>
            <li><strong>Функциональные</strong> - запоминают предпочтения</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">Управление cookie:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Вы можете отключить cookie в настройках браузера</li>
            <li>Отключение может повлиять на функциональность</li>
            <li>Мы не используем cookie для сбора данных без согласия</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">Сторонние сервисы:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Системы защиты от спама</li>
            <li>Сервисы обработки заявок</li>
            <li>Системы уведомлений</li>
          </ul>
          
          <p className="mt-6">Продолжая использовать сайт, вы соглашаетесь с использованием cookie.</p>
        </div>
      </div>
    </div>
  );

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] rounded-2xl p-6 max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Пользовательское соглашение</h3>
          <button 
            onClick={() => setShowTerms(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-white/80 space-y-4 text-sm">
          <p>Настоящее соглашение регулирует отношения между пользователями сайта banemzi.ru и компанией BANEMZI.</p>
          
          <h4 className="text-white font-semibold mt-6">Наши услуги:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Организация корпоративных мероприятий</li>
            <li>Проведение тимбилдингов</li>
            <li>Консультации по планированию мероприятий</li>
            <li>Полный цикл услуг от идеи до реализации</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">Использование сайта:</h4>
          <p><strong>Разрешено:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Просмотр информации о услугах</li>
            <li>Подача заявок на мероприятия</li>
            <li>Связь для обсуждения деталей</li>
          </ul>
          
          <p><strong>Запрещено:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Использование в незаконных целях</li>
            <li>Попытки взлома сайта</li>
            <li>Распространение вредоносного ПО</li>
            <li>Спам или массовые рассылки</li>
          </ul>
          
          <h4 className="text-white font-semibold mt-6">Ответственность:</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Пользователь несет ответственность за достоверность данных</li>
            <li>Мы не гарантируем бесперебойную работу сайта</li>
            <li>Все споры решаются в соответствии с законодательством РФ</li>
          </ul>
          
          <p className="mt-6"><strong>По вопросам:</strong> info@banemzi.ru</p>
        </div>
      </div>
    </div>
  );

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
              <button
                onClick={() => setShowPolicy(true)}
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Политика конфиденциальности
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => setShowCookies(true)}
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Правила обработки cookie
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => setShowConsent(true)}
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Согласие на обработку данных
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => setShowTerms(true)}
                className="text-white/60 hover:text-white transition-colors text-sm underline"
              >
                Пользовательское соглашение
              </button>
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

      {/* Модальные окна */}
      {showPolicy && <PolicyModal />}
      {showConsent && <ConsentModal />}
      {showCookies && <CookiesModal />}
      {showTerms && <TermsModal />}
    </>
  );
}
