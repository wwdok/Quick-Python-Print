# Change Log

## [2022/2/13]
0.1.0
- Initial release

## [2022/2/14]
0.1.1
- Add shortcut `Ctrl+Shift+T` to print `type(variable)`, also you can change `type()` to other built-in function in extension settings.

## [2022/2/15]
0.1.2
- Downward compatible to vscode version 1.63.0.
- When insert simply `print()`, if current line is not empty, insert at next line, or just insert in current line.
- Add introduction video link.

## [2022/2/16]
0.1.3
- Able to output colored text in terminal by using python built-in package: `termcolor`.
- Add the ability to automatically recognize variable before `+=`.

## [2022/2/19]
0.1.4
- Downward compatible to vscode version 1.57.0.
- Fix a bug when inserting with selection and `Ctrl+Shift+T`.
- Monitor the change of configuration and make it take effect immediately, so you don't need to restart vscode.

## [2022/2/19]
0.1.5
- Trim space besides selected variable.

## [2022/2/27]
0.1.6
- If selected variable is new defined for the first time, insert code at current line.
- If select multiple lines of code, press `Ctrl+Shift+/` will only comment out print statements inside the selected scope instead of all of print statements in the file. The same to `Ctrl+Shift+R`.
- `Ctrl+Shift+/` can both comment and uncomment print statement depend whether the print statement have `# ` or not.
- Add new shortcut:`Ctrl+Shift+;` which will insert `print("".center(50, "-"))` used for printing separator line.
- `Ctrl+Shift+R` will delete entire line, not just clean the content of the line, and it can recognize those code which start with `print(`, `# print(`,`prints(`,`# prints(` and delete them.

## [2022/4/2]
0.1.7
- Add the ability to recognize variables that were uppacked from tuple,list etc.
- Change the default operation of `ctrl shift /` without selection from toggle comment to comment out all of those uncomment print statements.
- Allow user to set customized suffix, like`:\n` by default. 

## [2022/4/5]
0.1.8
- Fix a bug of recognizing unpacked variables.
- Change the default suffix from `:\n` to `: `.
- Fix a bug when pressing `Ctrl Shift ;`.

## [2022/4/9]
0.1.9
- Fix a bug of recognizing variable when there are multiple `=` in a line.

## [2023/4/13]
0.2.0
- Use the "[formatted string literals](https://docs.python.org/3/whatsnew/3.6.html#pep-498-formatted-string-literals)" feature introduced since python 3.6.

## [2023/4/14]
0.2.1
- Update README.md

## [2023/10/1]
0.3.0
-  To support python built-in `logging`, `loguru`, `pprint` more friendly, now users can set the print funtion and option of wheather to use formatted string.
-  Fix bug of toggle comment out when selection is empty