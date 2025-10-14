import Reveal from './Reveal';
import AnimatedCounter from './AnimatedCounter';

export function Services() {
  const items = [
    { 
      title: 'Корпоративы', 
      text: 'От идеи до шоу. Свет, звук, сцена, ведущие — под ключ.',
      icon: '🎭',
      features: ['Полный продакшн', 'Профессиональная техника', 'Ведущие и артисты']
    },
    { 
      title: 'Тимбилдинги', 
      text: 'Сценарии, в которые вовлекаются даже интроверты.',
      icon: '🤝',
      features: ['Интерактивные форматы', 'Командные игры', 'Мотивационные программы']
    },
  ];
  return (
    <section id="services" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-white">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Что мы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
              умеем
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            От корпоративов до тимбилдингов — создаем мероприятия, которые запоминаются навсегда
          </p>
        </div>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.05}>
            <div className="group rounded-2xl p-6 border border-white/10 bg-[#111] hover:border-orange-500/30 hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  {it.icon}
                </div>
                <div className="text-xl font-semibold">{it.title}</div>
              </div>
              <div className="text-white/80 mb-4">{it.text}</div>
              <ul className="space-y-2">
                {it.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-white/70">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    {
      icon: '🎨',
      title: 'Смелый креатив',
      description: 'Постановка шоу, которая взрывает мозг',
      stat: '100+',
      statLabel: 'уникальных идей'
    },
    {
      icon: '⚡',
      title: 'Технический продакшн',
      description: 'Чёткий тайминг и профессиональная техника',
      stat: '24/7',
      statLabel: 'поддержка'
    },
    {
      icon: '📍',
      title: 'Площадки Омска',
      description: 'Лучшие локации города и ближайших городов',
      stat: '50+',
      statLabel: 'проверенных площадок'
    },
    {
      icon: '🚀',
      title: 'Оперативная связь',
      description: 'Без ожиданий, отвечаем в течение часа',
      stat: '<1ч',
      statLabel: 'время ответа'
    },
  ];

  return (
    <section id="benefits" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-white">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Что вы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
              получите
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Не просто мероприятие, а полноценный опыт, который изменит ваше представление о корпоративах
          </p>
        </div>
      </Reveal>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1}>
            <div className="group rounded-2xl p-6 border border-white/10 bg-[#111] hover:border-orange-500/30 hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10 text-center">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-white/70 text-sm mb-4">{item.description}</p>
              
              <div className="border-t border-white/10 pt-4">
                <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00] mb-1">
                  <AnimatedCounter end={item.stat === '24/7' ? 24 : item.stat === '<1ч' ? 1 : parseInt(item.stat)} suffix={item.stat.includes('+') ? '+' : item.stat.includes('/') ? '/7' : item.stat.includes('ч') ? 'ч' : ''} />
                </div>
                <div className="text-xs text-white/50 uppercase tracking-wide">
                  {item.statLabel}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    {
      icon: '💬',
      title: 'Бриф',
      description: 'Выясняем ваши желания и возможности',
      duration: '1-2 дня'
    },
    {
      icon: '💡',
      title: 'Идея',
      description: 'Создаем концепцию, которая взорвет мозг',
      duration: '2-3 дня'
    },
    {
      icon: '💰',
      title: 'Смета',
      description: 'Прозрачное ценообразование без скрытых платежей',
      duration: '1 день'
    },
    {
      icon: '🎬',
      title: 'Продакшн',
      description: 'Собираем команду и готовим техническую часть',
      duration: '1-2 недели'
    },
    {
      icon: '🎉',
      title: 'Проведение',
      description: 'День Х: создаем незабываемые эмоции',
      duration: '1 день'
    },
    {
      icon: '📊',
      title: 'Отчёт',
      description: 'Анализируем результат и планируем следующее',
      duration: '1-2 дня'
    }
  ];

  return (
    <section id="process" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-white">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Как мы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
              работаем
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            От первой встречи до финального отчета — четкий процесс без лишних движений
          </p>
        </div>
      </Reveal>

      {/* Desktop Timeline */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00] transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.1}>
                <div className="relative">
                  {/* Step card */}
                  <div className="bg-[#111] border border-white/10 rounded-2xl p-4 mt-8 hover:border-orange-500/30 hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
                    <div className="text-center">
                      <div className="text-3xl mb-3">{step.icon}</div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-white/70 text-sm mb-2">{step.description}</p>
                      <div className="text-xs text-orange-400 font-medium">{step.duration}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Grid */}
      <div className="lg:hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.05}>
              <div className="group rounded-2xl p-6 border border-white/10 bg-[#111] hover:border-orange-500/30 hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFD166] to-[#FF6B00] rounded-full flex items-center justify-center text-2xl">
                      {step.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <span className="text-xs text-orange-400 font-medium bg-orange-400/10 px-2 py-1 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const items = [
    { 
      icon: '👥',
      q: 'С какими масштабами работаем?', 
      a: 'От камерных до 500+ гостей. Подбираем площадку под любой формат — от интимных встреч до масштабных корпоративов.' 
    },
    { 
      icon: '🌍',
      q: 'География работы?', 
      a: 'Омск и ближайшие города. По всей России — по запросу. Готовы приехать туда, где нужен качественный ивент.' 
    },
    { 
      icon: '⚡',
      q: 'Сроки старта проекта?', 
      a: 'Оперативные. Договоримся и запустим. Минимальный срок подготовки — 2 недели, но можем ускориться при необходимости.' 
    },
    { 
      icon: '💰',
      q: 'Как формируется стоимость?', 
      a: 'Прозрачно и без скрытых платежей. Стоимость зависит от масштаба, сложности и технических требований. Всегда фиксируем в договоре.' 
    },
    { 
      icon: '🎭',
      q: 'Какие форматы мероприятий?', 
      a: 'Корпоративы, тимбилдинги, конференции, презентации, праздники. Любой формат, который нужен вашему бизнесу.' 
    },
    { 
      icon: '📞',
      q: 'Как с вами связаться?', 
      a: 'Telegram, телефон, email — выбирайте удобный способ. Отвечаем в течение часа в рабочее время.' 
    },
  ];

  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-white">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Частые{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
              вопросы
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Все, что вы хотели знать о нашей работе, но стеснялись спросить
          </p>
        </div>
      </Reveal>
      
      <div className="space-y-4">
        {items.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.05}>
            <details className="group rounded-2xl border border-white/10 bg-[#111] hover:border-orange-500/30 hover:bg-[#1a1a1a] transition-all duration-300">
              <summary className="cursor-pointer p-6 font-medium flex items-center space-x-4 hover:text-orange-400 transition-colors duration-300">
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="flex-1">{item.q}</span>
                <div className="text-orange-400 group-hover:rotate-180 transition-transform duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0 text-white/80 leading-relaxed">
                {item.a}
              </div>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 text-white" id="lead">
      <Reveal>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
              удивлять?
            </span>
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Не ждите идеального момента. Идеальный момент — это когда вы решаете действовать.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD166] to-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Быстрый старт</h3>
            <p className="text-white/70 text-sm">Ответим в течение часа и начнем работу</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD166] to-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Точный результат</h3>
            <p className="text-white/70 text-sm">Именно то мероприятие, которое вы представляли</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#FFD166] to-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Полная поддержка</h3>
            <p className="text-white/70 text-sm">От идеи до финального отчета — мы рядом</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="bg-gradient-to-r from-[#FFD166]/10 via-[#FF9A3C]/10 to-[#FF6B00]/10 rounded-3xl p-8 border border-orange-500/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Оставьте заявку прямо сейчас
            </h3>
            <p className="text-white/80 mb-6 text-lg">
              И получите персональную консультацию в течение часа
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Бесплатная консультация
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Персональный подход
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Гарантия качества
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


