<script>
    import { boardStore } from "../stores/boardStore.js";
    import StickyNote from "./StickyNote.svelte";
</script>

<div class="canvas">
    <div class="canvas-bg">
        <div class="bg-effects">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
        </div>
        <!-- Dot pattern -->
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern
                    id="dots"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.07)" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
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
        background: #ffffff !important;
    }

    .canvas-bg {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .bg-effects {
        position: absolute;
        inset: 0;
        filter: blur(80px);
        opacity: 0.6;
    }

    .orb {
        position: absolute;
        border-radius: 50%;
        animation: float 20s ease-in-out infinite;
    }

    .orb-1 {
        top: -10%;
        left: -10%;
        width: 50vw;
        height: 50vw;
        background: radial-gradient(
            circle,
            rgba(100, 200, 255, 0.4) 0%,
            transparent 70%
        );
        animation-delay: 0s;
        opacity: 0.6;
    }

    .orb-2 {
        bottom: -20%;
        right: -10%;
        width: 60vw;
        height: 60vw;
        background: radial-gradient(
            circle,
            rgba(255, 180, 200, 0.4) 0%,
            transparent 70%
        );
        animation-delay: -5s;
        opacity: 0.5;
    }

    @keyframes float {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(30px, 50px) scale(1.1);
        }
        66% {
            transform: translate(-20px, 20px) scale(0.9);
        }
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
        backdrop-filter: blur(4px);
        padding: var(--spacing-xl);
        border-radius: var(--border-radius-lg);
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .empty-icon {
        font-size: 64px;
        margin-bottom: var(--spacing-md);
        opacity: 0.8;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }

    .empty-state h2 {
        font-size: 28px;
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
        color: var(--text-primary);
        text-shadow: none;
    }

    .empty-state p {
        font-size: 16px;
        opacity: 0.8;
    }
</style>
