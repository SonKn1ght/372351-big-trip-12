import EventItemsModel from './model/event-items.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import TabsView from './view/tabs.js';
import NewEventItemButtonView from './view/new-event-item-button.js';
import StatisticsView from './view/statistics.js';
import Api from './api.js';
import {render, remove} from './utils/render.js';
import {FilterType, UpdateType, TabType, RenderPosition} from './const.js';

const AUTHORIZATION = `Basic hfcrwtn2f2kbz,kjyb`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

const pageBodyContainerElement = document.querySelector(`.page-main .page-body__container`);
const eventsElement = pageBodyContainerElement.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const eventItemsModel = new EventItemsModel();
const availableOffersModel = new OffersModel();
const availableDestinationsModel = new DestinationsModel();
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(eventsElement, eventItemsModel, filterModel, availableOffersModel, availableDestinationsModel, api);
const filterPresenter = new FilterPresenter(controlElement, filterModel);

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
  api.getOffers(),
  api.getDestinations(),
  api.getEventItems()
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


