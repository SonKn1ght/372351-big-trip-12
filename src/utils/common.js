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

export const checkForElements = (elements, element) => {
  if (!Array.isArray(elements)) {
    elements = [];
  }
  const verifiedElements = elements.filter((current) => {
    return !(current.title === element.title && current.price === element.price);
  });
  if (verifiedElements.length === elements.length) {
    elements.push(element);
    return elements;
  }
  return verifiedElements;
};
