export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const shuffleArray = (array) => {
  let mixedArray = array.slice();
  for (let i = mixedArray.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    let tempValue = mixedArray[i];
    mixedArray[i] = mixedArray[randomIndex];
    mixedArray[randomIndex] = tempValue;
  }
  return mixedArray;
};

export const humanizeDate = (Date) => {
  return Date.toLocaleString(`en-US`, {hour12: false, hour: `numeric`, minute: `numeric`});
};

export const dayDate = (Date) => {
  return Date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
};

export const convertMS = (millisec) => {
  let minutes = Math.floor(millisec / 60000);
  let hours = ``;
  let days = ``;
  if (minutes > 59) {
    hours = Math.floor(minutes / 60);
    minutes = minutes - (hours * 60);
    if (hours > 23) {
      days = Math.floor(hours / 24);
      hours = hours - (days * 24);
    }
  }
  hours = (hours > 9) ? hours : `0${hours}`;
  minutes = (minutes > 9) ? minutes : `0${minutes}`;
  days = (days > 9) ? days : `0${days}`;


  if (days !== `0`) {
    return `${days}D ${hours}H ${minutes}M`;
  }

  if (hours !== `0`) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const groupBy = function (arr, criteria) {
  return arr.reduce(function (obj, item) {
    const key = item[criteria];
    // Если свойство не создано, создаем его.
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }
    // Добавление значения в объект
    obj[key].push(item);
    // Возвращение объекта для следующего шага
    return obj;
  }, {});
};
