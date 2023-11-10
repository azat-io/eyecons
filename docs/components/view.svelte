<script lang="ts">
  import { themes } from '../../data/themes'
  import Select from './select.svelte'
  import Icons from './icons.svelte'
  import Code from './code.svelte'

  let items = themes.map(theme => ({
    label: theme.name,
    value: theme.id,
  }))

  let theme = items[0].value
</script>

<div class="view">
  <div class="icons">
    <Select options={items} bind:value={theme} />
    <Icons />
  </div>
  <Code {theme} />
</div>

<style>
  .view {
    display: grid;
    grid-template-columns: 1fr 400px;
    block-size: 100%;
  }

  .icons {
    background: var(--view-background-primary);
    color: var(--view-color-primary);
    padding: 10px;
    border-inline-end: 1px solid var(--view-border);
  }
</style>
