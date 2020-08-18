import {createElement} from '../utils';

export default class NoEvent {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
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
