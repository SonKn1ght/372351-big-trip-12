import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();

    this._availableOffers = [];
  }

  setAvailableOffers(updateType, offers) {
    this._availableOffers = offers;

    this._notify(updateType);
  }

  getAvailableOffers(pointType) {
    if (this._availableOffers.length === 0) {
      return {
        offers: [],
        type: pointType.toLowerCase()
      };
    }
    return this._availableOffers.filter((current) => {
      return current.type === pointType.toLowerCase();
    })[0];
  }
}
