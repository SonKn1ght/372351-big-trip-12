import {createElement} from "../utils";

export default class DayItem {
  constructor(numberDay, date) {
    this._date = date;
    this._numberDay = numberDay;
    this._element = null;
  }

  _getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._numberDay}</span>
        <time class="day__date" datetime="2019-03-18">${this._date}</time>
      </div>

      <ul class="trip-events__list">

      </ul>
    </li>`;
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

// export const createDayItemTemplate = (numberDay, date) => {
//   return (
//     `<li class="trip-days__item  day">
//       <div class="day__info">
//         <span class="day__counter">${numberDay}</span>
//         <time class="day__date" datetime="2019-03-18">${date}</time>
//       </div>
//
//       <ul class="trip-events__list">
//
//       </ul>
//     </li>`
//   );
// };
