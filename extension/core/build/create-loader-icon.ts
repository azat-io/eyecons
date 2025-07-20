/** Options for configuring the loader icon. */
interface LoaderIconOptions {
  /** Radius of the loader circles. Default: 6. */
  circleRadius?: number

  /** Duration of the animation in seconds. Default: 1. */
  duration?: number

  /** Color of the loader circles. Default: '#636363'. */
  color?: string
}

/**
 * Creates an animated SVG loader icon for use during the icon generation
 * process. The loader is displayed while the theme is being built.
 *
 * @param {LoaderIconOptions} [options] - Options to customize the loader
 *   appearance.
 * @returns {string} SVG string containing an animated loader icon.
 */
export function createLoaderIcon(options: LoaderIconOptions = {}): string {
  let color = options.color ?? '#636363'
  let circleRadius = options.circleRadius ?? 6
  let duration = options.duration ?? 1

  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      viewBox="0 0 100 100"
    >
      <g transform="translate(80,50)">
        <g transform="rotate(0)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="1">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.875s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.875s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(71.21320343559643,71.21320343559643)">
        <g transform="rotate(45)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.875">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.75s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.75s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(50,80)">
        <g transform="rotate(90)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.75">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.625s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.625s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(28.786796564403577,71.21320343559643)">
        <g transform="rotate(135)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.625">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.5s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.5s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(20,50.00000000000001)">
        <g transform="rotate(180)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.5">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.375s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.375s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(28.78679656440357,28.786796564403577)">
        <g transform="rotate(225)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.375">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.25s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.25s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(49.99999999999999,20)">
        <g transform="rotate(270)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.25">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="-0.125s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="-0.125s"
            ></animate>
          </circle>
        </g>
      </g>
      <g transform="translate(71.21320343559643,28.78679656440357)">
        <g transform="rotate(315)">
          <circle cx="0" cy="0" r="${circleRadius}" fill="${color}" fill-opacity="0.125">
            <animateTransform
              attributeName="transform"
              type="scale"
              begin="0s"
              values="1.5 1.5;1 1"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
            ></animateTransform>
            <animate
              attributeName="fill-opacity"
              keyTimes="0;1"
              dur="${duration}s"
              repeatCount="indefinite"
              values="1;0"
              begin="0s"
            ></animate>
          </circle>
        </g>
      </g>
    </svg>
  `
}
