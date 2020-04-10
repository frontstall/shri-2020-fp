/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import * as R from 'ramda';
import Api from '../tools/api';

const api = new Api();

const resolve = (value) => Promise.resolve(value);

const askBinary = R.pipeWith(R.then)([
  resolve,
  R.set(
    R.lensProp('number'),
    R.__,
    { from: 10, to: 2, number: null },
  ),
  R.append(R.__, ['https://api.tech/numbers/base']),
  R.apply(api.get),
  R.prop('result'),
]);

const askAnimal = R.pipeWith(R.then)([
  resolve,
  String,
  R.concat('https://animals.tech/'),
  api.get(R.__, null),
  R.prop('result'),
]);

const validate = R.allPass([
  R.compose(
    Number.isFinite,
    Number,
  ),
  R.compose(
    R.both(
      R.gt(R.__, 1),
      R.lt(R.__, 10),
    ),
    R.length,
  ),
  R.anyPass([
    R.startsWith('0.'),
    R.compose(
      R.test(/[1-9]/),
      R.head,
    ),
  ]),
  R.compose(
    R.gt(R.__, 0),
    Number,
  ),
]);

const normalize = R.compose(
  Math.round,
  Number,
);

const square = R.converge(
  R.multiply,
  [R.identity, R.identity],
);

const VALIDATION_ERROR_MESSAGE = 'ValidationError';

const processSequence = async ({
  value, writeLog, handleSuccess, handleError,
}) => {
  try {
    await R.pipe(
      R.tap(writeLog),
      R.ifElse(
        validate,
        R.pipeWith(R.then)([
          resolve,
          normalize,
          R.tap(writeLog),
          askBinary,
          R.tap(writeLog),
          R.length,
          R.tap(writeLog),
          square,
          R.tap(writeLog),
          R.modulo(R.__, 3),
          R.tap(writeLog),
          askAnimal,
          R.tap(writeLog),
          handleSuccess,
        ]),
        () => handleError(VALIDATION_ERROR_MESSAGE),
      ),
    )(value);
  } catch (e) {
    handleError(e);
  }
};

export default processSequence;
