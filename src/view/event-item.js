import {humanizeDate, convertMS, createElement} from "../utils.js";

export default class EventItem {
  constructor(itemEvent) {
    this._itemEvent = itemEvent;
    this._element = null;
  }

  _getTemplate() {
    const {pointType, iconPoint, destination, timeStart, timeEnd, differenceTime, offer, cost} = this._itemEvent;
    const createOffersTemplate = (offers) => {
      if (!offers) {
        return ``;
      }
      let result = ``;
      for (const off of offers) {
        result += `<li class="event__offer">
        <span class="event__offer-title">${off[0]}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${off[1]}</span>
      </li>`;
      }
      return result;
    };

    return (
      `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${iconPoint}" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeDate(timeStart)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeDate(timeEnd)}</time>
          </p>
          <p class="event__duration">${convertMS(differenceTime)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${cost}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
        ${createOffersTemplate(offer)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}


