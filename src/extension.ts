'use strict';
import * as vscode from 'vscode';

let insertText = (text: string, moveCursor?: boolean) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened');
        return;
    }
    let selection = editor.selection;

    editor.edit((editBuilder) => editBuilder.insert(selection.start, text)).then(() => {
      if (moveCursor) {
        // After editBuilder.insert(), the cursor have moved to the end of line

        // You have 2 methods to move the cursor to the destination position
        
        // Method 1: use built-in command 'cursorMove'
        vscode.commands.executeCommand('cursorMove', { to: 'left' });

        // Method 2 have 2 sub-methods, first one need get newselection, second one need calculate text length
        // Method 2-1:
        // let newselection = editor.selection;
        // var destPosition = new vscode.Position(newselection.start.line, newselection.start.character - 1);
        // Method 2-2:
        // var destPosition = new vscode.Position(selection.start.line, selection.start.character + text.length - 1);  // selection.start.character is indent

        // var newSelection = new vscode.Selection(destPosition, destPosition);
        // editor.selection = newSelection;
      }
    });
};

function handleInsertion(prefix:string, suffix:string, mode:number, color?:string) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened or cursor is not focused');
        return;
    }
    let selection = editor.selection;

    if (selection.isEmpty) {
        // Without selection
        let currentline = selection.start.line;
        let currentlineText = editor.document.lineAt(currentline).text;

        // find the variable name in current line
        let regexList = currentlineText.match(/\s*(\w+)\s*=\s*/)  || currentlineText.match(/\s*(\w+)\s*\+=\s*/);

        if (regexList) {
            let variableName = regexList[1];
            vscode.commands.executeCommand('editor.action.insertLineAfter')
            .then(() => {
                let codeToInsert = '';
                if (mode === 0) {
                    if(color) {
                        codeToInsert = `print(colored("${prefix}${variableName}${suffix}: ", "${color}"), ${variableName}${suffix})`;
                    } else {
                        codeToInsert = `print("${prefix}${variableName}${suffix}: ", ${variableName}${suffix})`;
                    }
                } else if (mode === 1) {
                    if(color) {
                        codeToInsert = `print(colored("${prefix}${suffix}(${variableName}): ", "${color}"), ${suffix}(${variableName}))`;
                    } else {
                        codeToInsert = `print("${prefix}${suffix}(${variableName}): ", ${suffix}(${variableName}))`;
                    }
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
        let variableName = editor.document.getText(selection);
        vscode.commands.executeCommand('editor.action.insertLineAfter')
        .then(() => {
            // let codeToInsert = `print("${prefix}${text}${suffix}: ", ${text}${suffix})`;
            let codeToInsert = '';
            if (mode === 0) {
                if(color) {
                    codeToInsert = `print(colored("${prefix}${variableName}${suffix}: ", "${color}"), ${variableName}${suffix})`;
                } else {
                    codeToInsert = `print("${prefix}${variableName}${suffix}: ", ${variableName}${suffix})`;
                }
            } else if (mode === 1) {
                if(color) {
                    codeToInsert = `print(colored("${prefix}${suffix}(${variableName}): ", "${color}"), ${suffix}(${variableName}))`;
                } else {
                    codeToInsert = `print("${prefix}${suffix}(${variableName}): ", ${suffix}(${variableName}))`;
                }
            }
            insertText(codeToInsert);
        });
    }
};

async function handleCommentOut(mode:string) {
    let editor = vscode.window.activeTextEditor;
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

    let prefix = vscode.workspace.getConfiguration().get('1.prefix');
    let attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
    let attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
    let builtinfunc = vscode.workspace.getConfiguration().get('4.built-in-function');
    let colortext = vscode.workspace.getConfiguration().get('5.enable-colored-output-text');
    let color1 = vscode.workspace.getConfiguration().get('6.color-of-ctrl-shift-l');
    let color2 = vscode.workspace.getConfiguration().get('7.color-of-ctrl-shift-o');
    let color3 = vscode.workspace.getConfiguration().get('8.color-of-ctrl-shift-t');

    // monitor the configuration changes and update them
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        prefix = vscode.workspace.getConfiguration().get('1.prefix');
        attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
        attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
        builtinfunc = vscode.workspace.getConfiguration().get('4.built-in-function');
        colortext = vscode.workspace.getConfiguration().get('5.enable-colored-output-text');
        color1 = vscode.workspace.getConfiguration().get('6.color-of-ctrl-shift-l');
        color2 = vscode.workspace.getConfiguration().get('7.color-of-ctrl-shift-o');
        color3 = vscode.workspace.getConfiguration().get('8.color-of-ctrl-shift-t');
    }));

    let disposable;

    disposable = vscode.commands.registerCommand('extension.python-print', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(attr1), 0, String(color1));
        } else {
            handleInsertion(String(prefix), String(attr1), 0);
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-tensor-shape', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(attr2), 0, String(color2));
        } else {
            handleInsertion(String(prefix), String(attr2), 0);
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-built-in-function', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(builtinfunc), 1, String(color3));
        } else {
            handleInsertion(String(prefix), String(builtinfunc), 1);
        }
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
        let editor = vscode.window.activeTextEditor;
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