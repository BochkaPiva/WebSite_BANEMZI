// Примитивный фильтр нецензурных слов (без морфологии, MVP)
const BAD_PARTS = [
  'хуй', 'пизд', 'еб', 'ёб', 'бля', 'сука', 'муд', 'хуе', 'пидор', 'педр', 'говн', 'дерьм'
];

export function hasProfanity(input: string): boolean {
  const s = (input || '').toLowerCase();
  return BAD_PARTS.some((w) => s.includes(w));
}


