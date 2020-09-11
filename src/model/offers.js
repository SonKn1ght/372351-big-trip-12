import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();

    this._availableOffers = null;
  }

  setAvailableOffers(updateType, offers) {
    this._availableOffers = offers;

    this._notify(updateType);
  }

  getAvailableOffers(pointType) {
    // отдаем набор опций под тип точки
    // return this._availableOffers;
    return this._availableOffers.filter((current) => {
      return current.type === pointType.toLowerCase();
    })[0];
  }
}
