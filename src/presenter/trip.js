import DayItem from '../view/day-item.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
import TripDays from '../view/trip-day.js';
import EventItemPresenter from './event-item.js';
import {updateItem} from '../utils/common.js';
import {remove, render, RenderPosition} from '../utils/render.js';
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
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(itemsEvent) {

    if (itemsEvent.length === 0) {
      this._renderNoEvent();
      return;
    }
    this._itemsEvent = itemsEvent;
    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList();
  }

  _handleModeChange() {
    Object
      .values(this._eventItemPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleEventItemChange(updatedEventItem) {
    this._itemsEvent = updateItem(this._itemsEvent, updatedEventItem);
    this._eventItemPresenter[updatedEventItem.id].init(updatedEventItem);
  }

  _sortTasks(sortType) {
    const dataToSort = this._itemsEvent.slice();
    switch (sortType) {
      case SortType.DURATION:
        return dataToSort.sort(sortEventDuration);
      case SortType.PRICE:
        return dataToSort.sort(sortEventPrice);
      default: return dataToSort;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // убрал запись в текущий тип сюда, что б не было ничего лишнего в самой сортировке, т.е. использовать ее как раз как функцию
    this._currentSortType = sortType;
    this._clearTripDays();
    const sortedItemsEvent = this._sortTasks(sortType);
    this._renderEventList(sortedItemsEvent, this._currentSortType);
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEvent, RenderPosition.BEFOREEND);
  }

  _renderSortEvent() {
    render(this._tripContainer, this._sortEvent, RenderPosition.BEFOREEND);
    this._sortEvent.getElement().addEventListener(`change`, (evt) => {
      this._handleSortTypeChange(evt.target.dataset.sortType);
    });
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
    const eventItemPresenter = new EventItemPresenter(eventListElement, this._handleEventItemChange, this._handleModeChange);
    eventItemPresenter.init(itemEvent);
    // сохраняем ссылки на точки в отдельное свойство
    this._eventItemPresenter[itemEvent.id] = eventItemPresenter;
  }

  _renderEventList(itemsEvent = this._itemsEvent, sort = SortType.DEFAULT) {
    // в очередной раз переписал эту функцию через set и фильтрацию
    let uniqueTripDays;
    let count;

    if (sort === SortType.DEFAULT) {
      let days = [];
      for (const item of itemsEvent) {
        days.push(item.dataSort);
      }
      uniqueTripDays = Array.from(new Set(days));
      count = 1;
    } else {
      uniqueTripDays = [``];
      count = ``;
    }

    uniqueTripDays.forEach((currentDay) => {
      // создаем день
      const eventListElement = new DayItem(count, currentDay);
      count++;
      // сохраняем ссылку на него для удаления
      this._eventListElements[currentDay] = eventListElement;

      // рисуем день
      render(this._tripDays, eventListElement, RenderPosition.BEFOREEND);
      // находим в дне элемент в который пишем точки
      const tripEventsList = eventListElement.getElement().querySelector(`.trip-events__list`);
      // пишем в переменную точки
      let currentDayItemsEvent = itemsEvent;
      if (sort === SortType.DEFAULT) {
        // получем точки только для этого дня если рисовка по умолчанию
        currentDayItemsEvent = itemsEvent
          .slice()
          .filter((itemEvent) => {
            return itemEvent.dataSort === currentDay;
          });
      }
      // рисуем точки по итоговым данным
      currentDayItemsEvent.forEach((point) => {
        this._renderEventItem(tripEventsList, point);
      });
    });
  }
}
