import DayItem from '../view/day-item.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
import TripDays from '../view/trip-day.js';
import Loading from '../view/loading.js';
import EventItemPresenter, {State as EventItemPresenterViewState} from './event-item.js';
import EventItemNewPresenter from './event-item-new.js';
import {remove, render} from '../utils/render.js';
import {SortType, FilterType, UpdateType, UserAction, RenderPosition} from '../const.js';
import {sortEventDuration, sortEventPrice, sortDefault} from '../utils/event.js';
import {filter} from '../utils/filter.js';


export default class Trip {
  constructor(tripContainer, eventItemsModel, filterModel, availableOffersModel, availableDestinationsModel, api) {
    this._eventItemsModel = eventItemsModel;
    this._filterModel = filterModel;
    this._availableOffersModel = availableOffersModel;
    this._availableDestinationsModel = availableDestinationsModel;
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;
    this._currentFilterType = FilterType.EVERYTHING;

    this._eventItemPresenter = {};
    this._isLoading = true;
    this._isNetwork = true;
    this._api = api;

    this._sortEventComponent = null;
    this._tripDaysComponent = null;
    this._noEventComponent = new NoEvent();
    this._loadingComponent = new Loading();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);

    this._eventItemNewPresenter = new EventItemNewPresenter(this._tripContainer, this._handleViewAction, this._availableOffersModel, this._availableDestinationsModel);
  }

  init() {
    if (this._sortEventComponent !== null && this._tripDaysComponent !== null) {
      return;
    }

    this._eventItemsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderEventsElement(this._isNetwork);
  }

  destroy() {
    this._clearEventsElement(true);

    this._eventItemsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);

    this._sortEventComponent = null;
    this._tripDaysComponent = null;
  }

  createEventItems(callback) {
    remove(this._sortEventComponent);
    this._eventItemNewPresenter.init(callback, this._isNetwork);
    this._renderSortEvent();
  }

  setIsNetwork(status) {
    this._isNetwork = status;
    this._clearEventsElement();
    this._renderEventsElement(this._isNetwork);
  }

  _getEventItems() {
    const filterType = this._filterModel.getFilter();
    if (filterType !== this._currentFilterType) {
      this._currentSortType = SortType.DEFAULT;
      this._currentFilterType = filterType;
    }
    const eventItems = this._eventItemsModel.getEventItems();
    const filteredEventItems = filter[filterType](eventItems);
    switch (this._currentSortType) {
      case SortType.DURATION:
        return filteredEventItems.sort(sortEventDuration);
      case SortType.PRICE:
        return filteredEventItems.sort(sortEventPrice);
    }
    return filteredEventItems.sort(sortDefault);
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

    render(this._tripContainer, this._sortEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripDays() {
    if (this._tripDaysComponent !== null) {
      this._tripDaysComponent = null;
    }
    this._tripDaysComponent = new TripDays();

    render(this._tripContainer, this._tripDaysComponent, RenderPosition.BEFOREEND);
  }

  _renderEventItem(eventListElement, itemEvent, availableOffers, availableDestinations, isNetwork) {
    const eventItemPresenter = new EventItemPresenter(eventListElement, this._handleViewAction, this._handleModeChange);
    eventItemPresenter.init(itemEvent, availableOffers, availableDestinations, isNetwork);
    this._eventItemPresenter[itemEvent.id] = eventItemPresenter;
  }

  _renderEventList(itemsEvent, isNetwork) {
    let uniqueTripDays = [];
    let count;

    if (this._currentSortType === SortType.DEFAULT) {
      for (const item of itemsEvent) {
        uniqueTripDays.push(item.dataSort);
      }
      uniqueTripDays = Array.from(new Set(uniqueTripDays));
      count = 1;
    } else {
      uniqueTripDays = [``];
      count = ``;
    }

    uniqueTripDays.forEach((currentDay) => {
      const eventListElement = new DayItem(count, currentDay);
      count++;
      render(this._tripDaysComponent, eventListElement, RenderPosition.BEFOREEND);
      const tripEventsList = eventListElement.getElement().querySelector(`.trip-events__list`);
      let currentDayItemsEvent = itemsEvent;
      if (this._currentSortType === SortType.DEFAULT) {
        currentDayItemsEvent = itemsEvent
          .slice()
          .filter((itemEvent) => {
            return itemEvent.dataSort === currentDay;
          });
      }
      currentDayItemsEvent.forEach((point) => {
        this._renderEventItem(tripEventsList, point, this._availableOffersModel, this._availableDestinationsModel, isNetwork);
      });
    });
  }

  _clearEventsElement(resetSortType = false) {
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

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderEventsElement(isNetwork = true) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const eventItems = this._getEventItems();
    if (eventItems.length === 0) {
      this._renderNoEvent();
      return;
    }

    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList(eventItems, isNetwork);
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
        this._eventItemPresenter[update.id].setViewState(EventItemPresenterViewState.SAVING);
        this._api.updateEventItem(update)
          .then((response) => {
            this._eventItemsModel.updateEventItem(updateType, response);
          })
          .catch(() => {
            this._eventItemPresenter[update.id].setViewState(EventItemPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_EVENT_ITEM:
        this._eventItemNewPresenter.setSaving();
        this._api.addEventItem(update)
          .then((response) => {
            this._eventItemsModel.addEventItem(updateType, response);
          })
          .catch(() => {
            this._eventItemNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_EVENT_ITEM:
        this._eventItemPresenter[update.id].setViewState(EventItemPresenterViewState.DELETING);
        this._api.deleteEventItem(update)
          .then(() => {
            this._eventItemsModel.deleteEventItem(updateType, update);
          })
          .catch(() => {
            this._eventItemPresenter[update.id].setViewState(EventItemPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        this._eventItemPresenter[data.id].init(data, this._availableOffersModel, this._availableDestinationsModel);
        this._eventItemPresenter[data.id].replaceEventToEdit();
        break;
      case UpdateType.MAJOR:
        this._clearEventsElement();
        this._renderEventsElement(this._isNetwork);
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderEventsElement(this._isNetwork);
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearEventsElement();
    this._renderEventsElement(this._isNetwork);
  }
}
