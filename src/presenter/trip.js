import DayItem from '../view/day-item.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
import TripDays from '../view/trip-day.js';
import Loading from '../view/loading.js';
import EventItemPresenter from './event-item.js';
import EventItemNewPresenter from './event-item-new.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {FilterType, SortType, UpdateType, UserAction} from '../const.js';
import {sortEventDuration, sortEventPrice, sortDefault} from '../utils/event.js';
import {filter} from '../utils/filter.js';


export default class Trip {
  constructor(tripContainer, eventItemsModel, filterModel, availableOffersModel) {
    this._eventItemsModel = eventItemsModel;
    this._filterModel = filterModel;
    this._availableOffersModel = availableOffersModel;
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;

    this._eventItemPresenter = {};
    this._isLoading = true;

    this._sortEventComponent = null;
    this._tripDaysComponent = null;
    this._noEventComponent = new NoEvent();
    this._loadingComponent = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventItemsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._eventItemNewPresenter = new EventItemNewPresenter(this._tripContainer, this._handleViewAction, this._availableOffersModel);
  }

  init() {
    // странновато, если не будет сюда добавок убрать лишний метод
    this._renderEventsElement();
  }

  createEventItems() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventItemNewPresenter.init();
  }

  _getEventItems() {
    const filterType = this._filterModel.getFilter();
    const eventItems = this._eventItemsModel.getEventItems();
    const filteredEventItems = filter[filterType](eventItems);
    switch (this._currentSortType) {
      case SortType.DURATION:
        return filteredEventItems.sort(sortEventDuration);
      case SortType.PRICE:
        return filteredEventItems.sort(sortEventPrice);
    }
    // добавил сортировку по дефолту, в хронологическом порядке старта события.
    return filteredEventItems.sort(sortDefault);
  }

  _handleModeChange() {
    this._eventItemNewPresenter.destroy();
    Object
      .values(this._eventItemPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_EVENT_ITEM:
        this._eventItemsModel.updateEventItem(updateType, update);
        break;
      case UserAction.ADD_EVENT_ITEM:
        this._eventItemsModel.addEventItem(updateType, update);
        break;
      case UserAction.DELETE_EVENT_ITEM:
        this._eventItemsModel.deleteEventItem(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // при изменениие Favorit => Minor перерисовка только карточки, Мajor при отправке формы
    switch (updateType) {
      case UpdateType.MINOR:
        this._eventItemPresenter[data.id].init(data, this._availableOffersModel);
        break;
      case UpdateType.MAJOR:
        this._clearEventsElement();
        this._renderEventsElement();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEventsElement();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsElement();
    this._renderEventsElement();
  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEventComponent, RenderPosition.BEFOREEND);
  }

  _renderSortEvent() {
    if (this._sortEventComponent !== null) {
      this._sortEventComponent = null;
    }
    this._sortEventComponent = new SortEvent(this._currentSortType);
    this._sortEventComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortEventComponent, RenderPosition.BEFOREEND);
  }

  _renderTripDays() {
    if (this._tripDaysComponent !== null) {
      this._tripDaysComponent = null;
    }
    this._tripDaysComponent = new TripDays();

    render(this._tripContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);
  }

  _renderEventItem(eventListElement, itemEvent, availableOffers) {
    const eventItemPresenter = new EventItemPresenter(eventListElement, this._handleViewAction, this._handleModeChange);
    // console.log(1)
    eventItemPresenter.init(itemEvent, availableOffers);
    // сохраняем ссылки на точки в отдельное свойство
    this._eventItemPresenter[itemEvent.id] = eventItemPresenter;
  }

  _renderEventList(itemsEvent) {
    console.log(itemsEvent)
    let uniqueTripDays;
    let count;

    if (this._currentSortType === SortType.DEFAULT) {
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

      // рисуем день
      render(this._tripDaysComponent, eventListElement, RenderPosition.BEFOREEND);
      // находим в дне элемент в который пишем точки
      const tripEventsList = eventListElement.getElement().querySelector(`.trip-events__list`);
      // пишем в переменную точки
      let currentDayItemsEvent = itemsEvent;
      if (this._currentSortType === SortType.DEFAULT) {
        // получем точки только для этого дня если рисовка по умолчанию
        currentDayItemsEvent = itemsEvent
          .slice()
          .filter((itemEvent) => {
            return itemEvent.dataSort === currentDay;
          });
      }
      // рисуем точки по итоговым данным
      currentDayItemsEvent.forEach((point) => {
        this._renderEventItem(tripEventsList, point, this._availableOffersModel);
      });
    });
  }

  _clearEventsElement() {
    this._eventItemNewPresenter.destroy();
    Object
      .values(this._eventItemPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
    this._eventItemPresenter = {};

    remove(this._sortEventComponent);
    remove(this._noEventComponent);
    remove(this._tripDaysComponent);
    remove(this._loadingComponent);
  }

  _renderEventsElement() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const eventItems = this._getEventItems();
    // console.log(this._getEventItems())
    if (eventItems.length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList(eventItems);
  }
}
