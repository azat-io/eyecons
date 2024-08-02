import type { Signal, QRL } from '@builder.io/qwik'

import { useOnDocument, $ } from '@builder.io/qwik'

export let useClickOutside = (
  ref: Signal<HTMLElement | undefined>,
  onClickOut: QRL<() => void>,
) => {
  useOnDocument(
    'click',
    $(event => {
      if (!ref.value) {
        return
      }
      let target = event.target as HTMLElement
      if (!ref.value.contains(target)) {
        onClickOut()
      }
    }),
  )
}
