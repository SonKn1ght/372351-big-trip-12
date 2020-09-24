import AbstractView from './abstract.js';

const formateDateForDataTime = (date) => {
  if (date === ``) {
    return ``;
  }
  return `${date.toLocaleString(`en-US`, {year: `numeric`})}-${date.toLocaleString(`en-US`, {month: `2-digit`})}-${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
};

const formatDateForUser = (date) => {
  if (date === ``) {
    return ``;
  }
  return date.toLocaleString(`en-US`, {month: `short`, day: `numeric`});
};

export default class DayItem extends AbstractView {
  constructor(numberDay = ``, date = ``) {
    super();
    this._date = date !== `` ? new Date(date) : ``;
    this._numberDay = numberDay;
  }

  getEventsList() {
    return this.getElement().querySelector(`.trip-events__list`)
  }

  _getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._numberDay}</span>
        <time class="day__date" datetime="${formateDateForDataTime(this._date)}">
          ${formatDateForUser(this._date)}
        </time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`;
  }
}

