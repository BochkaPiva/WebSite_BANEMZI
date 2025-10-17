"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

interface Review {
  id: number;
  name: string;
  position: string;
  text: string;
  rating: number;
  photos?: string[];
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Анна",
    position: "HR-директор",
    text: "Организовали корпоратив на 150 человек - все прошло без сучка без задоринки. Особенно понравилось, что учли все наши пожелания по бюджету и формату. Рекомендую!",
    rating: 5,
    photos: ["/ex1.jpeg", "/ex2.jpg", "/ex3.jpg"]
  },
  {
    id: 2,
    name: "Дмитрий",
    position: "Генеральный директор",
    text: "Нужна была презентация нового продукта для партнеров. BANEMZI сделали все четко и профессионально. Техника работала без сбоев, ведущий был на высоте.",
    rating: 5
  },
  {
    id: 3,
    name: "Елена",
    position: "Маркетинг-менеджер",
    text: "Промо-акция прошла хорошо, много людей подошло к стенду. Организация была на уровне, все вовремя привезли и установили. Думаю, повторим сотрудничество.",
    rating: 5,
    photos: ["/ex2.jpg", "/ex1.jpeg"]
  },
  {
    id: 4,
    name: "Александр",
    position: "Основатель стартапа",
    text: "Запускали новый проект, нужен был ивент для привлечения внимания. Получилось ярко и запоминающеся. Журналисты даже написали несколько статей.",
    rating: 5
  },
  {
    id: 5,
    name: "Мария",
    position: "Руководитель отдела продаж",
    text: "Тимбилдинг для нашей команды - все прошло весело и активно. Коллеги до сих пор вспоминают некоторые моменты. Организация была хорошая, без накладок.",
    rating: 5,
    photos: ["/ex3.jpg"]
  },
  {
    id: 6,
    name: "Сергей",
    position: "Директор по развитию",
    text: "Конференция на 300 человек - это было серьезное мероприятие. Все прошло по плану, участники остались довольны. Логистика была продумана до мелочей.",
    rating: 5
  },
  {
    id: 7,
    name: "Ольга",
    position: "PR-менеджер",
    text: "Юбилей компании отмечали с размахом. Гости были в восторге от программы и атмосферы. BANEMZI справились с задачей на отлично.",
    rating: 5
  }
];

