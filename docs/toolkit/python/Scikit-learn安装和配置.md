---
title: Scikit-learn安装和配置
tags:
  - Python
  - scikit-learn
  - sklearn
  - 机器学习
  - 安装
createTime: 2024/10/29 23:34:06
permalink: /article/slq5om8k/
---

## 创建虚拟环境,安装 scikit-learn

- [参考官网](https://scikit-learn.org/stable/install.html)
- **管理员身份，启动 Anaconda Prompt**

```bash
conda create -n sklearn-env -c conda-forge scikit-learn -y

conda activate sklearn-env
# 添加sklearn-env到jupyter notebook的kernel
pip install ipykernel -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m ipykernel install --user --name sklearn-env

# 列出jupyter notebook当前的内核
jupyter kernelspec list
# 将my_env从jupyter notebook的kernel目录中移除
jupyter kernelspec remove sklearn-env
# 将my_env从系统中彻底删除
conda remove -n sklearn-env --all
```
