export let themes = [
  {
    name: '2077',
    id: '2077',
  },
  {
    name: 'Adwaita Dark',
    id: 'adwaita-dark',
  },
  {
    name: 'Adwaita Light',
    id: 'adwaita-light',
  },
  {
    name: 'Atom One Dark',
    id: 'atom-one-dark',
  },
  {
    aliases: ['pustota'],
    name: 'Ayu Dark',
    id: 'ayu-dark',
  },
  {
    name: 'Ayu Light',
    id: 'ayu-light',
  },
  {
    aliases: ['Catppuccin Frappé', 'Catppuccin Macchiato'],
    name: 'Catppuccin Mocha',
    id: 'catppuccin-mocha',
  },
  {
    name: 'Cobalt 2',
    id: 'cobalt-2',
  },
  {
    name: 'Dark (Visual Studio)',
    id: 'dark',
  },
  {
    name: 'Dracula',
    id: 'dracula',
  },
  {
    name: 'GitHub Dark',
    id: 'github-dark',
  },
  {
    name: 'GitHub Light',
    id: 'github-light',
  },
  {
    name: 'Gruvbox Dark',
    id: 'gruvbox-dark',
  },
  {
    name: 'Gruvbox Light',
    id: 'gruvbox-light',
  },
  {
    name: 'Houston',
    id: 'houston',
  },
  {
    name: 'Matcha',
    id: 'matcha',
  },
  {
    name: 'Monokai Pro',
    id: 'monokai-pro',
  },
  {
    name: 'Night Owl',
    id: 'night-owl',
  },
  {
    name: 'Nord',
    id: 'nord',
  },
  {
    name: 'One Monokai',
    id: 'one-monokai',
  },
  {
    name: 'Panda',
    id: 'panda',
  },
  {
    name: 'SynthWave 84',
    id: 'synthwave-84',
  },
  {
    name: 'Tokyo Night',
    id: 'tokyo-night',
  },
  {
    aliases: ['Vitesse Black'],
    name: 'Vitesse Dark',
    id: 'vitesse-dark',
  },
  {
    name: 'Vitesse Light',
    id: 'vitesse-light',
  },
]

export let getThemeNameById = (id: string): string => {
  let theme = themes.find(themeValue => themeValue.id === id)
  return theme ? theme.name : ''
}
