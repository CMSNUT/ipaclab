import{_ as i,c as a,d as n,o as e}from"./app-Bi0c-17Q.js";const l={};function t(k,s){return e(),a("div",null,s[0]||(s[0]=[n(`<h2 id="创建虚拟环境-安装-scikit-learn" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境-安装-scikit-learn"><span>创建虚拟环境,安装 scikit-learn</span></a></h2><ul><li><a href="https://scikit-learn.org/stable/install.html" target="_blank" rel="noopener noreferrer">参考官网</a></li><li><strong>管理员身份，启动 Anaconda Prompt</strong></li></ul><div class="language-bash line-numbers-mode" data-ext="bash" data-title="bash"><button class="copy" title="复制代码" data-copied="已复制"></button><pre class="shiki shiki-themes vitesse-light vitesse-dark vp-code"><code><span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">conda</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> create</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -n</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> sklearn-env</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -c</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> conda-forge</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> scikit-learn</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -y</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">conda</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> activate</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> sklearn-env</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 添加sklearn-env到jupyter notebook的kernel</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">pip</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ipykernel</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -i</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> https://pypi.tuna.tsinghua.edu.cn/simple</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">python</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -m</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> ipykernel</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> install</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --user</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --name</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> sklearn-env</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 列出jupyter notebook当前的内核</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">jupyter</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> kernelspec</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> list</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 将my_env从jupyter notebook的kernel目录中移除</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">jupyter</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> kernelspec</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> remove</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> sklearn-env</span></span>
<span class="line"><span style="--shiki-light:#A0ADA0;--shiki-dark:#758575DD;"># 将my_env从系统中彻底删除</span></span>
<span class="line"><span style="--shiki-light:#59873A;--shiki-dark:#80A665;">conda</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> remove</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> -n</span><span style="--shiki-light:#B56959;--shiki-dark:#C98A7D;"> sklearn-env</span><span style="--shiki-light:#A65E2B;--shiki-dark:#C99076;"> --all</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)]))}const r=i(l,[["render",t],["__file","index.html.vue"]]),p=JSON.parse('{"path":"/article/slq5om8k/","title":"Scikit-learn安装和配置","lang":"zh-CN","frontmatter":{"title":"Scikit-learn安装和配置","tags":["Python","scikit-learn","sklearn","机器学习","安装"],"createTime":"2024/10/29 23:34:06","permalink":"/article/slq5om8k/"},"headers":[],"readingTime":{"minutes":0.45,"words":136},"git":{"updatedTime":1741837924000,"contributors":[{"name":"CMSNUT","username":"CMSNUT","email":"dhxia@snut.edu.cn","commits":2,"avatar":"https://avatars.githubusercontent.com/CMSNUT?v=4","url":"https://github.com/CMSNUT"},{"name":"Aikemi","username":"Aikemi","email":"dhxia@snut.edu.cn","commits":1,"avatar":"https://avatars.githubusercontent.com/Aikemi?v=4","url":"https://github.com/Aikemi"}]},"filePathRelative":"1.基础工具/python/Scikit-learn安装和配置.md","categoryList":[{"id":"67858d","sort":1,"name":"基础工具"},{"id":"d12a7e","sort":10001,"name":"python"}],"bulletin":false}');export{r as comp,p as data};
