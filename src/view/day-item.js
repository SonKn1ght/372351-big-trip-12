import AbstractView from './abstract.js';
import {dayDate} from "../utils/common";

export default class DayItem extends AbstractView {
  constructor(numberDay = ``, date = ``) {
    super();
    this._date = date;
    this._numberDay = numberDay;
  }

  _getTemplate() {
    const dateByDataTime = (date) => {
      return `${date.toLocaleString(`en-US`, {year: `numeric`})}-${date.toLocaleString(`en-US`, {month: `2-digit`})}-${date.toLocaleString(`en-US`, {day: `2-digit`})}`;
    };
    // сделал отображение datetime
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._numberDay}</span>
        <time class="day__date" datetime="${dateByDataTime(this._date)}">${dayDate(this._date)}</time>
      </div>
      <ul class="trip-events__list">

      </ul>
    </li>`;
  }
}

