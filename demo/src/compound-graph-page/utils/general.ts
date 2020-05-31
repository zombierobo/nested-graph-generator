/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (exclusive)
 */
export function getRandomArbitraryInt(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}
