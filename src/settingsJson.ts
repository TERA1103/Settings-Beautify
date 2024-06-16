import * as vscode from 'vscode';
import { extentionContext } from './extension';
import jsonParser from './jsonParser';

// 設定ファイルを読み込む処理を記述する
// クリップボードベースで入出力する．
function makeViewPanel() {
  // webviewのパネル作成
  const panel = vscode.window.createWebviewPanel('webViewPanel', 'Web View Panel', vscode.ViewColumn.One, {
    enableScripts: true,
  });

  panel.webview.html = `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https:; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Send Settings JSON</title>
    </head>
    <body>
      <textarea id="settingsJson" rows="30" cols="100"></textarea><br />
      <button onclick="send()">Send Settings JSON</button>

      <script>
        function send() {
          const vscode = acquireVsCodeApi();
          const textarea = document.getElementById('settingsJson');

          vscode.postMessage({
              type: 'settings',
              content: textarea.value
          })
        }
      </script>
    </body>
  </html>
  `;

  // メッセージの受信処理
  panel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.type) {
        case 'settings': {
          const settingText = message.content;
          const parser = new jsonParser(settingText);
          const items = parser.getJson();
          console.dir(items, { depth: null });
          // const sortedItems = sortJsonItems(items);
          // const groupedItems = makeItemGroup(sortedItems);
          // const beautifiedText = groupedItems
          //   .map((group) => group.map((item) => item.getTextData()).join('\n'))
          //   .join('\n');
          // await writeSetting();
        }
      }
    },
    undefined,
    extentionContext.subscriptions,
  );
}

// // 設定ファイルを書き込む処理を記述する
// async function writeSetting(textData: string): Promise<void> {
//   await vscode.env.clipboard.writeText(textData);
//   await vscode.window.showInformationMessage('Copied to clipboard');
// }

export { makeViewPanel };
