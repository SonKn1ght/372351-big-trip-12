import Observer from '../utils/observer.js';

export default class EventItems extends Observer {
  constructor() {
    super();
    this._eventItems = [];
  }

  setEventItems(eventItems) {
    this._eventItems = eventItems.slice();
  }

  getEventItems() {
    return this._eventItems;
  }

  updateEventItem(updateType, update) {
    const index = this._eventItems.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting Event Item`);
    }

    this._eventItems = [
      ...this._eventItems.slice(0, index),
      update,
      ...this._eventItems.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEventItem(updateType, update) {
    // пока добавляем в начало списка, не забыть про пункт тз что точка вставки определяется текуще сортировкой и фильтрами
    this._eventItems = [
      update,
      ...this._eventItems
    ];

    this._notify(updateType, update);
  }

  deleteEventItem(updateType, update) {
    const index = this._eventItems.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting Event Item`);
    }

    this._eventItems = [
      ...this._eventItems.slice(0, index),
      ...this._eventItems.slice(index + 1)
    ];

    this._notify(updateType);
  }
}
