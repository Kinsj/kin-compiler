import TokenType from "../tokenType";

const keywords = {
  int: TokenType.Int,
  char: TokenType.Char,
  if: TokenType.If,
  else: TokenType.Else,
}

type TKeywords = keyof (typeof keywords)

export const keyworksList: TKeywords[] = Object.keys(keywords) as TKeywords[]

// 匹配以starts的值开头的关键字
export const matchKeywords = (list: TKeywords[], starts: string): TKeywords[] => {
  return list.filter(
    keyword => keyword.indexOf(starts) === 0
  )
}

export default keywords