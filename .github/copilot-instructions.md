# Copilot Instructions for k-poll (React + Vite)

## 项目架构
- 本项目基于 [Vite](https://vitejs.dev/) 构建，主入口为 `src/main.jsx`，核心组件在 `src/App.jsx`。
- 采用 React 19，所有页面和组件均为函数组件，Hooks 用于状态和生命周期管理。
- 页面结构在 `src/pages/`，通用组件在 `src/componnets/`（注意拼写）。
- 静态资源放在 `public/` 和 `src/assets/`。

## 关键开发流程
- 启动开发环境：`npm run dev` 或 `yarn dev`，自动热重载。
- 构建生产包：`npm run build`。
- 预览生产包：`npm run preview`。
- 代码检查：`npm run lint`，ESLint 配置见 `eslint.config.js`，已启用 React Hooks 和 Vite 专用规则。

## 重要约定与模式
- 组件必须为函数组件，Hooks 只能在组件或自定义 Hook 内调用。
- 遵循 ESLint 规则，未使用变量允许以大写或下划线开头（见 `varsIgnorePattern`）。
- 路由建议使用 `react-router-dom`，但请确保 `BrowserRouter` 只在顶层组件内包裹。
- 入口文件 `main.jsx` 应只渲染一个根组件（如 `<App />`），避免多重 React 实例。
- 避免在 `public/` 之外引用静态资源，统一管理。

## 常见集成点
- Vite 插件：`@vitejs/plugin-react` 用于 HMR 和 Babel 支持。
- ESLint 插件：`eslint-plugin-react-hooks`、`eslint-plugin-react-refresh`。
- TypeScript 支持可参考 Vite 官方 TS 模板（当前未启用）。

## 典型问题与排查
- "Invalid hook call" 错误通常因 Hooks 用法不当、React 版本冲突或多重 React 实例导致。确保依赖版本一致，且只安装一个 React。
- 若遇到热重载异常，优先检查 Vite 插件和入口文件结构。

## 参考文件
- `src/App.jsx`、`src/main.jsx`：主入口与根组件结构范例。
- `vite.config.js`：Vite 配置与插件集成。
- `eslint.config.js`：代码规范与自定义规则。
- `README.md`：简要项目说明。

---
如需补充项目约定或遇到不明确的结构，请在此文件补充说明。
