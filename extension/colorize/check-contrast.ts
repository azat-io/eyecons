import { wcagContrast } from 'culori'

interface SvgInfo {
  background: string
  foreground: string
}

export let checkContrast = ({ background, foreground }: SvgInfo) =>
  wcagContrast(background, foreground) > 1.25
