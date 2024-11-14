export interface Theme {
  semanticHighlighting: boolean
  tokenColors: TokenColor[]
  $schema: string
  colors: Colors
  name: string
  type: string
}

export interface ThemeData {
  overrides: Record<string, Record<string, string>>
  colors: string[]
}

export interface Colors {
  'gitDecoration.conflictingResourceForeground': string
  'gitDecoration.untrackedResourceForeground': string
  'gitDecoration.modifiedResourceForeground': string
  'gitDecoration.deletedResourceForeground': string
  'gitDecoration.ignoredResourceForeground': string
  'peekViewEditor.matchHighlightBackground': string
  'peekViewResult.matchHighlightBackground': string
  'editorOverviewRuler.modifiedForeground': string
  'editorOverviewRuler.deletedForeground': string
  'editorOverviewRuler.warningForeground': string
  'gitDecoration.addedResourceForeground': string
  'minimap.selectionOccurrenceHighlight': string
  'editorOverviewRuler.addedForeground': string
  'editorOverviewRuler.errorForeground': string
  'notificationCenterHeader.background': string
  'notificationCenterHeader.foreground': string
  'editor.inactiveSelectionBackground': string
  'editorOverviewRuler.infoForeground': string
  'editorLineNumber.activeForeground': string
  'statusBarItem.prominentBackground': string
  'editorGroupHeader.tabsBackground': string
  'editorGutter.modifiedBackground': string
  'button.secondaryHoverBackground': string
  'sideBarSectionHeader.background': string
  'sideBarSectionHeader.foreground': string
  'welcomePage.progress.foreground': string
  'editorGutter.deletedBackground': string
  'activityBar.inactiveForeground': string
  'settings.modifiedItemIndicator': string
  'statusBarItem.remoteBackground': string
  'statusBarItem.remoteForeground': string
  'statusBar.debuggingBackground': string
  'panelTitle.inactiveForeground': string
  'statusBar.debuggingForeground': string
  'editorGutter.addedBackground': string
  'terminal.selectionBackground': string
  'statusBar.noFolderBackground': string
  'editorGroupHeader.tabsBorder': string
  'inputOption.activeBackground': string
  'tab.unfocusedActiveBorderTop': string
  'tab.unfocusedHoverBackground': string
  'activityBarBadge.background': string
  'activityBarBadge.foreground': string
  'chat.slashCommandBackground': string
  'chat.slashCommandForeground': string
  'editorLineNumber.foreground': string
  'input.placeholderForeground': string
  'panelTitle.activeForeground': string
  'settings.dropdownBackground': string
  'sideBarSectionHeader.border': string
  'titleBar.inactiveBackground': string
  'titleBar.inactiveForeground': string
  'editor.selectionBackground': string
  'terminal.ansiBrightMagenta': string
  'button.secondaryBackground': string
  'button.secondaryForeground': string
  'editor.findMatchBackground': string
  'editorOverviewRuler.border': string
  'keybindingLabel.foreground': string
  'welcomePage.tileBackground': string
  'terminalCursor.foreground': string
  'terminal.ansiBrightYellow': string
  'peekViewEditor.background': string
  'peekViewResult.background': string
  'settings.headerForeground': string
  'statusBarItem.focusBorder': string
  'tab.unfocusedActiveBorder': string
  'terminal.tab.activeBorder': string
  'textBlockQuote.background': string
  'textLink.activeForeground': string
  'titleBar.activeBackground': string
  'titleBar.activeForeground': string
  'editorWarning.foreground': string
  'terminal.ansiBrightBlack': string
  'terminal.ansiBrightGreen': string
  'terminal.ansiBrightWhite': string
  'activityBar.activeBorder': string
  'inputOption.activeBorder': string
  'menu.selectionBackground': string
  'notifications.background': string
  'notifications.foreground': string
  'textCodeBlock.background': string
  'textPreformat.foreground': string
  'textPreformat.background': string
  'textSeparator.foreground': string
  'sideBarTitle.foreground': string
  'terminal.ansiBrightBlue': string
  'terminal.ansiBrightCyan': string
  'debugToolBar.background': string
  'dropdown.listBackground': string
  'editorWidget.background': string
  'panelTitle.activeBorder': string
  'settings.dropdownBorder': string
  'editorError.foreground': string
  'terminal.ansiBrightRed': string
  'activityBar.background': string
  'activityBar.foreground': string
  'button.hoverBackground': string
  'progressBar.background': string
  'tab.inactiveBackground': string
  'tab.inactiveForeground': string
  'editorInfo.foreground': string
  'quickInput.background': string
  'quickInput.foreground': string
  'statusBar.focusBorder': string
  'tab.selectedBorderTop': string
  'textBlockQuote.border': string
  'editorWarning.border': string
  'terminal.ansiMagenta': string
  'statusBar.background': string
  'notifications.border': string
  'statusBar.foreground': string
  'tab.activeBackground': string
  'tab.activeForeground': string
  'list.dropBackground': string
  'terminal.background': string
  'terminal.foreground': string
  'terminal.ansiYellow': string
  'checkbox.background': string
  descriptionForeground: string
  'dropdown.background': string
  'dropdown.foreground': string
  'tab.activeBorderTop': string
  'tab.hoverBackground': string
  'textLink.foreground': string
  'editorError.border': string
  'terminal.ansiBlack': string
  'terminal.ansiGreen': string
  'terminal.ansiWhite': string
  'activityBar.border': string
  'editorGroup.border': string
  'pickerGroup.border': string
  'sideBar.background': string
  'sideBar.foreground': string
  'editor.background': string
  'editor.foreground': string
  'editorInfo.border': string
  'terminal.ansiBlue': string
  'terminal.ansiCyan': string
  'button.background': string
  'button.foreground': string
  'panelInput.border': string
  'terminal.ansiRed': string
  'badge.background': string
  'badge.foreground': string
  'input.background': string
  'input.foreground': string
  'panel.background': string
  'statusBar.border': string
  'tab.activeBorder': string
  'checkbox.border': string
  'dropdown.border': string
  'icon.foreground': string
  'menu.background': string
  'titleBar.border': string
  'sideBar.border': string
  'button.border': string
  errorForeground: string
  'widget.border': string
  'input.border': string
  'panel.border': string
  'tab.border': string
  focusBorder: string
  foreground: string
}

export interface TokenColor {
  settings: Settings
  scope: string[]
  name?: string
}

export interface Settings {
  foreground?: string
  fontStyle?: string
}
