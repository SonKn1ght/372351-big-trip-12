import TripInfo from './view/trip-info.js';
import Tabs from './view/tabs.js';
import Filters from './view/filter.js';
import SortEvent from './view/sort-event.js';
import TripDays from './view/trip-day.js';
import DayItem from './view/day-item.js';
import EventItem from './view/event-item';
import EventEdit from './view/event-edit.js';
import NoEvent from './view/no-event.js';
import {generateItemEvent} from './mock/item-event.js';
import {render, RenderPosition, groupBy} from './utils.js';

const EVENTS_COUNT = 0;

const itemsEvent = new Array(EVENTS_COUNT).fill().map(generateItemEvent).sort((a, b) => {
  return a.timeStart - b.timeStart;
});

// берем сортированный массив элементов точек и группируем их в объект с ключами представленными
// днями месяца, после чего подготавливаем этот объект и передаем его в Мар
const itemsEventByRender = new Map(Object.entries(groupBy(itemsEvent, `dataSort`)));

const mainElement = document.querySelector(`.trip-main`);
const controlElement = mainElement.querySelector(`.trip-controls`);

render(mainElement, new TripInfo(itemsEvent).getElement(), RenderPosition.AFTERBEGIN);

// создаю экземпляр, после вызываю отрисовку передавая вызов нужного метода, сначала отрисовываю заголовок => после сам элемент
const tabs = new Tabs();
render(controlElement, tabs.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, tabs.getElement(), RenderPosition.BEFOREEND);


const filters = new Filters();
render(controlElement, filters.getElementBeforeTitle(), RenderPosition.BEFOREEND);
render(controlElement, filters.getElement(), RenderPosition.BEFOREEND);


const eventsElement = document.querySelector(`.trip-events`);

// условия на приглашение добавления первой точки маршрута, если таковые отсутствуют
if (itemsEvent.length !== 0) {
  render(eventsElement, new SortEvent().getElement(), RenderPosition.BEFOREEND);
  render(eventsElement, new TripDays().getElement(), RenderPosition.BEFOREEND);
} else {
  render(eventsElement, new NoEvent().getElement(), RenderPosition.BEFOREEND);
}


const daysListElement = eventsElement.querySelector(`.trip-days`);

const renderEventItem = (eventListElement, itemEvent) => {
  const itemEventComponent = new EventItem(itemEvent);
  const eventEditComponent = new EventEdit(itemEvent);

  const replaceEventToEdit = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), itemEventComponent.getElement());
  };

  const replaceEditToEvent = () => {
    eventListElement.replaceChild(itemEventComponent.getElement(), eventEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  itemEventComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventListElement, itemEventComponent.getElement(), RenderPosition.BEFOREEND);
};

// счетчик номера дня, передаю в экземпляр дня, параметром для отрисовки номера дня в списке
let numberDay = 1;

for (let day of itemsEventByRender) {
  const eventListElement = new DayItem(numberDay, day[0]).getElement();
  render(daysListElement, eventListElement, RenderPosition.BEFOREEND);

  for (let point of day[1]) {
    const tripEventsList = eventListElement.querySelector(`.trip-events__list`);
    renderEventItem(tripEventsList, point);
  }
  numberDay++;
}


