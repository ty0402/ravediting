# 视频示例维护

每条数据记录包含完整 **instruction（prompt）** 和对应的 **Source / INS / Ours (NFT)**。页面按类别展示，指令通栏，视频并排；手机上 Source 居中，INS 与 Ours 保持相邻。

## 当前素材

来自 `av-study-aliyun-20260919.tar.gz` 的内嵌 study 清单，模型键 `instruct` 为 InstructAV2AV，`nft25` 为本页 Ours (NFT)。未使用 `base_fast` 输出。

| 主页目录 | 原始样本 ID |
| --- | --- |
| speech-01 / speech-02 | Q06 / Q07 |
| subject-editing-01 / subject-editing-02 | Q01 / Q02 |
| background-editing-01 / background-editing-02 | Q03 / Q04 |
| subject-addition-01 / subject-addition-02 | Q12 / Q13 |
| subject-removal-01 / subject-removal-02 | Q14 / Q15 |

视频仅通过 stream copy 调整为 fast-start MP4，保留各自原始分辨率、帧率、音轨及画面，不做裁切或重新编码。封面为各视频 0.5 秒处的静态帧。播放器等大显示，并用 `object-fit: contain` 保留完整画面。

## 添加一组示例

```text
static/videos/speech-03/
  source.mp4
  ins.mp4
  ours.mp4
  source.jpg
  ins.jpg
  ours.jpg
```

编辑 `data/examples.json`，保持 `schemaVersion: 2`。每条 `id` 唯一，`category` 对应 `categories` 中的 `id`：

```json
{
  "id": "speech-03",
  "category": "speech",
  "title": "A short descriptive title",
  "instruction": "The exact editing prompt used for both methods.",
  "source": { "src": "static/videos/speech-03/source.mp4", "poster": "static/videos/speech-03/source.jpg", "captions": "" },
  "ins": { "src": "static/videos/speech-03/ins.mp4", "poster": "static/videos/speech-03/ins.jpg", "captions": "" },
  "ours": { "src": "static/videos/speech-03/ours.mp4", "poster": "static/videos/speech-03/ours.jpg", "captions": "" }
}
```

`src`、`poster`、`captions` 支持相对于主页的路径或 HTTP(S) 直链；不以 `/` 开头。可选的封面/英文 WebVTT 字幕留空即可；没有视频时 `src` 留空。不同语言的字幕需同步调整 `static/app.js` 的 `srclang`。

新增类别时向 `categories` 添加 `id`、`label`、`description`；类别 ID 以小写字母开头，只用小写字母、数字和连字符。页面按 JSON 顺序生成锚点和分组。替换 JSON 时更新 `static/app.js` 中的数据版本参数，修改 CSS/JS 时更新 `index.html` 的对应版本参数，避免旧缓存。

## 播放与验证

- MP4 推荐 H.264 / AAC。保留音轨，不自动播放；开始播放任意视频会暂停其他视频，避免声音叠加。
- `preload="none"` 配合封面，首次打开不会批量下载所有视频。
- 从网站目录运行 `python3 -m http.server 8000`，通过 HTTP 预览。
- 检查两种方法与 Source 属于同一条指令、模型映射正确，并检查声音、手机布局和线上播放。
