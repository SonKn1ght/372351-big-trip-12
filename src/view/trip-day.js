import {createElement} from "../utils";

export default class TripDays {
  constructor() {
    this._element = null;
  }

  _getTemplate() {
    return `<ul class="trip-days">
     </ul>`;
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

