import {getRandomInteger, shuffleArray, dayDate} from "../utils.js";
// константы для моков не выносил в отдельный файл для констант, оставил все здесь

const generatePointType = () => {
  const POINTS_TYPE = [
    `Taxi to`,
    `Bus to`,
    `Train to`,
    `Ship to`,
    `Transport to`,
    `Drive to`,
    `Flight to`,
    `Check in`,
    `Sightseeing in`,
    `Restaurant in`
  ];
  const randomIndex = getRandomInteger(0, POINTS_TYPE.length - 1);
  return POINTS_TYPE[randomIndex];
};

const generatePoinTypeIcon = (pointType) => {
  const ICONS = {
    [`Taxi to`]: `taxi.png`,
    [`Bus to`]: `bus.png`,
    [`Train to`]: `train.png`,
    [`Ship to`]: `ship.png`,
    [`Transport to`]: `transport.png`,
    [`Drive to`]: `drive.png`,
    [`Flight to`]: `flight.png`,
    [`Check in`]: `check-in.png`,
    [`Sightseeing in`]: `sightseeing.png`,
    [`Restaurant in`]: `restaurant.png`
  };
  return ICONS[pointType];
};

const generateCity = () => {
  const CITIES = [
    `Vienna`,
    `Minsk`,
    `Sarajevo`,
    `Berlin`,
    `Copenhagen`,
    `Dublin`,
    `Belgrade`,
    `Stockholm`,
    `Paris`,
    `Moscow`
  ];
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
};

const generateTime = () => {
  // генерируем продолжительность события
  const timeHoursGap = getRandomInteger(0, 120);
  const timeMinutesGap = getRandomInteger(0, 59);

  const timeStart = new Date();
  // создаем начало события текущая дата + до 5 дней
  timeStart.setHours(timeHoursGap, timeMinutesGap);
  // создаем конец события начало события + рандом интервал до 4 часов 59 минут
  const timeEnd = new Date();
  timeEnd.setHours(timeHoursGap + getRandomInteger(0, 4), timeMinutesGap + getRandomInteger(0, 59));
  // получаем разницу между началом и концом в милисекундах
  const differenceTime = timeEnd - timeStart;
  // записываем все в объект для выдачи из функции
  return {
    timeStart,
    timeEnd,
    differenceTime
  };
};

const CATALOG_OFFERS = {
  [`Taxi to`]: [[`Offer Taxi 1 `, 20], [`Offer Taxi 2 `, 20]],
  [`Bus to`]: null,
  [`Train to`]: [[`Offer Train 1 `, 50], [`Offer Train 2 `, 60]],
  [`Ship to`]: [[`Offer Ship 1 `, 40], [`Offer Ship 2 `, 50]],
  [`Transport to`]: null,
  [`Drive to`]: [[`Offer Drive 1 `, 150], [`Offer Drive 2 `, 160], [`Offer Drive 3 `, 170]],
  [`Flight to`]: [[`Add luggage `, 50], [`Add meal `, 15], [`Switch to comfort `, 100], [`Choose seats `, 5], [`Travel by train `, 40]],
  [`Check in`]: [[`Offer Check 1  `, 100], [`Offer Check 2  `, 110]],
  [`Sightseeing in`]: [[`Offer Sightseeing 1 `, 50], [`Offer Sightseeing 2 + € `, 60], [`Offer Sightseeing 3 `, 70]],
  [`Restaurant in`]: null
};

const generateOffer = (pointType, Offers) => {
  // бросаем проверку на то есть в наличие опции
  const isOffer = (getRandomInteger(0, 1));

  if (!isOffer) {
    return null;
  }

  // бросаем проверку на наличие опций у текущего типа точки
  if (!Offers[pointType]) {
    return null;
  }
  // перемешиваем массив опций в рандомном порядке
  const availableOffers = shuffleArray(Offers[pointType]);
  // определяем сколько попадет опций из массива в выдачу
  const quantityOffers = getRandomInteger(1, Offers[pointType].length);
  // возвращаем перемешанный и обрезанный(или необрезанный, как рандом пошлет) массив с опциями
  return availableOffers.slice(0, quantityOffers);
};

const generatAvailableOffers = (pointType) => {
  return CATALOG_OFFERS[pointType];
};

const generateDescription = () => {
  const MIN_DESCRIPTION = 1;
  const MAX_DESCRIPTION = 5;
  const DESCRIPTION_OPTIONS = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];
  const randomIndex = getRandomInteger(MIN_DESCRIPTION, MAX_DESCRIPTION);
  const description = shuffleArray(DESCRIPTION_OPTIONS).slice(0, randomIndex);
  return description.reduce((accumulator, currentValue) => {
    return `${accumulator + currentValue} `;
  }, ``);
};

const generateFoto = () => {
  const MIN_FOTO = 1;
  const MAX_FOTO = 5;
  const randomIndex = getRandomInteger(MIN_FOTO, MAX_FOTO);
  const fotos = [];
  for (let i = 0; i < randomIndex; i++) {
    fotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return fotos;
};

const generateCost = () => {
  const minCost = 10;
  const maxCost = 250;
  return getRandomInteger(minCost, maxCost);
};

export const generateItemEvent = () => {
  const pointType = generatePointType();
  const offer = generateOffer(pointType, CATALOG_OFFERS);
  const iconPoint = generatePoinTypeIcon(pointType);
  const {timeStart, timeEnd, differenceTime} = generateTime();
  const availableOffers = generatAvailableOffers(pointType);
  return {
    dataSort: dayDate(timeStart),
    pointType,
    iconPoint,
    destination: generateCity(),
    timeStart,
    timeEnd,
    differenceTime,
    offer,
    availableOffers,
    description: generateDescription(),
    fotos: generateFoto(),
    cost: generateCost()
  };
};

// объект с данными по умолчанию - для запуска формы редактирования-создания в момент создания точки
export const newItemEventDefault = {
  pointType: `Taxi to`,
  iconPoint: `taxi.png`,
  destination: `destination`,
  timeStart: new Date(),
  timeEnd: new Date(),
  description: ``,
  availableOffers: generatAvailableOffers(`Taxi to`),
  offer: null,
  fotos: [],
  cost: ``
};

