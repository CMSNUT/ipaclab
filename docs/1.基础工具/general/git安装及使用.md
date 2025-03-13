---
title: Git安装及使用
tags:
  - 工具
  - git
  - gitee
  - github
createTime: 2024/10/28 20:50:13
permalink: /article/git/
---

## 安装

## 配置

## 使用

[参考](https://blog.csdn.net/xuedan1992/article/details/81605609)

::: tabs
@tab 克隆
```bash

git clone https://github.com/<USER>/<repository>.git

```

@tab 上传
```bash

git add .
git commit -m "init"
git push

```

@tab 下拉
```bash
git pull
```
:::


## 常见问题

<Card title="设置新创建的项目默认分支为main" icon="twemoji:astonished-face">

```bash

git config --global init.defaultBranch main

```

</Card>



<Card title="将 GitHub 分支从 master 改为 main" icon="twemoji:astonished-face">
  
  [X] **本地仓库设置**
  
  1. 切换到 master 分支： 

  ```bash
  git checkout master

  ```

  2. 重命名 master 分支为 main： 
  
  ```bash

  git branch -m master main

  ```

  3. 删除本地的 main 分支（如果存在）： 

  ```bash
  git branch -D main
  ```
  
  注意：-D 参数会强制删除指定的分支，即使该分支上的更改还未被合并。如果你只是想删除一个已经被合并的分支，可以使用 -d 参数。
  4. 将新的 main 分支推送到远程仓库： 

  ```bash
  git push -u origin main 
  ```
  
  以上命令中的 -u 参数可以设置远程仓库为默认的上游仓库，这样在未来运行 git push 或 git pull 时，就无需指定远程仓库和分支。

  [X] **GitHub 仓库设置**
  1. 打开 GitHub 仓库页面，点击 “Settings”。
  2. 在左侧选择 “Branches”。
  3. 在 “Default branch” 部分，点击 “master” 旁边的 “Rename” 按钮。
  4. 按照提示操作，将默认分支重命名为 main。

  [X] **更新本地仓库**
  
  在从 master 到 main 的迁移期间，需要更新本地仓库以反映新的默认分支。以下是更新本地仓库的步骤：
  1. 导航到本地仓库的目录。
  2. 运行以下命令将本地分支名从 master 改为 main： git branch -m master main
  3. 从远程仓库获取最新的更改： git fetch origin
  4. 将本地分支与远程分支关联： git branch -u origin/main main
  5. 更新远程仓库的默认分支： git remote set-head origin -a 
  
  现在，你的本地仓库将与新的 main 分支同步，并且你可以在提交更改时将其推送到 main 分支。

  [X] **收尾工作**

    一旦完成主分支的设置和迁移，还有一些收尾工作需要完成：

    - 告知团队成员有关分支更改的情况，并提供必要的指导。

    - 更新自动化持续集成/持续部署（CI/CD）工作流程，以确保与新的 main 分支兼容。

    - 更新文档和说明文件，提供与新的默认分支相对应的信息。

    - 更新开发者以使用新的分支名称进行分支操作和版本控制。

通过以上步骤，你可以顺利地将 GitHub 仓库的默认分支从 master 改为 main，并确保本地和远程仓库的一致性。
</Card>

<Card title="使用 git push 将更改推送到 main 分支" icon="twemoji:astonished-face">
  git push origin main
</Card>




