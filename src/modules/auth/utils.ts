import isEmail from 'validator/es/lib/isEmail'

// Available options: https://github.com/validatorjs/validator.js/blob/master/src/lib/isEmail.js#L8
export const validateEmail = (email: string): boolean => isEmail(email)

export class AuthCustomError extends Error {

}
