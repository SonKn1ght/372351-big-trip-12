import AbstractView from './abstract.js';


const NUMBER_POINTS = 3;
const ONE_ITEMS = 1;
const NO_ITEMS = 0;

const renderTravelPoints = (eventItems) => {
  const travelPoints = [];
  for (const item of eventItems) {
    travelPoints.push(item.destination.name);
  }
  if (travelPoints.length <= NUMBER_POINTS) {
    return travelPoints.join(` — `);
  }
  return `${travelPoints.shift()} —... — ${travelPoints.pop()}`;
};

const renderTripDate = (eventItems) => {
  if (eventItems.length === ONE_ITEMS) {
    const date = eventItems[0];
    const dateStartMonth = date.timeStart.toLocaleString(`en-US`, {month: `short`});
    const dateEndMonth = date.timeEnd.toLocaleString(`en-US`, {month: `short`});

    return `${dateStartMonth} ${date.timeStart.getDate()}&nbsp;&mdash;&nbsp;${dateEndMonth} ${date.timeEnd.getDate()}`;
  }
  const dateStart = eventItems.shift().timeStart;
  const dateEnd = eventItems.pop().timeEnd;
  const dateStartMonth = dateStart.toLocaleString(`en-US`, {month: `short`});
  const dateEndMonth = dateEnd.toLocaleString(`en-US`, {month: `short`});

  return `${dateStartMonth} ${dateStart.getDate()}&nbsp;&mdash;&nbsp;${dateEndMonth} ${dateEnd.getDate()}`;
};

const renderAllCost = (eventItems) => {
  return eventItems.reduce((total, eventItem) => {
    const offerCost = eventItem.offer.reduce((sum, eventItemOffer) => {
      return sum + eventItemOffer.price;
    }, 0);
    return total + eventItem.cost + offerCost;
  }, 0);
};


export default class TripInfo extends AbstractView {
  constructor(eventItems) {
    super();
    this._eventItems = eventItems;
  }

  _getTemplate() {
    return this._eventItems.length === NO_ITEMS ? ` ` :
      `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${renderTravelPoints(this._eventItems.slice())}</h1>
        <p class="trip-info__dates">${renderTripDate(this._eventItems.slice())}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${renderAllCost(this._eventItems)}</span>
      </p>
    </section>`;
  }
}
