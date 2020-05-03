/**
 * @license
 * Copyright Nicole Inc.
 */
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  /**
   * Register command
   */
  const disposable = vscode.commands.registerCommand('extension.akita-page', async () => {
    // The code you place here will be executed every time your command is executed
  });

  context.subscriptions.push(disposable);
}
