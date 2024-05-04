import commands from './commands';
import * as vscode from 'vscode';

class Beautifier {
  command: string;
  constructor(command: string) {
    this.command = command;
  }

  private beautify() {
    // TODO: 整形処理の実装を書く
  }

  beautifyUserspace() {
    // TODO: ユーザースペースの設定を整形する処理を書く
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

const beautifier = new Beautifier(commands[0]);
export default beautifier;
