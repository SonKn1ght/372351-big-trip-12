import {render, RenderPosition, replace, remove} from '../utils/render.js';
import EventEditView from '../view/event-edit.js';
import EventItemView from '../view/event-item.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`,
  ABORTING: `ABORTING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`
};

export default class EventItem {
  constructor(tripEventsList, changeData, changeMode) {
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._itemEventComponent = null;
    this._eventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(itemEvent, availableOffers, availableDestinations) {
    this._itemEvent = itemEvent;
    const prevEventItemComponent = this._itemEventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._itemEventComponent = new EventItemView(itemEvent);
    this._eventEditComponent = new EventEditView(availableOffers, itemEvent, availableDestinations);

    this._itemEventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setEventDeleteHandler(this._handleDeleteClick);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevEventItemComponent === null || prevEventEditComponent === null) {
      render(this._tripEventsList, this._itemEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._itemEventComponent, prevEventItemComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._itemEventComponent, prevEventEditComponent);
      this._mode = Mode.DEFAULT;
    }

    remove(prevEventItemComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._itemEventComponent);
    remove(this._eventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  setViewState(state) {
    const resetFormState = () => {
      this._eventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._eventEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._itemEventComponent.shake(resetFormState);
        this._eventEditComponent.shake(resetFormState);
        break;
    }
  }

  replaceEventToEdit() {
    replace(this._eventEditComponent, this._itemEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditToEvent() {
    replace(this._itemEventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._eventEditComponent.reset(this._itemEvent);
      this._replaceEditToEvent();
    }
  }

  _handleEditClick() {
    this.replaceEventToEdit();
  }

  _handleFormSubmit(eventItem) {
    this._changeData(
        UserAction.UPDATE_EVENT_ITEM,
        UpdateType.MAJOR,
        eventItem);
  }

  _handleDeleteClick(eventItem) {
    this._changeData(
        UserAction.DELETE_EVENT_ITEM,
        UpdateType.MAJOR,
        eventItem
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT_ITEM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._itemEvent,
            {
              isFavorite: !this._itemEvent.isFavorite
            }
        )
    );
  }
}
