# RAVEdit-NFT project page

Responsive research homepage for **RAVEdit-NFT: Joint Audio-Visual Editing with Role-Aware Cross-Modal Attention and Negative-Aware Fine-Tuning**.

The page follows the author's MMEditing and Foley-Omni project-page style: a centered paper title and authors, dark resource buttons, an abstract, a method figure, and grouped video comparisons with full editing prompts. Content and figures are taken from the supplied manuscript; the samples compare Source, INS, and Ours (NFT).

## 本地预览

无需安装 npm 依赖。在仓库目录运行：

```sh
python3 -m http.server 8000
```

打开 <http://localhost:8000>。请通过 HTTP 预览，直接双击 HTML 会使浏览器阻止读取 JSON。

## 示例视频与 prompt

`data/examples.json`（`schemaVersion: 2`）统一管理类别、原始编辑指令、Source、INS 和 Ours (NFT) 视频。页面当前包含 5 类、每类 2 组，共 10 组对比：Speech editing、Subject editing、Background editing、Subject addition、Subject removal。

每组先显示完整 prompt，再并排显示三个原生 MP4 播放器。**INS** 对应素材中的 `instruct`（InstructAV2AV），**Ours (NFT)** 对应 `nft25`。视频使用原始音视频流，仅将 MP4 索引移到文件开头方便网页播放；没有重新压缩结果。封面截取各视频 0.5 秒处。

素材来自用户提供的 `av-study-aliyun-20260919.tar.gz`。按该包清单原顺序，每类取前两个配对完整的例子；这些是定性展示示例，不是随机评估集。包内已有样本属于预先筛选的子集。映射为 Speech Q06/Q07、Subject editing Q01/Q02、Background Q03/Q04、Addition Q12/Q13、Removal Q14/Q15。

新增样本时，将 MP4 和封面放在 `static/videos/<example-id>/`，复制 JSON 条目并填写 `instruction`、`source`、`ins`、`ours`。路径相对于站点根页面，不以 `/` 开头，以兼容 GitHub Pages 的子目录。具体格式见 [视频维护说明](static/videos/README.md)。

## GitHub Pages

主页直接维护在 `main` 分支。在仓库 **Settings → Pages** 选择 **Deploy from a branch → main → /(root)**。站点预期地址为 <https://ty0402.github.io/ravediting/>；需启用 Pages 且部署完成后才能访问。

所有资源使用相对路径，可部署到仓库子路径。`.nojekyll` 允许直接发布静态文件。更新代码后推送到 `main`。Pages 首次发布需启用上述设置。

## 内容维护

- `index.html`：论文标题、作者、摘要、方法说明和演示入口。
- `static/css/index.css`：直接复用 Foley-Omni 的字体、颜色、按钮和页面基础样式。
- `static/css/bulma.min.css`：与原站一致的 Bulma 基础样式。
- `static/style.css`：作者信息、指令与三视频对比的移动端适配。
- `static/app.js`：JSON 读取、类别锚点、三视频对比、播放器和空状态。
- `data/examples.json`：编辑演示的统一数据入口。
- `static/images/`：从稿件原图等比缩放并压缩的 WebP 插图。

方法图来源：`RoleAVEdit_editable_v25_01.png`；定性对比来源：`RoleAVEdit_two_rows_editable_01.png`；人类偏好图来源：`av-study-fixedcanvas-editable_01.png`。结果以最新 `Template.tex` 为准。未使用旧的人类偏好图，也未将模板 PDF 当作正式论文发布。没有填入未经确认的 arXiv、会议信息、模型链接或 BibTeX。

页面直接复用作者的 [Foley-Omni](https://ty0402.github.io/Foley-omni-Web/) 基础样式，并采用 [MMEditing](https://ty0402.github.io/MMEditing/) 的编辑对照表布局。两站同款 Inter 字体通过 Google Fonts 加载，Bulma 样式保存在本地。Bulma 采用 MIT 许可（版权声明见 CSS 文件开头）。MMEditing 原模板来源为 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) / [Nerfies](https://nerfies.github.io/)，其页面代码采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；相关表格样式沿用该署名和许可。
