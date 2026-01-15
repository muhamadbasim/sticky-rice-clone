import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'sticky-rice-data-v2';

// Initial Data
const initialData = {
  mode: 'kanban', // 'free' or 'kanban'
  columns: [
    { id: 'col-1', title: 'To Do', noteIds: ['note-1', 'note-2'] },
    { id: 'col-2', title: 'Doing', noteIds: ['note-3'] },
    { id: 'col-3', title: 'Done', noteIds: [] }
  ],
  notes: {
    'note-1': { id: 'note-1', content: 'Explore Sticky Rice features', color: 'yellow' },
    'note-2': { id: 'note-2', content: 'Plan the implementation', color: 'pink' },
    'note-3': { id: 'note-3', content: 'Build Kanban Board', color: 'blue' }
  },
  // Keep legacy free-form notes here if needed, or unify.
  // For simplicity, let's treat free-form notes as notes without a column, 
  // but for this update we focus on Kanban.
  freeNotes: []
};

function loadData() {
  if (typeof window === 'undefined') return initialData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialData;
  } catch (e) {
    console.warn('Failed to load data:', e);
    return initialData;
  }
}

function saveData(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}

function createBoardStore() {
  const { subscribe, set, update } = writable(loadData());

  subscribe(data => saveData(data));

  return {
    subscribe,

    // --- Kanban Actions ---

    addColumn: () => {
      update(data => {
        const newCol = {
          id: crypto.randomUUID(),
          title: 'New Column',
          noteIds: []
        };
        return { ...data, columns: [...data.columns, newCol] };
      });
    },

    updateColumnTitle: (colId, title) => {
      update(data => ({
        ...data,
        columns: data.columns.map(col =>
          col.id === colId ? { ...col, title } : col
        )
      }));
    },

    deleteColumn: (colId) => {
      update(data => ({
        ...data,
        columns: data.columns.filter(c => c.id !== colId)
      }));
    },

    addNoteToColumn: (colId, color = 'yellow') => {
      update(data => {
        const newNoteId = crypto.randomUUID();
        const newNote = {
          id: newNoteId,
          content: '',
          color
        };

        const updatedNotes = { ...data.notes, [newNoteId]: newNote };
        const updatedColumns = data.columns.map(col =>
          col.id === colId
            ? { ...col, noteIds: [...col.noteIds, newNoteId] }
            : col
        );

        return { ...data, notes: updatedNotes, columns: updatedColumns };
      });
    },

    moveNote: (noteId, sourceColId, targetColId, newIndex) => {
      update(data => {
        // Remove from source
        const sourceCol = data.columns.find(c => c.id === sourceColId);
        const targetCol = data.columns.find(c => c.id === targetColId);

        if (!sourceCol || !targetCol) return data;

        const newSourceNoteIds = sourceCol.noteIds.filter(id => id !== noteId);

        // Add to target at specific index
        const newTargetNoteIds = [...targetCol.noteIds];
        if (sourceColId === targetColId) {
          // Moving within same column
          newTargetNoteIds.splice(newTargetNoteIds.indexOf(noteId), 1); // remove old first
          newTargetNoteIds.splice(newIndex, 0, noteId); // insert new
        } else {
          // Moving to diff column
          newTargetNoteIds.splice(newIndex, 0, noteId);
        }

        const updatedColumns = data.columns.map(col => {
          if (col.id === sourceColId && col.id === targetColId) {
            return { ...col, noteIds: newTargetNoteIds };
          } else if (col.id === sourceColId) {
            return { ...col, noteIds: newSourceNoteIds };
          } else if (col.id === targetColId) {
            return { ...col, noteIds: newTargetNoteIds };
          }
          return col;
        });

        return { ...data, columns: updatedColumns };
      });
    },

    updateNoteContent: (noteId, content) => {
      update(data => ({
        ...data,
        notes: {
          ...data.notes,
          [noteId]: { ...data.notes[noteId], content }
        }
      }));
    },

    deleteNote: (noteId) => {
      update(data => {
        const newNotes = { ...data.notes };
        delete newNotes[noteId];

        const newColumns = data.columns.map(col => ({
          ...col,
          noteIds: col.noteIds.filter(id => id !== noteId)
        }));

        return { ...data, notes: newNotes, columns: newColumns };
      });
    },

    reset: () => {
      set(initialData);
    }
  };
}

export const boardStore = createBoardStore();
