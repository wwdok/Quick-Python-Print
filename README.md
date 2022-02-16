# Quick Python Print

This repo is inspired by "[Python Quick Print](https://github.com/AhadCove/Python-Quick-Print)". "Python Quick Print" can quickly print out variables on the console by using shortcut `Ctrl+Shift+L`, while "Quick Python Print" enhance some features:
* Before press shortcuts, you can either select the variable or just put the cursor at target line.
* Press `Ctrl+Shift+O` to print out tensor shape, e.g. `print("==>> a.shape: ", a.shape)`.
* Press `Ctrl+Shift+T` to print out variable type, e.g. `print("==>> type(a): ", type(a))`.
* Move the cursor inside the bracket if insert simply `print()`.
* Press `Ctrl+Shift+/` will comment out all print statement in current python file.
* Press `Ctrl+Shift+R` will delete all print statements in current python file.
* Allow user to define customized prefix and suffix of print content flexibly in extension settings.
* Able to output colored text in terminal by using python built-in package: `termcolor`.

## Motivation

When i am learning deep learning model, i often want to know how the tensor shape changes along the way, i think this will help me understand how the deep learning model works. Take pytorh for example, these operations `view，slice，concat，permute，conv，linear etc` all will change the tensor shape. Fortunately, many deep learning framework all have `.shape` attribute of tensor(as far as i know, there are pytorch, numpy, tensorflow, paddlepaddle, oneflow), so this makes the extension be useful for different deep learning framework users.

## Installation

Before installation, make sure your vscode version ≥ 1.63.0
This extension is available in the Visual Studio Code Extension Marketplace, you can search "Quick-Python-Print" and install it.

## How to use

Introduction video: [Bilibili](https://www.bilibili.com/video/BV1hY411V7bi) | [Youtube](https://www.youtube.com/watch?v=w5cd_8lzylA)

This extension only activates within `.py` and `.ipynb` files

### Keyboard Shortcut
For Mac user, the `Ctrl` should be `Cmd`.

**Ctrl+Shift+L**

Select the variable, then press `Ctrl+Shift+L`:

![](images/Ctl+Shift+L-selection.gif)

You can also just put the cursor at the target line, then the extension will automatically recognize the variable:

![](images/Ctl+Shift+L-NOselection.gif)

If you didn't select variable or the extension can't recognize variable, it will just insert simply print():

![](images/Ctl+Shift+L-NOvariable.gif)

**Ctrl+Shift+O**

`Ctl+Shift+O` is similar to `Ctrl+Shift+L` except that it will print tensor shape by default:

![](images/Ctl+Shift+O.gif)

**Ctrl+Shift+T**

`Ctl+Shift+T` is similar to above except that it will print type of variable by default:

![](images/Ctl+Shift+T.gif)

**Ctrl+Shift+/**

Comment out all print statement in current python file:

![](images/Ctl+Shift+forwardslash.gif)

**Ctrl+Shift+up**

Comment out all print statement above the cursor in current python file:

![](images/Ctl+Shift+up.gif)

**Ctrl+Shift+down**

Comment out all print statement below the cursor in current python file:

![](images/Ctl+Shift+down.gif)

**Ctrl+Shift+R**

Delete all print statement in current python file:

![](images/Ctl+Shift+R.gif)

**Compatibility with different framework**

Many deep learning framework all have `.shape` attribute of tensor:

![](images/execution.gif)

If any of these shortcuts conflicts with existing shortcut, you may change it in the `Keyboard Shortcuts Setting`: Press `Cmd+P` or `Ctrl+P` and type in `>Open Keyboard Shortcuts`. Search for the conflict shortcut, then you will find those shortcut using the same keys, then right click one of them, modify or delete keybinding.

### Extension Settings

This extension has following settings:

![](images/setting1.png)
![](images/setting2.png)

You can go to the `Extension Settings` to modify them to suit your preferences. After modification, you need to restart vscode to make it take effect.

### Color output text
To color the output text in terminal, you need to do these things:
1. Go to `Extension Settings`, check the `5.enable-colored-output-text` to be true. And you can select the color you like from the drop-down list.
2. Add `from termcolor import colored` in the python file
3. Now Press `Ctrl+Shift+L` or `Ctrl+Shift+O` or `Ctrl+Shift+T` will insert the print statement that can color output text.
4. Run Python File in Terminal.

![](images/color-text.gif)

## More
I also make a pypi package : [**printensor**](https://github.com/wwdok/print_tensor) to uppack tensors inside list, tuple, dict, generator, then print their tensor shape. After installing and import, you can replace `print(` with `prints(` to intergrate with this extension.

## Known issue
This extension can not handle tensor that cross multiple lines, for example:
```
a = torch.tensor([[1.0, 2.0, 3.0], 
                [4.0, 5.0, 6.0]])
```
You can use `Alt + down` to move down the inserted code.

## Warning
This uses Python 3 syntax,If you're using Python 2 print isn't a function.You can import this behavior from `__future__`:
`from __future__ import print_function`

## Donation
If you find this extension can help you save time, and willing to donate me, i would be very grateful ! ❤

![](images/donation.png)

## License
MIT License
