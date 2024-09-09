
//kode lama ini tidak dipakai lagi dikarenakan sumber datanya beda , tadinya
// menggunakan array notesData, sekarang menggunakan API

// const API_URL adalah URL API yang akan digunakan untuk mengambil data notes
const API_URL = 'https://notes-api.dicoding.dev/v2';

// Fungsi fetch untuk mengambil notes dari API, menggunakan async-await
// Fungsi ini mengembalikan array notes jika berhasil, atau array kosong jika gagal
// Fungsi ini juga menampilkan alert jika terjadi error
const fetchNotes = async () => {
  try {
    const response = await fetch(`${API_URL}/notes`);
    const result = await response.json();
    if (response.ok) {
      return result.data;
    } else {
      alert('Gagal mengambil notes: ' + result.message);
      return [];
    }
  } catch (error) {
    alert('Error fetch notes: ' + error);
    return [];
  }
};

// Fungsi fetch untuk menghapus catatan dari API
// const deleteNote menerima parameter id catatan yang akan dihapus
// Fungsi ini menampilkan alert jika berhasil atau gagal menghapus catatan
const deleteNote = async (id) => {
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

// Tampilkan catatan di UI dengan memanggil fetchNotes dan menambahkan elemen note-item
// Fungsi ini akan menampilkan pesan "Loading notes..." saat sedang memuat data
// Fungsi ini akan menampilkan pesan "No notes available" jika tidak ada catatan
// Fungsi ini akan menampilkan catatan jika ada catatan
const displayNotes = async () => {
  const notesList = document.getElementById('notes-list');
  notesList.innerHTML = '<p>Loading notes...</p>';

  const notes = await fetchNotes();
  notesList.innerHTML = '';
  
  // Jika tidak ada catatan, tampilkan pesan "No notes available"
  if (notes.length === 0) {
    notesList.innerHTML = '<p>No notes available</p>';

  // Jika ada catatan, tampilkan catatan
  } else {
    notes.forEach(note => {
      const noteElement = document.createElement('note-item');
      noteElement.setAttribute('id', note.id);  // Tambahkan ID catatan
      noteElement.setAttribute('title', note.title);
      noteElement.setAttribute('body', note.body);
      noteElement.setAttribute('createdAt', note.createdAt);
      noteElement.addEventListener('deleteNote', (event) => {
        deleteNote(event.detail.id);  // Panggil deleteNote dengan ID
      });
      notesList.appendChild(noteElement);
    });
  }
};

// Definisikan custom element NoteItem dengan tombol hapus catatan
// Custom element ini memiliki atribut title, body, createdAt, dan id
// dan menampilkan judul, isi, tanggal dibuat, dan tombol hapus
class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'body', 'createdAt', 'id']; //id penting untuk menghapus catatan
  }

  // Ketika atribut berubah, render ulang elemen ini
  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Tampilan judul, isi, tanggal dibuat, dan tombol hapus catatan
    // div class langsung diterapkan pada elemen note agar lebih mudah diubah
    // button delete-btn akan mengirim event deleteNote dengan ID catatan
    // ID catatan diambil dari atribut id pada elemen note
    this.innerHTML = `
      <div class="note">
        <h2>${this.getAttribute('title')}</h2>
        <p>${this.getAttribute('body')}</p>
        <small>${new Date(this.getAttribute('createdAt')).toLocaleString()}</small>
        <button class="delete-btn">Hapus</button>
      </div>
    `;

    // Event listener untuk tombol hapus, mengirim event deleteNote dengan ID catatan
    // yang diambil dari atribut id pada elemen note ini
    this.querySelector('.delete-btn').addEventListener('click', () => {
      const event = new CustomEvent('deleteNote', {
        detail: { id: this.getAttribute('id') }
      });
      this.dispatchEvent(event);
    });
  }
}

// definisi custom element NoteItem yang akan digunakan di HTML
customElements.define('note-item', NoteItem);

// bagian ini adalah event listener untuk menambah catatan baru ke API
// event listener ini akan mengirimkan request POST ke API dengan data catatan
// jika berhasil, maka akan menampilkan catatan baru di UI
document.getElementById('note-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const body = document.getElementById('body').value;

  // bagian untuk mengirim request POST ke API dengan data catatan yang diambil dari form
  // Jika berhasil, tampilkan catatan baru di UI dan reset form
  // Jika gagal, tampilkan alert dengan pesan error
  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      // headers dan body harus diubah menjadi JSON
      headers: { 'Content-Type': 'application/json' },
      // body harus diubah menjadi JSON
      body: JSON.stringify({ title, body }),
    });
    const result = await response.json();
    if (response.ok) {
      displayNotes();
      document.getElementById('note-form').reset();
    } else {
      alert('Gagal menambah note: ' + result.message);
    }
  } catch (error) {
    alert('Error menambah note: ' + error);
  }
});

// Tampilkan catatan saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayNotes);