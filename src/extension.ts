// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { RocmSmiPlusProvider } from './rocm-smi-plus-provider';
import { MockRocmSmiProcess, RocmSmiProcess } from './rocm-smi-process';

let gTimer: NodeJS.Timeout | null;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rocm-smi-plus" is now active!');
	let rocmProvider = new RocmSmiPlusProvider(new MockRocmSmiProcess("/opt/rocm/bin/rocm-smi"));
	vscode.window.registerTreeDataProvider('rocm-smi-plus', rocmProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('rocm-smi-plus.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from rocm-smi+!');
	});

	vscode.commands.registerCommand('rocm-smi-plus.refresh', () => {
		rocmProvider.refresh();
	});

	context.subscriptions.push(disposable);
	startPolling(rocmProvider);
}

function startPolling(provider: RocmSmiPlusProvider) {
	if (gTimer) {
		return;
	}

	gTimer = setInterval(() => {
		provider.refresh();
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
}
