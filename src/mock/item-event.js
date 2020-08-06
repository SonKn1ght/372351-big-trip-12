import {getRandomInteger, shuffleArray} from "../utils.js";

const generatePointType = () => {
  const pointsType = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check`,
    `Sightseeing`,
    `Restaurant`
  ];
  const randomIndex = getRandomInteger(0, pointsType.length - 1);
  return pointsType[randomIndex];
};

const generateCity = () => {
  const cities = [
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
  const randomIndex = getRandomInteger(0, cities.length - 1);
  return cities[randomIndex];
};


const generateOffer = (pointType) => {
  // бросаем проверку на то есть в наличие опции
  const isOffer = (getRandomInteger(0, 1));

  if (!isOffer) {
    return null;
  }

  // описываем опции в соответствии с типом точки
  const offers = {
    Taxi: [[`Offer Taxi 1 + €`, 20], [`Offer Taxi 2 + €`, 20]],
    Bus: null,
    Train: [[`Offer Train 1 + €`, 50], [`Offer Train 2 + €`, 60]],
    Ship: [[`Offer Ship 1 + €`, 40], [`Offer Ship 2 + €`, 50]],
    Transport: null,
    Drive: [[`Offer Drive 1 + € `, 150], [`Offer Drive 2 + € `, 160], [`Offer Drive 3 + € `, 170]],
    Flight: [[`Add luggage + €`, 50], [`Add meal + €`, 15], [`Switch to comfort + €`, 100], [`Choose seats + €`, 5], [`Travel by train + €`, 40]],
    Check: [[`Offer Check 1 + € `, 100], [`Offer Check 2 + € `, 110]],
    Sightseeing: [[`Offer Sightseeing 1 + € `, 50], [`Offer Sightseeing 2 + € `, 60], [`Offer Sightseeing 3 + € `, 70]],
    Restaurant: null
  };
  // бросаем проверку на наличие опций у текущего типа точки
  if (!offers[pointType]) {
    return null;
  }
  // перемещиваем массив опций в рандомном порядке
  const availableOffers = shuffleArray(offers[pointType]);
  // определяем сколько попадет опций из массива в выдачу
  const quantityOffers = getRandomInteger(1, offers[pointType].length);
  // возвращаем перемешанный и обрезанный(или необрезанный, как рандом пошлет) массив
  return availableOffers.slice(0, quantityOffers);
};

const generateDescription = () => {
  const minDescription = 1;
  const maxDescription = 5;
  const descriptionOptions = [
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
  const randomIndex = getRandomInteger(minDescription, maxDescription);
  return shuffleArray(descriptionOptions).slice(0, randomIndex);
};

const generateFoto = () => {
  const minFoto = 1;
  const maxFoto = 5;
  const randomIndex = getRandomInteger(minFoto, maxFoto);
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
}

export const generateItemEvent = () => {
  const pointType = generatePointType();
  const offer = generateOffer(pointType);
  return {
    pointType,
    destination: generateCity(),
    offer,
    description: generateDescription(),
    fotos: generateFoto(),
    cost: generateCost()
  };git
};
