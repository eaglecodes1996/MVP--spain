import { getApi, postApi } from './config.js';

export function getSubjects() {
  return getApi('/subjects');
}

export function validateCalculatorCode(value) {
  return postApi('/subjects/calculator-validate', { value });
}
