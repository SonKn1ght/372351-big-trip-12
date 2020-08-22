import {createElement} from '../utils/render.js';

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can not instantiate Abstract, only concrete one.`);
    }
    this._element = null;
    this._callback = {};
  }

  _getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  _getTemplateBeforeTitle() {
    throw new Error(`Abstract method not implemented: getTemplateBeforeTitle`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this._getTemplate());
    }

    return this._element;
  }

  getElementBeforeTitle() {
    if (!this._beforeTitle) {
      this._beforeTitle = createElement(this._getTemplateBeforeTitle());
    }

    return this._beforeTitle;
  }

  removeElement() {
    this._element = null;
  }
}
