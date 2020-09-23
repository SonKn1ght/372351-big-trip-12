import AbstractView from './abstract.js';

export default class NewEventItemButton extends AbstractView {
  constructor() {
    super();

    this._newEventItemButtonClickHandler = this._newEventItemButtonClickHandler.bind(this);
  }

  _getTemplate() {
    return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
  }

  disable() {
    this.getElement().disabled = true;
  }

  enable() {
    this.getElement().disabled = false;
  }

  _newEventItemButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.newEventItemButtonClick();
  }

  setClickNewEventItemButtonHandler(callback) {
    this._callback.newEventItemButtonClick = callback;
    this.getElement().addEventListener(`click`, this._newEventItemButtonClickHandler);
  }
}
