import EventEditView from '../view/event-edit.js';
import {remove, render} from '../utils/render.js';
import {UserAction, UpdateType, RenderPosition} from '../const.js';

export default class EventItemNew {
  constructor(tripContainer, changeData, availableOffersModel, availableDestinationsModel) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;
    this._availableOffers = availableOffersModel;
    this._availableDestinations = availableDestinationsModel;

    this._eventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    const newItemEventDefault = {
      pointType: `Taxi`,
      iconPoint: `taxi.png`,
      destination: this._availableDestinations.getAvailableDestinations()[0],
      timeStart: new Date(),
      timeEnd: new Date(),
      description: ``,
      availableOffers: [],
      offer: [],
      photos: [],
      cost: ``,
      isFavorite: false
    };

    if (this._eventEditComponent !== null) {
      return;
    }
    this._destroyCallback = callback;

    this._eventEditComponent = new EventEditView(this._availableOffers, newItemEventDefault, this._availableDestinations);
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

  setSaving() {
    this._eventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._eventEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(eventItem) {
    this._changeData(
        UserAction.ADD_EVENT_ITEM,
        UpdateType.MAJOR,
        eventItem
    );
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
