import * as vscode from 'vscode';
import { MockRocmSmiProcess, RocmSmiProcess } from './rocm-smi-process';

class RocmSmiPlusItem extends vscode.TreeItem {
    constructor(
      public series: string,
      public readonly gpuId: number,
      public readonly ramUsage: number,
      public readonly usage: number,
      public readonly sclk: number,
      public readonly mclk: number,
      public readonly socclk: number) {
        super(`${gpuId.toString(10)} ${series}`, vscode.TreeItemCollapsibleState.Collapsed);
      }
}

export class RocmSmiPlusProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  constructor(readonly dataSource: RocmSmiProcess) {}

  getTreeItem(element: RocmSmiPlusItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RocmSmiPlusItem): Thenable<vscode.TreeItem[]> {
    if (!this.dataSource) {
      return Promise.resolve([]);
    }
    
    if (element) {
      return Promise.resolve([new vscode.TreeItem(`GPU: ${element.usage}%`, vscode.TreeItemCollapsibleState.None),
                              new vscode.TreeItem(`RAM: ${element.ramUsage}%`, vscode.TreeItemCollapsibleState.None),
                              new vscode.TreeItem(`sclk: ${element.sclk} MHz`, vscode.TreeItemCollapsibleState.None),
                              new vscode.TreeItem(`mclk: ${element.mclk} MHz`, vscode.TreeItemCollapsibleState.None),
                              new vscode.TreeItem(`socclk: ${element.socclk} MHz`, vscode.TreeItemCollapsibleState.None),]);
    }

    return Promise.resolve(this.getGpuInfoFromRawObject());
  }

  private getGpuInfoFromRawObject(): RocmSmiPlusItem[] {
    const infos = this.dataSource.runFormated();
    let items = new Array<RocmSmiPlusItem>();

    infos?.forEach((info, idx) => {
      items.push(new RocmSmiPlusItem(info.series, idx, info.gpuUsage, info.ramUsage, info.sclk, info.mclk, info.socclk));
    });

    return items;
  }

  private _onDidChangeTreeData: vscode.EventEmitter<RocmSmiPlusItem | undefined | null | void> = new vscode.EventEmitter<RocmSmiPlusItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RocmSmiPlusItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
