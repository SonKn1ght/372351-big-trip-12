import {newItemEventDefault, TRANSFER_POINTS, ACTIVITY_POINTS, CATALOG_OFFERS, ICONS} from '../mock/item-event.js';
import SmartView from './smart.js';
import {addPreposition} from '../utils/event.js';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

export default class EventEdit extends SmartView {
  constructor(itemEvent = newItemEventDefault) {
    super();
    this._data = itemEvent;
    this._dataPickerStart = null;
    this._dataPickerEnd = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventSelectionHandler = this._eventSelectionHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._setInnerHandlers();
    this._startTimeHandler = this._startTimeHandler.bind(this);
    this._endTimeHandler = this._endTimeHandler.bind(this);
    this._setDatapickers();
  }

  reset(itemEvent) {
    this.updateData(itemEvent);
  }

  _getTemplate() {
    const {id, pointType, iconPoint, destination, timeStart, timeEnd, description, availableOffers, offer, photos, cost, isFavorite} = this._data;

    const formateDate = (date) => {
      // В британском английском используется порядок день-месяц-год
      let str = date.toLocaleString(`en-GB`, {day: `2-digit`, month: `2-digit`, year: `numeric`, hour12: false, hour: `2-digit`, minute: `2-digit`});
      return str.replace(`,`, ``);
    };

    const renderPhotos = (allPhotos) => {
      return allPhotos.reduce((result, photo) => {
        return (result + `<img class="event__photo" src="${photo}" alt="Event photo">`);
      }, ``);
    };

    const renderOffers = (offers) => {
      if (!offers) {
        return `No offers available`;
      }
      let result = ``;
      // проверка на наличие выбранных опций, если опции выбраны то вешаем атрибут на чекбокс
      for (const offerItem of offers) {
        let check = ``;
        if (offer === null) {
          check = ``;
        } else if (offer.includes(offerItem)) {
          check = `checked`;
        }
        result += `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerItem[0]}" type="checkbox" name="event-offer-luggage" ${check}>
          <label class="event__offer-label" for="event-offer-${offerItem[0]}">
            <span class="event__offer-title">${offerItem[0]}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerItem[1]}</span>
          </label>
      </div>`;
      }
      return result;
    };

    const renderAvailablePoints = (pointsType, identifier, selectedType) => {
      return pointsType.reduce((result, type) => {
        return (
          result + `<div class="event__type-item">
        <input id="event-type-${type}-${identifier}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${(type === selectedType) ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-${identifier}">${type}</label>
      </div>`
        );
      }, ``);
    };

    return (
      `<li class="trip-events__item">
         <form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${iconPoint}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${renderAvailablePoints(TRANSFER_POINTS, id, pointType)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${renderAvailablePoints(ACTIVITY_POINTS, id, pointType)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${pointType} ${addPreposition(pointType)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="Saint Petersburg"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formateDate(timeStart)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formateDate(timeEnd)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${cost}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
      ${renderOffers(availableOffers)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${renderPhotos(photos)}
            </div>
          </div>
        </section>
      </section>
    </form>
</li>`
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this._setDatapickers();
  }

  _setDatapicker(property, data, selector, callback, minimumDate = false) {
    if (property) {
      property.destroy();
      property = null;
    }

    if (data) {
      this._dataPickerStart = flatpickr(
          this.getElement().querySelector(selector),
          {
            dateFormat: `d/m/Y H:m`,
            enableTime: true,
            defaultDate: data,
            onClose: callback,
            minDate: minimumDate,
          }
      );
    }
  }

  _setDatapickers() {
    this._setDatapicker(this._dataPickerStart, this._data.timeStart, `#event-start-time-1`, this._startTimeHandler);
    this._setDatapicker(this._dataPickerEnd, this._data.timeEnd, `#event-end-time-1`, this._endTimeHandler, this._data.timeStart);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventSelectionHandler);
  }

  _startTimeHandler([userDate]) {
    // делаем дату конца равной дате начала если => дата начала назначена хронологически позже даты конца
    if (userDate > this._data.timeEnd) {
      this.updateData({
        timeStart: userDate,
        timeEnd: userDate
      });
    } else {
      this.updateData({
        timeStart: userDate
      });
    }

  }

  _endTimeHandler([userDate]) {
    this.updateData({
      timeEnd: userDate
    });
  }

  _eventSelectionHandler(evt) {
    evt.preventDefault();
    this.updateData({
      pointType: evt.target.value,
      availableOffers: CATALOG_OFFERS[evt.target.value],
      iconPoint: ICONS[evt.target.value]
    });
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}

