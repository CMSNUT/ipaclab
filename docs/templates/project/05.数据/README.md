---
title: {{PROJECT_NAME}} 数据
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/data/
---

# {{PROJECT_NAME}} 数据

## 说明

- `湿实验/raw`：仪器原始导出
- `湿实验/processed`：清洗、整理后
- `计算实验/raw`：原始数据集
- `计算实验/processed`：处理后特征、结果

## 数据卡片

| 数据集 | 来源 | 规模 | 版本 | 备注 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 大文件

建议使用 Git LFS 或 DVC：

    git lfs track "05.数据/**/*.csv"
    git lfs track "05.数据/**/*.h5"
