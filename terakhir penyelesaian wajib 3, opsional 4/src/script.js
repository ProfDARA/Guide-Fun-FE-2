// <<<<<PENTING>>>>> ,  ditambah import css supaya CSS masuk ke dalam bundle dan di load oleh index.html
import './style.css';

// Fungsi fetch untuk mengambil notes dari API
const API_URL = 'https://notes-api.dicoding.dev/v2';

// tambahan kode untuk menyimpan id catatan yang dipilih
let selectedNoteId = null;
let selectedAction = null;

// Fungsi fetch untuk mengambil notes dari API
const fetchNotes = async () => {
  // toggle loading berfungsi untuk menampilkan loading
  // indicator saat proses pengambilan data sedang berlangsung
  // dan menyembunyikannya saat proses selesai atau terjadi error
  toggleLoadingIndicator(true);

  try {
    const response = await fetch(`${API_URL}/notes`);
    const result = await response.json();
    toggleLoadingIndicator(false);

    if (response.ok) {
      return result.data;
    } else {
      alert('Gagal mengambil notes: ' + result.message);
      return [];
    }
  } catch (error) {
    toggleLoadingIndicator(false);
    alert('Error fetching notes: ' + error.message);
    return [];
  }
};

// Fungsi fetch untuk menghapus catatan dari API, metode DELETE ke endpoint /notes/{id}
// fungsi ini akan menghapus catatan berdasarkan id yang diberikan
const deleteNote = async (id) => {
  // try catch untuk menangani error saat fetch gagal
  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert('Note berhasil dihapus');
      displayNotes(); // Refresh tampilan catatan setelah penghapusan
    } else {
      const result = await response.json();
      alert('Gagal menghapus note: ' + result.message);
    }
  } catch (error) {
    alert('Error menghapus note: ' + error);
  }
};

// fungsi tambahan untuk mengambil data pengarsipan
const fetchArchivedNotes = async () => {
  toggleLoadingIndicator(true);

  try {
    const response = await fetch(`${API_URL}/notes/archived`);
    const result = await response.json();
    toggleLoadingIndicator(false);

    if (response.ok) {
      return result.data;
    } else {
      alert('Gagal mengambil notes arsip: ' + result.message);
      return [];
    }
  } catch (error) {
    toggleLoadingIndicator(false);
    alert('Error fetching archived notes: ' + error.message);
    return [];
  }
};

// Archive note
const archiveNote = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}/archive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    if (response.ok) {
      alert('Note berhasil diarsipkan');
      displayNotes();
    } else {
      alert('Gagal mengarsipkan note: ' + result.message);
    }
  } catch (error) {
    alert('Error mengarsipkan note: ' + error.message);
  }
};

