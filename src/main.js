import {createTripInfoTemplate} from './view/trip-info.js';
import {createTabsTemplate} from './view/tabs.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortEventTemplate} from './view/sort-event.js';
import {createEventEditTemplate} from './view/event-edit.js';
import {createTripDayTemplate} from './view/trip-day.js';
import {createDayItemTemplate} from './view/day-item.js';
import {createEventItemTemplate} from './view/event-item.js';
import {generateItemEvent} from "./mock/item-event.js";
import {groupBy} from "./utils.js";


const EVENTS_COUNT = 10;

const itemsEvent = new Array(EVENTS_COUNT).fill().map(generateItemEvent).sort((a, b) => {
  return a.timeStart - b.timeStart;
});
// берем сортированный массив элементов точек, без первого элемента(его орисовка будет в форме редактирования),
// и группируем их в объект с ключами представленными днями месяца, после чего
// подготавливаем этот объект и передаем его в Мар
const itemsEventByRender = new Map(Object.entries(groupBy(itemsEvent.slice(1), `dataSort`)));


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);


render(mainElement, createTripInfoTemplate(itemsEvent), `afterbegin`);
render(controlElement, createTabsTemplate(), `beforeend`);
render(controlElement, createFilterTemplate(), `beforeend`);

const eventsElement = document.querySelector(`.trip-events`);

render(eventsElement, createSortEventTemplate(), `beforeend`);
// render(eventsElement, createEventEditTemplate(itemsEvent[0]), `beforeend`);

render(eventsElement, createTripDayTemplate(), `beforeend`);

const daysListElement = eventsElement.querySelector(`.trip-days`);


// рисуем преобразованнные данные
let numberDay = 1;
let countDayInNodeList = 0;
for (let day of itemsEventByRender) {
  render(daysListElement, createDayItemTemplate(numberDay, day[0]), `beforeend`);

  const eventListElement = daysListElement.querySelectorAll(`.trip-events__list`);
  if (eventListElement.length === 1) {
    render(eventListElement[countDayInNodeList], createEventEditTemplate(itemsEvent[0]), `beforeend`);
  }
  for (let point of day[1]) {
    render(eventListElement[countDayInNodeList], createEventItemTemplate(point), `beforeend`);
  }
  numberDay++;
  countDayInNodeList++;
}

