import { BigNumber } from 'bignumber.js'

// TODO: remove 'any' and make calculations with BigNumber.js
export const roundNumber = (number: string | number, n = 8): any => {
  // const precision = Math.pow(10, n)
  // return Math.round((+number + Number.EPSILON) * precision ) / precision
  return new BigNumber(number).decimalPlaces(n).toString(10)
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

export const spacifyFractional = (number: string | number): string => {
  return number.toString().replace(/(\d{3})/g, '$1 ').trim()
}

export const spacifyNumber = <T extends number|string>(number: T): string => {
  const match = number.toString().match(/[.,]/)
  if (match && match[0]) {
    const separator = match[0]
    // eslint-disable-next-line prefer-const
    let [integerPart, fractionalPart] = number.toString().split(separator)
    if (fractionalPart) {
      fractionalPart = spacifyFractional(fractionalPart)
    } else {
      return number.toString()
    }
    return integerPart + ',' + fractionalPart
  }
  return number.toString()
}

// Throttle source: https://github.com/bameyrick/throttle-typescript
export type ThrottledFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => ReturnType<T>;

export function throttle<T extends (...args: any) => any>(func: T, limit: number): ThrottledFunction<T> {
  let inThrottle: boolean
  let lastResult: ReturnType<T>

  return function(this: any): ReturnType<T> {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this

    if (!inThrottle) {
      inThrottle = true

      setTimeout(() => (inThrottle = false), limit)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      lastResult = func.apply(context, args)
    }

    return lastResult
  }
}
