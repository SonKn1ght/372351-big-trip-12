import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();

    this._availableDestinations = null;
  }

  setAvailableDestinations(updateType, destinations) {
    this._availableDestinations = destinations;

    this._notify(updateType);
  }

  getAvailableDestinations() {
    return this._availableDestinations;
  }
}
