# Eyecons

<img
  src="https://raw.githubusercontent.com/azat-io/eyecons/main/assets/logo.png"
  alt="Eyecons logo"
  align="right"
  height="160"
  width="160"
/>

[![Version](https://img.shields.io/visual-studio-marketplace/v/azat-io.eyecons?color=07af62&labelColor=151B23)](https://marketplace.visualstudio.com/items?itemName=azat-io.eyecons)
[![Code Coverage](https://img.shields.io/codecov/c/github/azat-io/eyecons.svg?color=07af62&labelColor=151B23)](https://npmjs.com/package/eyecons)
[![GitHub License](https://img.shields.io/badge/license-MIT-232428.svg?color=07af62&labelColor=151B23)](https://github.com/azat-io/eyecons/blob/main/license.md)

VS Code icon theme with adaptive icon colors that match the editor’s color theme.

Eyecons icon theme provides a dynamic and visually appealing experience by adapting icon colours to your editor's theme.

This creates a consistent and harmonious look across your dev environment.

## Why

- **Adaptive Colors:** Icons change colors based on the active VSCode theme, providing a cohesive visual experience.

- **Wide Icon Coverage:** Supports a comprehensive range of file types and technologies with distinctive icons.

- **Regular Updates:** Frequent updates to include new icons and improvements.

## Examples

See [docs](https://eyecons.dev).

### Nord

![Eyecons example for Nord theme](https://raw.githubusercontent.com/azat-io/eyecons/main/assets/nord.webp)

### Monokai Pro

![Eyecons example for Monokai Pro theme](https://raw.githubusercontent.com/azat-io/eyecons/main/assets/monokai-pro.webp)

### Gruvbox Dark

![Eyecons example for Gruvbox Dark theme](https://raw.githubusercontent.com/azat-io/eyecons/main/assets/gruvbox-dark.webp)

### Vitesse Dark

![Eyecons example for Vitesse Dark theme](https://raw.githubusercontent.com/azat-io/eyecons/main/assets/vitesse-dark.webp)

Look for more examples of icon theme integration with editor color themes on [the extension's website](https://eyecons.dev).

## Installation

Open the extension page on [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=azat-io.eyecons) and click the "Install" button.

Or install the extension using the command line:

```sh
code --install-extension azat-io.eyecons
```

## Configuration

You can customize the extension to suit your needs!

### Theme

You can choose your favorite color theme whose colors will be used to repaint the icons.

Or leave the value "inherit" to determine the color theme of the editor automatically.

### Folder Color

You can define the colors of the folders. Select one of the six possible options.

All folders use the colors of your color theme.

### Hide Explorer Arrows

If the option is enabled, arrows will additionally be displayed in the document tree. This can be useful to visually identify folders more quickly and distinguish them from regular files.

### Configuration via settings.json

You can also configure the extension directly in your VS Code `settings.json` file:

```json
{
  "eyecons.theme": "inherit",
  "eyecons.folderColor": "yellow",
  "eyecons.hidesExplorerArrows": true
}
```

Available settings:

- `eyecons.theme`: Set your preferred theme (e.g., "inherit", "gruvbox-dark", "nord")
- `eyecons.folderColor`: Choose folder color (available options depend on the theme)
- `eyecons.hidesExplorerArrows`: Set to true/false to show/hide explorer arrows

## Themes

The extension currently supports the following color themes:

- [2077](https://github.com/endormi/vscode-2077-theme)
- [Adwaita Dark](https://github.com/piousdeer/vscode-adwaita)
- [Adwaita Light](https://github.com/piousdeer/vscode-adwaita)
- [Alabaster](https://github.com/tonsky/vscode-theme-alabaster)
- [Atom One Dark](https://github.com/akamud/vscode-theme-onedark)
- [Aura](https://github.com/daltonmenezes/aura-theme)
- [Ayu Dark](https://github.com/ayu-theme/vscode-ayu)
- [Ayu Light](https://github.com/ayu-theme/vscode-ayu)
- [Catppuccin Mocha](https://github.com/catppuccin/vscode)
- [Cobalt 2](https://github.com/wesbos/cobalt2-vscode)
- [Dark (Visual Studio)](https://github.com/microsoft/vscode)
- [Dracula](https://github.com/dracula/visual-studio-code)
- [GitHub Dark](https://github.com/primer/github-vscode-theme)
- [GitHub Light](https://github.com/primer/github-vscode-theme)
- [Gruvbox Dark](https://github.com/jdinhify/vscode-theme-gruvbox)
- [Gruvbox Light](https://github.com/jdinhify/vscode-theme-gruvbox)
- [Houston](https://github.com/withastro/houston-vscode)
- [Matcha](https://github.com/lucafalasco/matcha)
- [Monokai Pro](https://github.com/Monokai/monokai-pro-vscode)
- [Night Owl](https://github.com/sdras/night-owl-vscode-theme)
- [Nord](https://github.com/nordtheme/visual-studio-code)
- [One Monokai](https://github.com/azemoh/vscode-one-monokai)
- [Panda](https://github.com/tinkertrain/panda-syntax-vscode)
- [Solarized Dark](https://github.com/ryanolsonx/vscode-solarized-theme)
- [Solarized Light](https://github.com/ryanolsonx/vscode-solarized-theme)
- [Synthwave '84](https://github.com/robb0wen/synthwave-vscode)
- [Tokyo Night](https://github.com/tokyo-night/tokyo-night-vscode-theme)
- [Vitesse Dark](https://github.com/antfu/vscode-theme-vitesse)
- [Vitesse Light](https://github.com/antfu/vscode-theme-vitesse)

Haven't found your favorite color theme? [Create an issue!](https://github.com/azat-io/eyecons/issues/new?assignees=&labels=feature&projects=&template=theme-request.yml&title=Theme+Request%3A+%28fill+in%29)

## Contributing

See [Contributing Guide](https://github.com/azat-io/eyecons/blob/main/contributing.md).

You can also support this project by giving this repository a star on GitHub or rate this extension with five stars on [Marketplace](https://marketplace.visualstudio.com/items?itemName=azat-io.eyecons).

## License

MIT &copy; [Azat S.](https://azat.io)
