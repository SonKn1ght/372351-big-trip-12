import DayItem from '../view/day-item.js';
import EventEdit from '../view/event-edit.js';
import EventItem from '../view/event-item.js';
import NoEvent from '../view/no-event.js';
import SortEvent from '../view/sort-event.js';
import TripDays from '../view/trip-day.js';
import {render, RenderPosition, replace} from '../utils/render.js';
import {groupBy} from '../utils/event.js';
import {SortType} from '../const.js';
import {sortEventDuration, sortEventPrice} from '../utils/event.js';

export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._currentSortType = SortType.DEFAULT;

    this._noEvent = new NoEvent();
    this._sortEvent = new SortEvent();
    this._tripDays = new TripDays();
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(itemsEvent) {

    if (itemsEvent.length === 0) {
      this._renderNoEvent();
      return;
    }
    this._sourcedItemsEvent = itemsEvent;
    this._itemsEvent = itemsEvent.slice();
    this._renderSortEvent();
    this._renderTripDays();
    this._renderEventList();
  }

  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DURATION:
        this._itemsEvent.sort(sortEventDuration);
        this._renderEventListSorted();
        break;
      case SortType.PRICE:
        this._itemsEvent.sort(sortEventPrice);
        this._renderEventListSorted();
        break;
      default: this._renderEventList();
    }
    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    // убрал отсюда дубль проверки и перенес отрисовку в _sortTasks
    this._clearTripDays();
    this._sortTasks(sortType);
  }

  _renderNoEvent() {
    render(this._tripContainer, this._noEvent, RenderPosition.BEFOREEND);
  }

  _renderSortEvent() {
    render(this._tripContainer, this._sortEvent, RenderPosition.BEFOREEND);
    this._sortEvent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderTripDays() {
    render(this._tripContainer, this._tripDays, RenderPosition.BEFOREEND);
  }

  _clearTripDays() {
    this._tripDays.getElement().innerHTML = ``;
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
      replaceEditToEvent();
      evt.preventDefault();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(eventListElement, itemEventComponent, RenderPosition.BEFOREEND);
  }

  _renderEventList() {
    const itemsEventByRender = Object.entries(groupBy(this._sourcedItemsEvent, `dataSort`));
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

  _renderEventListSorted() {
    const eventListElement = new DayItem(``, ``);
    render(this._tripDays, eventListElement, RenderPosition.BEFOREEND);
    const tripEventsList = eventListElement.getElement().querySelector(`.trip-events__list`);
    this._itemsEvent.forEach((item) => {
      this._renderEventItem(tripEventsList, item);
    });
  }
}
