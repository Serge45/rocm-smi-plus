import * as vscode from 'vscode';
import { MockRocmSmiProcess, RocmSmiProcess } from './rocm-smi-process';

class RocmSmiPlusItem extends vscode.TreeItem {
    constructor(
        public readonly gpuId: number,
        public readonly ramUsage: number,
        public readonly usage: number) {
          super(`${gpuId.toString(10)} RAM: ${ramUsage}% GPU: ${usage}%`, vscode.TreeItemCollapsibleState.None);
        }
}

export class RocmSmiPlusProvider implements vscode.TreeDataProvider<RocmSmiPlusItem> {
  constructor(private dataSource: RocmSmiProcess) {}

  getTreeItem(element: RocmSmiPlusItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RocmSmiPlusItem): Thenable<RocmSmiPlusItem[]> {
    if (!this.dataSource) {
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve([]);
    }

    return Promise.resolve(this.getGpuInfoFromRawObject(this.dataSource));
  }

  private getGpuInfoFromRawObject(dataSource: RocmSmiProcess): RocmSmiPlusItem[] {
    const infos = dataSource.runFormated();
    let items = new Array<RocmSmiPlusItem>();

    infos?.forEach((info, idx) => {
      items.push(new RocmSmiPlusItem(idx, info.gpuUsage, info.ramUsage));
    });

    return items;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<RocmSmiPlusItem | undefined | null | void> = new vscode.EventEmitter<RocmSmiPlusItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RocmSmiPlusItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
