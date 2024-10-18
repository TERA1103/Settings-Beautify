import * as vscode from 'vscode';

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

// 設定ファイルを書き込む処理を記述する
function writeSetting(textData: string): void {
  const textEditor = vscode.window.activeTextEditor;
  if (!textEditor) {
    vscode.window.showErrorMessage('No active text editor');
    return;
  }

  const document = textEditor.document;
  const lastLineNum = document.lineCount - 1;
  const lastCharNum = document.lineAt(lastLineNum).text.length;
  textEditor.edit((editBuilder) => {
    editBuilder.replace(new vscode.Range(0, 0, lastLineNum, lastCharNum), textData);
  });
}

export { readTextEditor, writeSetting };
