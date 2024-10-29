---
title: Anaconda安装和配置
tags:
  - Anaconda
  - Python
  - jupyter
createTime: 2024/10/27 19:50:19
permalink: /article/pdfr7qz3/
---
### Anaconda安装

<https://www.anaconda.com/>

### Anaconda配置

[参考](https://blog.csdn.net/xd_wjc/article/details/80587488)

**管理员身份 启动 Anaconda Prompt**

- **查看已有镜像**

```bash
conda config --show channels
```

- **移除当前配置的所有镜像（会保留default）**

```bash
conda config --remove-key channels
conda config --remove channels [urls] #删除指定的镜像源
```

- **添加镜像**

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels http://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
conda config --add channels http://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/fastai/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/main/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/conda-forge/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/msys2/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/bioconda/
conda config --add channels https://mirrors.ustc.edu.cn/anaconda/cloud/menpo/
conda config --set show_channel_urls yes
```

- **pip**

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple 
```

直接在user目录中创建一个pip目录，如：C:\Users\xxxx\pip，新建文件pip.ini，内容如下，注意加trusted-host

```bash
 [global]
 index-url = https://pypi.tuna.tsinghua.edu.cn/simple
```

### Jupyter notebook更改目录

- **生成配置文件**
在开始菜单中打开Anaconda Prompt，输入：

```bash
jupyter notebook --generate-config
```

- **找到文件的位置，使用记事本等方式打开，Ctrl+F查找：c.ServerApp.notebook_dir**
- 将 **#c.ServerApp.notebook_dir  = ‘’**修改为：c.ServerApp.notebook_dir  = ‘指定目录（根据自己修改而定）’，比如：c.ServerApp.notebook_dir  = 'E:\\python'，保存退出
- **Jupyter Notebook快捷方式，配置其属性（右击选择属性，删除 目标中的 "%USERPROFILE%/"这个后缀 以及起始位置的 "%USERPROFILE%/"）**
- **非管理员打开，管理员打开有时会出错**

### Anaconda 清除安装包和缓存
[参考资料](https://blog.csdn.net/Ever_____/article/details/136749066)

```bash
# 清理所有环境的Anaconda包缓存 删除所有未使用的包以及缓存的索引和临时文件
conda clean --all -y

# 清理某一特定环境的Anaconda包缓存
conda clean --all -n 环境名

# 清除Anaconda下载的 tarballs（.tar.bz2 文件）
conda clean -t #所有环境
conda clean -t -n 环境名 #某一特定环境

```

- **清理anaconda缓存**
```bash
conda clean -p      # 删除没有用的包 --packages
conda clean -t      # 删除tar打包 --tarballs
conda clean -y -all # 删除所有的安装包及cache(索引缓存、锁定文件、未使用过的包和tar包)
```