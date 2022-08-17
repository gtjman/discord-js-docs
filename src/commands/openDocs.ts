import * as vscode from 'vscode';

export default vscode.commands.registerCommand('discord-js-docs.openDocs', async () => {
    const panel = vscode.window.createWebviewPanel(
        'docs',
        `discord.js`,
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
    <iframe src="https://discord.js.org/#/docs/discord.js/main/general/welcome"></iframe>
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
</html>`
})