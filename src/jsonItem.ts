class JsonItem {
  key: string[];
  textData: string;
  // textData: 設定の該当する部分の文字列データ
  constructor(textData: string) {
    this.textData = textData;
    this.key = this.parseToKey(textData);
  }

  // keyをパースして読み取るメソッド
  private parseToKey(textData: string): string[] {
    // TODO: パース処理
    return [""];
  }

  // keyを取得するメソッド
  public getKey(): string[] {
    return this.key;
  }

  // textDataを取得するメソッド
  public getTextData(): string {
    return this.textData;
  }
}

// itemsをソートする関数
// キーの辞書順でソートする
function sortJsonItems(items: JsonItem[]): JsonItem[] {
  // TODO: itemsをソートする処理
  return items;
}

// 第一キーが同じものをグループ化する関数
// グループ化したものを返す
function makeItemGroup(items: JsonItem[]): JsonItem[][] {
  // TODO: itemsをグループ化する処理
  return [items];
}

export default JsonItem;
export { sortJsonItems, makeItemGroup };
