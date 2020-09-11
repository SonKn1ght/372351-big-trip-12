import TripInfo from './view/trip-info.js';
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


const AUTHORIZATION = `Basic hfcrwtnfkbz,kjyb`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const api = new Api(END_POINT, AUTHORIZATION);

const eventItemsModel = new EventItemsModel();
const availableOffersModel = new OffersModel();
const availableDestinationsModel = new DestinationsModel();

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);
// прокинуть данные сюда после того как разберусь с остальным
// render(mainElement, new TripInfo(itemsEvent), RenderPosition.AFTERBEGIN);

const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(controlElement, filterModel);
filterPresenter.init();

const eventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(eventsElement, eventItemsModel, filterModel, availableOffersModel, availableDestinationsModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEventItems();
});

api.getOffers()
  .then((offersAvailable) => {
    availableOffersModel.setAvailableOffers(UpdateType.INIT, offersAvailable);
  })
  .catch(() => {
    availableOffersModel.setAvailableOffers(UpdateType.INIT, []);
  });

api.getDestinations()
  .then((destinations) => {
    availableDestinationsModel.setAvailableDestinations(UpdateType.INIT, destinations);
  })
  .catch(
      availableDestinationsModel.setAvailableDestinations(UpdateType.INIT, [])
  );

api.getEventItems()
  .then((eventItems) => {
    eventItemsModel.setEventItems(UpdateType.INIT, eventItems);
  })
  .catch(() => {
    // console.warn(`catch`)
    eventItemsModel.setEventItems(UpdateType.INIT, []);
    // console.warn(`catch2`)
  });


