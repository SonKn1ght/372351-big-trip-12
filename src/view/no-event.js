import AbstractView from './abstract.js';

export default class NoEvent extends AbstractView {
  _getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
