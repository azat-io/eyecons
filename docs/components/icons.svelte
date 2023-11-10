<script lang="ts">
  import { fileIcons } from '../../data/icons-files'
  import Icon from './icon.svelte'
</script>

<ul class="list">
  {#each fileIcons as icon}
    <li class="item">
      <Icon name={icon.id} />
      <p class="icon-name">{icon.name}</p>
    </li>
  {/each}
</ul>

<style>
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 56px);
    gap: 16px;
    padding-inline-start: 0;
    margin-block: 16px;
    list-style-type: none;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .icon-name {
    font-size: 12px;
    margin-block: 0;
  }
</style>
