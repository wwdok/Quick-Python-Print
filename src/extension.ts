'use strict';
import * as vscode from 'vscode';

const insertText = (text: string, moveCursor?: boolean) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened');
        return;
    }
    const selection = editor.selection;

    editor.edit((editBuilder) => editBuilder.insert(selection.start, text)).then(() => {
      if (moveCursor) {
        // After editBuilder.insert(), the cursor have moved to the end of line

        // You have 2 methods to move the cursor to the destination position
        
        // Method 1: use built-in command 'cursorMove'
        vscode.commands.executeCommand('cursorMove', { to: 'left' });

        // Method 2 have 2 sub-methods, first one need get newselection, second one need calculate text length
        // Method 2-1:
        // const newselection = editor.selection;
        // var destPosition = new vscode.Position(newselection.start.line, newselection.start.character - 1);
        // Method 2-2:
        // var destPosition = new vscode.Position(selection.start.line, selection.start.character + text.length - 1);  // selection.start.character is indent

        // var newSelection = new vscode.Selection(destPosition, destPosition);
        // editor.selection = newSelection;
      }
    });
};

function handleInsertion(prefix:string, suffix:string, mode:number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened or cursor is not focused');
        return;
    }
    const selection = editor.selection;

    if (selection.isEmpty) {
        // Without selection
        const currentline = selection.start.line;
        const currentlineText = editor.document.lineAt(currentline).text;

        // find the variable name in current line
        const regexList = currentlineText.match(/\s*(\w+)\s*=\s*/);

        if (regexList) {
            const variableName = regexList[1];
            vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
                let codeToInsert = '';
                if (mode === 0) {
                    codeToInsert = `print("${prefix}${variableName}${suffix}: ", ${variableName}${suffix})`;
                } else if (mode === 1) {
                    codeToInsert = `print("${prefix}${suffix}(${variableName}): ", ${suffix}(${variableName}))`;
                }
                insertText(codeToInsert);
            });
        } else {
            // if current line is not empty, insert at next line, or just insert in current line
            if (currentlineText.trim()) {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    insertText('print()', true);
                });
            } else {
                insertText('print()', true);
            }
        }


    } else {
        // With selection
        const text = editor.document.getText(selection);
        vscode.commands.executeCommand('editor.action.insertLineAfter')
        .then(() => {
            const codeToInsert = `print("${prefix}${text}${suffix}: ", ${text}${suffix})`;
            insertText(codeToInsert);
        });
    }
};

async function handleCommentOut(mode:string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t comment out print() because no python file is opened or cursor is not focused');
        return;
    }
    let totalCount = editor.document.lineCount;
    let start;
    let end;
    switch (mode) {
        case 'all':
            start = 0;
            end = totalCount;
            break;
        case 'up':
            start = 0;
            end = editor.selection.start.line;
            break;
        case 'down':
            start = editor.selection.end.line;
            end = totalCount;
            break;
        default:
            start = 0;
            end = totalCount;
            break;
    }
    // comment the print() line
    for (let i = start; i < end; i++) {
        let line = editor.document.lineAt(i);
        if (line.text.trim().startsWith("print(")) {
            // comment out this line
            // why use await, see:https://github.com/Microsoft/vscode/issues/9874#issuecomment-235769379
            await editor.edit(editBuilder => {
                editBuilder.insert(line.range.start, '# ');
            });
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Quick Python Print is now active!');

    const prefix = vscode.workspace.getConfiguration().get('python-print.prefix');
    const attr1 = vscode.workspace.getConfiguration().get('python-print.attribute1');
    const attr2 = vscode.workspace.getConfiguration().get('python-print.attribute2');
    const builtinfunc = vscode.workspace.getConfiguration().get('python-print.built-in-function');

    let disposable;

    disposable = vscode.commands.registerCommand('extension.python-print', () => {
        handleInsertion(String(prefix), String(attr1), 0);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-tensor-shape', () => {
        handleInsertion(String(prefix), String(attr2), 0);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-built-in-function', () => {
        handleInsertion(String(prefix), String(builtinfunc), 1);
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-commentall', () => {
        handleCommentOut("all");
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-commentup', () => {
        handleCommentOut("up");
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-commentdown', () => {
        handleCommentOut("down");
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-deleteall', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t delete print() because no python file is opened or cursor is not focused');
            return;
        }
        let totalCount = editor.document.lineCount;
        // delete all the print() line
        for (let i = 0; i < totalCount; i++) {
            let line = editor.document.lineAt(i);
            if (line.text.trim().startsWith("print(")) {
                // delete this line
                await editor.edit(editBuilder => {
                    editBuilder.delete(line.range);
                });
            }
        }
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}