import * as vscode from "vscode";

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
                if (message.command === "openGuide") {
                    vscode.commands.executeCommand(`discord-js-docs.openGuide`);
                } else if (message.command === "openDocs") {
                    vscode.commands.executeCommand(`discord-js-docs.openDocs`);
                } else if (message.command === "searchDocs") {
                    vscode.commands.executeCommand(`discord-js-docs.searchDocs`);
                } else if (message.command === "openDocsLink") {
                    const panel = vscode.window.createWebviewPanel(
                        'docs',
                        `${message.label}`,
                        vscode.ViewColumn.One,
                        {
                            enableScripts: true
                        }
                    );
                    panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <iframe src="${message.link}"></iframe>
</body>
<style>
iframe {  
  position:fixed;
  top:0;
  left:0;
  bottom:0;
  right:0;
  width:100%;
  height:100%;
  border:none;
  margin:0;
  padding:0;
  overflow:hidden;
  z-index:999999
}
</style>
</html>`;
                }
            },
            undefined,
            this.extensionContext.subscriptions
        );
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const stylesFile = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "styles.css"));
        const scriptFile = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "script.js"));
        const bannerFile = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "media", "banner.png"));

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${stylesFile}" rel="stylesheet">
    <title>Discord.js</title>
</head>
<body>
    <img src="${bannerFile}" class="banner" draggable="false" />
    <button id="searchDocs">Search docs</button>
    <button id="openDocs">Open docs</button>
    <button class="secondary" id="openGuide">Open guide</button>
</body>
<script src="${scriptFile}"></script>
</html>`;
    }
}