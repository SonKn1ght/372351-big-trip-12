export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffleArray = (array) => {
  const mixedArray = array.slice();
  for (let i = mixedArray.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const tempValue = mixedArray[i];
    mixedArray[i] = mixedArray[randomIndex];
    mixedArray[randomIndex] = tempValue;
  }
  return mixedArray;
};

// все функции форматирования даты раскидал по шаблонам сюда буду выносить только те которые используются больше чем 1 раз
export const dayDate = (Date) => {
  return Date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
};
