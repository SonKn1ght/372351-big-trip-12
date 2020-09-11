import Observer from '../utils/observer.js';
import {dayDate, doFirstUpperCase} from '../utils/common.js';

export default class EventItems extends Observer {
  constructor() {
    super();
    this._eventItems = [];
  }

  setEventItems(updateType, eventItems) {
    this._eventItems = eventItems;

    this._notify(updateType);
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

  static adaptToClient(eventItem) {
    const adaptedEventItem = Object.assign(
        {},
        eventItem,
        {
          cost: eventItem.base_price,
          dataSort: dayDate(new Date(eventItem.date_from)),
          iconPoint: `${eventItem.type}.png`,
          isFavorite: eventItem.is_favorite,
          offer: eventItem.offers,
          pointType: doFirstUpperCase(eventItem.type),
          timeEnd: new Date(eventItem.date_to),
          timeStart: new Date(eventItem.date_from)
        });
    delete adaptedEventItem.base_price;
    delete adaptedEventItem.date_from;
    delete adaptedEventItem.date_to;
    delete adaptedEventItem.is_favorite;
    delete adaptedEventItem.offers;
    delete adaptedEventItem.type;
    return adaptedEventItem;
  }

  static adaptToServer(eventItem) {
    const adaptedEventItem = Object.assign(
        {},
        eventItem,
        {
          'base_price': eventItem.cost,
          'is_favorite': eventItem.isFavorite,
          'offers': eventItem.offer,
          'type': (eventItem.pointType).toLowerCase(),
          'date_from': eventItem.timeStart.toISOString(),
          'date_to': eventItem.timeEnd.toISOString()
        });
    delete eventItem.dataSort;
    delete eventItem.iconPoint;
    delete eventItem.timeStart;
    delete eventItem.timeEnd;

    return adaptedEventItem;
  }
}
