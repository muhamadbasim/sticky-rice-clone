<script>
    import { boardStore } from "../stores/boardStore.js";
    import KanbanNote from "./KanbanNote.svelte";

    let { column } = $props();

    let isDragOver = $state(false);
    let title = $derived(column.title);

    function handleTitleChange(e) {
        boardStore.updateColumnTitle(column.id, e.target.value);
    }

    function handleAddNote() {
        boardStore.addNoteToColumn(column.id);
    }

    /* --- Drag and Drop Logic --- */
    function onDragOver(e) {
        e.preventDefault(); // Necessary to allow dropping
        isDragOver = true;
        e.dataTransfer.dropEffect = "move";
    }

    function onDragLeave(e) {
        isDragOver = false;
    }

    function onDrop(e) {
        e.preventDefault();
        isDragOver = false;
        const noteId = e.dataTransfer.getData("text/plain");
        if (!noteId) return;

        // Determine existing column and index?
        // For simplicity in this version, we just append to the column on drop.
        // A more advanced version would calculate the index based on Y mouse position.

        // We need to find the source column to pass it (or store handles it)
        // Actually our store needs sourceColId.
        // Let's iterate all columns to find the note's current parent.
        // Ideally the store or drag data provides this, but search is cheap here.

        // Let's pass a special value or let the store find the source.
        // Updated store logic: find source automatically inside store.

        // Calc index: simplest is append to end.
        const newIndex = column.noteIds.length;

        // If we dropped on the column itself, find the source and move
        let sourceColId = null;
        // We can use a trick: the Store can find the note.

        // But we need to know the *source column ID* for the store function.
        // Hack: we'll search for it in the store subscription inside the store action,
        // but the `moveNote` signature asks for it.
        // Let's use a helper in BoardStore or search here.

        // Since we don't have full store access here synchronously without subscribing,
        // let's pass a "unknown" logic or update store to find it.
        // I'll update store to find sourceColId if not provided.

        // actually, let's just find it from the DOM or passing data.
        // Easier: attach source col id to drag data.
    }

    // Revised Drop Logic to use DataTransfer for Source Column
    function onDropWithSource(e) {
        e.preventDefault();
        isDragOver = false;

        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        const { noteId, sourceColId } = JSON.parse(data);

        if (sourceColId === column.id) return; // Reordering within same column (handled differently usually) or just append

        boardStore.moveNote(
            noteId,
            sourceColId,
            column.id,
            column.noteIds.length,
        );
    }
</script>

<div class="column" class:drag-over={isDragOver}>
    <div class="column-header">
        <input
            class="column-title"
            value={column.title}
            oninput={handleTitleChange}
        />
        <div class="column-actions">
            <!-- Optional: Delete Column -->
            <button
                class="icon-btn"
                onclick={() => boardStore.deleteColumn(column.id)}>×</button
            >
        </div>
    </div>

    <div
        class="column-body"
        ondragover={onDragOver}
        ondragleave={onDragLeave}
        ondrop={(e) => {
            e.preventDefault();
            isDragOver = false;

            // Retrieve data
            const rawJson = e.dataTransfer.getData("application/json");
            if (rawJson) {
                const { noteId, sourceColId } = JSON.parse(rawJson);
                boardStore.moveNote(
                    noteId,
                    sourceColId,
                    column.id,
                    column.noteIds.length,
                );
            }
        }}
    >
        {#each column.noteIds as noteId (noteId)}
            <div
                role="listitem"
                draggable="true"
                ondragstart={(e) => {
                    const data = { noteId, sourceColId: column.id };
                    e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify(data),
                    );
                    e.dataTransfer.effectAllowed = "move";
                }}
            >
                <KanbanNote {noteId} />
            </div>
        {/each}
    </div>

    <div class="column-footer">
        <button class="add-btn" onclick={handleAddNote}> + Add note </button>
    </div>
</div>

<style>
    .column {
        background: var(--bg-secondary);
        width: 280px;
        min-width: 280px;
        border-radius: var(--border-radius-md);
        display: flex;
        flex-direction: column;
        max-height: 100%;
        border: 1px solid transparent;
        transition: border-color 0.2s;
    }

    .column.drag-over {
        border-color: var(--accent-primary);
        background: rgba(108, 99, 255, 0.05);
    }

    .column-header {
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .column-title {
        background: transparent;
        border: none;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 15px;
        width: 100%;
        outline: none;
    }

    .column-title:focus {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        padding: 2px 4px;
        margin: -2px -4px;
    }

    .icon-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 18px;
        cursor: pointer;
        opacity: 0.5;
    }
    .icon-btn:hover {
        opacity: 1;
        color: #ff5555;
    }

    .column-body {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-height: 100px; /* Drop target area */
    }

    .column-footer {
        padding: 8px 12px;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .add-btn {
        width: 100%;
        padding: 8px;
        background: transparent;
        border: 1px dashed rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s;
        text-align: left;
        font-size: 14px;
    }

    .add-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.4);
        color: var(--text-primary);
    }
</style>
