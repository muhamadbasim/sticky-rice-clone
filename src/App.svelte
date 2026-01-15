<script>
  import Toolbar from "./lib/components/Toolbar.svelte";
  import KanbanBoard from "./lib/components/KanbanBoard.svelte";
  import { onMount } from "svelte";
  import { boardStore } from "./lib/stores/boardStore.js";

  let searchTerm = $state("");

  onMount(() => {
    // Any init logic
  });
</script>

<main class="app-container">
  <Toolbar bind:searchTerm />
  <KanbanBoard {searchTerm} />
</main>

<style>
  .app {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
