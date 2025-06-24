let quotes = [];

function loadQuotes() {
  const savedQuotes = localStorage.getItem("quotes");
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    quotes = [
      { text: "Believe in yourself!", category: "Motivation" },
      { text: "Life is a journey, not a race.", category: "Life" },
      { text: "Stay positive, work hard, make it happen.", category: "Success" },
    ];
  }
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  let filtered = quotes;

  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes in this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (newQuote.text && newQuote.category) {
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map(q => q.category))];

  dropdown.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    dropdown.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategory");
  if (lastFilter) {
    dropdown.value = lastFilter;
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selectedCategory);
  showRandomQuote();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");

  const title = document.createElement("h2");
  title.textContent = "Add a New Quote";

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";
  textInput.id = "newQuoteText";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.id = "newQuoteCategory";

  const button = document.createElement("button");
  button.textContent = "Add Quote";
  button.addEventListener("click", addQuote);

  formContainer.appendChild(title);
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(button);
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format. Please upload a valid JSON file.");
      }
    } catch (e) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Task 3: Fetch quotes from mock API using async/await
async function fetchQuotesFromServer() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  // Use only first 5 items and convert them to quote format
  const serverQuotes = data.slice(0, 5).map(post => ({
    text: post.title,
    category: "API"
  }));

  return serverQuotes;
}

// ✅ Sync and resolve conflicts
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();
  let hasConflict = false;
  let updated = false;

  const localQuotesMap = new Map(quotes.map(q => [q.text, q]));

  serverQuotes.forEach(serverQuote => {
    const localQuote = localQuotesMap.get(serverQuote.text);
    if (!localQuote) {
      quotes.push(serverQuote);
      updated = true;
    } else if (localQuote.category !== serverQuote.category) {
      localQuote.category = serverQuote.category;
      hasConflict = true;
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    showRandomQuote();
  }

  const msg = document.getElementById("syncMessage");
  if (hasConflict) {
    msg.textContent = "Conflicts resolved using server data.";
  } else if (updated) {
    msg.textContent = "Quotes updated from server.";
  } else {
    msg.textContent = "Quotes are already up to date.";
  }

  setTimeout(() => msg.textContent = "", 5000);
}

// 🟢 Initialization
loadQuotes();
createAddQuoteForm();
populateCategories();

document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportQuotes").addEventListener("click", exportToJsonFile);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);

const lastFilter = localStorage.getItem("lastCategory");
if (lastFilter) {
  document.getElementById("categoryFilter").value = lastFilter;
}
showRandomQuote();

// 🟢 Sync on load and every 30 seconds
syncWithServer();
setInterval(syncWithServer, 30000);
