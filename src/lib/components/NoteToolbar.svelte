<script>
    import { boardStore } from "../stores/boardStore.js";

    let { noteId, color, type } = $props();

    let showColors = $state(false);
    let showTypes = $state(false);

    const colors = [
        { name: "yellow", bg: "var(--note-yellow)" },
        { name: "pink", bg: "var(--note-pink)" },
        { name: "blue", bg: "var(--note-blue)" },
        { name: "green", bg: "var(--note-green)" },
        { name: "orange", bg: "var(--note-orange)" },
        { name: "purple", bg: "var(--note-purple)" },
    ];

    const types = [
        { id: "text", label: "📝 Teks" },
        { id: "checklist", label: "✅ List" },
        { id: "bigtext", label: "📢 Teriak" },
    ];

    function handleColorChange(newColor) {
        boardStore.updateNoteColor(noteId, newColor);
        showColors = false;
    }

    function handleTypeChange(newType) {
        boardStore.updateNoteType(noteId, newType);
        showTypes = false;
    }

    function handleDelete() {
        if (confirm("Yakin mau hapus?")) {
            boardStore.deleteNote(noteId);
        }
    }
</script>

<div class="note-toolbar" role="toolbar" onclick={(e) => e.stopPropagation()}>
    <!-- Type Switcher -->
    <div class="tool-group">
        <button
            class="tool-btn"
            onclick={() => (showTypes = !showTypes)}
            title="Ganti Tipe"
        >
            {types.find((t) => t.id === type)?.label.split(" ")[0] || "📝"}
        </button>
        {#if showTypes}
            <div class="popover types-popover">
                {#each types as t}
                    <button
                        class="popover-item"
                        onclick={() => handleTypeChange(t.id)}
                    >
                        {t.label}
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Color Picker -->
    <div class="tool-group">
        <button
            class="tool-btn"
            onclick={() => (showColors = !showColors)}
            title="Ganti Warna"
        >
            🎨
        </button>
        {#if showColors}
            <div class="popover colors-popover">
                {#each colors as c}
                    <button
                        class="color-dot"
                        style="background: {c.bg}"
                        onclick={() => handleColorChange(c.name)}
                        aria-label={c.name}
                    ></button>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Delete -->
    <button class="tool-btn delete" onclick={handleDelete} title="Hapus">
        🗑️
    </button>
</div>

<style>
    .note-toolbar {
        display: flex;
        gap: 4px;
        background: rgba(0, 0, 0, 0.8);
        padding: 4px;
        border-radius: 6px;
        position: absolute;
        top: -35px;
        right: 0;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s;
        pointer-events: none;
        z-index: 100;
        backdrop-filter: blur(4px);
    }

    :global(.kanban-note:hover) .note-toolbar {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
    }

    .tool-btn {
        background: transparent;
        border: none;
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }

    .tool-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .tool-btn.delete:hover {
        background: #ff4757;
    }

    .popover {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #2f3542;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 6px;
        border-radius: 6px;
        display: flex;
        gap: 4px;
        margin-top: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        min-width: max-content;
    }

    .types-popover {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .popover-item {
        background: transparent;
        border: none;
        color: white;
        padding: 4px 8px;
        width: 100%;
        text-align: left;
        cursor: pointer;
        border-radius: 4px;
        font-size: 13px;
    }

    .popover-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .color-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        cursor: pointer;
    }
    .color-dot:hover {
        transform: scale(1.1);
        border-color: white;
    }
</style>
