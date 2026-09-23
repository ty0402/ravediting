# RAVEdit-NFT project page

Responsive research homepage for **RAVEdit-NFT: Joint Audio-Visual Editing with Role-Aware Cross-Modal Attention and Negative-Aware Fine-Tuning**.

The page follows the author's MMEditing and Foley-Omni project-page style: a centered paper title and authors, dark resource buttons, an abstract, a method figure, and simple Instruction / Source / Target MP4 tables. Content and figures are taken from the supplied manuscript. Video slots are empty until samples are added.

## 本地预览

无需安装 npm 依赖。在仓库目录运行：

```sh
python3 -m http.server 8000
```

打开 <http://localhost:8000>。请通过 HTTP 预览，直接双击 HTML 会使浏览器阻止读取 JSON。

## 添加视频和 instruction

每个例子将原始视频与编辑视频放在同一个目录，MP4 中保留音轨：

```text
static/videos/speech-01/
  source.mp4
  target.mp4
  source.webp        # 可选封面
  target.webp        # 可选封面
  source.vtt         # 可选英文字幕
  target.vtt         # 可选英文字幕
```

然后修改 `data/examples.json` 中对应条目：

```json
{
  "id": "speech-01",
  "category": "speech",
  "title": "Speech example 01",
  "instruction": "在这里填写实际的编辑指令",
  "source": {
    "src": "static/videos/speech-01/source.mp4",
    "poster": "",
    "captions": ""
  },
  "target": {
    "src": "static/videos/speech-01/target.mp4",
    "poster": "",
    "captions": ""
  }
}
```

保留 `schemaVersion`、`categories` 和 `examples` 的外层结构。复制一个条目即可新增例子，`id` 应唯一，`category` 应与分组 ID 对应。支持站点相对路径或完整 HTTPS 媒体链接；不要以 `/` 开头，避免绕过 GitHub Pages 的 `/ravediting/` 路径。

`instruction`、`src`、`poster`、`captions` 初始均为空。留空时显示占位，不请求不存在的媒体。上传视频后会使用原生播放器，并自动暂停其他视频，避免声音重叠。推荐浏览器兼容的 H.264/AAC MP4。初版的 Speech / Visual / Joint AV 是演示分组，不是论文中五类 benchmark 的枚举。详见 [视频目录说明](static/videos/README.md)。

## GitHub Pages

主页直接维护在 `main` 分支。在仓库 **Settings → Pages** 选择 **Deploy from a branch → main → /(root)**。站点预期地址为 <https://ty0402.github.io/ravediting/>；需启用 Pages 且部署完成后才能访问。

所有资源使用相对路径，可部署到仓库子路径。`.nojekyll` 允许直接发布静态文件。更新代码后推送到 `main`。Pages 首次发布需启用上述设置。

## 内容维护

- `index.html`：论文标题、作者、摘要、方法说明和演示入口。
- `static/css/index.css`：直接复用 Foley-Omni 的字体、颜色、按钮和页面基础样式。
- `static/css/bulma.min.css`：与原站一致的 Bulma 基础样式。
- `static/style.css`：作者信息和 MMEditing 三列表格的移动端适配。
- `static/app.js`：JSON 读取、类别锚点、三列表格、播放器和空状态。
- `data/examples.json`：编辑演示的统一数据入口。
- `static/images/`：从稿件原图等比缩放并压缩的 WebP 插图。

方法图来源：`RoleAVEdit_editable_v25_01.png`；定性对比来源：`RoleAVEdit_two_rows_editable_01.png`；人类偏好图来源：`av-study-fixedcanvas-editable_01.png`。结果以最新 `Template.tex` 为准。未使用旧的人类偏好图，也未将模板 PDF 当作正式论文发布。没有填入未经确认的 arXiv、会议信息、模型链接或 BibTeX。

页面直接复用作者的 [Foley-Omni](https://ty0402.github.io/Foley-omni-Web/) 基础样式，并采用 [MMEditing](https://ty0402.github.io/MMEditing/) 的编辑对照表布局。两站同款 Inter 字体通过 Google Fonts 加载，Bulma 样式保存在本地。Bulma 采用 MIT 许可（版权声明见 CSS 文件开头）。MMEditing 原模板来源为 [Academic Project Page Template](https://github.com/eliahuhorwitz/Academic-project-page-template) / [Nerfies](https://nerfies.github.io/)，其页面代码采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；相关表格样式沿用该署名和许可。
