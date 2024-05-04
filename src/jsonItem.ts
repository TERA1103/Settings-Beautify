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
    // パース処理
    let textDataline = textData.split('\n');
    const c = textDataline.length;

    for (let i = 0; i < c; i++) {
      let line = textDataline[i];
      const re = /".*":/gi;
      const re2 = /\/\//gi;
      if (line.match(re2)) {
        continue;
      }
      if (line.match(re)) {
        let keyStr = line.match(re);
        if (keyStr) {
          const keyStr2 = keyStr[0].slice(1, keyStr[0].length - 2);
          const keyStrSplit = keyStr2.split('.');
          return keyStrSplit;
        }
      }
    }

    return [''];
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
  // itemsをソートする処理
  return items.sort((a, b) => (a.getKey() > b.getKey() ? 1 : -1));
}

// 第一キーが同じものをグループ化する関数
// グループ化したものを返す
function makeItemGroup(items: JsonItem[]): JsonItem[][] {
  // itemsをグループ化する処理
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
