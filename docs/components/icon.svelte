<script lang="ts">
  export let name: string
</script>

<div class="icon">
  {#await import(`../../icons/files/${name}.svg?raw`) then raw}
    {@html raw.default}
  {/await}
</div>

<style>
  .icon {
    inline-size: 56px;
    block-size: 56px;
  }
</style>
