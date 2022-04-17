import torch
from termcolor import colored

features = []
features.append(torch.randn(2, 3))
features.append(torch.randn(2, 3))

# 测试一行里有多个=：Ctrl Shift L
in_coord_ceilX = torch.cat(features, dim=1)
print(colored("==>> in_coord_ceilX: ", "green"), in_coord_ceilX)

# 测试分割线
print("".center(50, "-"))
print(colored("".center(50, "-"), "magenta"))

