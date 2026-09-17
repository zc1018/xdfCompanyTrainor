# 新东方企业英语培训 · 滚屏主页

分支：`feat/enterprise-motion-home`。根据用户提供的 NovaAI 页面规格，将现有
企培内容适配为全屏滚动体验。正式站点的发布不属于本次 UI/UX 修改。

## 两个保存版本

- 当前深色滚屏版：`/scroll/`，入口文件 `scroll/index.html`；保留滚动驱动视频、渐入和连续企培内容。
- 之前白底无滚屏版：`/white/`，入口文件 `white/index.html`；从 `1586cba` 恢复，保留原布局、H3 首屏视频和品牌轮播，不含滚动驱动视频。
- 原有 `/` 地址继续显示滚屏版，既有链接不变。
- 两版拥有独立组件与样式入口，避免后续改版互相影响；白底版不是将深色版临时暂停或换色。
- 构建产物分别为 `dist/scroll/index.html` 与 `dist/white/index.html`，复用品牌及媒体素材。当前仅本地保存，未发布到正式站点。
- 已有 `/static/` 深色静态兼容入口仍保留，不作为上述白底原版。

本地入口：[深色滚屏版](http://127.0.0.1:4202/scroll/) · [白底原版](http://127.0.0.1:4202/white/)。

白底版来源与隔离说明见 `white/README.md`；检查脚本为 `scripts/verify-white.mjs`。
之前深色滚屏/静态入口的 33 项兼容检查保留在 `scripts/verify-versions.mjs`。
本次构建通过，白底原版还原及访问检查 37 项通过（含 10 个源文件逐项比对），
深色滚屏回归 83 项与兼容入口检查 33 项通过；白底报告见
`docs/plans/2026-09-17-white-version-qa.json`。已检查 320、390、1440px 画面。

## 运行

```sh
npm ci
npm run dev
```

开发预览：`http://127.0.0.1:4201/`。

```sh
npm run build
npm run preview
npm test
```

测试默认访问 `http://127.0.0.1:4202`，需先启动 preview；可设置
`ENTERPRISE_PREVIEW_URL` 和 `ENTERPRISE_QA_OUTPUT`。测试使用本机 Chrome，
不会实际发邮件或拨号。

## 当前交互

- 两屏视觉开场，中间保留 80vh 滚动留白；随后按培训方案 → 学习方式 → 交付与案例 → FAQ → 咨询连续阅读。
- 原片按页面滚动进度推进及回滚，采用 0.12 插值；不自动播放，不循环。
- 首帧封面 → 可定位的视频 → 缓存帧画布，500ms 交接；开场内容以 700ms 渐入并轻微上移，正文始终可见。
- 桌面最多缓存 90 帧、960px；移动端和低内存设备最多 48 帧、640px。画布 DPR 上限为 2。缓存不可用时仍可通过视频定位播放。
- 滚动停止后停止绘制；切后台时挂起。可手动暂停；系统减少动态效果时只显示封面，不下载视频。
- 原片偏亮，为白字可读性统一校正背景亮度；无不透明视频遮罩。
- 详细内容全部融入主页，没有弹窗或嵌套滚动。固定导航直接定位章节并移动键盘焦点；支持手机菜单、浏览器前进后退及 `#contact` 等直接入口。
- FAQ、课程目录或咨询摘要展开时，视频会按更新后的整页高度重新计算滚动进度。

## 内容与咨询

保留三类培训目标、四种课程形式、AI 外刊学习方式与六类文章选题、四步项目交付、
月度反馈、匿名方案示例、八个品牌/项目标识及关系说明、五项 FAQ。
参考页的英文营销文案和陌生人照片不作为真实企培资料使用。

企业培训规划师：胡婷 Maggie，`huting20@xdf.cn`，`15811383545`。
`src/content.ts` 与 `index.html` 无脚本联系方式保持一致。

咨询摘要仍只在本地生成、复制与下载。邮件按钮打开带摘要的邮件草稿，不自动发送。
在章节间跳转保留本次浏览的填写内容，刷新后不保留；不写入浏览器存储或后端。

## 核心文件

- `src/App.tsx`：视觉开场、连续主页、章节导航与咨询入口。
- `src/components/ScrollVideo.tsx`：随滚动推进的视频、缓存与失败降级。
- `src/components/Reveal.tsx`：交错渐入，单一 IntersectionObserver。
- `src/components/PageContent.tsx`：连续内容章节、交付案例、品牌关系、FAQ 与页尾。
- `src/lib.ts`：锚点滚动与标题焦点管理。
- `src/components/Solutions.tsx` / `Learning.tsx` / `Contact.tsx`：既有培训与咨询功能。
- `src/index.css`：Inter、玻璃样式、响应式及减少动态效果。
- `assets/media/SOURCES.md`：原片、封面、文件校验与历史视频记录。
- `scripts/verify-scroll.mjs`：本版滚屏行为、响应式、咨询流程与降级检查。
- `scripts/verify-react.mjs`：上一版 H3 首屏的历史检查脚本。
- `legacy.html` / `app.js` / `styles.css`：原版静态页面保留用于比较。

本地验证结果见 `docs/plans/2026-09-17-scroll-home.md`。浏览器模拟尺寸与自动检查
不等同于实体 iPhone/Android 验收。参考提示中的 `localhost:5199` 当前不可访问，
本版按附件的文字规格制作。
