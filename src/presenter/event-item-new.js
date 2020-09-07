import EventEditView from '../view/event-edit.js';
import {generateId} from '../mock/item-event.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';
import {newItemEventDefault} from '../mock/item-event.js';

export default class EventItemNew {
  constructor(tripContainer, changeData, availableOffers) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._availableOffers = availableOffers;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._eventEditComponent = new EventEditView(this._availableOffers, newItemEventDefault, true);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setEventDeleteHandler(this._handleDeleteClick);

    // вставляет не туда, куда нужно, должно добавляться после соритровки.
    render(this._tripContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

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
