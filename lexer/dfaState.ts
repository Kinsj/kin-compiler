// 构造有限状态自动机
enum DfaState {
  Initial,  // 初始状态

  If, Else, Int,
  Id_Keyword,
  Id, // 标识符（单词）
  GT, // > 
  GE, // >=

  Assignment,

  Plus, Minus, Star, Slash,

  SemiColon,
  LeftParen,
  RightParen,

  IntLiteral  // 数字
}

export default DfaState;