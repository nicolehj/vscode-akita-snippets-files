/**
 * @license
 * Copyright Nicole Inc.
 */

import * as _path from 'path';
import * as utils from './utils/utils';
import { FileUtil } from './utils/file.util';
import { window as vsWindow } from 'vscode';
import { AKITA_DEFAULT, AKITA_CONFIG } from './constance';
import { FileManager } from './file-manager';

/**
 * AkitaCli params
 */
export interface AkitaCliParams {
  inputName: string;
  toPath: string;
  vsConfig: {[key: string]: any};
  toPathRoot: string;
  type: string;
}

/**
 * Akita cli
 */
export class AkitaCli {
  public generateResources(
    { inputName, toPath, vsConfig, toPathRoot, type }: AkitaCliParams,
  ): void {
    if (!inputName) {
      return;
    }

    if (!FileUtil.isDirectory(toPath)) {
      vsWindow.showInformationMessage('Only directory is valid', 'Got It');

      return;
    }

    const config = {
      name: inputName,
      path: toPath,
      prefix: vsConfig.prefix || AKITA_DEFAULT.PREFIX,
      style: vsConfig.style || AKITA_DEFAULT.STYLE,
      ...utils,
    };

    let templatePath = vsConfig.templatePath.trim();
    if (templatePath) {
      // use template path from vscode settings
      templatePath = _path.join(
        toPathRoot,
        templatePath,
        type || '',
      );
    }

    if (!templatePath || !FileUtil.isDirectory(templatePath)) {
      // use default template path
      templatePath = _path.join(
        __dirname,
        AKITA_CONFIG.TEMPLATE_PATH,
        type || '',
      );
    }

    FileManager.generateFiles(templatePath, config)
    .then(() => vsWindow.showInformationMessage('Success!'))
    .catch(() => console.log('Error!'));
  }
}
