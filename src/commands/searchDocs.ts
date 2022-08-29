import axios from 'axios';
import * as vscode from 'vscode';
import { wait } from '../utils/wait';

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
    let pkgs: { name: string; versions: string[] }[] = [
        {
            name: "discord.js",
            versions: []
        },
        {
            name: "builders",
            versions: []
        },
        {
            name: "collection",
            versions: []
        },
        {
            name: "proxy",
            versions: []
        },
        {
            name: "rest",
            versions: []
        },
        {
            name: "voice",
            versions: []
        },
        {
            name: "ws",
            versions: []
        }
    ];

    axios.get("https://api.github.com/repos/discordjs/discord.js/git/refs/tags").then(async res => {
        res.data.forEach((tag: any) => {
            let version = tag.ref.match(/(\d|\.+)/g).join("");
            let name = "";
            if (tag.ref === `refs/tags/${version}`) {
                name = "discord.js";
            } else {
                name = tag.ref.split(`@${version}`)[0].split("/")[3];
            }
            let found = pkgs.find(pkg => pkg.name === name) as { name: string; versions: string[] };
            pkgs[pkgs.indexOf(found)]?.versions.push(version);
        });
        let versions = pkgs.find(pkg => {
            let name = docs?.label as string;
            return pkg.name === name;
        })?.versions as string[];
        const version = await vscode.window.showQuickPick([{ label: "main" }, { label: "stable" }, ...versions?.map(v => ({ label: v })).reverse()]);
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
                    `${prop?.label}`,
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
    }).catch(error => {
        return vscode.window.showErrorMessage("Failed to fetch data");
    });
});