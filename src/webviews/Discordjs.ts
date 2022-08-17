import * as vscode from "vscode";
import db from "../utils/dbArray";

export class DiscordjsWebView implements vscode.WebviewViewProvider {
    constructor(private readonly _extensionUri: vscode.Uri, public extensionContext: vscode.ExtensionContext) { }

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(
            message => {
                vscode.commands.executeCommand(`discord-js-docs.${message.command}`);
            },
            undefined,
            this.extensionContext.subscriptions
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const stylesFile = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "styles.css"));
        const scriptFile = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "script.js"));

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${stylesFile}" rel="stylesheet">
    <title>Discord.js</title>
</head>
<body>
    <button id="searchDocs">Search docs</button>
    <button id="openDocs">Open docs</button>
    <button class="secondary" id="openGuide">Open guide</button>
</body>
<script src="${scriptFile}" />
</html>`;
    }
}