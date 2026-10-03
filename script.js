// --- 1. Select the elements needed ---
const form = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const categorySelect = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const notesList = document.querySelector('#notes-list');
const clearAllBtn = document.querySelector('#clear-all-btn'); // NEW: Selected Clear All button

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

    // Rebuild the list by looping over the provided list
    list.forEach(note => {
        const li = document.createElement('li');
        li.className = `category-${note.category}`;

        const textContainer = document.createElement('div');
        
        const textNode = document.createElement('p');
        textNode.textContent = note.text; 
        
        const metaNode = document.createElement('small');
        const categoryLabel = note.category.charAt(0).toUpperCase() + note.category.slice(1);
        metaNode.textContent = `${categoryLabel} • ${note.createdAt}`;
        
        textContainer.appendChild(textNode);
        textContainer.appendChild(metaNode);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';

        // Delete Button Event Listener
        deleteBtn.addEventListener('click', () => {
            notes = notes.filter(n => n.id !== note.id);
            
            const searchTerm = searchInput.value.toLowerCase();
            const filtered = notes.filter(n => n.text.toLowerCase().includes(searchTerm));
            
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
        noteCount.textContent = `You have ${notes.length} notes.`;
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
    searchInput.value = ''; // Clear search so new note is immediately visible
    
    render();
});

// Search Input Listener (Filter notes)
searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );
    render(filteredNotes);
});

// --- NEW: Clear All Button Listener ---
clearAllBtn.addEventListener('click', () => {
    const confirmed = confirm("Delete all notes?");
    
    if (confirmed) {
        // 1. Empty out the notes array
        notes = [];
        
        // 2. Empty out the search box's value
        searchInput.value = '';
        
        // 3. Call render() to update the UI and save to localStorage
        render();
    }
    // If false, the function simply ends and nothing happens
});

// --- 5. Initial Render ---
// Render the notes when the page first loads
render();