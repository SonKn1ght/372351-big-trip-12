export const createTripInfoTemplate = (itemsEvent) => {
  // получаем наш маршрут, дубли если они есть не удаляются (потом попробовать через reduce)
  let route = [];
  for (let el of itemsEvent) {
    route.push(el.destination);
  }
  route = route.join(` — `);

  // получаем даты преобразуем к требуемому на выход формату и проверка на случай изменения месяца тогда добавляем месяц к второму пункту интервала
  const dateStart = itemsEvent[0].timeStart;
  const dateEnd = itemsEvent[itemsEvent.length - 1].timeStart;
  const dateStartMonth = dateStart.toLocaleString(`en-US`, {month: `short`});
  let dateEndMonth = dateEnd.toLocaleString(`en-US`, {month: `short`});
  if (dateStartMonth === dateEndMonth) {
    dateEndMonth = ``;
  } else {
    dateEndMonth = `${dateEndMonth} `;
  }
  // считаем стоимость
  const allCost = itemsEvent.reduce((accumulator, currentValue) => {
    let costStepOffeer = 0;
    if (currentValue.offer === null) {
      costStepOffeer = 0;
    } else {
      for (let el of currentValue.offer) {
        costStepOffeer += el[1];
      }
    }
    return accumulator + currentValue.cost + costStepOffeer;
  }, 0);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${dateStartMonth} ${dateStart.getDate()}&nbsp;&mdash;&nbsp;${dateEndMonth}${dateEnd.getDate()}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${allCost}</span>
      </p>
    </section>`
  );
};
