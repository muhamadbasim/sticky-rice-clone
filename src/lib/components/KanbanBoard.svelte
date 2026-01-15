<script>
    import { boardStore } from "../stores/boardStore.js";
    import Column from "./Column.svelte";

    let { searchTerm = "" } = $props();

    let columns = $derived($boardStore.columns);
    let notes = $derived($boardStore.notes);

    // Filter logic
    let fileteredColumns = $derived(
        columns.map((col) => {
            if (!searchTerm) return col;

            const filteredNoteIds = col.noteIds.filter((id) => {
                const note = notes[id];
                if (!note) return false;

                const lowerTerm = searchTerm.toLowerCase();
                const contentMatch =
                    typeof note.content === "string"
                        ? note.content.toLowerCase().includes(lowerTerm)
                        : Array.isArray(note.content)
                          ? // Search in checklist items
                            note.content.some((i) =>
                                i.text.toLowerCase().includes(lowerTerm),
                            )
                          : false; // Should not happen for BigText stored as string

                // Search tags
                const tagMatch =
                    note.tags &&
                    note.tags.some((tag) =>
                        tag.toLowerCase().includes(lowerTerm),
                    );

                return contentMatch || tagMatch;
            });

            return { ...col, noteIds: filteredNoteIds };
        }),
    );

    function addColumn() {
        boardStore.addColumn();
    }
</script>

<div class="kanban-board">
    <div class="board-content">
        {#each fileteredColumns as column (column.id)}
            <Column {column} />
        {/each}

        <button class="new-column-btn" onclick={addColumn}>
            + Nambah Beban
        </button>
    </div>
</div>

<style>
    .kanban-board {
        width: 100%;
        height: 100%;
        overflow-x: auto;
        padding: 24px;
        /* Gen Z Aesthetic: Dark Aura / Mesh Gradient */
        background: #0f0c29;
        background: linear-gradient(
            135deg,
            #0f0c29 0%,
            #302b63 50%,
            #24243e 100%
        );
        background-size: 400% 400%;
        animation: gradientBG 15s ease infinite;
    }

    @keyframes gradientBG {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
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
