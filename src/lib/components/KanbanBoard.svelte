<script>
    import { boardStore } from "../stores/boardStore.js";
    import Column from "./Column.svelte";

    let columns = $state([]);

    $effect(() => {
        const unsub = boardStore.subscribe((data) => {
            columns = data.columns;
        });
        return unsub;
    });

    function addColumn() {
        boardStore.addColumn();
    }
</script>

<div class="kanban-board">
    <div class="board-content">
        {#each columns as column (column.id)}
            <Column {column} />
        {/each}

        <button class="new-column-btn" onclick={addColumn}>
            + New Column
        </button>
    </div>
</div>

<style>
    .kanban-board {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        padding: 24px;
        background: var(--bg-canvas);
        /* Grid pattern overlay */
        background-image: linear-gradient(
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
            ),
            linear-gradient(
                90deg,
                rgba(255, 255, 255, 0.03) 1px,
                transparent 1px
            );
        background-size: 40px 40px;
    }

    .board-content {
        display: flex;
        gap: 16px;
        height: 100%;
        align-items: flex-start;
    }

    .new-column-btn {
        min-width: 280px;
        height: 50px;
        background: rgba(255, 255, 255, 0.02);
        border: 1px dashed rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-md);
        color: var(--text-secondary);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .new-column-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.3);
        color: var(--text-primary);
    }
</style>
