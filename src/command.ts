/**
 * @license
 * Copyright Nicole Inc.
 */

import { AkitaCli } from './akita-cli';

/**
 * Command information
 */
export interface ICommand {
  placeholder: string;
  type: CommandType;
  handle: (cli: AkitaCli, params: CommandParams) => void;
}

/**
 * Equal to dir names under templates dir
 */
export enum CommandType {
  /** templates/page */
  Page = 'page',
  /** templates/store */
  Store = 'store',
  /** templates/query */
  Query = 'query',
  /** templates/service */
  Service = 'service',
}

/**
 * Command key
 */
export enum CommandKey {
  /** command/page */
  Page = 'extension.akita-page',
  /** command/store */
  Store = 'extension.akita-store',
  /** command/query */
  Query = 'extension.akita-query',
  /** command/service */
  Service = 'extension.akita-service',
}

/**
 * Command params
 */
export interface CommandParams {
  inputName: string;
  toPath: string;
  vsConfig: {};
  toPathRoot: string;
}

/**
 * Commands
 */
export const Commands = new Map<CommandKey, ICommand>([
  [
    CommandKey.Page,
    {
      placeholder: 'Akita page',
      type: CommandType.Page,
      handle: (cli: AkitaCli, params: CommandParams) => {
        cli.generateResources({ ...params, type: CommandType.Page });
      },
    },
  ],
  [
    CommandKey.Store,
    {
      placeholder: 'Akita store',
      type: CommandType.Store,
      handle: (cli: AkitaCli, params: CommandParams) => {
        cli.generateResources({ ...params, type: CommandType.Store });
      },
    },
  ],
  [
    CommandKey.Query,
    {
      placeholder: 'Akita query',
      type: CommandType.Query,
      handle: (cli: AkitaCli, params: CommandParams) => {
        cli.generateResources({ ...params, type: CommandType.Query });
      },
    },
  ],
  [
    CommandKey.Service,
    {
      placeholder: 'Akita service',
      type: CommandType.Service,
      handle: (cli: AkitaCli, params: CommandParams) => {
        cli.generateResources({ ...params, type: CommandType.Service });
      },
    },
  ],
]);
