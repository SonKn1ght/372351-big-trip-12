import {nanoid} from 'nanoid';
import EventItemsModel from '../model/event-items.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.event);
};

const createStoreStructure = (items, isEvents) => {
  return items.reduce((acc, current) => {
    if (isEvents) {
      return Object.assign({}, acc, {
        [current.id]: current,
      });
    }
    return items;
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getEventItems() {
    if (Provider.isOnline()) {
      return this._api.getEventItems()
        .then((events) => {
          const items = createStoreStructure(events.map(EventItemsModel.adaptToServer), true);
          this._store.setEventItems(items);
          return events;
        });
    }

    const storeEvents = Object.values(this._store.getEventItems());

    return Promise.resolve(storeEvents.map(EventItemsModel.adaptToClient));
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructure(offers);
          this._store.setAvailableOfferItems(items);
          return offers;
        });
    }
    const storeOffers = Object.values(this._store.getAvailableOfferItems());

    return Promise.resolve(storeOffers.slice());
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destination) => {
          const items = createStoreStructure(destination);
          this._store.setAvailableDestinationItems(items);
          return destination;
        });
    }

    const storeDestination = Object.values(this._store.getAvailableDestinationItems());

    return Promise.resolve(storeDestination.slice());
  }

  updateEventItem(event) {
    if (Provider.isOnline()) {
      return this._api.updateEventItem(event)
        .then((updatedEvent) => {
          this._store.setEventItem(updatedEvent.id, EventItemsModel.adaptToServer(updatedEvent));
          return updatedEvent;
        });
    }

    this._store.setEventItem(event.id, EventItemsModel.adaptToServer(Object.assign({}, event)));

    return Promise.resolve(event);
  }

  addEventItem(event) {
    if (Provider.isOnline()) {
      return this._api.addEventItem(event)
        .then((newEventItem) => {
          this._store.setEventItem(newEventItem.id, EventItemsModel.adaptToServer(newEventItem));
          return newEventItem;
        });
    }

    const localNewEventItemId = nanoid();
    const localNewEventItem = Object.assign({}, event, {id: localNewEventItemId});

    this._store.setEventItem(localNewEventItem.id, EventItemsModel.adaptToServer(localNewEventItem));

    return Promise.resolve(localNewEventItem);
  }

  deleteEventItem(event) {
    if (Provider.isOnline()) {
      return this._api.deleteEventItem(event)
        .then(() => this._store.removeItem(event.id));
    }

    this._store.removeItem(event.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeEvents = Object.values(this._store.getEventItems());

      return this._api.sync(storeEvents)
        .then((response) => {
          const createdEventsItem = getSyncedEvents(response.created);
          const updatedEventsItem = getSyncedEvents(response.updated);
          const items = createStoreStructure([...createdEventsItem, ...updatedEventsItem]);

          this._store.setEventItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}

