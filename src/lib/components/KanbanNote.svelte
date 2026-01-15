<script>
    import { boardStore } from "../stores/boardStore.js";
    import NoteToolbar from "./NoteToolbar.svelte";

    let { noteId, isOverlay = false } = $props();

    // Use Svelte's auto-subscription with $ prefix
    let note = $derived($boardStore.notes[noteId] || {});
    let color = $derived(note.color || "yellow");
    let type = $derived(note.type || "text");
    let content = $derived(note.content);

    const colorMap = {
        yellow: "var(--note-yellow)",
        pink: "var(--note-pink)",
        blue: "var(--note-blue)",
        green: "var(--note-green)",
        orange: "var(--note-orange)",
        purple: "var(--note-purple)",
    };

    function handleInput(e) {
        // Only for text/bigtext types
        boardStore.updateNoteContent(noteId, e.target.innerText);
    }

    function handleChecklistChange(index, checked) {
        const newContent = [...content];
        newContent[index].done = checked;
        boardStore.updateNoteContent(noteId, newContent);
    }

    function handleChecklistText(index, text) {
        const newContent = [...content];
        newContent[index].text = text;
        boardStore.updateNoteContent(noteId, newContent);
    }

    function addChecklistItem() {
        const newContent = [
            ...(Array.isArray(content) ? content : []),
            { text: "", done: false },
        ];
        boardStore.updateNoteContent(noteId, newContent);
    }

    function removeChecklistItem(index) {
        const newContent = [...content];
        newContent.splice(index, 1);
        boardStore.updateNoteContent(noteId, newContent);
    }

    // Progress bar calculation
    let progress = $derived.by(() => {
        if (
            type !== "checklist" ||
            !Array.isArray(content) ||
            content.length === 0
        )
            return 0;
        const done = content.filter((i) => i.done).length;
        return Math.round((done / content.length) * 100);
    });
</script>

{#if note.id}
    <div
        class="kanban-note"
        class:overlay={isOverlay}
        style:background={colorMap[color] || colorMap.yellow}
        draggable={!isOverlay}
        ondragstart={(e) => {
            e.dataTransfer.setData(
                "application/json",
                JSON.stringify({ noteId }),
            );
            e.dataTransfer.effectAllowed = "move";
            e.target.classList.add("dragging-source");
        }}
        ondragend={(e) => {
            // Safe check before removing class
            if (e.target && e.target.classList) {
                e.target.classList.remove("dragging-source");
            }
        }}
    >
        {#if !isOverlay}
            <NoteToolbar {noteId} {color} {type} />
        {/if}

        <div class="note-header">
            {#if type === "checklist"}
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: {progress}%"></div>
                </div>
            {:else}
                <div class="drag-handle">
                    <span></span><span></span><span></span>
                </div>
            {/if}
        </div>

        <div class="note-body">
            {#if type === "text"}
                <div
                    class="content-editable text-mode"
                    contenteditable="true"
                    oninput={handleInput}
                    role="textbox"
                    aria-multiline="true"
                    spellcheck="false"
                >
                    {content}
                </div>
            {:else if type === "bigtext"}
                <div
                    class="content-editable big-mode"
                    contenteditable="true"
                    oninput={handleInput}
                    role="textbox"
                    spellcheck="false"
                >
                    {content}
                </div>
            {:else if type === "checklist" && Array.isArray(content)}
                <div class="checklist-container">
                    {#each content as item, i}
                        <div class="checklist-item">
                            <input
                                type="checkbox"
                                checked={item.done}
                                onchange={(e) =>
                                    handleChecklistChange(i, e.target.checked)}
                            />
                            <input
                                type="text"
                                class="checklist-input"
                                class:done={item.done}
                                value={item.text}
                                oninput={(e) =>
                                    handleChecklistText(i, e.target.value)}
                            />
                            <button
                                class="remove-item"
                                onclick={() => removeChecklistItem(i)}>×</button
                            >
                        </div>
                    {/each}
                    <button class="add-item-btn" onclick={addChecklistItem}
                        >+ Item</button
                    >
                </div>
            {:else}
                <div class="error">Invalid content</div>
            {/if}
        </div>

        {#if note.tags && note.tags.length > 0}
            <div class="tags">
                {#each note.tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}
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
        /* Ensure toolbar can overlap */
        overflow: visible;
    }

    .kanban-note:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
        z-index: 10;
    }

    .kanban-note.dragging-source {
        opacity: 0.4;
    }

    .kanban-note.overlay {
        transform: rotate(3deg);
        box-shadow: var(--shadow-lg);
        cursor: grabbing;
    }

    .note-header {
        padding: 8px 12px 0;
        min-height: 12px;
    }

    .drag-handle {
        display: flex;
        gap: 3px;
        opacity: 0.3;
    }
    .drag-handle span {
        width: 4px;
        height: 4px;
        background: black;
        border-radius: 50%;
    }

    .note-body {
        padding: 8px 12px 12px;
    }

    .content-editable {
        outline: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: var(--text-on-note);
    }

    .text-mode {
        font-size: 14px;
        line-height: 1.5;
        min-height: 40px;
    }

    .big-mode {
        font-size: 24px;
        font-weight: 800;
        line-height: 1.2;
        min-height: 60px;
        text-transform: uppercase;
        font-family: "Inter", sans-serif; /* Fallback */
    }

    /* Checklist Styles */
    .checklist-container {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .checklist-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .checklist-input {
        background: transparent;
        border: none;
        outline: none;
        flex: 1;
        font-size: 14px;
        color: var(--text-on-note);
        border-bottom: 1px solid transparent;
    }

    .checklist-input:focus {
        border-bottom-color: rgba(0, 0, 0, 0.1);
    }

    .checklist-input.done {
        text-decoration: line-through;
        opacity: 0.6;
    }

    .remove-item {
        background: none;
        border: none;
        color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        font-size: 16px;
        display: none;
    }

    .checklist-item:hover .remove-item {
        display: block;
    }

    .add-item-btn {
        background: rgba(0, 0, 0, 0.05);
        border: none;
        padding: 4px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.6);
        align-self: flex-start;
        margin-top: 4px;
    }

    .add-item-btn:hover {
        background: rgba(0, 0, 0, 0.1);
    }

    /* Progress Bar */
    .progress-bar-container {
        width: 100%;
        height: 4px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background: #2ecc71;
        transition: width 0.3s ease;
    }

    /* Tags */
    .tags {
        padding: 0 12px 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
    }

    .tag {
        font-size: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
</style>
