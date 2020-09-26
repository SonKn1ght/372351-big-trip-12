import TripInfoView from '../view/trip-info.js';
import {remove, render} from '../utils/render.js';
import {RenderPosition} from '../const.js';

export default class TripInfo {
  constructor(tripInfoContainer) {
    this._tripInfoContainer = tripInfoContainer;
  }

  init(eventItemsModel) {
    this._eventItems = eventItemsModel.getEventItems();
    this._tripInfoComponent = new TripInfoView(this._eventItems);
    render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    remove(this._tripInfoComponent);
  }
}
