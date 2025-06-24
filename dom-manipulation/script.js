let quotes = [];

// Load quotes from local storage if available
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

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote and store it in session storage
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  sessionStorage.setItem("lastQuote", JSON.stringify(quote));

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `
    <p><strong>Quote:</strong> "${quote.text}"</p>
    <p><strong>Category:</strong> ${quote.category}</p>
  `;
}

// Add a new quote
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
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// Create the quote form dynamically
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
  button.id = "addQuoteBtn";
  button.addEventListener("click", addQuote);

  formContainer.appendChild(title);
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(button);
}

// Export quotes as JSON file
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
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

// Create import/export buttons
function createImportExportButtons() {
  const formContainer = document.getElementById("formContainer");

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes to JSON";
  exportBtn.addEventListener("click", exportToJsonFile);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  formContainer.appendChild(document.createElement("br"));
  formContainer.appendChild(exportBtn);
  formContainer.appendChild(document.createElement("br"));
  formContainer.appendChild(importInput);
}

// Initialize app
loadQuotes();
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
createAddQuoteForm();
createImportExportButtons();
showRandomQuote();
