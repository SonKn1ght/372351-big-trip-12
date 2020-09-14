import Observer from '../utils/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();

    this._availableOffers = null;
  }

  setAvailableOffers(offers) {
    this._availableOffers = offers;
  }

  getAvailableOffers(pointType) {
    return this._availableOffers[pointType];
  }
}
