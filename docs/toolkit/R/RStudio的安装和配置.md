---
title: RStudio的安装和配置
tags:
  - R
  - RStudio
  - RTools
  - 安装
  - 配置
createTime: 2024/10/26 16:50:30
permalink: /article/hst6zip1/
---

## 安装R+RStudio+RTools

```flow
op1=>operation: 1.安装R
op2=>operation: 2.安装RTools
op3=>operation: 3.安装RStudio
op4=>operation: 4.关联RTools和RStudio
op5=>operation: 5.启动RStudio
op6=>operation: 6.配置RStudio

op1(right)->op2->op3(right)->op4->op5(right)->op6
```

- [x] 国内镜像(如[清华镜像](https://mirrors.tuna.tsinghua.edu.cn/CRAN/))下载**R**和对应的**RTools**，如[R-4.4.1](https://mirrors.tuna.tsinghua.edu.cn/CRAN/)，对应[RTools 4.4.0](https://mirrors.tuna.tsinghua.edu.cn/CRAN/bin/windows/Rtools/rtools44/files/rtools44-6335-6327.exe), 并安装在非系统盘，安装路径必须是英文
- [x] [RStudio官网](https://posit.co/download/rstudio-desktop/)下载最新版，如[win10/11版](https://download1.rstudio.org/electron/windows/RStudio-2024.09.0-375.exe)，并安装在非系统盘，安装路径必须是英文

## 关联 RTools和RStudio

```bash
# 启动RStudio
# 控制台窗口，输入
writeLines('PATH="${RTOOLS40_HOME}\\usr\\bin;${PATH}"', con = "~/.Renviron")
# 重启Rstudio (快捷键 Ctrl+Shift+F10)
# 检验并找到配置路径是否成功
Sys.which("make")
# 返回 "D:\\R\\R-4.0.5\\R_Files\\rtools40\\usr\\bin\\make.exe"，表明配置成功
```

## 镜像设置

```bash
# 查看默认镜像
options()$repos # CRAN镜像
options()$BioC_mirror # Bioconductor镜像

# 选择CRAN镜像，建议选择国内镜像
chooseCRANmirror()
# 命令设置CRAN镜像
options("repos" = c(CRAN="https://mirrors.tuna.tsinghua.edu.cn/CRAN/")) # 清华镜像

# Bioconductor镜像设置 (安装Bioconductor前设置)
options(BioC_mirror="https://mirrors.tuna.tsinghua.edu.cn/bioconductor") #清华镜像

# 选择
chooseBioCmirror(graphics = getOption("menu.graphics"), ind = NULL,local.only = FALSE)
```

- [x] [国内镜像可以查询](https://www.bioconductor.org/about/mirrors/)

## 界面设置

略

## 专业书籍

1. [R for Data Science （2e）](https://r4ds.hadley.nz/)
2. [Efficient R programming](https://bookdown.org/csgillespie/efficientR/)
3. [bookdown: Authoring Books and Technical Documents with R Markdown](https://bookdown.org/yihui/bookdown/)
4. [R Markdown: The Definitive Guide](https://bookdown.org/yihui/rmarkdown/)

## 数据科学必备R包

[参考资料](https://blog.csdn.net/u013421629/article/details/72955040)


