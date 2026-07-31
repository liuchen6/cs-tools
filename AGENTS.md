# cs-tools 项目约定

## 项目信息
- 项目根目录：`D:\workspace\opencode\cs-tools`
- 线上地址：https://cs-tools-56k.pages.dev/
- GitHub 私有仓库：https://github.com/liuchen6/cs-tools.git（main 分支）
- 目标自定义域名：tools.csbreakout.com（DNS 在 DNSPod，暂未配置 CNAME）
- 技术栈：Vue 3 + Vite 6 + Tailwind CSS 3 + vue-router，纯静态 SPA

## 每次改动必须执行的流程（无例外）

1. **实现**：按需求修改/新增文件
   - 新工具 = `src/data/xxx.json` + `tools-registry.js` 注册一行
   - 现有组件类型：checklist / decision-flow / graduate-path
2. **验证**：`npm run build` 必须通过
3. **发布**（用户确认后）：`npm run build` + `npx wrangler pages deploy dist --project-name cs-tools`
4. **同步代码**（每次改动后必做）：
   ```
   git add -A
   git commit -m "feat/fix: 简要描述"
   git push
   ```
   - push 需要代理：已在 git 全局配置 `http.https://github.com.proxy = http://127.0.0.1:7890`，无需额外设置
   - 不要提交 `node_modules`、`dist`（.gitignore 已配置）

## 环境注意事项
- Windows + PowerShell 5.1，执行策略限制脚本，用 `npm.cmd` 而非 `npm.ps1`（或先 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force`）
- 本机不能直连 GitHub，必须走代理 127.0.0.1:7890（系统代理已开启时 curl 可直接用）
- 开发服务器（vite dev）是临时的，终端关闭即停；用户预览完要提示启动新会话
- wrangler 已本地安装（devDependency），OAuth 已登录（1306147839@qq.com）
- Cloudflare 账号下无 csbreakout.com zone（0 zones），自定义域名需等用户在 DNSPod 加 CNAME

## 发布检查清单
- [ ] build 通过
- [ ] 线上 URL 返回 200（https://cs-tools-56k.pages.dev/）
- [ ] git commit + push 完成
