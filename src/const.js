export const SortType = {
  DEFAULT: `default`,
  DURATION: `duration`,
  PRICE: `price`
};

export const UserAction = {
  UPDATE_EVENT_ITEM: `UPDATE_EVENT_ITEM`,
  ADD_EVENT_ITEM: `ADD_EVENT_ITEM`,
  DELETE_EVENT_ITEM: `DELETE_EVENT_ITEM`
};

export const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const TRANSFER_POINTS = [
  `Taxi`,
  `Bus`,
  `Train`,
  `Ship`,
  `Transport`,
  `Drive`,
  `Flight`
];
export const ACTIVITY_POINTS = [
  `Check-in`,
  `Sightseeing`,
  `Restaurant`
];

export const ALL_POINTS = TRANSFER_POINTS.concat(ACTIVITY_POINTS);

export const TabType = {
  TABLE: `Table`,
  STATS: `Stats`
};
