import {getRandomInteger, shuffleArray, dayDate} from '../utils/common.js';
import {CATALOG_OFFERS} from './offers.js';

export const TRANSFER_POINTS = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];
export const ACTIVITY_POINTS = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];
const POINTS_TYPE = TRANSFER_POINTS.concat(ACTIVITY_POINTS);
export const ICONS = {
  [`Taxi`]: `taxi.png`,
  [`Bus`]: `bus.png`,
  [`Train`]: `train.png`,
  [`Ship`]: `ship.png`,
  [`Transport`]: `transport.png`,
  [`Drive`]: `drive.png`,
  [`Flight`]: `flight.png`,
  [`Check-in`]: `check-in.png`,
  [`Sightseeing`]: `sightseeing.png`,
  [`Restaurant`]: `restaurant.png`
};
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
const MIN_DESCRIPTION = 1;
const MAX_DESCRIPTION = 5;
const MIN_FOTO = 1;
const MAX_FOTO = 5;
const MIN_COST = 10;
const MAX_COST = 250;

let timeAccumulator = 0;

export const generateId = () => {
  return Date.now() + parseInt(Math.random() * 10000, 10);
};

const generatePointType = () => {
  const randomIndex = getRandomInteger(0, POINTS_TYPE.length - 1);
  return POINTS_TYPE[randomIndex];
};

const generateCity = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);
  return CITIES[randomIndex];
};

const generateTime = (param) => {

  let timeStart = new Date((param + (2 * 60 * 60 * 1000)));

  // это для установки даты на первой итерации текущая дата + 1 час
  if (param === 0) {
    // для получения данных в прошлом не мудрствовал лукаво
    timeStart = new Date((Date.now() - (3 * 24 * 60 * 60 * 1000)));
  }
  // создаем конец события начало события + интервал от 1 го до 6 часов, добавил разброс для теста сортировки
  const timeEnd = new Date((timeStart.getTime() + (getRandomInteger(1, 40) * 60 * 60 * 1000)));
  // обновляем переменную => внешний накопитель даты
  timeAccumulator = timeEnd.getTime();
  // записываем все в объект для выдачи из функции
  return {
    timeStart,
    timeEnd
  };
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
  // перемешиваем массив ключей опций в рандомном порядке
  const availableOffers = shuffleArray(Object.keys(CATALOG_OFFERS[pointType]));
  // определяем сколько попадет опций из массива в выдачу
  const quantityOffers = getRandomInteger(1, Object.keys(CATALOG_OFFERS[pointType]).length);

  // возвращаем перемешанный и обрезанный(или необрезанный, как рандом пошлет) массив с опциями
  return availableOffers.slice(0, quantityOffers);
};

const generateDescription = () => {
  const randomIndex = getRandomInteger(MIN_DESCRIPTION, MAX_DESCRIPTION);
  const description = shuffleArray(DESCRIPTION_OPTIONS).slice(0, randomIndex);
  return description.reduce((accumulator, currentValue) => {
    return `${accumulator + currentValue} `;
  }, ``);
};

const generatePhotos = () => {
  const randomIndex = getRandomInteger(MIN_FOTO, MAX_FOTO);
  const photos = [];
  for (let i = 0; i < randomIndex; i++) {
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photos;
};

const generateCost = () => {
  return getRandomInteger(MIN_COST, MAX_COST);
};


export const generateItemEvent = () => {
  const pointType = generatePointType();
  const offer = generateOffer(pointType, CATALOG_OFFERS);
  const iconPoint = ICONS[pointType];
  const {timeStart, timeEnd} = generateTime(timeAccumulator);
  // console.log(offer)
  return {
    id: generateId(),
    dataSort: dayDate(timeStart),
    pointType,
    iconPoint,
    destination: generateCity(),
    timeStart,
    timeEnd,
    offer,
    description: generateDescription(),
    photos: generatePhotos(),
    cost: generateCost(),
    isFavorite: false
  };
};

// объект с данными по умолчанию - для запуска формы редактирования-создания в момент создания точки
export const newItemEventDefault = {
  pointType: `Taxi`,
  iconPoint: `taxi.png`,
  destination: ``,
  timeStart: new Date(),
  timeEnd: new Date(),
  description: ``,
  availableOffers: CATALOG_OFFERS[`Taxi`],
  offer: null,
  photos: [],
  cost: ``,
  isFavorite: false
};


