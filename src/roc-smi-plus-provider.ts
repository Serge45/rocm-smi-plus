import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

class RocmSmiPlusItem extends vscode.TreeItem {
    constructor(
        private rawObject: object,
        public readonly gpuId: number,
        public readonly ramUsage: number,
        public readonly usage: number) {
            super(gpuId.toString(10), vscode.TreeItemCollapsibleState.None);
        }
}

export class RocmSmiPlusProvider implements vscode.TreeDataProvider<RocmSmiPlusItem> {
  constructor(private rawObject: object) {}

  getTreeItem(element: RocmSmiPlusItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: RocmSmiPlusItem): Thenable<RocmSmiPlusItem[]> {
    //TODO: what to do?
  }
}