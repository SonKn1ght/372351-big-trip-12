import {createElement} from '../utils';

export default class Tabs {
  constructor() {
    this._beforeTitle = null;
    this._element = null;
  }

  _getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`;
  }

  _getTemplateBeforeTitle() {
    return `<h2 class="visually-hidden">Switch trip view</h2>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  getElementBeforeTitle() {
    if (!this._beforeTitle) {
      this._beforeTitle = createElement(this._getTemplateBeforeTitle());
    }

    return this._beforeTitle;
  }
  // удаляется 2 элемента одним методом, т.к. заголовок и блок существуют парой
  removeElement() {
    this._element = null;
    this._beforeTitle = null;
  }
}

