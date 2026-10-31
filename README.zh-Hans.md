# Photo Reason Skills

简体中文 · [English](README.md)

面向摄影师的开源 Agent Skills，以 Codex 为主要安装体验，同时保留 Claude Code 和
Kimi Code 的原生插件配置。当前版本只包含 Portfolio Site Builder：从已选照片到作品集网站。

作品集建站保留为一个技能。独立的照片编辑与排序工作流，应在准备好后作为另一个技能与
技能市场条目提供；当前版本不将它列为已发布功能。已有选片和顺序由摄影师决定。

本仓库中的技能是 [Photo Reason Lab](https://www.photoreason.art/zh-hans/lab)
所展示内容的唯一来源。

## 两种协作方式

引导模式依次完成：费用 → 照片、简介与域名等材料 → 使用模板搭建 → 预览 → 发布到
Cloudflare Pages 或 Squarespace。电脑操作模式沿用同一流程，在宿主提供电脑或浏览器
控制工具、用户授权后，助手可以接手上传、域名连接等困难步骤。用户随时可以收回控制。
面向中国大陆受众时，模板网站也仍推荐 Cloudflare；实际访问效果需要从目标网络检查。

## 现有技能

| 技能 | 用途 |
| --- | --- |
| [`portfolio-site-builder`](skills/portfolio-site-builder/) | 从费用、照片编辑与排序开始，一步一步帮助摄影师发布一个三语作品集网站；不要求技术经验。 |

## 在 Mac 上添加 Codex 技能市场之前

Codex 通过 Git 下载技能市场。新 Mac 可能需要先安装 Apple 命令行工具，无需安装完整 Xcode。

1. 打开终端，运行 `git --version`。
2. 如果 macOS 提示安装开发者工具，完成安装；也可以运行 `xcode-select --install` 启动安装。
3. 再次运行 `git --version`。能显示版本号后，退出并重新打开 Codex，再添加技能市场。

`xcode-select: No developer tools were found` 发生在 Git 读取仓库之前，不能靠修改网址或
插件配置解决。如果已经安装 Xcode，先打开它并完成初始设置；若仍有问题，请按 Apple 的
说明检查当前开发者工具位置，不要使用猜测的路径。

[Apple 命令行工具安装说明](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)

### 不使用 Git

在 GitHub 点击 **Code → Download ZIP**，解压到准备长期保留的文件夹。支持本地技能市场
的 Codex CLI 可以直接添加这个文件夹，再安装插件：

```sh
codex plugin marketplace add "/完整路径/skills-main"
codex plugin add photoreason-skills@photoreason-skills
```

把示例路径换成实际解压路径。这种方式不执行 Git 克隆，也不会接收 Git 技能市场更新；
更新时需重新下载 ZIP，并添加、安装新的本地版本。请勿把 ZIP 或 JSON 网址填入 Git 市场地址栏。

## 安装

### Codex

```bash
codex plugin marketplace add photoreason/skills
```

重启 ChatGPT 桌面应用，打开 **Plugins**，选择 Photo Reason Marketplace，并安装
**Photo Reason Skills**。可以用 `$portfolio-site-builder` 明确调用，也可以直接描述
作品集任务。


### Kimi Code

若希望收到更新提示，请在 Kimi Code 中打开 Photo Reason Marketplace：

```text
/plugins marketplace https://raw.githubusercontent.com/photoreason/skills/main/.kimi-plugin/marketplace.json
```

选择 **Photo Reason Skills**，确认信任这个第三方插件，然后运行 `/reload` 或
`/new`。

如果只是快速试用，也可以直接从 GitHub 安装：

```text
/plugins install https://github.com/photoreason/skills
/reload
```

启动摄影作品集流程：

```text
/skill:portfolio-site-builder
```

也可以直接说：“请用中文一步一步帮我建立摄影作品集网站。我不懂技术，请一次只问我
一个问题。”当需求与描述匹配时，Kimi 也可能自动选择这个技能。

### Claude Code

```text
/plugin marketplace add photoreason/skills
/plugin install photoreason-skills@photoreason-skills
```

### Gemini CLI

使用仓库中的 `gemini-extension.json` 将本仓库安装为扩展。

### Cursor

在 Cursor 的插件管理器中添加 `github.com/photoreason/skills`。插件清单位于
`.cursor-plugin/plugin.json`。

### OpenCode 与 Pi

- OpenCode：参见 [`.opencode/INSTALL.md`](.opencode/INSTALL.md)。
- Pi：加载 `.pi/extensions/photoreason-skills.ts` 扩展。

## 更新与版本管理

发布版本遵循[语义化版本](https://semver.org/lang/zh-CN/)：

- **补丁版本**（`0.1.1`）：不改变使用流程的修复与文字改进。
- **次版本**（`0.2.0`）：新增技能或向后兼容的重要功能。
- **主版本**（`1.0.0` → `2.0.0`）：要求用户调整安装或使用方式的变更。

Kimi Code 不会在后台静默替换已安装的第三方插件。通过 Marketplace 安装时，Kimi
可以显示更新标记；过期插件被使用后，也可以给出一次更新提示。用户确认更新后运行
`/reload` 或 `/new` 即可生效。直接通过 GitHub 安装的用户，可以再次运行安装命令
来更新。

各客户端的更新方式：

| 客户端 | 更新方式 |
| --- | --- |
| **Kimi Code** | Marketplace 安装可以显示更新标记，并在使用过期插件后给出一次提示；用户确认后重新加载。 |
| **Claude Code** | 支持启动时自动更新 Marketplace 与插件。第三方 Marketplace 默认关闭自动更新；可在 `/plugin` → **Marketplaces** 中开启。更新后 Claude 会提示运行 `/reload-plugins`。 |
| **Codex** | 运行 `codex plugin marketplace upgrade photoreason-skills` 刷新来源，再在 Plugins 界面应用更新。 |
| **Cursor、Gemini、OpenCode、Pi** | 使用相同的版本化文件，但更新检测与安装取决于各客户端；Photo Reason 发布新版本后请检查或重新安装。 |

所有平台清单共享同一个发布版本。因此即使更新界面不同，同一次 Photo Reason Release
在各支持客户端中对应相同的技能内容。

维护者每次正式发布时应当：

1. 更新 `.version-bump.json` 中列出的全部版本字段。
2. 运行 `pnpm sync:plugins` 和完整测试。
3. 提交版本变更、建立 `vX.Y.Z` 标签，并发布 GitHub Release。

普通 commit 不自动升级公开版本；只有经过测试、准备发布的版本才会触发用户更新提示。

## 仓库结构

```text
skills/<name>/
├── SKILL.md        可跨平台使用的工作流元数据与说明
├── registry.yaml   Photo Reason Lab 使用的展示信息
└── …               可选的 references、templates 与 assets
```

Registry 生成器会把 `skills/*/` 转换为需要一同提交的 `registry.json`：

```bash
pnpm install
pnpm build:registry
pnpm validate:registry
pnpm test
pnpm sync:plugins
```

## 参与贡献

欢迎贡献代码、技能和摄影师的实际使用反馈。提交 Pull Request 前请阅读
[CONTRIBUTING.md](CONTRIBUTING.md) 与[行为准则](CODE_OF_CONDUCT.md)。

## 安全问题

如果怀疑存在安全漏洞，请不要创建公开 Issue。请先阅读
[SECURITY.md](SECURITY.md)，并通过
[contact@photoreason.com](mailto:contact@photoreason.com) 私下联系我们。

## 许可证

[MIT](LICENSE) © Photo Reason。
