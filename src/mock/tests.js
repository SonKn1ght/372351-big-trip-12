"use strict";

const generateFoto = () => {
  const randomIndex = 4;
  const fotos = new Array();
  for (let i = 0; i < randomIndex; i++) {
    fotos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return fotos;
};

generateFoto();

// let iterable = [10, 20, 30];
//
// for (let value of iterable) {
//   value += 1;
//   console.log(value);
// }
