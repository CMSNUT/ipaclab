---
title: 基于python的化学信息学平台构建
tags:
  - Python
  - 化学信息学
  - OpenBabel
  - RDKit
  - PyMol
  - Gromacs
  - vina
createTime: 2024/10/27 15:57:21
permalink: /article/21o14ut0/
---

**管理员身份，启动 Anaconda Prompt**

## 设置清华源

要设置完整的清华源（包括主渠道、`conda-forge`、`bioconda` 等），可以按照以下步骤操作。清华大学的 Anaconda 镜像源地址为：`https://mirrors.tuna.tsinghua.edu.cn/anaconda/`。

---

### 1. 查看当前 Conda 配置
首先，查看当前的 Conda 配置，确认是否已经配置了其他源：

```bash
conda config --show
```

---

### 2. 添加完整的清华源
#### 添加主渠道（main 和 free）
```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
```

#### 添加 `conda-forge` 渠道
`conda-forge` 是一个常用的社区维护的渠道，许多软件包都可以从这里安装：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
```

#### 添加 `bioconda` 渠道
`bioconda` 是生物信息学相关的渠道：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
```

#### 添加 `msys2` 渠道
`msys2` 是 Windows 系统相关的工具和库：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
```

#### 添加 `menpo` 渠道
`menpo` 是图像处理和计算机视觉相关的渠道：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/
```

#### 添加 `pytorch` 渠道
`pytorch` 是深度学习框架 PyTorch 的官方渠道：

```bash
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
```

---

### 3. 设置搜索时显示通道地址
为了确保 Conda 优先使用清华源，可以设置 `channel_priority` 为 `strict`：

```bash
conda config --set channel_priority strict
```

---

### 4. 验证配置
运行以下命令查看配置是否生效：

```bash
conda config --show channels
```

你应该会看到类似以下的输出：

```plaintext
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/conda-forge/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/bioconda/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/msys2/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/menpo/
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch/
  - defaults
```

---

### 5. 清除缓存（可选）
如果你之前使用过其他源，建议清除 Conda 的缓存，以确保使用新的源：

```bash
conda clean -i
```

---

### 6. 恢复默认源（如果需要）
如果你想恢复默认的 Conda 源，可以运行以下命令：

```bash
conda config --remove-key channels
```

---

## 虚拟环境安装程序包

要在 Anaconda 中创建一个名为 `chem-env` 的虚拟环境，并安装 `rdkit`、`openbabel`、`pymol` 和 `gromacs`等程序包

### 1. 创建虚拟环境
首先，使用 `conda` 创建一个新的虚拟环境，并指定 Python 版本为 3.12：

```bash
conda create -n chem-env python=3.12
```

### 2. 激活虚拟环境
创建环境后，激活它：

```bash
conda activate chem-env
```

### 3. 安装所需的软件包
接下来，安装 `rdkit`、`openbabel`、`pymol` 和 `gromacs`

#### 安装 `rdkit`
`rdkit` 可以通过 `conda` 安装：

```bash
conda install -c conda-forge rdkit
```

#### 安装 `openbabel`
`openbabel` 也可以通过 `conda` 安装：

```bash
conda install -c conda-forge openbabel
```

#### 安装 `pymol`
`pymol` 可以通过 `conda` 安装：

```bash
conda install -c schrodinger pymol
```

#### 安装 `gromacs`
`gromacs` 也可以通过 `conda` 安装：

```bash
conda install -c conda-forge gromacs
```

#### 安装 `vinadock`
`vinadock` 可能不在 `conda` 的默认渠道中，因此你可能需要使用 `pip` 来安装：

```bash
pip install vinadock
```

### 4. 验证安装
安装完成后，你可以通过以下命令验证各个软件包是否安装成功：

```bash
python -c "import rdkit; print(rdkit.__version__)"
python -c "import openbabel; print(openbabel.__version__)"
python -c "import pymol; print(pymol.__version__)"
python -c "import gromacs; print(gromacs.__version__)"
```

### 5. 使用虚拟环境
现在，你可以在 `chem-env` 环境中使用这些工具进行化学计算和分子建模了。

### 6. 退出虚拟环境
当你完成工作后，可以通过以下命令退出虚拟环境：

```bash
conda deactivate
```

## 安装分子对接相关程序包
在 Anaconda 环境下，有许多用于分子对接的软件和工具可以通过 `conda` 或 `pip` 安装。以下是一些常用的分子对接软件及其安装方法：

---

### 1. **AutoDock**
   - **简介**: AutoDock 是一个开源的分子对接工具，广泛用于小分子与生物大分子（如蛋白质）的对接。
   - **安装方法**:
     ```bash
     conda install -c conda-forge autodock
     ```
   - **使用**: 需要准备 `.pdbqt` 格式的受体和配体文件，并通过命令行运行。

---

### 2. **AutoDock Vina**
   - **简介**: AutoDock Vina 是 AutoDock 的改进版本，具有更快的运行速度和更高的准确性。
   - **安装方法**:
     ```bash
     conda install -c conda-forge autodock-vina
     ```
   - **使用**: 支持 `.pdbqt` 格式文件，命令行操作简单。

