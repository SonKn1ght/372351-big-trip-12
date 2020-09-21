import {FilterType} from '../const.js';

export const filter = {
  [FilterType.EVERYTHING]: (eventItems) => {
    return eventItems;
  },
  [FilterType.FUTURE]: (eventItems) => eventItems.filter((eventItem) => {
    return eventItem.timeStart >= new Date();
  }),
  [FilterType.PAST]: (eventItems) => eventItems.filter((eventItem) => {
    return eventItem.timeStart < new Date();
  }),
};
