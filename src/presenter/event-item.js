import {render, RenderPosition, replace, remove} from '../utils/render.js';
import EventEditView from '../view/event-edit.js';
import EventItemView from '../view/event-item.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
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

  init(itemEvent, availableOffers) {
    const prevEventItemComponent = this._itemEventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._itemEventComponent = new EventItemView(itemEvent, availableOffers);
    this._eventEditComponent = new EventEditView(availableOffers, itemEvent);

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
      replace(this._eventEditComponent, prevEventEditComponent);
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

  _replaceEventToEdit() {
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
    this._replaceEventToEdit();
  }

  _handleFormSubmit(eventItem) {
    // не забыть завести проверку на минор-мажор
    this._changeData(
        UserAction.UPDATE_EVENT_ITEM,
        UpdateType.MAJOR,
        eventItem);
    this._replaceEditToEvent();
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
            {}, this._itemEvent, {isFavorite: !this._itemEvent.isFavorite}
        )
    );
  }
}
