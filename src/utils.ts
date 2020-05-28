export function randomNumber(max: number): number {
  return Math.floor(Math.random() * max);
}

export function eventHappened(probability: number): boolean {
  return Math.random() >= 1 - probability;
}
