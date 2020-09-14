// import TripInfo from './view/trip-info.js';
import Tabs from './view/tabs.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import EventItemsModel from './model/event-items.js';
import FilterModel from './model/filter.js';
import {render, RenderPosition} from './utils/render.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import {UpdateType} from './const.js';
import Api from './api.js';


const AUTHORIZATION = `Basic hfcrwtn2f2kbz,kjyb`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const api = new Api(END_POINT, AUTHORIZATION);

const eventItemsModel = new EventItemsModel();
const availableOffersModel = new OffersModel();
const availableDestinationsModel = new DestinationsModel();

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);
// render(mainElement, new TripInfo(itemsEvent), RenderPosition.AFTERBEGIN);

const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(controlElement, filterModel);

const eventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(eventsElement, eventItemsModel, filterModel, availableOffersModel, availableDestinationsModel, api);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEventItems();
});
// сначала проверяем загрузку оферов, потом destination, и только после точки. Иначе при отрисовке редактирования возможно недополучение данных и некорректное отображение редактирования точки. Либо без списка доступных пунктков - либо без предложений
Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getEventItems()
]).then((result) => {
  const [offersAvailable, availableDestinations, eventItems] = result;
  availableOffersModel.setAvailableOffers(UpdateType.INIT, offersAvailable);
  availableDestinationsModel.setAvailableDestinations(UpdateType.INIT, availableDestinations);
  // фильтры рисую только при удачном разрешении для отрисовки точек
  filterPresenter.init();
  eventItemsModel.setEventItems(UpdateType.INIT, eventItems);
})
  .catch(() => {
    throw new Error(`Something went wrong`);
  });
