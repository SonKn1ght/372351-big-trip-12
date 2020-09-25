import AbstractView from './abstract.js';
import {FilterType} from '../const.js';
import {doFirstUpperCase} from '../utils/common.js';

const renderFilter = (FilterTypes, currentFilterType, filters) => {
  return Object.values(FilterTypes).reduce((result, type) => {
    return (
      result + `<div class="trip-filters__filter">
         <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden"
         type="radio" name="trip-filter"
         value="${type}" ${currentFilterType === type ? `checked` : ``}
         ${filters[type] === 0 ? `disabled` : ``}>
         <label class="trip-filters__filter-label ${filters[type] === 0 ? `trip-filters__filter-label-disabled` : ``}"
          for="filter-${type}">${doFirstUpperCase(type)}</label>
       </div>`
    );
  }, ``);
};

export default class Filters extends AbstractView {
  constructor(currentFilterType, filters) {
    super();
    this._beforeTitle = null;
    this._currentFilter = currentFilterType;
    this._FilterType = FilterType;
    this._filters = filters;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _getTemplate() {
    return `<form class="trip-filters" action="#" method="get">
       ${renderFilter(this._FilterType, this._currentFilter, this._filters)}
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

