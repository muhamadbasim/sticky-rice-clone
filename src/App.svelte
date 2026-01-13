<script>
  import Canvas from "./lib/components/Canvas.svelte";
  import Toolbar from "./lib/components/Toolbar.svelte";
</script>

<main class="app">
  <Canvas />
  <Toolbar />
</main>

<style>
  .app {
    width: 100%;
    height: 100vh;
    position: relative;
    overflow: hidden;
  }
</style>
