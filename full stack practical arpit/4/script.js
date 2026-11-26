const board = document.getElementById("chessboard");

// Chess pieces
const pieces = Array.of(
  "♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜",
  "♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "", "", "", "", "", "", "", "",
  "♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙",
  "♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"
);

// Store selected square
let selected = null;

// Create 64 squares
for (let i = 0; i < 64; i++) {
  const square = document.createElement("div");
  square.classList.add("square");

  // Alternate colors using CSS classes
  const isLight = (Math.floor(i / 8) + (i % 8)) % 2 === 0;
  square.classList.add(isLight ? "light" : "dark");

  square.textContent = pieces.at(i);

  // Click event
  square.addEventListener("click", function () {
    // Select a pawn
    if (selected === null) {
      if (square.textContent === "♙" || square.textContent === "♟") {
        selected = square;
        square.classList.add("selected");
      }
    }
    // Move selected pawn
    else {
      if (square.textContent === "") {
        square.textContent = selected.textContent;
        selected.textContent = "";
      }

      // Restore original tile color
      selected.classList.remove("selected");
      selected = null;
    }
  });

  board.appendChild(square);
}
