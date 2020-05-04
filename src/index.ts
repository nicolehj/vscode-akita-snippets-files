/**
 * @license
 * Copyright Nicole Inc.
 */

import { Commands, ICommand } from './command';
import { AkitaCli } from './akita-cli';
import { AKITA_CONFIG } from './constance';
import { workspace, ExtensionContext, commands, window as vsWindow } from 'vscode';

/**
 * this method is called when your extension is activated, your extension is activated the very first time the command is executed
 *
 * @export
 * @param {ExtensionContext} context
 */
export function activate(context: ExtensionContext) {
  // get configurations from vscode settings
  let vsConfig = workspace.getConfiguration(AKITA_CONFIG.CONFIGURATION_KEY);

  // listen changes of vscode settings
  workspace.onDidChangeConfiguration(() => {
    vsConfig = workspace.getConfiguration(AKITA_CONFIG.CONFIGURATION_KEY);
  });

  // init cli
  const cli = new AkitaCli();

  const commandHandler = async (args: any, iCommand: ICommand) => {
    // fix when args is undefined
    if (!args) {
      return;
    }

    // get file name from user input
    const inputName = await vsWindow.showInputBox();
    // TODO: add more validations
    if (!inputName) {
      vsWindow.showWarningMessage(
        'That\'s not a valid name! (no whitespaces or special characters)',
      );
      return;
    }

    // Command handler
    iCommand.handle(
      cli,
      { inputName, vsConfig, toPath: args.fsPath, toPathRoot: workspace.rootPath || '' },
    );
  };

  /**
   * Register command
   */
  for (const [key, value] of Commands) {
    const disposable = commands.registerCommand(key, args => commandHandler(args, value));
    context.subscriptions.push(disposable);
  }
}
