import EventItemsModel from '../model/event-items.js';

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatus = {
  SUCCESSFULLY: 200
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getEventItems() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((eventPoints) => {
        return eventPoints.map(EventItemsModel.adaptToClient);
      });
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(Api.toJSON);
  }

  updateEventItem(eventItem) {
    return this._load({
      url: `points/${eventItem.id}`,
      method: Method.PUT,
      body: JSON.stringify(EventItemsModel.adaptToServer(eventItem)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .then(EventItemsModel.adaptToClient);
  }

  addEventItem(eventItem) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(EventItemsModel.adaptToServer(eventItem)),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then(Api.toJSON)
      .then(EventItemsModel.adaptToClient);
  }

  deleteEventItem(eventItem) {
    return this._load({
      url: `points/${eventItem.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status !== SuccessHTTPStatus.SUCCESSFULLY) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
