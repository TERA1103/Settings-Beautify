import * as vscode from 'vscode';
// import { extentionContext } from './extension';
// import jsonParser from './jsonParser';

// settings.jsonの読み込み
// vscode.window.activeTextEditorで読み込む
function readTextEditor() {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    vscode.window.showErrorMessage('No active text editor');
    return;
  }

  const document = textEditor.document.getText();
  return document;
}

// // 設定ファイルを書き込む処理を記述する
// async function writeSetting(textData: string): Promise<void> {
//   await vscode.env.clipboard.writeText(textData);
//   await vscode.window.showInformationMessage('Copied to clipboard');
// }

export { readTextEditor };
