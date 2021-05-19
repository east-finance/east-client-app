export const roundNumber = (number: string, n = 2) => {
  const precision = Math.pow(10, n)
  return Math.round((+number + Number.EPSILON) * precision ) / precision
}
