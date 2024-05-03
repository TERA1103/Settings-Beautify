class JsonItem {
  key: string[];
  textData: string;
  // textData: 設定の該当する部分の文字列データ
  constructor(textData: string) {
    this.textData = textData;
    this.key = this.parseToKey(textData);
  }

  // keyをパースして読み取るメソッド
  public parseToKey(textData: string): string[] {
    // private parseToKey(textData: string): string[] {
    // TODO: パース処理
    let textDataline = textData.split("\n");
    const c = textDataline.length;
    
    for (let i = 0; i < c; i++) {
      let line = textDataline[i];
      const re = /".*":/gi;
      const re2 = /\/\//gi;
      if (line.match(re2)) {
        continue;
      }
      if (line.match(re)) {
        let key_str = line.match(re);
        if (key_str) {
          const key_str2 = key_str[0].slice(1, key_str[0].length - 2);
          const key_str_split = key_str2.split(".");
          return key_str_split;
        }
      }
    }


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
  return items.sort((a, b) => (a.getKey() > b.getKey() ? 1 : -1));
}

// 第一キーが同じものをグループ化する関数
// グループ化したものを返す
function makeItemGroup(items: JsonItem[]): JsonItem[][] {
  // TODO: itemsをグループ化する処理
  let c = 0;
  let keyname = items[0];
  const groups = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i] !== keyname) {
      groups.push(items.slice(c, i));
    }
    c = i;
    keyname = items[i];
  }
  groups.push(items.slice(c, items.length));

  return groups;
}

export default JsonItem;
export { sortJsonItems, makeItemGroup };
