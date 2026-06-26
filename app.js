'use strict';

let notes = [];
let editingNoteId = null;
const loadNotes = () => {
    try {
        const saved = localStorage.getItem('CleanNotes');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const generateId = () => {
    return Date.now().toString();
};

const saveNotes = () => {
    localStorage.setItem('CleanNotes', JSON.stringify(notes));
}

const saveNote = (event) => {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // update existing

        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title: title,
            content: content
        }
    }
    else {
        // add new
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        });
    }



    saveNotes();
    renderNotes();
    document.getElementById('noteForm')
    closeNoteDialog();
};
function deleteNote(noteId) {
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}
const renderNotes = () => {
    const notesContainer = document.getElementById('notesContainer');

    if(notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty_state">
                <h2>No notes yet...</h2>
                <p>Create a new note to get started!</p>
                <button class="add_note_btn" onclick="openNoteDialog()">+ Add Your First Note</button>
            </div>
        `

        return
    }
    notesContainer.innerHTML = notes.map(note => `
        <div class="note_card">
            <h3 class="note_title">${note.title}</h3>
            <p class="note_content">${note.content}</p>
            <div class="note_actions">
                <button class="edit_btn" onclick="openNoteDialog('${note.id}')" title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"/>
                    </svg>
                </button>
                <button class="delete_btn" onclick="deleteNote('${note.id}')" title="Delete">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 0h24v24H0V0z" fill="none"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function openNoteDialog(noteId) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        // edit
        const noteToEdit = notes.find(note => note.id === noteId);
        editingNoteId = noteId;
        document.getElementById('dialogTitle').textContent = 'Edit';
        contentInput.value = noteToEdit.content;
    }
    else {
        // add
        editingNoteId = null;
        document.getElementById('dialogTitle').textContent = 'Add';
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal();
    titleInput.focus();
}
const closeNoteDialog = () => {
    document.getElementById('noteDialog').close();
};
const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark_theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeToggleBtn').textContent = isDark ? '☀️' : '🌙';
}
const applyTheme = () => {
    if(localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark_theme');
        document.getElementById('themeToggleBtn').textContent = '☀️';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    notes = loadNotes()
    renderNotes();



    document.getElementById('noteForm')
        .addEventListener('submit', saveNote);
    document.getElementById('themeToggleBtn')

        .addEventListener('click', toggleTheme)


    document.getElementById('noteDialog').addEventListener('click', function (event)  {
        if (event.target === this) {
            closeNoteDialog();
        }
    });
});

const closeButton = document.querySelector('.close_btn');
const addNoteBtn = document.querySelector('.add_note_btn');
const cancelBtn = document.querySelector('.cancel_btn');

addNoteBtn.addEventListener('click', () => {
    openNoteDialog();
});
closeButton.addEventListener('click', () => {
    closeNoteDialog();
});
cancelBtn.addEventListener('click', () => {
    closeNoteDialog();
});