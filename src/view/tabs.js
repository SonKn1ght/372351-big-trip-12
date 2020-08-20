import AbstractView from './abstract.js';

export default class Tabs extends AbstractView {
  constructor() {
    super();
    this._beforeTitle = null;
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

  removeElement() {
    this._element = null;
    this._beforeTitle = null;
  }
}

