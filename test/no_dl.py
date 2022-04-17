"""测试一些跟深度学习框架无关的特性"""
from termcolor import colored
a, b = (1,2)

if True:
    a_1, b6 ,Cc = (1,2,3)
    print(colored("==>> type(a_1): ", "blue"), type(a_1))
    print(colored("==>> type(b6): ", "blue"), type(b6))
    print(colored("==>> type(Cc): ", "blue"), type(Cc))
    
    dic = {'a':1, 'b':2}
    print(colored("==>> type(dic): ", "blue"), type(dic))
    dic["a"] = 3

    l = [[0,0], [1,1]]
    l[0,0]
    
    
