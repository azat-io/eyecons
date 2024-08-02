import { component$ } from '@builder.io/qwik'

import styles from './index.module.css'

export let Logo = component$(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    class={styles.logo}
    fill="none"
  >
    <path
      d="M172.915 101.992C172.69 102.071 127.483 79.404 127.483 79.404L83.445 101.717C83.445 101.717 22 70.771 22 70.653C22 70.495 127.663 17 127.663 17C127.663 17 233.236 70.495 232.966 70.732C232.651 71.047 173.5 101.795 172.915 101.992Z"
      fill="var(--color-yellow)"
    />
    <path
      d="M123.446 239.324C123.174 241.589 17 185.464 17 185.464C17 185.464 17.181 78 17.362 78C17.543 78 78.983 109.067 78.983 109.067V154.118L124 176.883C124 176.883 123.627 238.013 123.446 239.324Z"
      fill="var(--color-green)"
    />
    <path
      d="M132.111 239.29C131.657 239.408 132.37 181.072 132.213 177.018C132.174 176.012 176.299 154.649 176.481 154.451C176.662 154.215 176.844 110.456 176.844 110.456C176.844 110.456 237.867 79.1262 238.275 79.0082C238.956 78.7712 239.001 185.702 239.001 185.702C239.001 185.702 132.474 239.25 132.111 239.29Z"
      fill="var(--color-orange)"
    />
  </svg>
))
