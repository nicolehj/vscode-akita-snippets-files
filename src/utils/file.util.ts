/**
 * @license
 * Copyright Nicole Inc.
 */

import * as _fs from 'fs';

/**
 * File util
 */
export class FileUtil {

  public static isDirectory(path: string): boolean {
    if (!!path && _fs.existsSync(path)) {
      const stats = _fs.statSync(path);
      return stats.isDirectory();
    }
    return false;
  }
}
