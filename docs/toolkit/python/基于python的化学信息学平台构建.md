---
title: 基于python的化学信息学平台构建
tags:
  - Python
  - 化学信息学
  - OpenBabel
  - RDKit
createTime: 2024/10/27 15:57:21
permalink: /article/21o14ut0/
---
## 创建虚拟环境,安装RDKit

**管理员身份，启动 Anaconda Prompt**

```bash
conda create -c rdkit -n cheminfo-env rdkit
conda activate cheminfo-env
pip install ipykernel -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m ipykernel install --user --name cheminfo-env

# 列出jupyter notebook当前的内核
jupyter kernelspec list
# 将my_env从jupyter notebook的kernel目录中移除
jupyter kernelspec remove cheminfo-env
# 将my_env从系统中彻底删除
conda remove -n cheminfo-env --all

# 测试安装成功与否
python
import rdkit
# 查看版本
print (rdkit.__version__)
exit()
```

## 安装OpenBabel

```bash
conda install -c openbabel openbabel
# 测试安装是否成功
obabel
# 或
openbabel
# 或
pybel
# 或
python
import openbabel
import pybel
```

**全错了，找不到程序。因为安装的是旧版本**

[正确安装参考](https://blog.csdn.net/DJJ5210/article/details/134279936?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7Ebaidujs_utm_term%7ECtr-3-134279936-blog-88086905.235%5Ev43%5Epc_blog_bottom_relevance_base2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7Ebaidujs_utm_term%7ECtr-3-134279936-blog-88086905.235%5Ev43%5Epc_blog_bottom_relevance_base2&utm_relevant_index=5)

<https://pypi.org/search/?q=rdkit-pypi+>

## **再来一次**

```bash
conda create -n cheminfo-env python=3.12
conda activate cheminfo-env

# ipykernel
pip install ipykernel -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m ipykernel install --user --name cheminfo-env

# rdkit
pip install rdkit -i https://pypi.tuna.tsinghua.edu.cn/simple
# 测试
python -c "from rdkit import Chem; print(Chem.MolToMolBlock(Chem.MolFromSmiles('C1CCC1')))"
# jupyter
from rdkit import Chem
print(Chem.MolToMolBlock(Chem.MolFromSmiles('C1CCC1')))

# openbabel
pip install openbabel-wheel -i https://pypi.tuna.tsinghua.edu.cn/simple
obabel -h
# 测试(jupyter)
from openbabel import openbabel

```
