import EventEditView from '../view/event-edit.js';
import {generateId} from '../utils/event.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {newItemEventDefault} from '../const.js';

export default class EventItemNew {
  constructor(tripContainer, changeData, availableOffers, availableDestinationsModel) {
    this._itemEvent = newItemEventDefault;
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._availableOffers = availableOffers;
    this._availableDestinations = availableDestinationsModel;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    if (this._eventEditComponent !== null) {
      return;
    }
    this._destroyCallback = callback;

    this._eventEditComponent = new EventEditView(this._availableOffers, this._itemEvent, this._availableDestinations, true);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setEventDeleteHandler(this._handleDeleteClick);
    render(this._tripContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;
    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(eventItem) {
    this._changeData(
        UserAction.ADD_EVENT_ITEM,
        UpdateType.MAJOR,
        Object.assign({id: generateId()}, eventItem)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
