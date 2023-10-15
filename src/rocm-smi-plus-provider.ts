import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class RocmSmiPlusItem extends vscode.TreeItem {
    constructor(
        public readonly gpuId: number,
        public readonly ramUsage: number,
        public readonly usage: number) {
          super(`${gpuId.toString(10)} RAM: ${ramUsage}% GPU: ${usage}%`, vscode.TreeItemCollapsibleState.None);
        }
}

export class RocmSmiPlusProvider implements vscode.TreeDataProvider<RocmSmiPlusItem> {
  constructor(private rawObject: object) {}

  getTreeItem(element: RocmSmiPlusItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RocmSmiPlusItem): Thenable<RocmSmiPlusItem[]> {
    if (!this.rawObject) {
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    }

    return Promise.resolve(this.getGpuInfoFromRawObject(this.rawObject));
  }

  private getGpuInfoFromRawObject(rawObject: object): RocmSmiPlusItem[] {
    //TODO: remove mock implementation.
    return [new RocmSmiPlusItem(0, 50, 90), new RocmSmiPlusItem(1, 100, 30)];
  }
}
