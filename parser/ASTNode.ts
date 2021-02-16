import ASTNodeType from "./ASTNodeType"

class ASTNode {
  parent: ASTNode
  children: ASTNode[] = []
  nodeType: ASTNodeType
  text: string
  constructor(nodeType: ASTNodeType, text: string) {
    this.nodeType = nodeType
    this.text = text
  }

  getParent(): ASTNode {
    return this.parent;
  }

  getChildren(): ASTNode[] {
    return this.children;
  }

  getType(): string {
    return ASTNodeType[this.nodeType];
  }

  getText(): string {
    return this.text;
  }

  addChild(child: ASTNode) {
    this.children.push(child);
    child.parent = this;
  }
}

export default ASTNode
