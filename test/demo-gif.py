import torch

a = torch.randn(2, 3)

# test for line with indent
if True:
    b = torch.tensor([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
    b.view(1, 6)
    c, d = 100, 999
    e = c+d
    f = c*d