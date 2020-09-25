import FiltersView from '../view/filter.js';
import {render, replace, remove} from '../utils/render.js';
import {UpdateType, RenderPosition, FilterType} from '../const.js';
import {filter} from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, eventItemsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._eventItemsModel = eventItemsModel;
    this._currentFilter = null;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._eventItemsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FiltersView(this._currentFilter, filters);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const eventItems = this._eventItemsModel.getEventItems();

    return {
      [FilterType.EVERYTHING]: filter[FilterType.EVERYTHING](eventItems).length,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](eventItems).length,
      [FilterType.PAST]: filter[FilterType.PAST](eventItems).length
    };
  }

}