// funsgi untuk unarchive, metode POST ke endpoint /notes/{id}/unarchive
// fungsi ini akan mengembalikan catatan yang diarsipkan menjadi aktif
const unarchiveNote = async (id) => {
  try {
    const response = await fetch(`${API_URL}/notes/${id}/unarchive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    if (response.ok) {
      alert('Note berhasil di-unarchive');
      displayNotes();
    } else {
      alert('Gagal meng-unarchive note: ' + result.message);
    }
  } catch (error) {
    alert('Error meng-unarchive note: ' + error.message);
  }
};

// Tampilkan catatan di UI, tambahkan tombol archive dan delete
// tambahkan tombol unarchive jika catatan diarsipkan
const displayNotes = async () => {
  const notesList = document.getElementById('notes-list');
  const archivedNotesList = document.getElementById('archived-notes-list');
  notesList.innerHTML = '<p>Loading notes...</p>';
  archivedNotesList.innerHTML = '<p>Loading archived notes...</p>';

  // Fetch notes dan archived notes
  const notes = await fetchNotes();
  const archivedNotes = await fetchArchivedNotes();

  // Tampilkan catatan di UI
  notesList.innerHTML = '';
  archivedNotesList.innerHTML = '';

  // Jika tidak ada catatan, tampilkan pesan
  if (notes.length === 0) {
    notesList.innerHTML = '<p>tidak ada catatan aktif</p>';

    // sebaliknya, tampilkan catatan di UI, tambahan tombol archive dan delete
  } else {
    notes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', note.id);
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('createdAt', note.createdAt);
      noteElement.setAttribute('archived', 'false');
      notesList.appendChild(noteElement);
    });
  }

  // ini adalah bagian baru untuk menampilkan catatan yang diarsipkan
  if (archivedNotes.length === 0) {
    archivedNotesList.innerHTML = '<p>No archived notes available</p>';
  } else {
    archivedNotes.forEach((note) => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', note.id);
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('createdAt', note.createdAt);
      noteElement.setAttribute('archived', 'true');
      archivedNotesList.appendChild(noteElement);
    });
  }
};

// bagian baru untuk dialog konfirmasi
const showConfirmationDialog = (action, id) => {
  selectedAction = action;
  selectedNoteId = id;
  const message =
    action === 'delete'
      ? 'Apa anda yakin untuk menghapus note?'
      : action === 'archive'
        ? 'Apa anda yakin untuk mengarsipkan note?'
        : 'Apa anda yakin untuk meng-unarchive note?';
  document.getElementById('confirmation-message').textContent = message;
  document.getElementById('confirmation-modal').style.display = 'block';
};

// Tambahan event listener untuk tombol konfirmasi ya dan tidak
document.getElementById('confirm-yes').addEventListener('click', async () => {
  document.getElementById('confirmation-modal').style.display = 'none';
  if (selectedAction === 'delete') {
    await deleteNote(selectedNoteId);
  } else if (selectedAction === 'archive') {
    await archiveNote(selectedNoteId);
  } else if (selectedAction === 'unarchive') {
    await unarchiveNote(selectedNoteId);
  }
});

// tambahan event listener untuk tombol konfirmasi tidak
document.getElementById('confirm-no').addEventListener('click', () => {
  document.getElementById('confirmation-modal').style.display = 'none';
  selectedNoteId = null;
  selectedAction = null;
});

// Definisikan custom element NoteItem dengan tombol hapus
class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'body', 'createdAt', 'id', 'archived'];
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  // tambahan tombol archive dan unarchive di sini, tergantung pada status archived
  render() {
    const isArchived = this.getAttribute('archived') === 'true';
    this.innerHTML = `
      <div class="note">
        <h2>${this.getAttribute('title')}</h2>
        <p>${this.getAttribute('body')}</p>
        <small>${new Date(this.getAttribute('createdAt')).toLocaleString()}</small>
        ${isArchived ? '<button class="unarchive-btn">Unarchive</button>' : '<button class="archive-btn">Archive</button>'}
        <button class="delete-btn">Delete</button>
      </div>
    `;

    this.querySelector('.delete-btn').addEventListener('click', () => {
      showConfirmationDialog('delete', this.getAttribute('id'));
    });

    if (isArchived) {
      this.querySelector('.unarchive-btn').addEventListener('click', () => {
        showConfirmationDialog('unarchive', this.getAttribute('id'));
      });
    } else {
      this.querySelector('.archive-btn').addEventListener('click', () => {
        showConfirmationDialog('archive', this.getAttribute('id'));
      });
    }
  }
}

customElements.define('note-item', NoteItem);

// Tambah catatan baru
document
  .getElementById('note-form')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;

    toggleLoadingIndicator(true);
    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      const result = await response.json();
      toggleLoadingIndicator(false);
      if (response.ok) {
        displayNotes();
        document.getElementById('note-form').reset();
      } else {
        alert('Gagal menambah note: ' + result.message);
      }
    } catch (error) {
      toggleLoadingIndicator(false);
      alert('Error menambah note: ' + error);
    }
  });

// bagian baru untuk loading indikator
const toggleLoadingIndicator = (show) => {
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = show ? 'block' : 'none';
};

// Tampilkan catatan saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayNotes);

// Tampilkan catatan saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayNotes);
