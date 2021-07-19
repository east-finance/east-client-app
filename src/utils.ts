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

export const spacifyFractional = (number: string | number) => {
  return number.toString().replace(/(\d{3})/g, '$1 ').trim()
}

export const spacifyNumber = (number: string | number) => {
  const match = number.toString().match(/[.,]/)
  if (match && match[0]) {
    const separator = match[0]
    // eslint-disable-next-line prefer-const
    let [integerPart, fractionalPart] = number.toString().split(separator)
    if (fractionalPart) {
      fractionalPart = spacifyFractional(fractionalPart)
    } else {
      return number
    }
    return integerPart + ',' + fractionalPart
  }
  return number
}
