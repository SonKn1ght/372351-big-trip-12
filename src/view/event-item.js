import AbstractView from './abstract.js';
import {addPreposition} from '../utils/event.js';
import {formatEventDuration} from '../utils/event.js';

export default class EventItem extends AbstractView {
  constructor(itemEvent) {
    super();
    this._itemEvent = itemEvent;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _getTemplate() {
    const {pointType, iconPoint, destination, timeStart, timeEnd, offer, cost} = this._itemEvent;
    const createOffersTemplate = (offers) => {
      if (!offers) {
        return ``;
      }
      let result = ``;
      // отображение только трех предложений в точке, остальные показываются при раскрытии точки
      const threeOffers = offers.slice(0, 3);
      for (const off of threeOffers) {
        result += `<li class="event__offer">
        <span class="event__offer-title">${off[0]}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${off[1]}</span>
      </li>`;
      }
      return result;
    };

    const humanizeDate = (Date) => {
      return Date.toLocaleString(`en-US`, {hour12: false, hour: `numeric`, minute: `numeric`});
    };

    const formattingDateTime = (time) => {
      return time.toISOString().slice(0, 16);
    };

    return (
      `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${iconPoint}" alt="Event type icon">
        </div>
        <h3 class="event__title">${pointType} ${addPreposition(pointType)} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formattingDateTime(timeStart)}">${humanizeDate(timeStart)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formattingDateTime(timeEnd)}">${humanizeDate(timeEnd)}</time>
          </p>
          <p class="event__duration">${formatEventDuration(timeStart, timeEnd)}</p>
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

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}


