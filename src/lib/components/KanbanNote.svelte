<script>
    import { boardStore } from "../stores/boardStore.js";

    let { noteId, isOverlay = false } = $props();

    // Reactive derived state for the note
    let note = $state({});
    let color = $state("yellow");

    $effect(() => {
        const unsub = boardStore.subscribe((data) => {
            if (data.notes[noteId]) {
                note = data.notes[noteId];
                color = note.color;
            }
        });
        return unsub;
    });

    const colorMap = {
        yellow: "var(--note-yellow)",
        pink: "var(--note-pink)",
        blue: "var(--note-blue)",
        green: "var(--note-green)",
        orange: "var(--note-orange)",
        purple: "var(--note-purple)",
    };

    function handleInput(e) {
        boardStore.updateNoteContent(noteId, e.target.innerText);
    }

    function handleDelete() {
        boardStore.deleteNote(noteId);
    }
</script>

{#if note.id}
    <div
        class="kanban-note"
        class:overlay={isOverlay}
        style:background={colorMap[color] || colorMap.yellow}
        draggable={!isOverlay}
        ondragstart={(e) => {
            e.dataTransfer.setData("text/plain", noteId);
            e.dataTransfer.effectAllowed = "move";
            // Add a class to hide the original element or styling
            e.target.classList.add("dragging-source");
        }}
        ondragend={(e) => {
            e.target.classList.remove("dragging-source");
        }}
    >
        <div class="note-header">
            <div class="drag-handle">
                <span></span><span></span><span></span>
            </div>
            <button class="delete-btn" onclick={handleDelete}>×</button>
        </div>
        <div
            class="note-content"
            contenteditable="true"
            oninput={handleInput}
            role="textbox"
            aria-multiline="true"
        >
            {note.content}
        </div>
    </div>
{/if}

<style>
    .kanban-note {
        background: var(--note-yellow);
        border-radius: var(--border-radius-sm);
        box-shadow: var(--shadow-sm);
        margin-bottom: var(--spacing-sm);
        padding: 0;
        transition:
            transform 0.2s,
            box-shadow 0.2s;
        cursor: grab;
        position: relative;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .kanban-note:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
        z-index: 10;
    }

    .kanban-note.dragging-source {
        opacity: 0.4;
    }

    /* When reused as drag overlay */
    .kanban-note.overlay {
        transform: rotate(3deg);
        box-shadow: var(--shadow-lg);
        cursor: grabbing;
    }

    .note-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 8px 0;
    }

    .drag-handle {
        display: flex;
        gap: 3px;
    }
    .drag-handle span {
        width: 4px;
        height: 4px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
    }

    .delete-btn {
        background: none;
        border: none;
        font-size: 18px;
        line-height: 1;
        cursor: pointer;
        opacity: 0.4;
        padding: 4px;
    }
    .delete-btn:hover {
        opacity: 1;
        color: #e53935;
    }

    .note-content {
        padding: 8px 12px 16px;
        font-size: 14px;
        line-height: 1.5;
        color: var(--text-on-note);
        outline: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        min-height: 60px;
    }
</style>
