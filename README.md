# 新东方企业英语培训页

静态 HTML / CSS / JavaScript 页面，沿用现有项目技术栈。无需构建；图片、字体和脚本全部在本地提供，运行时无第三方请求。

## 线上部署

- 生产网址：https://xdf-company-trainor.vercel.app
- GitHub：https://github.com/zc1018/xdfCompanyTrainor
- Vercel 项目：`cha-d/xdf-company-trainor`，静态站点，无构建步骤。
- 手动发布：在项目目录运行 `npx vercel deploy --prod`。
- Git 自动部署尚未连接：Vercel 账号需要先添加 GitHub Login Connection，再运行 `npx vercel git connect`。目前单独 push 不会自动更新线上页面。
- `.vercelignore` 排除开发文档、测试脚本和旧素材；原始 PPT 不在仓库内。

## 预览

在上级目录 `/Users/xdf/Documents/XDF/外刊` 启动静态服务：

```sh
python3 -m http.server 4199 --bind 127.0.0.1
```

打开 `http://127.0.0.1:4199/enterprise-training-landing/`。

## 销售联系方式

只修改 `sales-config.js` 中已经确认的公开销售渠道：

| 字段 | 支持的值 | 留空时 |
| --- | --- | --- |
| `email` | 正式销售邮箱 | 不显示邮件入口 |
| `phone` | 电话号码，可包含国际区号、空格、括号或连字符 | 不显示电话入口 |
| `consultationUrl` | HTTPS 在线咨询地址 | 不显示在线咨询入口 |
| `wechatId` | 正式销售微信号 | 不显示复制微信入口 |
| `wechatQrImage` | 本地 `assets/` 下的 PNG / JPG / WebP 文件路径；须同时填写微信号 | 不显示二维码 |

至少一个有效渠道配置后，页面自动显示“直接联系培训顾问”，并移除“联系方式即将公布”。配置邮箱后，生成的需求摘要会多出“用邮件发送”入口。它只打开用户的邮件客户端草稿，不代表邮件已发出或已送达。

当前所有渠道均为空，这是用户指定的待定状态。不得填入猜测邮箱、占位电话号码或未经确认的销售微信。

### 需求摘要的边界

- 表单只整理培训目标、企业/团队名、人数和时间，不要求个人联系方式。
- 信息只存在当前页面内存中，刷新可能丢失；页面已说明这一点。
- 生成、复制、下载均不发送网络请求，不调用 CRM，也不把信息写入浏览器存储。
- 无 JavaScript 时，生成按钮默认禁用，避免浏览器默认 GET 提交。课程目录、FAQ 和普通锚点仍然可用。
- 若日后需要在线提交线索，必须另行实现服务端接收、隐私说明、必要同意、异常恢复与销售端回执，不能把本地摘要状态改成“提交成功”冒充接入。

## 文件

- `index.html`：页面内容、语义结构、原生 FAQ / 课程展开。
- `styles.css`：响应式布局、键盘焦点、减少动态效果和打印样式。
- `app.js`：目标切换、学习方式预览、导航、移动咨询条、配置校验与本地需求摘要。
- `sales-config.js`：唯一销售渠道配置入口。
- `scripts/verify.cjs`：自动化浏览器检查；`qa-capture.cjs` 是兼容入口。
- `scripts/prepare-assets.mjs`：从本次生成图压缩出两个 WebP 尺寸，并生成字体子集；该脚本需要网络，仅资产更新时执行。
- `DESIGN-REVIEW.md`：评估结论、修改决策、素材边界及验证记录。
- `assets/brands/SOURCES.md`：正式品牌与合作标识来源、附件依据及展示边界。

## 验证

当前 macOS 工作环境使用已安装的 Chrome 和 Codex 附带的 Playwright：

```sh
/Users/xdf/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify.cjs
```

可通过 `ENTERPRISE_PREVIEW_URL` 指定预览地址，`ENTERPRISE_QA_OUTPUT` 指定测试输出目录。测试覆盖 320、390、768、1024、1440 px 宽度，以及无脚本、减弱动态、剪贴板失败和有效/无效销售配置。销售配置测试使用隔离拦截，生产配置不会被修改，也不会联系测试渠道。

## 内容与素材

课程形式、项目服务、大型语言培训经历与匿名方案示例，依据用户提供的《2026版-新东方英语企业英语培训介绍.pptx》。页面不承诺培训效果百分比，不引用未经提供的价格、客户证言或成果数据。

首屏办公场景由 imagegen 生成，页面明确标为场景示意，不用作真实客户案例照片。英语学习卡片是可切换的功能讲解示意，非实际产品界面、实时评分或可播放音频。

字体使用 Noto Sans SC / Noto Serif SC 的本页自托管子集；许可证保存在 `assets/fonts/*-OFL.txt`。英文教学例句使用系统衬线字体改善标点排印。原有附件抽取素材和旧图片均保留，未做清理删除。

## 上线前仍需确认

1. 填入已确认的销售渠道，并由负责人实际完成一次联系/接收测试。
2. 确认公开发布域名、部署方式及合作机构标识的对外展示权限。页头、页尾已使用新东方官网标识。
3. 如增加线索系统，完成真实收件验证与隐私合规检查。
4. 页面已部署至上方 Vercel 生产网址；真实销售接收与企业转化率仍未验证。
