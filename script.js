// --- 1. Select the elements needed ---
const form = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const categorySelect = document.querySelector('#note-category');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');
const noteCount = document.querySelector('#note-count');
const notesList = document.querySelector('#notes-list');

// --- 2. Keep notes in an array ---
let notes = [];

// --- 3. Write a render() function ---
function render() {
    // Clear the list first
    notesList.innerHTML = '';

    // Rebuild the list by looping over notes
    notes.forEach(note => {
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

        // --- NEW: Delete Button Event Listener ---
        deleteBtn.addEventListener('click', () => {
            // Remove this specific note from the notes array by filtering out its ID
            notes = notes.filter(n => n.id !== note.id);
            
            // Re-render the list to reflect the removal
            render();
        });

        li.appendChild(textContainer);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });

    // Exact phrasing for the count text
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }
}

// --- 4. Listen for the form's "submit" event ---
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

    const newNote = {
        id: Date.now(), 
        text: text,
        category: category,
        createdAt: new Date().toLocaleString() 
    };

    notes.push(newNote);
    noteInput.value = '';
    render();
});

// --- Initial Render ---
render();