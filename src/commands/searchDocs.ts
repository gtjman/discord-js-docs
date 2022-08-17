import axios from 'axios';
import * as vscode from 'vscode';
import db from '../utils/dbArray';

export default vscode.commands.registerCommand('discord-js-docs.searchDocs', async () => {
    const docs = await vscode.window.showQuickPick([
        {
            label: "discord.js",
            detail: "discord.js is a powerful Node.js  module that allows you to easily interact with the Discord API ."
        },
        {
            label: "builders",
            detail: "A set of builders that you can use when creating your bot."
        },
        {
            label: "collection",
            detail: "@discordjs/collection is a powerful utility data structure used in discord.js."
        },
        {
            label: "proxy",
            detail: "@discordjs/proxy is a powerful wrapper around @discordjs/rest for running an HTTP proxy in front of Discord's API"
        },
        {
            label: "rest",
            detail: "The REST API for discord.js."
        },
        {
            label: "voice",
            detail: "An implementation of the Discord Voice API for Node.js, written in TypeScript."
        },
        {
            label: "ws",
            detail: "@discordjs/ws is a powerful wrapper around Discord's gateway."
        }
    ], {
        matchOnDetail: true
    });
    let versions: string[] = [];
    switch (docs?.label) {
        case "discord.js":
            versions = ["main", "stable", "v11", "v12", "v13", "14.2.0", "14.1.2", "14.0.3", "13.10.2", "13.9.2", "13.8.1", "13.7.0", "13.6.0", "13.5.1", "13.4.0", "13.3.1", "13.2.0", "13.1.0", "13.0.1", "12.5.3", "12.4.1", "12.3.1", "12.2.0", "12.1.1", "12.0.2", "11.6.4", "11.5.1", "11.4.2", "11.3.2", "11.2.0", "11.1.0", "11.0.0", "10.0.1", "9.3.1", "9.2.0", "9.1.1", "9.0.2"];
            break;
        case "builders":
            versions = ["main", "1.1.0", "1.0.0", "0.16.0", "0.15.0", "0.14.0", "0.13.0", "0.12.0", "0.11.0"];
            break;
        case "collection":
            versions = ["main", "1.0.1", "1.0.0", "0.8.0", "0.7.0", "0.6.0", "0.5.0", "0.4.0"];
            break;
        case "proxy":
            versions = ["1.0.0"];
            break;
        case "rest":
            versions = ["main", "1.0.1", "1.0.0", "0.6.0", "0.5.0", "0.4.0", "0.3.0"];
            break;
        case "voice":
            versions = ["main", "0.11.0", "0.10.0", "0.9.0", "0.8.0", "0.7.5"];
            break;
        case "ws":
            versions = ["0.1.0", "0.2.0"];
            break;
    };
    const version = await vscode.window.showQuickPick(versions?.map((v) => {
        return {
            label: v
        };
    }));
    axios.get(`https://docs.discordjs.dev/docs/${docs?.label}/${version?.label}.json`).then(async res => {
        let data = res.data;
        let sectionPick = await vscode.window.showQuickPick([
            {
                label: "Functions"
            },
            {
                label: "Classes"
            },
            {
                label: "Typedefs"
            },
        ], {
            matchOnDetail: true
        });
        let section: any;
        switch (sectionPick?.label) {
            case "Functions":
                section = data["functions"];
                break;
            case "Classes":
                section = data["classes"];
                break;
            case "Typedefs":
                section = data["typedefs"];
                break;
        }
        let nameNoS: string = "";
        if (sectionPick?.label === "Functions") { nameNoS = "function"; }
        if (sectionPick?.label === "Classes") { nameNoS = "class"; }
        if (sectionPick?.label === "Typedefs") { nameNoS = "typedef"; }
        let prop: any = await vscode.window.showQuickPick(section.map((s: { name: string; description: string; }) => {
            return {
                label: `${s.name}`,
                detail: `${s.description}` || "",
                link: `https://discord.js.org/#/docs/${docs?.label}/${version?.label}/${nameNoS}/${s.name}`,
                docName: `${s.name}`
            };
        }), { matchOnDetail: true, matchOnDescription: true });
        if (prop?.link && prop?.link !== null && prop?.link !== undefined) {
            const panel = vscode.window.createWebviewPanel(
                'docs',
                `${prop?.detail}`,
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );
            db.push("lasSearches", prop);
            panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <iframe src="${prop?.link}"></iframe>
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
    }).catch(error => {
        return vscode.window.showErrorMessage("Failed to fetch data");
    });
});