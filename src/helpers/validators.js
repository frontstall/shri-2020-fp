/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import * as R from 'ramda';

import { SHAPES, COLORS } from '../constants';

const {
  CIRCLE,
  SQUARE,
  STAR,
  TRIANGLE,
} = SHAPES;

const {
  BLUE,
  GREEN,
  ORANGE,
  RED,
  WHITE,
} = COLORS;

const isGreen = R.equals(GREEN);
const isRed = R.equals(RED);
const isOrange = R.equals(ORANGE);
const isWhite = R.equals(WHITE);
const isBlue = R.equals(BLUE);

const size = R.compose(R.length, R.values);
const max = (args) => Math.max(...args);
const countOf = (fn) => R.compose(
  size,
  R.filter(fn),
);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = R.allPass([
  R.propSatisfies(isGreen, SQUARE),
  R.propSatisfies(isRed, STAR),
  R.compose(
    R.all(isWhite),
    R.props([TRIANGLE, CIRCLE]),
  ),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = R.compose(
  R.gte(R.__, 2),
  countOf(isGreen),
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = R.converge(
  R.eqBy(size),
  [
    R.filter(isRed),
    R.filter(isBlue),
  ],
);

// 4. Синий круг, красная звезда, оранжевый квадрат
// export const validateFieldN4 = R.allPass([

export const validateFieldN4 = R.where({
  [STAR]: isRed,
  [CIRCLE]: isBlue,
  [SQUARE]: isOrange,
});

// 5. Три фигуры одного любого цвета кроме белого.
export const validateFieldN5 = R.compose(
  R.gte(R.__, 3),
  max,
  R.values,
  R.countBy(R.identity),
  R.values,
  R.reject(isWhite),
);

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = R.allPass([
  R.propSatisfies(isGreen, TRIANGLE),
  R.compose(
    R.gte(R.__, 2),
    countOf(isGreen),
  ),
  R.compose(
    R.gte(R.__, 1),
    countOf(isRed),
  ),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = R.compose(
  R.all(isOrange),
  R.values,
);

// 8. Не красная и не белая звезда.
export const validateFieldN8 = R.propSatisfies(
  R.both(
    R.complement(isWhite),
    R.complement(isRed),
  ),
  STAR,
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = R.compose(
  R.all(isGreen),
  R.values,
);

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = R.compose(
  R.both(
    R.all(R.complement(isWhite)),
    R.apply(R.equals),
  ),
  R.props([TRIANGLE, SQUARE]),
);
