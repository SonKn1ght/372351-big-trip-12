import TripInfo from './view/trip-info.js';
import Tabs from './view/tabs.js';
import Filters from './view/filter.js';
import TripPresenter from "./presenter/trip";
import {generateItemEvent} from './mock/item-event.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 10;

const itemsEvent = new Array(EVENTS_COUNT).fill().map(generateItemEvent).sort((a, b) => {
  return a.timeStart - b.timeStart;
});

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

render(mainElement, new TripInfo(itemsEvent), RenderPosition.AFTERBEGIN);

// с этими двумя h2, как курица с яйцом, пока через в abstract сунул в методы и в потомках реализовал. Вот думаю может лучше было просто ещё 2 класса сделать и их тут вызывать?
const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs, RenderPosition.BEFOREEND);

const filters = new Filters();
render(controlElement, filters.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, filters, RenderPosition.BEFOREEND);

const eventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(eventsElement);
tripPresenter.init(itemsEvent);

