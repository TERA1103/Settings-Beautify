import JsonItem from './jsonItem';

// settings.json用のParser
class settingParser {
  settingText: string;
  currentPos: number = 0;
  currentLevel: number = 0;
  items: JsonItem[] = [];

  constructor(settingText: string) {
    this.settingText = settingText;
  }

  public parse(): JsonItem[] {
    // 一番始めのキーに到達したかどうか
    let beganflag: boolean = false;
    while (this.currentPos < this.settingText.length) {
      // 一番浅いキーバリューペアでアイテム分けする
      // 最初の{}に入る前: currentLevel = 0
      // 一番浅い{}内: currentLevel = 1
      // それ以降: currentLevel =< 2
      if (this.settingText[this.currentPos] === '{') {
        this.currentLevel++;
      } else if (this.settingText[this.currentPos] === '}') {
        this.currentLevel--;
      }
      // 最初のキーに到達するまでは，空白と改行を読み飛ばす
      // 二行目以降は行頭から読み始めるようにするため
      if (this.settingText[this.currentPos] !== ' ' && this.settingText[this.currentPos] !== '\n') {
        beganflag = true;
      }

      // 最初のキーに到達するとこの処理に入る
      if (this.currentLevel !== 0 && beganflag) {
        this.currentPos++;
        this.parseInternal();
        return this.items;
      }

      this.currentPos++;
    }
    throw new Error('Invalid setting.json');
  }

  // パース用の内部関数
  // これが終了した時パースも終了している
  private parseInternal() {
    // 同じItemに含まれる文字列を足していく
    let substr: string = '';
    // カンマを見たかどうか
    // カンマを見ると，その次にスペースでも'"'でもない文字が来れば，その行には次のキーは現れない
    let sawComma: boolean = false;
    while (this.currentPos < this.settingText.length) {
      if (this.settingText[this.currentPos] === '{' || this.settingText[this.currentPos] === '[') {
        this.currentLevel++;
      } else if (this.settingText[this.currentPos] === '}' || this.settingText[this.currentPos] === ']') {
        this.currentLevel--;
      }
      // 一番外側の'}'を抜けたら終了
      if (this.currentLevel === 0) {
        return;
      }

      substr += this.settingText[this.currentPos];
      this.currentPos++;

      // 深い場所でのカンマは無視する（キーの判定に入れない）
      if (this.currentLevel >= 2) {
        continue;
      }
      // カンマを見たら，その行に次のキーが現れるかどうかを判定してJsonItemを生成する処理を変える
      if (sawComma) {
        // 'value,      "key":'のような場合に対応
        while (this.settingText[this.currentPos] === ' ') {
          substr += this.settingText[this.currentPos];
          this.currentPos++;
        }
        if (this.settingText[this.currentPos] === '"') {
          // JsonItemを生成し，substrやsawCommaを初期化
          const item = new JsonItem(substr);
          this.items.push(item);
          substr = '';
          sawComma = false;
          continue;
        } else {
          // こっちは，次の行以降にキーが現れる場合
          while (this.settingText[this.currentPos] !== '\n') {
            substr += this.settingText[this.currentPos];
            this.currentPos++;
          }
          substr += this.settingText[this.currentPos];
          this.currentPos++;
          // JsonItemを生成し，substrやsawCommaを初期化
          const item = new JsonItem(substr);
          this.items.push(item);
          substr = '';
          sawComma = false;
          continue;
        }
      }

      if (this.settingText[this.currentPos] === ',') {
        sawComma = true;
      }
    }
  }
}

export default settingParser;
