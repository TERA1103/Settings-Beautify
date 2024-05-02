import * as vscode from 'vscode';

// 設定ファイルを読み込む処理を記述する
// クリップボードベースで入出力する．
async function readSetting(): Promise<string> {
  const input = await vscode.window.showInputBox({ placeHolder: "Please paste your setting.json", title: "Beautify your setting.json", ignoreFocusOut: true });
  if (!input) {
    throw new Error("No input");
  }
  console.log(input);
  return input;
}

// 設定ファイルを書き込む処理を記述する
function writeSetting(textData: string): void {
  // TODO: 設定ファイルを書き込む処理
}

export { readSetting, writeSetting };
