import AbstractView from './abstract.js';
import {TabType} from '../const.js';

export default class Tabs extends AbstractView {
  constructor() {
    super();
    this._beforeTitle = null;

    this._tabsClickHandler = this._tabsClickHandler.bind(this);
  }

  _getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="Table">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="Stats">Stats</a>
    </nav>`;
  }

  _getTemplateBeforeTitle() {
    return `<h2 class="visually-hidden">Switch trip view</h2>`;
  }

  _tabsClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    if (evt.target.dataset.value === TabType.TABLE) {

    }
    this._callback.tabsClick(evt.target.dataset.value);
  }

  setClickTabsHandler(callback) {
    this._callback.tabsClick = callback;
    this.getElement().addEventListener(`click`, this._tabsClickHandler);
  }

  removeElement() {
    this._element = null;
    this._beforeTitle = null;
  }
}

