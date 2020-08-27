import DayItem from '../view/day-item.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
import TripDays from '../view/trip-day.js';
import EventItemPresenter from './event-item.js';
import {updateItem} from '../utils/common.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {groupBy} from '../utils/event.js';
import {SortType} from '../const.js';
import {sortEventDuration, sortEventPrice} from '../utils/event.js';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;

    this._eventItemPresenter = {};
    this._eventListElements = {};

    this._noEvent = new NoEvent();
    this._sortEvent = new SortEvent();
    this._tripDays = new TripDays();
    this._handleEventItemChange = this._handleEventItemChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(itemsEvent) {

    if (itemsEvent.length === 0) {
      this._renderNoEvent();
      return;
    }
    this._sourcedItemsEvent = itemsEvent;
    this._itemsEvent = itemsEvent.slice();
    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList();
  }

  _handleEventItemChange(updatedEventItem) {
    this._itemsEvent = updateItem(this._itemsEvent, updatedEventItem);
    this._sourcedItemsEvent = updateItem(this._sourcedItemsEvent, updatedEventItem);
    this._eventItemPresenter[updatedEventItem.id].init(updatedEventItem);
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DURATION:
        this._itemsEvent.sort(sortEventDuration);
        this._renderEventList(true);
        break;
      case SortType.PRICE:
        this._itemsEvent.sort(sortEventPrice);
        this._renderEventList(true);
        break;
      default: this._renderEventList();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // убрал отсюда дубль проверки и перенес отрисовку в _sortTasks
    this._clearTripDays();
    this._sortTasks(sortType);
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEvent, RenderPosition.BEFOREEND);
  }

  _renderSortEvent() {
    render(this._tripContainer, this._sortEvent, RenderPosition.BEFOREEND);
    this._sortEvent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripDays() {
    render(this._tripContainer, this._tripDays, RenderPosition.BEFOREEND);
  }

  _clearTripDays() {
    Object
      .values(this._eventItemPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._eventItemPresenter = {};

    // отдельно удаляю дни, были мысли им свой презентер сделать, но они для этого слишком просты и не имеют своего интерактива
    Object
      .values(this._eventListElements)
      .forEach((element) => {
        remove(element);
      });
    this._eventListElements = {};
  }

  _renderEventItem(eventListElement, itemEvent) {
    const eventItemPresenter = new EventItemPresenter(eventListElement, this._handleEventItemChange);
    eventItemPresenter.init(itemEvent);
    // сохраняем ссылки на точки в отдельное свойство
    this._eventItemPresenter[itemEvent.id] = eventItemPresenter;
  }

  _renderEventList(sorted = null) {
    // переделал две функции в одну, т.к. вроде одну задачу решают
    // объявляею переменные вне условий, дабы были они за за блочной область видимости, удобно было бы использовать
    // внутри if - var, но критерии.
    let itemsEventByRender;
    let index;
    // в завистимости от типа вызова функции присваиваю нужные значения
    if (!sorted) {
      itemsEventByRender = Object.entries(groupBy(this._sourcedItemsEvent, `dataSort`));
      index = 1;
    } else {
      itemsEventByRender = [[``, this._itemsEvent]];
      index = ``;
    }
    // вызываю отрисовку
    itemsEventByRender.forEach((current) => {
      this._eventListElement = new DayItem(index, current[0]);
      index++;
      // сохраняем ссылки на дни в отдельное свойство,
      // ключ - собственно дата, не завожу для нее отдельных функций по генерации ключа
      // так как она у нас уникальна для каждого дня
      this._eventListElements[current[0]] = this._eventListElement;
      render(this._tripDays, this._eventListElement, RenderPosition.BEFOREEND);
      const tripEventsList = this._eventListElement.getElement().querySelector(`.trip-events__list`);
      current[1].forEach((point) => {
        this._renderEventItem(tripEventsList, point);
      });
    });
  }
}
