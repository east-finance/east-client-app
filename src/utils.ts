export const formatNumber = (value: string, visibleDigits = 2) => {
  const [integerPart, decimalPart = ''] = value.split('.')
  const decimal = decimalPart ? '.' + decimalPart.slice(0, visibleDigits) : ''
  return integerPart + decimal
}
