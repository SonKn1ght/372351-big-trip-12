import EventItemsModel from './model/event-items.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import TabsView from './view/tabs.js';
import NewEventItemButtonView from './view/new-event-item-button.js';
import StatisticsView from './view/statistics.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import {render, remove} from './utils/render.js';
import {FilterType, UpdateType, TabType, RenderPosition} from './const.js';

const AUTHORIZATION = `Basic hfcrwtn2f2kbz,kjyb`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER = `v1`;

const StoreType = {
  EVENTS: `events`,
  OFFERS: `offers`,
  DESTINATION: `destination`
};

const STORE_EVENTS = `${STORE_PREFIX}-${StoreType.EVENTS}-${STORE_VER}`;
const STORE_OFFERS = `${STORE_PREFIX}-${StoreType.OFFERS}-${STORE_VER}`;
const STORE_DESTINATION = `${STORE_PREFIX}-${StoreType.DESTINATION}-${STORE_VER}`;

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

const pageBodyContainerElement = document.querySelector(`.page-main .page-body__container`);
const eventsElement = pageBodyContainerElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);
const storeEvents = new Store(STORE_EVENTS, window.localStorage);
const storeOffers = new Store(STORE_OFFERS, window.localStorage);
const storeDestination = new Store(STORE_DESTINATION, window.localStorage);

const apiEventsItemWithProvider = new Provider(api, storeEvents);
const apiOffersWithProvider = new Provider(api, storeOffers);
const apiDestinationWithProvider = new Provider(api, storeDestination);

const eventItemsModel = new EventItemsModel();
const availableOffersModel = new OffersModel();
const availableDestinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(eventsElement, mainElement, eventItemsModel, filterModel, availableOffersModel, availableDestinationsModel, apiEventsItemWithProvider);
const filterPresenter = new FilterPresenter(controlElement, filterModel, eventItemsModel);

const tabs = new TabsView();
const newEventItemButton = new NewEventItemButtonView();

render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs, RenderPosition.BEFOREEND);

tripPresenter.init();

let statisticsComponent = null;
const handleTabsClick = (tabsItem) => {
  switch (tabsItem) {
    case TabType.TABLE:
      tripPresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statisticsComponent);
      break;
    case TabType.STATS:
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      remove(statisticsComponent);
      statisticsComponent = new StatisticsView(eventItemsModel);
      render(pageBodyContainerElement, statisticsComponent.getElement(), RenderPosition.BEFOREEND);
      break;
  }
};

const handleNewEventItemButtonClick = () => {
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();

  tabs.switchActive(true);
  remove(statisticsComponent);


  tripPresenter.createEventItems(() => {
    newEventItemButton.enable();
  });
  newEventItemButton.disable();
};

tabs.setClickTabsHandler(handleTabsClick);
newEventItemButton.setClickNewEventItemButtonHandler(handleNewEventItemButtonClick);

Promise.all([
  apiOffersWithProvider.getOffers(),
  apiDestinationWithProvider.getDestinations(),
  apiEventsItemWithProvider.getEventItems()
]).then((result) => {
  const [offersAvailable, availableDestinations, eventItems] = result;
  availableOffersModel.setAvailableOffers(UpdateType.INIT, offersAvailable);
  availableDestinationsModel.setAvailableDestinations(UpdateType.INIT, availableDestinations);
  filterPresenter.init();
  eventItemsModel.setEventItems(UpdateType.INIT, eventItems);
  render(mainElement, newEventItemButton, RenderPosition.BEFOREEND);
})
  .catch(() => {
    throw new Error(`Something went wrong`);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
  if (!window.navigator.onLine) {
    tripPresenter.setIsNetwork(false);
  }
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiEventsItemWithProvider.sync();
  tripPresenter.setIsNetwork(true);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
  tripPresenter.setIsNetwork(false);
});
