// 构造有限状态自动机
enum DfaState {
  Initial,  // 初始状态

  If, Id_if1, Id_if2, Else, Id_else1, Id_else2, Id_else3, Id_else4, Int, Id_int1, Id_int2, Id_int3, 
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