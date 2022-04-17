import torch
import tensorflow as tf
import paddle
import numpy as np
from termcolor import colored

# test for compatibility with different AI framework
a = torch.randn(2, 3)

b = tf.constant([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
print("==>> b.shape: ", b.shape)
print(colored("==>> type(b): ", "blue"), type(b))
# print("==>> type(b): ", type(b))
# print("==>> b.shape: ", b.shape)

c = paddle.to_tensor([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
print("==>>c.shape: ", c.shape)

d = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
print(colored("==>> d.shape: ", "red"), d.shape)
print(colored("==>> type(d): ", "blue"), type(d))
print("==>>d.shape: ", d.shape)

# test for line with indent
if True:
    a += torch.tensor([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    a.bernoulli_(0.1)

