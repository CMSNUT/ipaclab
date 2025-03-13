---
title: 基于shiny的交互式网页应用
tags:
  - Python
  - Shiny
  - 交互式网页
createTime: 2024/11/21 21:02:44
permalink: /article/hglymqiu/
---

## 创建环境

```bash
jupyter kernelspec list

conda create -n shiny-env python -y
conda activate shiny-env
pip install ipykernel -i https://pypi.tuna.tsinghua.edu.cn/simple
python -m ipykernel install --user --name shiny-env
```

## 安装配置shiny

https://shiny.posit.co/py/docs/install-create-run.html

```bash
conda install -c conda-forge shiny
# 升级
conda update -c conda-forge shiny
```

## 云托管

```bash
# 安装 rsconnect-python 软件包
pip install rsconnect-python

# 注册免费的 shinyapps.io 帐户
## 首次登录时，将显示一个要运行的命令，该命令将使用 shinyapps.io API 令牌配置 rsconnect-python。该命令将如下所示
rsconnect add --account <ACCOUNT> --name <NAME> --token <TOKEN> --secret <SECRET>

# 部署
rsconnect deploy shiny /path/to/app --name <NAME> --title my-app
```

## 模板

```bash
shiny create

shiny create --template basic-navigation --mode express --github posit-dev/py-shiny-templates
shiny create --template basic-navigation --mode core --github posit-dev/py-shiny-templates

# conda
cd G:\python\tcmiqe-suite\basic-navigation
g:

# vs code
cd basic-navigation

pip install -r requirements.txt --no-warn-script-location

```

## 基于Python的shiny基础

### 基础
#### 概述
#### 用户界面

### 工作流
#### 安装、创建与运行

#### 调试、排障和帮助

### 用户界面
#### 概述
#### Jupyter小部件
#### 动态UI
#### HTML UI
#### 自定义UI

### 反应式
#### 基础
#### 模式
#### 可变对象

### 语法模式
#### EXPRESSS和Core
#### 选择语法
#### 深度表达
#### 过渡到核心


### 模块
#### shiny的模块
#### 模块通信

### 测试
#### 单元测试
#### 端到端测试

### 扩展
#### 自定义JavaScript部件
#### 自定义组件包

### 框架比较
#### Streamlit (流式)
#### shiny R

### 其他
#### 非阻塞操作
#### 路由

