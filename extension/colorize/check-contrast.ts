import { wcagContrast } from 'culori'

interface SvgInfo {
  background: string
  foreground: string
}

export let checkContrast = ({ background, foreground }: SvgInfo): boolean =>
  wcagContrast(background, foreground) > 1.25
