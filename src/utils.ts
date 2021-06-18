export const roundNumber = (number: string | number, n = 2) => {
  const precision = Math.pow(10, n)
  return Math.round((+number + Number.EPSILON) * precision ) / precision
}

export const cutNumber = (number: string | number, maxFractional = 8): string => {
  const match = number.toString().match(/[.,]/)
  if (match) {
    const [divider] = match
    const [decimal, fractional] = number.toString().split(divider)
    return `${decimal}${divider}${fractional.slice(0, maxFractional)}`
  }
  return number.toString()
}
