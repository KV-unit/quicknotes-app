// --- 1. Select the elements needed ---
const form = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const categorySelect = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const notesList = document.querySelector('#notes-list');

// --- 2. Initialize notes (Load from LocalStorage or start empty) ---
let notes = [];

const savedNotes = localStorage.getItem("notes");
if (savedNotes) {
    notes = JSON.parse(savedNotes);
}

// --- 3. Define helper functions ---
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function render(list = notes) {
    // Clear the list first
    notesList.innerHTML = '';

    // Rebuild the list by looping over the provided list (either full notes or filtered notes)
    list.forEach(note => {
        const li = document.createElement('li');
        li.className = category-${note.category};

        const textContainer = document.createElement('div');

        const textNode = document.createElement('p');
        textNode.textContent = note.text; 

        const metaNode = document.createElement('small');
        const categoryLabel = note.category.charAt(0).toUpperCase() + note.category.slice(1);
        metaNode.textContent = ${categoryLabel} • ${note.createdAt};

        textContainer.appendChild(textNode);
        textContainer.appendChild(metaNode);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';

        // --- FIXED: Delete Button Event Listener ---
        deleteBtn.addEventListener('click', () => {
            // 1. Remove this specific note from the master notes array
            notes = notes.filter(n => n.id !== note.id);

            // 2. Recompute the filtered list based on the active search term
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = notes.filter(n => n.text.toLowerCase().includes(searchTerm));

            // 3. Re-render using the filtered list (if search is empty, this naturally shows all notes)
            render(filtered);
        });

        li.appendChild(textContainer);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });

    // Handle empty search results
    if (list.length === 0 && notes.length > 0) {
        const noResultsLi = document.createElement('li');
        noResultsLi.textContent = 'No notes match your search.';
        noResultsLi.className = 'no-results'; 
        notesList.appendChild(noResultsLi);
    }

    // Update the count text
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = You have ${notes.length} notes.;
    }

    // Save the current state of the notes array to LocalStorage
    saveNotes();
}

// --- 4. Event Listeners ---

// Form Submit Listener (Add new note)
form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = noteInput.value.trim();
    const category = categorySelect.value;

    // Validation checks
    if (text === '') {
        errorMessage.textContent = 'Please type a note first.';
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.';
        return;
    }

    // Clear any previous error message
    errorMessage.textContent = '';

    // Create and add the new note
    const newNote = {
        id: Date.now(), 
        text: text,
        category: category,
        createdAt: new Date().toLocaleString() 
    };

    notes.push(newNote);
    noteInput.value = '';

    // Clear search input so the new note is immediately visible
    searchInput.value = '';

    render();
});

// Search Input Listener (Filter notes)
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    // Filter the master notes array without modifying it
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    // Render only the filtered notes
    render(filteredNotes);
});

// --- 5. Initial Render ---
// Render the notes when the page first loads
render();