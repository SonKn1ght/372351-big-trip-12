import AbstractView from './abstract.js';
import {TabType} from '../const.js';

export default class Tabs extends AbstractView {
  constructor() {
    super();
    this._beforeTitle = null;
    this._currentTypeTab = TabType.TABLE;

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

  removeElement() {
    this._element = null;
    this._beforeTitle = null;
  }

  switchActive(newEventItem = false) {
    const tabs = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    if (newEventItem) {
      if (tabs[1].classList.contains(`trip-tabs__btn--active`)) {
        this._currentTypeTab = TabType.TABLE;
        this.switchActive();
        return;
      }
      return;
    }

    tabs.forEach((current) => {
      current.classList.toggle(`trip-tabs__btn--active`);
    });
  }

  _tabsClickHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }
    evt.preventDefault();
    if (this._currentTypeTab === evt.target.dataset.value) {
      return;
    }
    this.switchActive();
    this._currentTypeTab = evt.target.dataset.value;

    this._callback.tabsClick(evt.target.dataset.value);
  }

  setClickTabsHandler(callback) {
    this._callback.tabsClick = callback;
    this.getElement().addEventListener(`click`, this._tabsClickHandler);
  }
}

