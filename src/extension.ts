// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RocmSmiPlusProvider } from './rocm-smi-plus-provider';
import { MockRocmSmiProcess, RocmSmiProcess, GpuCardInfo } from './rocm-smi-process';

let gTimer: NodeJS.Timeout | null;
let gGpuCardInfos: Array<Array<GpuCardInfo>>;
const gGpuCardInfoMaxSize: number = 100;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "rocm-smi-plus" is now active!');
    let rocmProvider = new RocmSmiPlusProvider(new RocmSmiProcess("/opt/rocm/bin/rocm-smi"));
    vscode.window.registerTreeDataProvider('rocm-smi-plus', rocmProvider);

    let disposable = vscode.commands.registerCommand('rocm-smi-plus.refresh', () => {
        rocmProvider.refresh();
    });

    context.subscriptions.push(disposable);
    gGpuCardInfos = [];
    startPolling(rocmProvider);
}

function startPolling(provider: RocmSmiPlusProvider) {
    if (gTimer) {
        return;
    }

    gTimer = setInterval(() => {
        provider.refresh();
        const info = provider.dataSource.lastGpuInfo;

        if (info) {
            gGpuCardInfos.push(info);
            while (gGpuCardInfos?.length > gGpuCardInfoMaxSize) {
                gGpuCardInfos.splice(0, 1);
            }
        }
    }, 1000);
}

function stopPolling() {
    if (gTimer) {
        clearInterval(gTimer);
        gTimer = null;
    }
}

// This method is called when your extension is deactivated
export function deactivate() {
    stopPolling();
    gGpuCardInfos = [[]];
}
