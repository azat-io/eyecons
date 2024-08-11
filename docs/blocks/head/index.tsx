import { useDocumentHead, useLocation } from '@builder.io/qwik-city'
import { component$ } from '@builder.io/qwik'

export const Head = component$(() => {
  let head = useDocumentHead()
  let loc = useLocation()

  return (
    <head>
      <meta charset="utf-8" />

      <title>{`${head.title} | Advanced VS Code Icon Theme`}</title>

      <link href={loc.url.href} rel="canonical" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <link rel="shortcut icon" href="/favicon.ico" sizes="32x32" />
      <link type="image/svg+xml" href="/favicon.svg" rel="icon" />
      <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      <link href={`${import.meta.env.BASE_URL}manifest.json`} rel="manifest" />

      {head.meta.map(m => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map(l => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map(s => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map(s => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </head>
  )
})
