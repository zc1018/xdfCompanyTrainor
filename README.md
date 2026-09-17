# 新东方企业英语培训 · Motion 主页分支

分支：`feat/enterprise-motion-home`，基于 `main` 的 `788cc41`。这是独立 UI/UX 方案，不替换当前生产站点。

## 运行

```sh
npm ci
npm run dev
```

开发预览：`http://127.0.0.1:4201/`。生产包检查：

```sh
npm run build
npm run preview
npm test
```

测试默认访问 `http://127.0.0.1:4202`，需先启动 preview；可设置 `ENTERPRISE_PREVIEW_URL` 和 `ENTERPRISE_QA_OUTPUT`。测试使用本机 Chrome，不会实际发邮件或拨号。

### 本地验收 · 2026-09-17

构建、TypeScript 和生产依赖安全检查通过。浏览器回归覆盖 320 / 390 / 768 / 1024 / 1440 / 1932px，80 项全部通过。包含屏蔽全部外部资源后的站内视频播放、服务文件与原视频字节校验、慢速加载 / 视频失败时的首帧封面、减少动态效果时不请求视频且保留封面，以及咨询流程和无脚本联系方式。原 CloudFront 链接曾出现连接失败，现已获用户确认改为站内媒体；外链可用性不再影响首屏视频。未进行实体手机测试或生产部署。

## 技术与设计

- React + TypeScript + Vite，Tailwind CSS v4，Motion，lucide-react，clsx 和 tailwind-merge。
- 按用户规格使用 Google Fonts 的 Inter / Outfit；中文保留系统无衬线字体回退。
- 1400px 最大宽度、48px 圆角、600px 高的视频 Hero；使用用户指定的原视频，不添加视频遮罩。经用户确认，原视频按字节完整保存在站内，不再依赖 CloudFront 外链。
- 首屏文字和底部悬浮导航使用 Motion 入场；CSS transform 实现双份 Logo 无缝滚动，悬停暂停。
- 提供整体动态暂停按钮；系统减少动态效果时显示首帧封面、不下载或播放视频，并停止滚动和过渡。背景视频离开视口或切换标签页后暂停。
- 320px 窄屏将首屏左右留白由 32px 收至 20px，保留 42px 标题字号，避免中文标题折成四行；悬浮导航省略装饰星标以保证可点击区域。
- 视频慢速加载或失败时展示站内首帧封面；Google Fonts 加载失败时使用系统字体，仍可读、可咨询。未启用 JavaScript 时展示基本产品与联系方式。

## 内容边界

只改 UI/UX 和呈现方式，不扩展业务承诺。课程组合、目标切换、学习方式示意、项目服务、匿名方案示例、FAQ 与本地咨询摘要均沿用原页。

滚动区将示例中的科技公司标识替换为八个已有真实素材：新东方自身品牌、中国银行、IBM、汇丰、中国邮政、上海世博会、金砖国家厦门会晤及杭州亚运会。字幕及辅助文本区分品牌、项目与历史合作机构，不暗示示例科技公司是客户。关系依据见 `assets/brands/SOURCES.md`。

企业培训规划师：胡婷 Maggie，`huting20@xdf.cn`，`15811383545`。主配置在 `src/content.ts`；同时保持 `index.html` 的无脚本联系方式一致。原 `sales-config.js` 仅供旧版页面使用。

表单不保存浏览器草稿，不调用后端或 CRM。生成 / 复制 / 下载都是本地操作；邮件按钮只打开带有摘要的邮件草稿，仍需用户在邮件应用中确认发送。

## 文件

- `src/components/Hero.tsx` / `Marquee.tsx`：视频首屏、导航与滚动标识。
- `src/components/Solutions.tsx` / `Learning.tsx`：键盘可操作的目标与学习方式选择。
- `src/components/Contact.tsx`：咨询渠道与摘要工具。
- `src/content.ts`：确认过的业务内容与素材。
- `assets/media/`：用户指定的原视频与首帧封面；`SOURCES.md` 记录原始来源、文件校验和与提取方法。
- `src/index.css`：Tailwind v4 主题、滚动动画、响应式与无障碍规则。
- `scripts/verify-react.mjs`：构建预览回归与截图。
- `legacy.html` / `app.js` / `styles.css` / `LEGACY-README.md`：原版静态页面保留用于比较，不作为新版入口。

当前线上主站仍为 `https://xdf-company-trainor.vercel.app/`，本分支尚未发布生产。若需部署本分支，请先使用 Vercel Preview 评审，确认后再合并及生产发布。
