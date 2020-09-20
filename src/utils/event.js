import {ACTIVITY_POINTS} from '../const.js';
import {addZero} from './common.js';
import moment from 'moment';

export const sortDefault = (eventA, eventB) => {
  return eventA.timeStart - eventB.timeStart;
};

export const sortEventDuration = (eventA, eventB) => {
  return (eventA.timeStart - eventA.timeEnd) - (eventB.timeStart - eventB.timeEnd);
};

// в т.з. явно не описано, сортирую по стоимости точки, без учета стоимости предложений
export const sortEventPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};

export const addPreposition = (pointType) => {
  return ACTIVITY_POINTS.includes(pointType) ? `in` : `to`;
};

export const formatEventDuration = (timeStart, timeEnd) => {
  if (!(timeStart instanceof Date) && !(timeEnd instanceof Date)) {
    return ``;
  }
  const duration = moment.duration(timeEnd - timeStart);

  if (duration.days() !== 0) {
    return `${addZero(duration.days())}D ${addZero(duration.hours())}H ${addZero(duration.minutes())}M`;
  }
  if (duration.hours() !== 0) {
    return `${addZero(duration.hours())}H ${addZero(duration.minutes())}M`;
  }

  return `${addZero(duration.minutes())}M`;
};
