# RAVEdit-NFT project page

Responsive research homepage for **RAVEdit-NFT: Joint Audio-Visual Editing with Role-Aware Cross-Modal Attention and Negative-Aware Fine-Tuning**.

The page contains an overview, method figures, an instruction + source/target MP4 gallery, quantitative comparisons, and a human preference study. Content and figures are taken from the supplied manuscript. Unreleased resources and video samples are clearly marked as coming soon.

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

合并主页 PR 后，在仓库 **Settings → Pages** 选择 **Deploy from a branch → main → /(root)**。站点预期地址为 <https://ty0402.github.io/ravediting/>；需启用 Pages 且部署完成后才能访问。

所有资源使用相对路径，可部署到仓库子路径。`.nojekyll` 允许直接发布静态文件。本 PR 不会自动合并，也不修改仓库的 Pages 设置。

## 内容维护

- `index.html`：论文标题、作者、摘要、方法说明和结果表。
- `static/style.css`：响应式布局、配色及移动端适配。
- `static/app.js`：JSON 读取、筛选、播放器、空状态和加载失败处理。
- `data/examples.json`：编辑演示的统一数据入口。
- `static/images/`：从稿件原图等比缩放并压缩的 WebP 插图。

方法图来源：`RoleAVEdit_editable_v25_01.png`；定性对比来源：`RoleAVEdit_two_rows_editable_01.png`；人类偏好图来源：`av-study-fixedcanvas-editable_01.png`。结果以最新 `Template.tex` 为准。未使用旧的人类偏好图，也未将模板 PDF 当作正式论文发布。没有填入未经确认的 arXiv、会议信息、模型链接或 BibTeX。

视觉结构参考作者的 [MMEditing 主页](https://ty0402.github.io/MMEditing/)，本站以独立 HTML/CSS/JS 实现，不依赖外部字体、脚本 CDN 或前端框架。
