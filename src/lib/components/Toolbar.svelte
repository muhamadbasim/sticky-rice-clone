<script>
    import { boardStore } from "../stores/boardStore.js";

    const colors = [
        { name: "yellow", label: "Yellow" },
        { name: "pink", label: "Pink" },
        { name: "blue", label: "Blue" },
        { name: "green", label: "Green" },
        { name: "orange", label: "Orange" },
        { name: "purple", label: "Purple" },
    ];

    const colorMap = {
        yellow: "var(--note-yellow)",
        pink: "var(--note-pink)",
        blue: "var(--note-blue)",
        green: "var(--note-green)",
        orange: "var(--note-orange)",
        purple: "var(--note-purple)",
    };

    function addNote(color) {
        boardStore.addNote(color);
    }
</script>

<div class="toolbar">
    <div class="toolbar-content">
        <div class="brand">
            <span class="logo">🍚</span>
            <span class="title">Sticky Rice</span>
        </div>

        <div class="divider"></div>

        <div class="color-picker">
            <span class="label">Add Note:</span>
            {#each colors as color}
                <button
                    class="color-btn"
                    style="background: {colorMap[color.name]}"
                    onclick={() => addNote(color.name)}
                    aria-label="Add {color.label} note"
                    title="Add {color.label} note"
                >
                    <span class="plus">+</span>
                </button>
            {/each}
        </div>

        <div class="divider"></div>

        <div class="actions">
            <button
                class="action-btn"
                onclick={() => boardStore.reset()}
                aria-label="Reset board"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <path
                        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                    />
                    <path d="M3 3v5h5" />
                </svg>
                <span>Reset</span>
            </button>
        </div>
    </div>
</div>

<style>
    .toolbar {
        position: fixed;
        bottom: var(--spacing-lg);
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
    }

    .toolbar-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-lg);
        background: var(--bg-secondary);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }

    .brand {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .logo {
        font-size: 24px;
    }

    .title {
        font-weight: 600;
        font-size: 16px;
        background: linear-gradient(
            135deg,
            var(--accent-primary),
            var(--accent-secondary)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .divider {
        width: 1px;
        height: 24px;
        background: rgba(255, 255, 255, 0.1);
    }

    .color-picker {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .label {
        font-size: 13px;
        color: var(--text-secondary);
    }

    .color-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);
        position: relative;
    }

    .color-btn:hover {
        transform: scale(1.15);
        border-color: rgba(255, 255, 255, 0.3);
    }

    .color-btn .plus {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-on-note);
        opacity: 0;
        transition: opacity var(--transition-fast);
    }

    .color-btn:hover .plus {
        opacity: 0.7;
    }

    .actions {
        display: flex;
        gap: var(--spacing-sm);
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--border-radius-sm);
        color: var(--text-secondary);
        font-size: 13px;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .action-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-color: rgba(255, 255, 255, 0.2);
    }

    .action-btn svg {
        opacity: 0.7;
    }
</style>
