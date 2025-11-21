 // --- Configuration ---
const DB_NAME = 'DemoDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'user_notes';
const KEY_NAME = 'my_note';
let db; // Will hold the database object

// --- Logging all messages into a custom div ---
function log(message, type = 'info') {
  const logEl = document.getElementById("indexeddb-demo-log");
  const timestamp = new Date().toLocaleTimeString();
  const entry = document.createElement('div');
  entry.className = type === 'error' ? 'log-error' : (type === 'success' ? 'log-success' : 'log-info')
  entry.innerHTML = `<span>[${timestamp}]</span> ${message}`;  
  logEl.appendChild(entry);
  logEl.scrollTop = logEl.scrollHeight; // Auto scroll to bottom
}

// --- IndexedDB Initialization ---
function initDB() {
  log("Opening database connection...");
            
  // Open (or create) the database
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  // Triggered if the client doesn't have this DB or version is higher
  request.onupgradeneeded = (event) => {
    log("Database upgrade needed. Creating object store...", 'success');
    db = event.target.result;
                
    // Create an object store named 'user_notes'
    // We don't need a keyPath because we will specify the key manually
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
};

  request.onsuccess = (event) => {
    log("Database connected successfully.", 'success');
    db = event.target.result;
    loadData(); // Load data immediately after connection
  };

  request.onerror = (event) => {
    log(`Database error: ${event.target.error}`, 'error');
    };
}

// --- CRUD Operations ---
function saveData() {
  const noteContent = getInputEl().value;
            
  if (!db) {
    log("Error: Database not initialized.", 'error');
    return;
  }

  // 1. Start a transaction (readwrite)
  const transaction = db.transaction([STORE_NAME], 'readwrite');
            
  // 2. Get the object store
  const objectStore = transaction.objectStore(STORE_NAME);
            
  // 3. Perform the Put operation (Insert or Update)
  const request = objectStore.put(noteContent, KEY_NAME);

  request.onsuccess = () => {
    log("Data successfully saved to IndexedDB!", 'success');
    alert("Saved! Now try reloading the page.");
  };

  request.onerror = (err) => {
    log(`Failed to save: ${err.target.error}`, 'error');
  };
}

function loadData() {
  if (!db) return;

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const objectStore = transaction.objectStore(STORE_NAME);
            
  // Get the specific key
  const request = objectStore.get(KEY_NAME);

  request.onsuccess = (event) => {
    const result = event.target.result;
    if (result) {
      getInputEl().value = result;
      log(`Found saved data: "${result.substring(0, 20)}${result.length > 20 ? '...' : ''}"`, 'success');
    } else {
      log("No saved data found in IndexedDB.");
    }
  };
}

function clearData() {
  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const objectStore = transaction.objectStore(STORE_NAME);
  const request = objectStore.clear();

  request.onsuccess = () => {
    getInputEl().value = '';
    log("Database cleared.", 'info');
  };
}

function getInputEl(){
  return document.getElementById('indexeddb-demo-input');
}

window.addEventListener("load", initDB);
