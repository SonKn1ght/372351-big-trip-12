// import {createTripInfoTemplate} from './view/trip-info.js';
import TripInfo from "./view/trip-info.js";
import Tabs from "./view/tabs.js";
import Filters from "./view/filter.js";
import SortEvent from "./view/sort-event.js";
import TripDays from "./view/trip-day.js";
import DayItem from "./view/day-item.js";
import EventItem from "./view/event-item";
import EventEdit from "./view/event-edit.js";
import {generateItemEvent} from "./mock/item-event.js";
import {render, RenderPosition, groupBy} from "./utils.js";

const EVENTS_COUNT = 10;

const itemsEvent = new Array(EVENTS_COUNT).fill().map(generateItemEvent).sort((a, b) => {
  return a.timeStart - b.timeStart;
});

// берем сортированный массив элементов точек, без первого элемента(его орисовка будет в форме редактирования),
// и группируем их в объект с ключами представленными днями месяца, после чего
// подготавливаем этот объект и передаем его в Мар
const itemsEventByRender = new Map(Object.entries(groupBy(itemsEvent.slice(1), `dataSort`)));

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

render(mainElement, new TripInfo(itemsEvent).getElement(), RenderPosition.AFTERBEGIN);

const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs.getElement(), RenderPosition.BEFOREEND);

const filters = new Filters();
render(controlElement, filters.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, filters.getElement(), RenderPosition.BEFOREEND);

const eventsElement = document.querySelector(`.trip-events`);

render(eventsElement, new SortEvent().getElement(), RenderPosition.BEFOREEND);

render(eventsElement, new TripDays().getElement(), RenderPosition.BEFOREEND);

const daysListElement = eventsElement.querySelector(`.trip-days`);


let numberDay = 1;
let countDayInNodeList = 0;

for (let day of itemsEventByRender) {
  render(daysListElement, new DayItem(numberDay, day[0]).getElement(), RenderPosition.BEFOREEND);
  const eventListElement = daysListElement.querySelectorAll(`.trip-events__list`);

  if (eventListElement.length === 1) {
    render(eventListElement[countDayInNodeList], new EventEdit(itemsEvent[0]).getElement(), RenderPosition.BEFOREEND);
  }

  for (let point of day[1]) {
    render(eventListElement[countDayInNodeList], new EventItem(point).getElement(), RenderPosition.BEFOREEND);
  }
  numberDay++;
  countDayInNodeList++;
}


