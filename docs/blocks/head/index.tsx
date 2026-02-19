import { useDocumentHead, useLocation } from '@builder.io/qwik-city'
import { component$ } from '@builder.io/qwik'

export let Head = component$(() => {
  let head = useDocumentHead()
  let loc = useLocation()

  return (
    <head>
      <meta charset="utf-8" />

      <title>{`${head.title} | Advanced VS Code Icon Theme`}</title>

      <link
        href={loc.url.href}
        rel="canonical"
      />
      <meta
        content="width=device-width, initial-scale=1.0"
        name="viewport"
      />
      <link
        rel="shortcut icon"
        href="/favicon.ico"
        sizes="32x32"
      />
      <link
        type="image/svg+xml"
        href="/favicon.svg"
        rel="icon"
      />
      <link
        href="/apple-touch-icon.png"
        rel="apple-touch-icon"
      />
      <link
        href={`${import.meta.env.BASE_URL}manifest.json`}
        rel="manifest"
      />

      {head.meta.map(meta => (
        <meta
          key={meta.key}
          {...meta}
        />
      ))}

      {head.links.map(link => (
        <link
          key={link.key}
          {...link}
        />
      ))}

      {head.styles.map(style => (
        <style
          key={style.key}
          {...style.props}
          {...(style.props?.dangerouslySetInnerHTML ?
            {}
          : { dangerouslySetInnerHTML: style.style })}
        />
      ))}

      {head.scripts.map(script => (
        <script
          key={script.key}
          {...script.props}
          {...(script.props?.dangerouslySetInnerHTML ?
            {}
          : { dangerouslySetInnerHTML: script.script })}
        />
      ))}
    </head>
  )
})
