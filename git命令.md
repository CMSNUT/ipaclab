## 清除本地 Git 历史 + 清理 reflog + 强制推送

### 1. 清理本地 reflog（彻底清除旧提交引用）

```powershell
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### 2. 强制推送到远程

```powershell

# 1. 确认当前分支名
git branch

# 2. 确认远程仓库
git remote -v

# 3. 关联远程仓库（如果还没关联）
git remote add origin https://github.com/cmsnut/ipaclab.git

# 4.
git push -f origin main
```
