import type { Signal, QRL } from '@builder.io/qwik'

import { useOnDocument, $ } from '@builder.io/qwik'

export let useClickOutside = (
  reference: Signal<HTMLElement | undefined>,
  onClickOut: QRL<() => void>,
): void => {
  useOnDocument(
    'click',
    $(async event => {
      if (!reference.value) {
        return
      }
      let target = event.target as HTMLElement
      if (!reference.value.contains(target)) {
        await onClickOut()
      }
    }),
  )
}
