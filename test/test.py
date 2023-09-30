import torch
from termcolor import colored
from pprint import pprint

features = []
features.append(torch.randn(2, 3))
features.append(torch.randn(2, 3))
print(f"==>> type(features): {type(features)}")
print(f"==>> features: {features}")

# 测试一行里有多个= ：Ctrl Shift L
in_coord_ceilX = torch.cat(features, dim=1)
print(f"==>> type(in_coord_ceilX): {type(in_coord_ceilX)}")
print(f"==>> in_coord_ceilX: {in_coord_ceilX}")

#测试mode=1
a = (1,2)
print(f"==>> a: {a}")
print(f"==>> type(a): {type(a)}")

# 测试分割线
print("".center(50, "-"))
print(colored("".center(50, "-"), "magenta"))

#测试与loguru的兼容
from loguru import logger
# print = logger.debug
print(f"==>> in_coord_ceilX.shape: {in_coord_ceilX.shape}")
print(f"That's it, beautiful and simple logging!")
print(f"If you're using Python {3.6}, prefer {'f-strings'} of course!")
