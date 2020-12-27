const alpha = /[a-zA-Z_]/
const digit = /\d/
const blank = /\s/
const keyword = /[i]/

export const isAlpha = (char: string) => alpha.test(char);
export const isDigit = (char: string) => digit.test(char);
export const isBlank = (char: string) => blank.test(char);