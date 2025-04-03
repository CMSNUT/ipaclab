import{_ as d,c as e,d as o,o as r}from"./app-Bi0c-17Q.js";const c={};function s(n,t){return r(),e("div",null,t[0]||(t[0]=[o('<h2 id="vite配置" tabindex="-1"><a class="header-anchor" href="#vite配置"><span>Vite配置</span></a></h2><p>以下是针对该Vite配置文件的详细解释表格：</p><table><thead><tr><th><strong>配置项</strong></th><th><strong>子项/参数</strong></th><th><strong>说明</strong></th><th><strong>默认值/用户设置</strong></th><th><strong>作用/目的</strong></th></tr></thead><tbody><tr><td><strong>基本配置</strong></td><td>base</td><td>项目基础路径</td><td><code>&#39;./&#39;</code></td><td>指定index.html文件所在的基础路径（相对路径）</td></tr><tr><td></td><td>root</td><td>项目根目录</td><td><code>&#39;./&#39;</code></td><td>指定项目的根目录（源代码所在位置）</td></tr><tr><td></td><td>minify</td><td>是否压缩代码</td><td><code>true</code></td><td>生产构建时压缩代码，减小体积</td></tr><tr><td><strong>解析配置</strong></td><td>resolve.alias</td><td>路径别名配置</td><td>自定义路径别名（如<code>/@</code>指向<code>./src/</code>，<code>@views</code>指向<code>./src/views</code>等）</td><td>简化模块导入路径，提高代码可读性</td></tr><tr><td><strong>全局变量</strong></td><td>define</td><td>定义全局变量</td><td><code>&#39;process.env.NODE_ENV&#39;</code>根据<code>command</code>动态设置为<code>development</code>或<code>production</code></td><td>在代码中注入环境变量，区分开发和生产环境</td></tr><tr><td><strong>开发服务器</strong></td><td>server</td><td>开发服务器配置</td><td>- <code>host: true</code>（允许网络访问）<br>- <code>port: 8080</code><br>- <code>cors: true</code>（允许跨域）<br>- <code>proxy: {}</code>（代理为空）</td><td>配置本地开发服务器的行为，如端口、跨域支持等</td></tr><tr><td><strong>构建配置</strong></td><td>build.target</td><td>构建目标浏览器兼容性</td><td><code>&#39;es2015&#39;</code></td><td>指定生成的JavaScript兼容性级别</td></tr><tr><td></td><td>build.minify</td><td>代码压缩工具</td><td><code>&#39;terser&#39;</code></td><td>使用Terser进行代码压缩</td></tr><tr><td></td><td>build.outDir</td><td>输出目录</td><td><code>&#39;dist&#39;</code></td><td>指定构建产物的输出目录</td></tr><tr><td></td><td>build.rollupOptions</td><td>Rollup打包配置</td><td>- <code>output.manualChunks</code>分割<code>vue</code>和<code>echarts</code><br>- 文件名添加哈希（缓存控制）</td><td>优化代码分割策略，提升缓存利用率</td></tr><tr><td><strong>依赖优化</strong></td><td>optimizeDeps</td><td>预构建依赖配置</td><td>用户设置为空对象<code>{}</code></td><td>自定义需要预构建的依赖项（默认自动检测）</td></tr><tr><td><strong>ESBuild配置</strong></td><td>esbuild</td><td>ESBuild转换配置</td><td>用户设置为空对象<code>{}</code></td><td>自定义ESBuild选项（如JSX处理等）</td></tr><tr><td><strong>插件配置</strong></td><td>plugins</td><td>使用的Vite插件列表</td><td>- <code>legacyPlugin</code>（兼容旧版浏览器）<br>- <code>vuePlugin</code>（Vue支持）<br>- <code>vueJsx</code>（Vue JSX支持）<br>- <code>vueSetupExtend</code>（支持<code>&lt;script setup&gt;</code>语法扩展）<br>- <code>createHtmlPlugin</code>（HTML模板注入数据）</td><td>- 为旧版浏览器生成polyfills<br>- 支持Vue单文件组件和JSX语法<br>- 增强<code>&lt;script setup&gt;</code>功能<br>- 动态注入HTML模板中的标题（<code>appConfig.APP_TITLE</code>）</td></tr><tr><td><strong>CSS配置</strong></td><td>css.preprocessorOptions</td><td>CSS预处理器配置</td><td><code>css: { charset: false }</code></td><td>禁用CSS文件中的<code>@charset</code>规则生成</td></tr><tr><td><strong>JSON配置</strong></td><td>json.namedExports</td><td>是否支持按名导入JSON字段</td><td><code>true</code></td><td>允许通过命名导出访问JSON字段</td></tr><tr><td></td><td>json.stringify</td><td>是否将JSON转为字符串</td><td><code>false</code></td><td>直接导入JSON对象（若为<code>true</code>则使用<code>JSON.parse</code>优化性能）</td></tr><tr><td><strong>其他</strong></td><td>legacyPlugin配置</td><td>旧版浏览器兼容插件配置</td><td>- <code>targets</code>指定兼容的浏览器版本<br>- <code>polyfills</code>包含<code>es.promise.finally</code>等<br>- <code>modernPolyfills</code>为现代浏览器添加必要的polyfills<br>- <code>renderLegacyChunks: true</code>（生成旧版兼容代码块）</td><td>确保在旧版浏览器（如Android &gt; 39、Chrome &gt;= 60等）中正常运行，同时为现代浏览器提供轻量级polyfills</td></tr></tbody></table><h3 id="补充说明" tabindex="-1"><a class="header-anchor" href="#补充说明"><span>补充说明：</span></a></h3><ol><li><p><strong>路径解析</strong></p><ul><li><code>pathResolve</code>函数用于统一处理路径别名，避免硬编码路径。</li><li>例如：<code>@/components</code>指向<code>src/components</code>，简化导入语句。</li></ul></li><li><p><strong>环境变量注入</strong></p><ul><li>通过<code>define</code>动态设置<code>process.env.NODE_ENV</code>，便于代码中根据环境执行不同逻辑。</li></ul></li><li><p><strong>代码分割策略</strong></p><ul><li><code>manualChunks</code>将<code>vue</code>、<code>vue-router</code>、<code>pinia</code>打包为一个块，<code>echarts</code>单独打包，减少重复加载。</li></ul></li><li><p><strong>HTML模板处理</strong></p><ul><li><code>createHtmlPlugin</code>动态注入<code>title</code>，使得HTML中的<code>&lt;title&gt;</code>标签内容可通过<code>appConfig.APP_TITLE</code>配置。</li></ul></li><li><p><strong>旧版浏览器支持</strong></p><ul><li><code>legacyPlugin</code>会为不支持ESM的浏览器生成传统格式（如SystemJS模块），并注入必要的polyfills。</li></ul></li></ol><h2 id="main-js配置" tabindex="-1"><a class="header-anchor" href="#main-js配置"><span>main.js配置</span></a></h2>',6)]))}const l=d(c,[["render",s],["__file","index.html.vue"]]),a=JSON.parse('{"path":"/learning/other/frontend/dhango-vue-lyadmin/","title":"dhango-vue-lyadmin项目解析","lang":"zh-CN","frontmatter":{"title":"dhango-vue-lyadmin项目解析","createTime":"2025/04/02 11:15:25","permalink":"/learning/other/frontend/dhango-vue-lyadmin/"},"headers":[],"readingTime":{"minutes":2.92,"words":877},"git":{"updatedTime":1743674194000,"contributors":[{"name":"Aikemi","username":"Aikemi","email":"dhxia@snut.edu.cn","commits":3,"avatar":"https://avatars.githubusercontent.com/Aikemi?v=4","url":"https://github.com/Aikemi"}]},"filePathRelative":"notes/学习资料/其他/1.前端基础/1.django-vue-lyadmin项目解析.md","bulletin":false}');export{l as comp,a as data};
