let searchDocsButton = document.getElementById("searchDocs");
let openDocsButton = document.getElementById("openDocs");
let openGuideButton = document.getElementById("openGuide");
(function () {
    const vscode = acquireVsCodeApi();
    searchDocsButton.onclick = () => {
        vscode.postMessage({
            command: 'searchDocs'
        });
    };
    openDocsButton.onclick = () => {
        vscode.postMessage({
            command: 'openDocs'
        });
    };
    openGuideButton.onclick = () => {
        vscode.postMessage({
            command: 'openGuide'
        });
    };
})();