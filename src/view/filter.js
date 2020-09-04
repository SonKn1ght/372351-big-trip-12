import AbstractView from './abstract.js';
import {FilterType} from '../const.js';
import {doFirstUpperCase} from '../utils/common.js';

export default class Filters extends AbstractView {
  constructor(currentFilterType) {
    super();
    this._beforeTitle = null;
    this._currentFilter = currentFilterType;
    this._FilterType = FilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    const renderFilter = (FilterTypes, currentFilterType) => {
      return Object.values(FilterTypes).reduce((result, type) => {
        return (
          result + `<div class="trip-filters__filter">
         <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${currentFilterType === type ? `checked` : ``}>
         <label class="trip-filters__filter-label" for="filter-${type}">${doFirstUpperCase(type)}</label>
       </div>`
        );
      }, ``);
    };

    return `<form class="trip-filters" action="#" method="get">
       ${renderFilter(this._FilterType, this._currentFilter)}
       <button class="visually-hidden" type="submit">Accept filter</button>
     </form>`;
  }

  _getTemplateBeforeTitle() {
    return `<h2 class="visually-hidden">Filter events</h2>`;
  }

  removeElement() {
    this._element = null;
    this._beforeTitle = null;
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

