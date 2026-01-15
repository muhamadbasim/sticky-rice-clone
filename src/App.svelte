<script>
  import KanbanBoard from "./lib/components/KanbanBoard.svelte";
  import Toolbar from "./lib/components/Toolbar.svelte";
</script>

<main class="app">
  <KanbanBoard />
  <!-- Toolbar for branding/reset -->
  <div style="pointer-events: none; opacity: 0.5;">
    <Toolbar />
  </div>
</main>

<style>
  .app {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