---

### 3. **rdkit**
   - **简介**: RDKit 是一个化学信息学工具包，虽然不直接用于分子对接，但可以用于分子文件处理、构象生成和分子描述符计算。
   - **安装方法**:
     ```bash
     conda install -c conda-forge rdkit
     ```
   - **使用**: 通常与其他对接工具结合使用。

---

### 4. **Open Babel**
   - **简介**: Open Babel 是一个分子文件格式转换工具，常用于将分子文件转换为对接软件所需的格式（如 `.pdbqt`）。
   - **安装方法**:
     ```bash
     conda install -c conda-forge openbabel
     ```
   - **使用**: 支持多种分子文件格式的转换。

---

### 5. **Schrödinger Suite (Maestro)**
   - **简介**: Schrödinger 是一个商业软件套件，包含 Glide 等强大的分子对接工具。
   - **安装方法**: 需要从 Schrödinger 官网下载并安装，不支持直接通过 Conda 安装。
   - **使用**: 提供图形界面和命令行工具。

---

### 6. **PyRx (AutoDock Vina 的图形界面)**
   - **简介**: PyRx 是一个基于 AutoDock Vina 的图形界面工具，适合不熟悉命令行的用户。
   - **安装方法**:
     - 通过 Conda 安装：
       ```bash
       conda install -c conda-forge pyrx
       ```
     - 或者从官网下载：[PyRx 官网](https://pyrx.sourceforge.io/)
   - **使用**: 提供图形界面，支持分子对接和虚拟筛选。

---

### 7. **LeDock**
   - **简介**: LeDock 是一个快速、高效的分子对接工具，适用于大规模虚拟筛选。
   - **安装方法**: 需要从官网下载并安装，不支持直接通过 Conda 安装。
   - **官网**: [LeDock 官网](http://www.lephar.com/)

---

### 8. **PLIP**
   - **简介**: PLIP 是一个用于蛋白质-配体相互作用分析的工具，通常与对接结果结合使用。
   - **安装方法**:
     ```bash
     conda install -c conda-forge plip
     ```
   - **使用**: 分析对接结果中的相互作用。

---

### 9. **Dock6**
   - **简介**: Dock6 是一个经典的分子对接工具，适用于多种对接任务。
   - **安装方法**: 需要从官网下载并安装，不支持直接通过 Conda 安装。
   - **官网**: [Dock6 官网](https://dock.compbio.ucsf.edu/DOCK_6/)

---

### 10. **Gnina**
   - **简介**: Gnina 是一个基于深度学习的分子对接工具，支持 AutoDock Vina 和 CNN 评分函数。
   - **安装方法**:
     ```bash
     conda install -c conda-forge gnina
     ```
   - **使用**: 支持命令行操作，适合高级用户。

---

### 11. **MGLTools (AutoDockTools)**
   - **简介**: MGLTools 是 AutoDock 的图形界面工具，用于准备分子文件和分析对接结果。
   - **安装方法**: 需要从官网下载并安装，不支持直接通过 Conda 安装。
   - **官网**: [MGLTools 官网](https://ccsb.scripps.edu/mgltools/)

---

### 12. **Rosetta**
   - **简介**: Rosetta 是一个强大的蛋白质设计和大分子对接工具。
   - **安装方法**: 需要从官网下载并安装，不支持直接通过 Conda 安装。
   - **官网**: [Rosetta 官网](https://www.rosettacommons.org/)

---

### 13. **VinaMPI**
   - **简介**: VinaMPI 是 AutoDock Vina 的并行版本，支持多节点计算。
   - **安装方法**: 需要从 GitHub 下载并编译：[VinaMPI GitHub](https://github.com/ccsb-scripps/VinaMPI)

---

### 14. **QuickVina**
   - **简介**: QuickVina 是 AutoDock Vina 的加速版本，适用于大规模虚拟筛选。
   - **安装方法**: 需要从 GitHub 下载并编译：[QuickVina GitHub](https://github.com/QVina/QuickVina)

---

### 15. **DeepChem**
   - **简介**: DeepChem 是一个基于深度学习的化学信息学工具包，支持分子对接和虚拟筛选。
   - **安装方法**:
     ```bash
     conda install -c conda-forge deepchem
     ```
   - **使用**: 适合结合机器学习进行分子对接。

---

### 总结
在 Anaconda 环境下，推荐使用以下组合：
- **AutoDock Vina** + **PyRx**（图形界面）
- **rdkit** + **Open Babel**（分子处理）
- **Gnina**（深度学习增强）

## 导出 Anaconda 虚拟环境中安装的包

### **激活虚拟环境**：
   ```bash
   conda activate myenv
   ```

###  **导出 conda 包列表**：
   ```bash
   conda list --export > conda_requirements.txt
   ```

### **导出 pip 包列表**：
   ```bash
   pip freeze > pip_requirements.txt
   ```

### **在其他环境中恢复**：

   - 对于 `conda` 安装的包：

     ```bash
     conda install --file conda_requirements.txt
     ```

   - 对于 `pip` 安装的包：

     ```bash
     pip install -r pip_requirements.txt
     ```



