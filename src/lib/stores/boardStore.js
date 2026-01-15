import { writable, get } from 'svelte/store';

const STORAGE_KEY = 'satset-data-v2';

// --- Default Data for SATSET Pro ---
const initialData = {
  mode: 'kanban',
  columns: [
    { id: 'col-1', title: 'Wacana', noteIds: ['note-1', 'note-2', 'note-4'] },
    { id: 'col-2', title: 'Lagi OTW', noteIds: ['note-3'] },
    { id: 'col-3', title: 'Udah Kelar', noteIds: [] }
  ],
  notes: {
    'note-1': {
      id: 'note-1',
      type: 'text',
      content: 'Tulis ide lo biar gak lupa',
      color: 'yellow',
      tags: ['#IDE']
    },
    'note-2': {
      id: 'note-2',
      type: 'bigtext',
      content: 'TERIAK!',
      color: 'pink',
      tags: ['#PENTING']
    },
    'note-3': {
      id: 'note-3',
      type: 'checklist',
      content: [
        { text: 'Buka Laptop', done: true },
        { text: 'Ngoding', done: true },
        { text: 'Deploy', done: false }
      ],
      color: 'blue',
      tags: ['#KERJAAN']
    },
    'note-4': {
      id: 'note-4',
      type: 'text',
      content: 'Jangan wacana doang, kerjain!',
      color: 'green',
      tags: []
    }
  },
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
          title: 'Wacana Baru',
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

    // Updated addNote to support types
    addNote: (colId, type = 'text', color = 'yellow') => {
      update(data => {
        const newNoteId = crypto.randomUUID();
        let content = '';

        if (type === 'checklist') {
          content = [{ text: 'Baru', done: false }];
        } else if (type === 'bigtext') {
          content = 'HEADLINE';
        } else {
          content = ''; // text
        }

        const newNote = {
          id: newNoteId,
          type,
          content,
          color,
          tags: []
        };

        const updatedNotes = { ...data.notes, [newNoteId]: newNote };

        // If colId is provided, add to specific column. 
        // If not (e.g. from global toolbar), add to first column (default inbox).
        let targetColId = colId;
        if (!targetColId && data.columns.length > 0) {
          targetColId = data.columns[0].id;
        }

        const updatedColumns = data.columns.map(col =>
          col.id === targetColId
            ? { ...col, noteIds: [...col.noteIds, newNoteId] }
            : col
        );

        return { ...data, notes: updatedNotes, columns: updatedColumns };
      });
    },

    // For backward compatibility / explicit column add
    addNoteToColumn: (colId) => {
      // delegate to addNote
      const newNoteId = crypto.randomUUID();
      update(data => {
        const newNote = {
          id: newNoteId,
          type: 'text',
          content: '',
          color: 'yellow',
          tags: []
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
        const sourceCol = data.columns.find(c => c.id === sourceColId);
        const targetCol = data.columns.find(c => c.id === targetColId);

        if (!sourceCol || !targetCol) return data;

        const newSourceNoteIds = sourceCol.noteIds.filter(id => id !== noteId);
        const newTargetNoteIds = [...targetCol.noteIds];

        if (sourceColId === targetColId) {
          newTargetNoteIds.splice(newTargetNoteIds.indexOf(noteId), 1);
          newTargetNoteIds.splice(newIndex, 0, noteId);
        } else {
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

    updateNoteColor: (noteId, color) => {
      update(data => ({
        ...data,
        notes: {
          ...data.notes,
          [noteId]: { ...data.notes[noteId], color }
        }
      }));
    },

    updateNoteType: (noteId, type) => {
      update(data => {
        const note = data.notes[noteId];
        if (!note) return data;

        let newContent = note.content;

        // Conversion logic
        if (note.type === 'checklist' && type !== 'checklist') {
          // Convert array to string
          newContent = note.content.map(i => (i.done ? '[x] ' : '[ ] ') + i.text).join('\n');
        } else if (note.type !== 'checklist' && type === 'checklist') {
          // Convert string to array
          const lines = typeof note.content === 'string' ? note.content.split('\n') : [''];
          newContent = lines.map(line => ({ text: line.replace(/^\[.\] /, ''), done: line.includes('[x]') }));
        }

        return {
          ...data,
          notes: {
            ...data.notes,
            [noteId]: { ...note, type, content: newContent }
          }
        };
      });
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
