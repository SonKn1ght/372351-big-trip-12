import DayItem from '../view/day-item.js';
import EventEdit from '../view/event-edit.js';
import EventItem from '../view/event-item.js';
// import Filters from '../view/filter.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
// import Tabs from '../view/tabs.js';
import TripDays from '../view/trip-day.js';
// import TripInfo from '../view/trip-info.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {groupBy} from '../utils/event.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._noEvent = new NoEvent();
    this._sortEvent = new SortEvent();
    this._tripDays = new TripDays();
  }

  init(itemsEvent) {
    if (itemsEvent.length === 0) {
      this._renderNoEvent();
      return;
    }
    this._itemsEvent = itemsEvent.slice();
    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList();
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEvent, RenderPosition.BEFOREEND);
  }

  _renderSortEvent() {
    render(this._tripContainer, this._sortEvent, RenderPosition.BEFOREEND);
  }

  _renderTripDays() {
    render(this._tripContainer, this._tripDays, RenderPosition.BEFOREEND);
  }

  _renderEventItem(eventListElement, itemEvent) {
    const itemEventComponent = new EventItem(itemEvent);
    const eventEditComponent = new EventEdit(itemEvent);

    const replaceEventToEdit = () => {
      replace(eventEditComponent, itemEventComponent);
    };

    const replaceEditToEvent = () => {
      replace(itemEventComponent, eventEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceEditToEvent();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    itemEventComponent.setEditClickHandler(() => {
      replaceEventToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    eventEditComponent.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, itemEventComponent, RenderPosition.BEFOREEND);
  }

  _renderEventList() {
    const itemsEventByRender = Object.entries(groupBy(this._itemsEvent, `dataSort`));
    // ура я выкинул наружнюю переменную, убрал мапу => использую просто массив из массивов)), во вложенных -
    // 2 элементами в 1м элементе дата, во втором массив точек относящихся к этой дате
    // собственно все это для доступа внутри forEach к номеру итерации, на Map в коллбэк forEach передают ключ, а на массиве индекс
    itemsEventByRender.forEach((current, index) => {
      // к index прибавляем 1, что б нумерация шла с одного.
      // Можно конечно тут и отдельную переменную под него завести, но она внутри будет инициализироваться на каждой итерации.
      // А вот теперь вопрос попадает ли префиксный инкремент под Б31, критерий про магию?
      const eventListElement = new DayItem(++index, current[0]);
      render(this._tripDays, eventListElement, RenderPosition.BEFOREEND);
      const tripEventsList = eventListElement.getElement().querySelector(`.trip-events__list`);
      current[1].forEach((point) => {
        this._renderEventItem(tripEventsList, point);
      });
    });
  }
}
