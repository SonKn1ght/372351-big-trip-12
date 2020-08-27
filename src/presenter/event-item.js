import {render, RenderPosition, replace, remove} from '../utils/render.js';
import EventEditView from '../view/event-edit.js';
import EventItemView from '../view/event-item.js';

export default class EventItem {
  constructor(tripEventsList, changeData) {
    // в tripEventsList передается сразу Dom элемент
    this._tripEventsList = tripEventsList;
    this._changeData = changeData;

    this._itemEventComponent = null;
    this._eventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(itemEvent) {
    this._itemEvent = itemEvent;

    const prevEventItemComponent = this._itemEventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._itemEventComponent = new EventItemView(itemEvent);
    this._eventEditComponent = new EventEditView(itemEvent);

    this._itemEventComponent.setEditClickHandler(this._handleEditClick);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setFavoriteClickHandler(this._handleFavoriteClick);


    if (prevEventItemComponent === null || prevEventEditComponent === null) {
      render(this._tripEventsList, this._itemEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._tripEventsList.contains(prevEventItemComponent.getElement())) {
      replace(this._itemEventComponent, prevEventItemComponent);
    }

    if (this._tripEventsList.contains(prevEventEditComponent.getElement())) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventItemComponent);
    remove(prevEventEditComponent);
  }

  destroy() {
    remove(this._itemEventComponent);
    remove(this._eventEditComponent);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._itemEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceEditToEvent() {
    replace(this._itemEventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceEditToEvent();
    }
  }

  _handleEditClick() {
    this._replaceEventToEdit();
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceEditToEvent();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {}, this._itemEvent, {isFavorite: !this._itemEvent.isFavorite}
        )
    );
  }
}
