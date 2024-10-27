---
title: npm安装和配制
tags:
  - npm
  - nvm
  - pnpm
createTime: 2024/10/27 20:48:34
permalink: /article/czpd4cj4/
---

## nvm 安装和卸载

- **NVM（Node Version Manager）允许你在同一台电脑上轻松切换不同项目的Node.js版本**
- [参考1](https://blog.csdn.net/jieyucx/article/details/127997208)
- [参考2](https://blog.csdn.net/l_ymttt/article/details/119598032)

### 卸载NVM

- 先删除你当初所安装的nvm的文件夹即可。
- 文件夹内右键 此电脑 -- 点击属性 -- 找到高级系统设置 -- 环境变量。
- 删除用户变量 和 系统变量中名为 NVM_HOME 和 NVM_SYMLINK 两个变量。其他的不要改。
- 用户变量和系统变量中path中的 %NVM_HOME%;%NVM_SYMLINK% 两个属性，其他的不要改。

## npm 安装和配置

- [参考](https://blog.csdn.net/gengermao/article/details/124122151)
- **下载nodejs**
选择zip模式下的64位进行下载
- 解压缩后的目录，创建node-cache和node-global文件夹
- 配置环境变量
  - 我的电脑-》右键（选中属性）-》高级系统设置-》切换到高级选项卡，点击环境变量-》选中系统变量下的Path，双击-》点击新建-》输入nodejs解压缩路径-》一直确定
  - 添加系统变量: 双击 `path` ，新建，`d:\nodejs\`, `d:\nodejs\node_global`
  - 添加系统变量 NODE_PATH， `d:\nodejs\node_global\modules`
  - 验证是否安装成功: 进入cmd，输入node，回车

  ```bash
  npm config set prefix "d:\nodejs\node_global"
  npm config set cache "d:\nodejs\node_cache"
  npm config set registry https://registry.npmmirror.com/
  ```

- 本地仓

```bash
npm list -global
```

- 升级

```bash
npm install npm -g
```
