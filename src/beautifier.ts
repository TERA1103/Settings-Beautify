import * as vscode from 'vscode';
import commands from './commands';
import { readTextEditor } from './settingsJson';

class CommandManager {
  command: string;
  constructor(command: string) {
    this.command = command;
  }

  async beautifyUserspace() {
    // TODO: ユーザースペースの設定を整形する処理を書く
    beautify();
    vscode.window.showInformationMessage(`Hello World from Userspace!`);
  }

  beautifyWorkspace() {
    // TODO: ワークスペースの設定を整形する処理を書く
    vscode.window.showInformationMessage(`Hello World from Workspace!`);
  }

  beautifyAll() {
    // TODO: ユーザースペースとワークスペースの設定を整形する処理を書く
    vscode.window.showInformationMessage(`Hello World from All!`);
  }

  // コマンドをセット（オーバーライド）するメソッド
  public setCommand(command: string) {
    this.command = command;
  }

  // セットしたコマンドに応じたbeautify関数をreturnするメソッド
  public getFunc(): () => void {
    console.log(this.command);
    switch (this.command) {
      case commands[0]:
        return this.beautifyUserspace;
      case commands[1]:
        return this.beautifyWorkspace;
      case commands[2]:
        return this.beautifyAll;
      default:
        throw new Error('Invalid command');
    }
  }
}

function beautify() {
  readTextEditor();
}

const beautifier = new CommandManager(commands[0]);
export default beautifier;
export { beautify };
