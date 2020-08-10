import {getRandomInteger} from "../utils.js";

export const generateDayEvent = () => {
  const dayStart = new Date();
  dayStart.setDate(dayStart.getDate() + getRandomInteger(2, 5));
  return dayStart;
};