export default function ReviewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Автопрокрутка
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setCurrentPhotoIndex(0); // Сбрасываем индекс фото
    setIsAutoPlaying(false);
    // Возобновляем автопрокрутку через 10 секунд
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
    setCurrentPhotoIndex(0); // Сбрасываем индекс фото
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    setCurrentPhotoIndex(0); // Сбрасываем индекс фото
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < rating 
            ? 'text-yellow-400' 
            : 'text-gray-600'
        }`}
      >
        ★
      </span>
    ));
  };

  const goToPreviousPhoto = () => {
    const currentReview = reviews[currentIndex];
    if (currentReview.photos && currentReview.photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => 
        prevIndex === 0 ? currentReview.photos!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNextPhoto = () => {
    const currentReview = reviews[currentIndex];
    if (currentReview.photos && currentReview.photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => 
        (prevIndex + 1) % currentReview.photos!.length
      );
    }
  };

  const goToPreviousModalPhoto = () => {
    const currentReview = reviews[currentIndex];
    if (currentReview.photos && currentReview.photos.length > 1) {
      setModalPhotoIndex((prevIndex) => 
        prevIndex === 0 ? currentReview.photos!.length - 1 : prevIndex - 1
      );
    }
  };

  const goToNextModalPhoto = () => {
    const currentReview = reviews[currentIndex];
    if (currentReview.photos && currentReview.photos.length > 1) {
      setModalPhotoIndex((prevIndex) => 
        (prevIndex + 1) % currentReview.photos!.length
      );
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Что говорят{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD166] via-[#FF9A3C] to-[#FF6B00]">
                клиенты
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Реальные отзывы от тех, кто уже работал с нами
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            {/* Карусель */}
            <div className="relative overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full"
                >
                  <div 
                    className="group rounded-2xl p-8 md:p-12 bg-[#111] hover:bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <div className={`${reviews[currentIndex].photos ? 'grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center' : 'text-center'}`}>
                      {/* Левая часть - текст отзыва */}
                      <div className={`${reviews[currentIndex].photos ? 'order-2 lg:order-1 lg:col-span-2' : ''}`}>
                        {/* Звезды рейтинга */}
                        <div className={`flex ${reviews[currentIndex].photos ? 'justify-start' : 'justify-center'} mb-6`}>
                          {renderStars(reviews[currentIndex].rating)}
                        </div>

                        {/* Текст отзыва */}
                        <blockquote className={`text-white/90 text-lg md:text-xl leading-relaxed mb-8 ${reviews[currentIndex].photos ? 'text-left' : 'max-w-4xl mx-auto'}`}>
                          "{reviews[currentIndex].text}"
                        </blockquote>

                        {/* Автор */}
                        <div className={`flex ${reviews[currentIndex].photos ? 'flex-row items-center space-x-4' : 'flex-col items-center'}`}>
                          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 flex-shrink-0">
                            <span className="text-white font-bold text-xl">
                              {reviews[currentIndex].name.charAt(0)}
                            </span>
                          </div>
                          <div className={`${reviews[currentIndex].photos ? 'text-left' : 'text-center'}`}>
                            <div className="text-white font-semibold text-lg">
                              {reviews[currentIndex].name}
                            </div>
                            <div className="text-orange-400 text-sm">
                              {reviews[currentIndex].position}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Правая часть - фото (если есть) */}
                      {reviews[currentIndex].photos && reviews[currentIndex].photos!.length > 0 && (
                        <div className="order-1 lg:order-2 lg:col-span-1 flex justify-center">
                          <div className="relative w-full max-w-xs">
                            {/* Основное фото */}
                            <div 
                              className="relative group cursor-pointer"
                              onClick={() => {
                                setSelectedPhoto(reviews[currentIndex].photos![currentPhotoIndex]);
                                setModalPhotoIndex(currentPhotoIndex);
                              }}
                            >
                              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                <img
                                  src={reviews[currentIndex].photos![currentPhotoIndex]}
                                  alt={`Фото с мероприятия - ${reviews[currentIndex].name}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center justify-between">
                                  <p className="text-white text-sm font-medium">
                                    Фото {currentPhotoIndex + 1} из {reviews[currentIndex].photos!.length}
                                  </p>
                                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                  </svg>
                                </div>
                              </div>
                            </div>

                            {/* Кнопки навигации по фото (если фото больше одного) */}
                            {reviews[currentIndex].photos!.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    goToPreviousPhoto();
                                  }}
                                  className="absolute left-2 top-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                  </svg>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    goToNextPhoto();
                                  }}
                                  className="absolute right-2 top-2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </>
                            )}

                            {/* Индикаторы фото (если фото больше одного) */}
                            {reviews[currentIndex].photos!.length > 1 && (
                              <div className="flex justify-center mt-3 space-x-2">
                                {reviews[currentIndex].photos!.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setCurrentPhotoIndex(index);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                      index === currentPhotoIndex
                                        ? 'bg-orange-400 scale-125'
                                        : 'bg-white/30 hover:bg-white/50'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Навигационные кнопки */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#111] hover:bg-[#1a1a1a] rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/10 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#111] hover:bg-[#1a1a1a] rounded-full flex items-center justify-center text-white transition-all duration-300 border border-white/10 hover:border-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Индикаторы */}
            <div className="flex justify-center mt-8 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-orange-400 scale-125 shadow-lg shadow-orange-400/50'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Прогресс-бар автопрокрутки */}
            <div className="mt-4">
              <div className="w-full bg-white/10 rounded-full h-1">
                <motion.div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-1 rounded-full shadow-lg shadow-orange-400/50"
                  initial={{ width: "0%" }}
                  animate={{ width: (isAutoPlaying && !isHovered) ? "100%" : "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  key={currentIndex}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Модальное окно для просмотра фото */}
      <AnimatePresence>
        {selectedPhoto && reviews[currentIndex].photos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Кнопка закрытия */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Кнопки навигации по фото (если фото больше одного) */}
              {reviews[currentIndex].photos!.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPreviousModalPhoto();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNextModalPhoto();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Фото */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={modalPhotoIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    src={reviews[currentIndex].photos![modalPhotoIndex]}
                    alt="Фото с мероприятия"
                    className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                  />
                </AnimatePresence>
                
                {/* Информация о фото */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-6">
                  <div className="text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      Фото с мероприятия{' '}
                      {reviews[currentIndex].photos!.length > 1 && (
                        <span className="text-orange-400">
                          {modalPhotoIndex + 1} из {reviews[currentIndex].photos!.length}
                        </span>
                      )}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {reviews[currentIndex].photos!.length > 1 
                        ? "Используйте стрелки или кликните в любом месте для закрытия"
                        : "Нажмите в любом месте или на крестик, чтобы закрыть"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Индикаторы фото (если фото больше одного) */}
              {reviews[currentIndex].photos!.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {reviews[currentIndex].photos!.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalPhotoIndex(index);
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === modalPhotoIndex
                          ? 'bg-orange-400 scale-125 shadow-lg shadow-orange-400/50'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
