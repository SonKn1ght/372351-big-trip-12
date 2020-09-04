import TripInfo from './view/trip-info.js';
import Tabs from './view/tabs.js';
import FilterPresenter from './presenter/filter.js';
import TripPresenter from './presenter/trip.js';
import EventItemsModel from './model/event-items.js';
import FilterModel from './model/filter.js';
import {generateItemEvent} from './mock/item-event.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 10;

const itemsEvent = new Array(EVENTS_COUNT).fill().map(generateItemEvent);

const eventItemsModel = new EventItemsModel();
eventItemsModel.setEventItems(itemsEvent);

const filterModel = new FilterModel();

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

render(mainElement, new TripInfo(itemsEvent), RenderPosition.AFTERBEGIN);

const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs, RenderPosition.BEFOREEND);

const filterPresenter = new FilterPresenter(controlElement, filterModel);
filterPresenter.init();

const eventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(eventsElement, eventItemsModel, filterModel);
tripPresenter.init();


