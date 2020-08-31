import {ACTIVITY_POINTS} from "../mock/item-event";

export const sortEventDuration = (eventA, eventB) => {
  return eventB.differenceTime - eventA.differenceTime;
};

// в т.з. явно не описано, сортирую по стоимости точки, без учета стоимости предложений
export const sortEventPrice = (eventA, eventB) => {
  return eventB.cost - eventA.cost;
};

export const addPreposition = (pointType) => {
  return ACTIVITY_POINTS.includes(pointType) ? `in` : `to`;
};
