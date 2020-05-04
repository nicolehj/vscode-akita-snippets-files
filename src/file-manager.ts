/**
 * @license
 * Copyright Nicole Inc.
 */

import * as memFs from 'mem-fs';
import { create as EditorCreate } from 'mem-fs-editor';
import * as _fs from 'fs';
import * as _path from 'path';
import { AKITA_CONFIG } from './constance';

/**
 * FilePath
 */
export interface FilePath {
  name: string;
  templatePath: string;
  destinationPath: string;
}

export interface DestPath { path: string; }
export type DestPathValue = boolean | string | number | undefined;
export type DestPathPipeFn = (path: string) => string;
export type DestPathConfig = {
  [key: string]: DestPathValue | DestPathPipeFn | DestPathConfig | any,
};

/**
 * Destination path options
 */
export interface DestPathOptions {
  /** Interpolation start and end strings. */
  interpolationStart: string;
  /** Interpolation start and end strings. */
  interpolationEnd: string;
  /** Separator for pipes. Do not specify to remove pipe support. */
  pipeSeparator?: string;
}

/**
 * File manager
 */
export class FileManager {

  /**
   * Generate files
   *
   * @static
   * @param {string} templatePath
   * @param {DestPathConfig} config
   * @returns {Promise<void>}
   * @memberof FileManager
   */
  public static generateFiles(templatePath: string, config: DestPathConfig): Promise<void> {
    // init mfs
    const store = memFs.create();
    const mfs = EditorCreate(store);

    // get full path of files
    const files = FileManager.fileScan(templatePath);

    const destinationPathFn = FileManager.applyPathTemplate({
      templatePath,
      data: config,
    });

    return FileManager.generate({ mfs, files, destinationPathFn, config });
  }

  /**
   * Generate
   *
   * @private
   * @static
   * @param {*} mfs
   * @param {*} files
   * @param {*} destinationPathFn
   * @param {*} config
   * @returns {Promise<void>}
   * @memberof FileManager
   */
  private static generate({ mfs, files, destinationPathFn, config }: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        files
          .map((t: FilePath) => {
            const destination = destinationPathFn({
              // TODO: Mac / Windows
              // path: t.templatePath.replace(/^\//, ''),
              path: t.templatePath,
            });
            return {
              ...t,
              destinationPath: destination.path,
            };
          })
          .forEach((f: FilePath) => {
            // copy template
            mfs.copyTpl(f.templatePath, f.destinationPath, config);
          });
        // write files
        mfs.commit(() => {
          resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * File scan
   *
   * @private
   * @static
   * @param {string} start
   * @returns {Partial<FilePath>[]}
   * @memberof FileManager
   */
  private static fileScan(start: string): Partial<FilePath>[] {
    const dirs: Partial<FilePath>[] = [];

    function read(rootPath: string) {
      const files = _fs.readdirSync(rootPath);
      files
        .filter((f: string) => f && !f.startsWith('.'))
        .forEach((fileName) => {
          const fileDir = _path.join(rootPath, fileName);
          const stats = _fs.statSync(fileDir);

          if (stats.isFile()) {
            dirs.push({
              name: fileName,
              templatePath: fileDir, // TODO:fileDir.replace(start, "") case: __path__
            });
          }

          if (stats.isDirectory()) {
            read(fileDir);
          }
        });
    }

    // start
    read(start);

    return dirs;
  }

  /**
   *
   * const data = {
   *  name: 'homeDetail',
   *  path: '',
   *  style: 'scss',
   *  ...utils
   * }
   *
   * const test = applyPathTemplate(data);
   * const res = test({path: '__name@dasherize__/view/__name@dasherize__.component.ts'});
   * console.log('res >>> %o', res);
   *
   */
  private static applyPathTemplate<T extends DestPathConfig, S extends DestPath>({
    data,
    templatePath,
    options = {
      interpolationStart: '__',
      interpolationEnd: '__',
      pipeSeparator: '@',
    },
  }: {
    data: T,
    templatePath: string,
    options?: DestPathOptions,
  }): (entry: S) => S {
    return (entry) => {
      const is = options.interpolationStart;
      const ie = options.interpolationEnd;
      const isL = is.length;
      const ieL = ie.length;

      // remove template suffix
      let path = entry.path.replace(AKITA_CONFIG.TEMPLATE_SUFFIX, '');
      // TODO: fix start path, case: __path__
      // from:  path
      // to:    data.path
      path = path.replace(templatePath, data.path);

      // start
      const original = path;
      let start = path.indexOf(is);

      // + 1 to have at least a length 1 name. `____` is not valid.
      let end = path.indexOf(ie, start + isL + 1);
      while (start !== -1 && end !== -1) {
        const match: string = path.substring(start + isL, end);
        let replacement: any = data[match];
        if (!options.pipeSeparator) {
          if (typeof replacement === 'function') {
            replacement = replacement.call(data, original);
          }
          if (replacement === undefined) {
            throw new Error(match);
          }
        } else {
          const [name, ...pipes] = match.split(options.pipeSeparator);
          replacement = data[name];
          if (typeof replacement === 'function') {
            replacement = replacement.call(data, original);
          }
          if (replacement === undefined) {
            throw new Error(name);
          }
          replacement = pipes.reduce((acc: string, pipe: string) => {
            if (!pipe) {
              return acc;
            }
            if (!(pipe in data)) {
              throw new Error(pipe);
            }
            if (typeof data[pipe] !== 'function') {
              throw new Error(pipe);
            }
            // Coerce to string.
            return `${(data[pipe] as DestPathPipeFn)(acc)}`;
          }, `${replacement}`);
        }
        path =
          path.substring(0, start) + replacement + path.substring(end + ieL);

        // reset start and end
        start = path.indexOf(options.interpolationStart);
        end = path.indexOf(options.interpolationEnd, start + isL + 1);
      }

      return { path } as S;
    };
  }
}
