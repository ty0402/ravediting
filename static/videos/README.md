# 视频示例维护

每组示例把 **instruction、source、target** 放在同一条数据记录中，并按三列表格展示：Instruction / Source / Target (RAVEdit-NFT)。当前初版保留三组空模板：Speech editing、Visual editing、Joint AV editing；这些是主页展示分组，不表示论文中的 benchmark 类别。所有指令和媒体地址均留空，页面会显示「Coming soon」。

## 推荐目录

每个示例使用独立目录，目录名与 `data/examples.json` 中的 `id` 一致：

```text
static/videos/
  speech-01/
    source.mp4
    target.mp4
    source-poster.jpg    # 可选：视频封面
    target-poster.jpg    # 可选：视频封面
    source.en.vtt        # 可选：WebVTT 英文字幕
    target.en.vtt        # 可选：WebVTT 英文字幕
  visual-01/
    source.mp4
    target.mp4
  joint-01/
    source.mp4
    target.mp4
```

## 填充数据

编辑项目根目录的 `data/examples.json`。保留 `schemaVersion: 1`，让每个示例的 `id` 唯一，并让 `category` 对应 `categories` 中的 `id`。例如：

```json
{
  "id": "speech-01",
  "category": "speech",
  "title": "填写真实示例的标题",
  "instruction": "填写实际使用的编辑指令",
  "source": {
    "src": "static/videos/speech-01/source.mp4",
    "poster": "static/videos/speech-01/source-poster.jpg",
    "captions": "static/videos/speech-01/source.en.vtt"
  },
  "target": {
    "src": "static/videos/speech-01/target.mp4",
    "poster": "static/videos/speech-01/target-poster.jpg",
    "captions": "static/videos/speech-01/target.en.vtt"
  }
}
```

媒体路径相对于主页 `index.html`，无需以 `/` 开头；也可填写完整的 HTTP(S) 地址。没有封面或字幕时对应字段保持 `""`。没有视频时 `src` 保持 `""`；不要填入不存在的文件地址。字幕播放器当前按英文标记，其他语言的字幕需同步调整 `static/app.js` 中的 `track.srclang` 和 `track.label`。

新增示例时，复制一条记录并更新 `id`、分组、标题、指令和素材路径。新增展示分组时，先向 `categories` 添加包含 `id`、`label`、`description` 的对象。`id` 以小写字母开头，仅使用小写字母、数字和连字符。页面会按数据顺序生成分组表格和简单的分组锚点链接。

## 上传与检查

建议采用浏览器兼容的 H.264 视频与 AAC 音频，MP4 文件保留原始声音；可将 `moov` 元数据放在文件开头以便网页播放。较大的视频可使用外部静态文件存储，并在 `src` 中填写直链。

从项目根目录运行 `python3 -m http.server 8000`，打开 `http://localhost:8000/` 检查。请不要直接双击 HTML：浏览器可能阻止本地文件读取 JSON。

- 检查 Source 和 Target 对应同一条指令，并确认声音、口型及视频内容正确。
- 检查各分组锚点链接、移动端排版，以及键盘 Tab / Enter 操作。
- 视频没有自动播放；用户手动播放一个视频时，其他视频会暂停，避免声音叠加。
- `preload="none"` 避免首次访问批量下载视频。无视频时显示空状态；已填写地址但加载失败时也会显示占位状态。
- 提交素材与 JSON 后，在发布后的页面再次播放，确认路径大小写一致、远程地址可直接访问，字幕和封面正常显示。
