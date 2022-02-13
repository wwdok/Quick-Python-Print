# Quick Python Print

This repo is inspired by "[Python Quick Print](https://github.com/AhadCove/Python-Quick-Print)". "Python Quick Print" can quickly print out variables on the console by using shortcut `Ctrl+Shift+L`, while "Quick Python Print" enhance some features:
* Before press shortcuts, you can either select the variable or just put the cursor at target line.
* Press `Ctrl+Shift+O` to print out tensor shape, e.g. `print("a.shape", a.shape)`.
* Move the cursor inside the bracket if insert simply `print()`.
* Press `Ctrl+Shift+/` will comment out all print statement in current python file.
* Press `Ctrl+Shift+R` will delete all print statements in current python file.
* allow user to define custimized prefix and suffix of print content.

## Motivation
When i am learning deep learning model, i often want to know how the tensor shape changes along the way, i think this will help me understand how the deep learning model works. Take pytorh for example, these operations `view，slice，concat，permute，conv，linear etc` all will change the tensor shape. Fortunately, many deep learning framework all have `.shape` attribute of tensor(as far as i know, there are pytorch, numpy, tensorflow, paddlepaddle, oneflow), so this makes the extension be useful for different deep learning framework users.

## Installation

This extension is available in the Visual Studio Code Extension Marketplace, you can search "Quick-Python-Print" and install it.

## How to use

This extension only activates within .py files

#### Keyboard Shortcut
For Mac user, the `Ctrl` should be `Cmd`.

**Ctrl+Shift+L**

Select the variable, then press `Ctrl+Shift+L`:

![](images/Ctl+Shift+L-selection.gif)

You can also just put the cursor at the target line, then the extension will automatically recognize the variable:

![](images/Ctl+Shift+L-NOselection.gif)

If you didn't select variable or the extension can't recognize variable, it will just insert simply print():

![](images/Ctl+Shift+L-NOvariable.gif)

**Ctrl+Shift+O**

`Ctl+Shift+O` is similar to `Ctrl+Shift+L` except that it will print tensor shape:

![](images/Ctl+Shift+O.gif)

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

If these shortcut interferes with another extension or system shortcut, you may change it in the `Keyboard Shortcuts Setting`.Press `Cmd+P` or `Ctrl+P` and type in `Open Keyboard Shortcuts`.Search for `>Print Python Selection` and click on the `pen icon`.This is where you can enter any `Shortcut` you choose.

### Extension Settings

This extension contributes the following settings, you can modify them to suit your preferences.

```json
"python-print.prefix": {
    "type": "string",
    "default": "==>> ",
    "description": "prefix in the front of the print out result"
},
"python-print.attribute1": {
    "type": "string",
    "default": "",
    "description": "variable attribute for ctrl+shift+l short cut"
},
"python-print.attribute2": {
    "type": "string",
    "default": ".shape",
    "description": "variable attribute for ctrl+shift+o short cut"
}
```
  
## More
I also make a pypi package : [printensor](https://github.com/wwdok/print_tensor) to uppack tensors inside list, tuple, dict, generator, then print their tensor shape. After installing and import, you can replace `print(` with `prints(` to intergrate with this extension.

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
