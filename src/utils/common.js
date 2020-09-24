export const formateDayDate = (date) => {
  return date.toLocaleString(`en-US`, {year: `numeric`, month: `short`, day: `numeric`});
};

export const addZero = (number) => {
  let numberCurrent = String(number);
  const TWO_DIGIT = 2;
  if (numberCurrent.length === TWO_DIGIT) {
    return number;
  }
  numberCurrent = `0${number}`;
  return numberCurrent;
};

export const doFirstUpperCase = (string) => {
  if (typeof string !== `string`) {
    throw new Error(`Not string`);
  }
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
};

export const checkForElementArray = (array, element) => {
  if (!Array.isArray(array)) {
    array = [];
  }
  const verifiedArray = array.filter((current) => {
    if (current.title === element.title && current.price === element.price) {
      return false;
    }
    return true;
  });
  if (verifiedArray.length === array.length) {
    array.push(element);
    return array;
  }
  return verifiedArray;
};
