import { writable } from 'svelte/store';

const STORAGE_KEY = 'sticky-rice-notes';

// Default notes for first-time users
const defaultNotes = [
  {
    id: crypto.randomUUID(),
    content: '👋 Welcome to Sticky Rice!\n\nDrag me around the board.',
    x: 100,
    y: 100,
    color: 'yellow',
    width: 220,
    height: 180,
    zIndex: 1,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    content: '✨ Click to edit this note.\n\nDouble-click the × to delete.',
    x: 360,
    y: 150,
    color: 'pink',
    width: 220,
    height: 180,
    zIndex: 2,
    createdAt: Date.now()
  },
  {
    id: crypto.randomUUID(),
    content: '🎨 Try different colors!\n\nUse the toolbar below.',
    x: 200,
    y: 350,
    color: 'blue',
    width: 220,
    height: 180,
    zIndex: 3,
    createdAt: Date.now()
  }
];

// Load from localStorage or use defaults
function loadNotes() {
  if (typeof window === 'undefined') return defaultNotes;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultNotes;
    }
  } catch (e) {
    console.warn('Failed to load notes from localStorage:', e);
  }
  
  return defaultNotes;
}

// Save to localStorage
function saveNotes(notes) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('Failed to save notes to localStorage:', e);
  }
}

// Create the store
function createBoardStore() {
  const { subscribe, set, update } = writable(loadNotes());
  
  // Auto-save on changes
  subscribe(notes => {
    saveNotes(notes);
  });
  
  return {
    subscribe,
    
    addNote: (color = 'yellow') => {
      update(notes => {
        const maxZ = Math.max(0, ...notes.map(n => n.zIndex));
        const newNote = {
          id: crypto.randomUUID(),
          content: '',
          x: 150 + Math.random() * 200,
          y: 150 + Math.random() * 200,
          color,
          width: 220,
          height: 180,
          zIndex: maxZ + 1,
          createdAt: Date.now()
        };
        return [...notes, newNote];
      });
    },
    
    updateNote: (id, updates) => {
      update(notes => 
        notes.map(note => 
          note.id === id ? { ...note, ...updates } : note
        )
      );
    },
    
    deleteNote: (id) => {
      update(notes => notes.filter(note => note.id !== id));
    },
    
    bringToFront: (id) => {
      update(notes => {
        const maxZ = Math.max(0, ...notes.map(n => n.zIndex));
        return notes.map(note => 
          note.id === id ? { ...note, zIndex: maxZ + 1 } : note
        );
      });
    },
    
    moveNote: (id, x, y) => {
      update(notes => 
        notes.map(note => 
          note.id === id ? { ...note, x, y } : note
        )
      );
    },
    
    clearAll: () => {
      set([]);
    },
    
    reset: () => {
      set(defaultNotes);
    }
  };
}

export const boardStore = createBoardStore();
