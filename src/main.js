import {createTripInfoTemplate} from './view/trip-info.js';
import {createTabsTemplate} from './view/tabs.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortEventTemplate} from './view/sort-event.js';
import {createEventEditTemplate} from './view/event-edit.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createDayItemTemplate} from './view/day-item.js';
import {createEventItemTemplate} from './view/event-item.js';

const EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);


render(mainElement, createTripInfoTemplate(), `afterbegin`);
render(controlElement, createTabsTemplate(), `beforeend`);
render(controlElement, createFilterTemplate(), `beforeend`);

const eventsElement = document.querySelector(`.trip-events`);

render(eventsElement, createSortEventTemplate(), `beforeend`);
render(eventsElement, createEventEditTemplate(), `beforeend`);

render(eventsElement, createTripDayTemplate(), `beforeend`);

const daysListElement = eventsElement.querySelector(`.trip-days`);

render(daysListElement, createDayItemTemplate(), `beforeend`);

const eventListElement = daysListElement.querySelector(`.trip-events__list`);

for (let i = 0; i < EVENTS_COUNT; i++) {
  render(eventListElement, createEventItemTemplate(), `beforeend`);
}

