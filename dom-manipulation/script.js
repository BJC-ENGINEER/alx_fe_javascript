let quotes = [
  { text: "Believe in yourself!", category: "Motivation" },
  { text: "Life is a journey, not a race.", category: "Life" },
  { text: "Stay positive, work hard, make it happen.", category: "Success" },
];

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

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
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// ✅ Create the quote form dynamically
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

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// 🔔 Initialize
showRandomQuote();
createAddQuoteForm();
