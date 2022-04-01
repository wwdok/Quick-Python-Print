'use strict';
import * as vscode from 'vscode';

function getInsertCode(mode:number, variableName:string, prefix:string, suffix:string, attr:string, color?:string) {
    let codeToInsert = '';
    if (mode === 0) {
        if(color) {
            codeToInsert = `print(colored("${prefix}${variableName}${attr}${suffix}", "${color}"), ${variableName}${attr})`;
        } else {
            codeToInsert = `print("${prefix}${variableName}${attr}${suffix}", ${variableName}${attr})`;
        }
    } else if (mode === 1) {
        if(color) {
            codeToInsert = `print(colored("${prefix}${attr}(${variableName})${suffix}", "${color}"), ${attr}(${variableName}))`;
        } else {
            codeToInsert = `print("${prefix}${attr}(${variableName})${suffix}", ${attr}(${variableName}))`;
        }
    }
    else if (mode === 2) {
        if(color) {
            codeToInsert = `print(colored("${variableName}".center(${prefix}, "${attr}"), "${color}"))`;
        } else {
            codeToInsert = `print("${variableName}".center(${prefix}, "${attr}"))`;
        }
    }
    return codeToInsert;
}

let insertText = (text: string, moveCursor?: boolean) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t insert print() because no python file is opened or cursor is not focused');
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

