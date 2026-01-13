<script>
    import { boardStore } from "../stores/boardStore.js";
    import StickyNote from "./StickyNote.svelte";
</script>

<div class="canvas">
    <div class="canvas-bg">
        <!-- Grid pattern -->
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(255,255,255,0.03)"
                        stroke-width="1"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
    </div>

    <div class="notes-container">
        {#each $boardStore as note (note.id)}
            <StickyNote {note} />
        {/each}
    </div>

    {#if $boardStore.length === 0}
        <div class="empty-state">
            <div class="empty-icon">📝</div>
            <h2>No notes yet</h2>
            <p>Click a color button below to add your first sticky note!</p>
        </div>
    {/if}
</div>

<style>
    .canvas {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        background: var(--bg-canvas);
    }

    .canvas-bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .notes-container {
        position: absolute;
        inset: 0;
        padding: var(--spacing-lg);
    }

    .empty-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: var(--text-secondary);
        pointer-events: none;
    }

    .empty-icon {
        font-size: 64px;
        margin-bottom: var(--spacing-md);
        opacity: 0.5;
    }

    .empty-state h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
        opacity: 0.7;
    }

    .empty-state p {
        font-size: 14px;
        opacity: 0.6;
    }
</style>
