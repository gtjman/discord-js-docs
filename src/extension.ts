import * as vscode from 'vscode';
import openDocs from './commands/openDocs';
import openGuide from './commands/openGuide';
import searchDocs from './commands/searchDocs';
import { DiscordjsWebView } from './webviews/Discordjs';

export function activate(context: vscode.ExtensionContext) {
	console.log("Activated");

	context.subscriptions.push(searchDocs);
	context.subscriptions.push(openDocs);
	context.subscriptions.push(openGuide);
	context.subscriptions.push(vscode.window.registerWebviewViewProvider("discord-js-docs.DiscordjsWebView", new DiscordjsWebView(context.extensionUri, context)));
}

export function deactivate() { }