async function handleInsertion(prefix:string, suffix:string, attr:string, mode:number, color?:string) {
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
        let regexList = currentlineText.match(/\s*(.*)\s*=\s*/)  || currentlineText.match(/\s*(\w+)\s*\+=\s*/);
        
        if (regexList) {
            console.log("regexList[0]:" + regexList[0]);
            console.log("regexList[1]:" + regexList[1]);
            if (regexList[1].includes(',')){
                // there are multiple unpakced variables
                let v_list = regexList[1].split(',');
                for (var variableName of v_list){
                    await vscode.commands.executeCommand('editor.action.insertLineAfter')
                    .then(() => {
                        const codeToInsert = getInsertCode(mode, variableName.trim(), prefix, suffix, attr, color);
                        insertText(codeToInsert);
                    });
                }
            } else {
                // only single variable
                let variableName = regexList[1].trim();
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const codeToInsert = getInsertCode(mode, variableName, prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }

        } else {
            // Not find variable, then just insert print() 
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
        const selected_text = editor.document.getText(selection).trim();
        if (selected_text.includes(',')){
            // there are multiple unpakced variables
            let v_list = selected_text.split(',');
            for (var variableName of v_list){
                await vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const codeToInsert = getInsertCode(mode, variableName.trim(), prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        } else {
            const linecontent = editor.document.lineAt(selection.start.line).text.trim();
            // If selected variable is new defined for the first time, insert code at current line, or insert at next line
            if(selected_text === linecontent) {
                const codeToInsert = getInsertCode(mode, selected_text, prefix, suffix, attr, color);
                // to achieve insert in current line, just replace the selected text with codeToInsert
                editor.edit((editBuilder) => editBuilder.replace(selection, codeToInsert));
            } else {
                vscode.commands.executeCommand('editor.action.insertLineAfter')
                .then(() => {
                    const codeToInsert = getInsertCode(mode, selected_text, prefix, suffix, attr, color);
                    insertText(codeToInsert);
                });
            }
        }
    }
};

async function handleCommentOut(mode:string) {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Can\'t comment out print() because no python file is opened or cursor is not focused');
        return;
    }
    let start, end;
    let selection = editor.selection;
    if (selection.isEmpty) {
        let totalCount = editor.document.lineCount;
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
        for (let i = start; i < end+1; i++) {
            let line = editor.document.lineAt(i);
            // comment the line
            if (line.text.trim().startsWith("print(") || line.text.trim().startsWith("prints(")) {
                // why use await, see:https://github.com/Microsoft/vscode/issues/9874#issuecomment-235769379
                await editor.edit(editBuilder => {
                    // get the indent position
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    const p = new vscode.Position(i, indent);
                    editBuilder.insert(p, '# ');
                });
            }
        }
    } else {
        start = editor.selection.start.line;
        end = editor.selection.end.line;
        // toggle
        for (let i = start; i < end+1; i++) {
            let line = editor.document.lineAt(i);
            // comment the line
            if (line.text.trim().startsWith("print(") || line.text.trim().startsWith("prints(")) {
                // why use await, see:https://github.com/Microsoft/vscode/issues/9874#issuecomment-235769379
                await editor.edit(editBuilder => {
                    // get the indent position
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    const p = new vscode.Position(i, indent);
                    editBuilder.insert(p, '# ');
                });
            } else if (line.text.trim().startsWith("# print(") || line.text.trim().startsWith("# prints(")) {
                // uncomment out the line
                await editor.edit(editBuilder => {
                    const indent = line.firstNonWhitespaceCharacterIndex;
                    let toDeleteRange = new vscode.Range(line.range.start.translate(0,indent), line.range.start.translate(0, indent+2));
                    editBuilder.delete(toDeleteRange);
                }
                );
            }
        }
    }
    

}

export function activate(context: vscode.ExtensionContext) {
    console.log('Quick Python Print is now active!');

    let prefix = vscode.workspace.getConfiguration().get('1.1.prefix');
    let suffix = vscode.workspace.getConfiguration().get('1.2.suffix');
    let attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
    let attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
    let builtinfunc = vscode.workspace.getConfiguration().get('4.function');
    let colortext = vscode.workspace.getConfiguration().get('5.1.enable colored output text');
    let color1 = vscode.workspace.getConfiguration().get('5.2.color for ctrl shift l');
    let color2 = vscode.workspace.getConfiguration().get('5.3.color for ctrl shift o');
    let color3 = vscode.workspace.getConfiguration().get('5.4.color for ctrl shift t');
    let delimierSymbol = vscode.workspace.getConfiguration().get('6.1.delimiter symbol for ctrl shift ;');
    let delimierLength = vscode.workspace.getConfiguration().get('6.2.delimiter length for ctrl shift ;');
    let delimierColor = vscode.workspace.getConfiguration().get('6.3.delimiter color for ctrl shift ;');

    // monitor the configuration changes and update them
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(() => {
        prefix = vscode.workspace.getConfiguration().get('1.1.prefix');
        suffix = vscode.workspace.getConfiguration().get('1.2.suffix');
        attr1 = vscode.workspace.getConfiguration().get('2.attribute1');
        attr2 = vscode.workspace.getConfiguration().get('3.attribute2');
        builtinfunc = vscode.workspace.getConfiguration().get('4.function');
        colortext = vscode.workspace.getConfiguration().get('5.1.enable colored output text');
        color1 = vscode.workspace.getConfiguration().get('5.2.color for ctrl shift l');
        color2 = vscode.workspace.getConfiguration().get('5.3.color for ctrl shift o');
        color3 = vscode.workspace.getConfiguration().get('5.4.color for ctrl shift t');
        delimierSymbol = vscode.workspace.getConfiguration().get('6.1.delimiter symbol for ctrl shift ;');
        delimierLength = vscode.workspace.getConfiguration().get('6.2.delimiter length for ctrl shift ;');
        delimierColor = vscode.workspace.getConfiguration().get('6.3.delimiter color for ctrl shift ;');
    }));

    let disposable;

    disposable = vscode.commands.registerCommand('extension.python-print', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(attr1), 0, String(color1));
        } else {
            handleInsertion(String(prefix), String(suffix), String(attr1), 0);
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-tensor-shape', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(attr2), 0, String(color2));
        } else {
            handleInsertion(String(prefix), String(suffix), String(attr2), 0);
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-function', () => {
        if (Boolean(colortext)) {
            handleInsertion(String(prefix), String(suffix), String(builtinfunc), 1, String(color3));
        } else {
            handleInsertion(String(prefix), String(suffix), String(builtinfunc), 1);
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
        let start, end;
        let selection = editor.selection;
        if (selection.isEmpty) {
            start = 0;
            end = editor.document.lineCount-1;  // the lineCount start from 1, so minus 1
        } else {
            start = editor.selection.start.line;
            end = editor.selection.end.line;
        }
        // array to store the lines to be deleted
        let linesToDelete:number[] = [];
        for (let i = start; i < end+1; i++) {  // the for loop will not reach end, so plus 1
            const line = editor.document.lineAt(i);
            const lineText = line.text.trim();
            console.log("lineText: " + lineText);
            if (lineText.startsWith("print(") || lineText.startsWith("# print(") || lineText.startsWith("prints(") || lineText.startsWith("# prints(")) {
                linesToDelete.push(line.lineNumber);
            }
        }
        console.log("linesToDelete", linesToDelete);
        // delete all the lines indexed by the array
        for (let i = 0; i < linesToDelete.length; i++) {
            const line = editor.document.lineAt(linesToDelete[i]-i);  // Every time a row is deleted, the index is decremented by one
            await editor.edit(editBuilder => {
                editBuilder.delete(line.rangeIncludingLineBreak);
            });
        }
    });
    context.subscriptions.push(disposable);

    disposable = vscode.commands.registerCommand('extension.python-print-delimiter', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Can\'t insert separator because no python file is opened or cursor is not focused');
            return;
        }
        let selection = editor.selection;
        let codeToInsert = "";
        const v:string = "";
        if (Boolean(colortext)) {
            codeToInsert = getInsertCode(2, v, v, String(delimierLength), String(delimierSymbol), String(delimierColor));
        } else {
            codeToInsert = getInsertCode(2, v, v, String(delimierLength), String(delimierSymbol));
        }
        editor.edit((editBuilder) => editBuilder.insert(selection.start, codeToInsert));
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}