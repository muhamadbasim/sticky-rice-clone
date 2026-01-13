<script>
  import { boardStore } from "../stores/boardStore.js";

  let { note } = $props();

  let isDragging = $state(false);
  let isEditing = $state(false);
  let dragOffset = { x: 0, y: 0 };
  let noteElement;

  const colorMap = {
    yellow: "var(--note-yellow)",
    pink: "var(--note-pink)",
    blue: "var(--note-blue)",
    green: "var(--note-green)",
    orange: "var(--note-orange)",
    purple: "var(--note-purple)",
  };

  function handlePointerDown(e) {
    if (isEditing) return;
    if (e.target.closest(".note-content")) return;

    isDragging = true;
    boardStore.bringToFront(note.id);

    const rect = noteElement.getBoundingClientRect();
    dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    noteElement.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!isDragging) return;

    const canvas = noteElement.parentElement;
    const canvasRect = canvas.getBoundingClientRect();

    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    const clampedX = Math.max(0, Math.min(newX, canvasRect.width - note.width));
    const clampedY = Math.max(
      0,
      Math.min(newY, canvasRect.height - note.height),
    );

    boardStore.moveNote(note.id, clampedX, clampedY);
  }

  function handlePointerUp(e) {
    if (isDragging) {
      isDragging = false;
      noteElement.releasePointerCapture(e.pointerId);
    }
  }

  function handleContentInput(e) {
    boardStore.updateNote(note.id, { content: e.target.innerText });
  }

  function handleDelete() {
    boardStore.deleteNote(note.id);
  }

  function handleFocus() {
    isEditing = true;
    boardStore.bringToFront(note.id);
  }

  function handleBlur() {
    isEditing = false;
  }
</script>

<div
  bind:this={noteElement}
  class="sticky-note"
  class:dragging={isDragging}
  style="left: {note.x}px; top: {note.y}px; width: {note.width}px; min-height: {note.height}px; background: {colorMap[
    note.color
  ] || colorMap.yellow}; z-index: {note.zIndex};"
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  role="article"
  aria-label="Sticky note"
>
  <div class="note-header">
    <div class="drag-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <button
      class="delete-btn"
      onclick={handleDelete}
      aria-label="Delete note"
      title="Delete note"
    >
      ×
    </button>
  </div>

  <div
    class="note-content"
    contenteditable="true"
    oninput={handleContentInput}
    onfocus={handleFocus}
    onblur={handleBlur}
    role="textbox"
    aria-multiline="true"
    aria-label="Note content"
  >
    {note.content}
  </div>
</div>

<style>
  .sticky-note {
    position: absolute;
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-note);
    cursor: grab;
    user-select: none;
    transition:
      box-shadow var(--transition-smooth),
      transform var(--transition-fast);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    touch-action: none;
  }

  .sticky-note:hover {
    box-shadow: var(--shadow-note-hover);
  }

  .sticky-note.dragging {
    cursor: grabbing;
    box-shadow: var(--shadow-lg);
    transform: scale(1.02) rotate(1deg);
    opacity: 0.95;
  }

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    opacity: 0.6;
    transition: opacity var(--transition-fast);
  }

  .sticky-note:hover .note-header {
    opacity: 1;
  }

  .drag-indicator {
    display: flex;
    gap: 2px;
    flex-direction: column;
  }

  .drag-indicator span {
    width: 20px;
    height: 2px;
    background: var(--text-on-note);
    opacity: 0.3;
    border-radius: 1px;
  }

  .delete-btn {
    background: none;
    border: none;
    font-size: 20px;
    color: var(--text-on-note);
    cursor: pointer;
    opacity: 0.5;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all var(--transition-fast);
  }

  .delete-btn:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.1);
    color: #e53935;
  }

  .note-content {
    flex: 1;
    padding: var(--spacing-sm) var(--spacing-md) var(--spacing-md);
    color: var(--text-on-note);
    font-size: 14px;
    line-height: 1.5;
    cursor: text;
    outline: none;
    white-space: pre-wrap;
    word-wrap: break-word;
    min-height: 100px;
  }

  .note-content:focus {
    cursor: text;
  }

  .note-content:empty::before {
    content: "Type something...";
    color: rgba(0, 0, 0, 0.3);
    font-style: italic;
  }
</style>
