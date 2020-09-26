export const getMoney = (eventItems, typesPoint) => {
  const result = [];

  typesPoint.forEach((currentType) => {
    result.push(eventItems.reduce((accumulator, current) => {
      if (current.pointType === currentType) {
        return accumulator + current.cost;
      }
      return accumulator;
    }, 0)
    );
  });
  return result;
};

export const getTransport = (eventItems, typesPointTransport) => {
  const results = [];

  typesPointTransport.forEach((currentType) => {
    results.push(eventItems.reduce((accumulator, current) => {
      if (current.pointType === currentType) {
        return accumulator + 1;
      }
      return accumulator;
    }, 0)
    );
  });
  return results;
};

export const getTimeSpend = (eventItems, typesPoint) => {
  const result = [];

  typesPoint.forEach((currentType) => {
    result.push(eventItems.reduce((accumulator, current) => {
      if (current.pointType === currentType) {
        const timeDifference = current.timeEnd - current.timeStart;
        return accumulator + timeDifference;
      }
      return accumulator;
    }, 0)
    );
  });
  return result;
};
