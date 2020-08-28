export const groupBy = function (array, criteria) {
  return array.reduce(function (obj, item) {
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

export const sortEventDuration = (eventA, eventB) => {
  return eventB.differenceTime - eventA.differenceTime;
};

// в т.з. явно не описано, сортирую по стоимости точки, без учета стоимости предложений
export const sortEventPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};
