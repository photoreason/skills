# Installing Photo Reason Skills for OpenCode

## Prerequisites

- [OpenCode.ai](https://opencode.ai) installed

## Installation

Add the plugin to the `plugin` array in your `opencode.json` (global or project-level):

```json
{
  "plugin": ["photoreason-skills@git+https://github.com/photoreason/skills.git"]
}
```

Restart OpenCode. The plugin registers the skills directory through OpenCode's
plugin manager.

Verify with OpenCode's native `skill` tool:

```
use skill tool to list skills
use skill tool to load portfolio-site-builder
```

## Updating

OpenCode installs through a git-backed package spec. If updates don't appear
after a restart, clear OpenCode's package cache or reinstall the plugin. To pin
a version:

```json
{
  "plugin": ["photoreason-skills@git+https://github.com/photoreason/skills.git#v0.1.0"]
}
```

## Getting help

- Issues: https://github.com/photoreason/skills/issues
