import {FilterType} from '../const.js';

export const filter = {
  // очень странная запись, но иначе линтер ругается, оставил так что б все фильтры вызывались консистентно
  [FilterType.EVERYTHING]: (eventItems) => {
    return eventItems;
  },
  // если вдруг случается такое на миллион и нажатие фильтра совпадет с текушей датой => то она будет сидеть в будущих
  [FilterType.FUTURE]: (eventItems) => eventItems.filter((eventItem) => {
    return eventItem.timeStart >= new Date();
  }),
  [FilterType.PAST]: (eventItems) => eventItems.filter((eventItem) => {
    return eventItem.timeStart < new Date();
  }),
};
