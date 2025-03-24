async function submitAddress() {
  const cryptoSelect = document.getElementById("cryptoSelect");
  const addressInput = document.getElementById("addressInput");
  const addressCards = document.getElementById("addressCards");

  const crypto = cryptoSelect.value;
  const address = addressInput.value;

  // Check if there's an existing card for the selected cryptocurrency
  const existingCard = document.querySelector(`.card[data-crypto="${crypto}"]`);

  if (existingCard) {
    // Update the existing card
    existingCard.querySelector("p").textContent = address;
  } else {
    // Create a new card
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-crypto", crypto);
    card.innerHTML = `<h3>${crypto}</h3><p>${address}</p>`;
    addressCards.appendChild(card);
  }

  // Clear the form fields after submission
  cryptoSelect.value = "";
  addressInput.value = "";

  // Make a POST request to the server
  try {
    const response = await fetch(
      `/4837jshjfh94y89q293fdkjhf-a73a4d5e2/addresses/${crypto}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ [crypto]: address }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData); // You can handle the server response here
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// function submitAddress() {
//   const cryptoSelect = document.getElementById("cryptoSelect");
//   const addressInput = document.getElementById("addressInput");
//   const addressCards = document.getElementById("addressCards");

//   const crypto = cryptoSelect.value;
//   const address = addressInput.value;

//   // Check if there's an existing card for the selected cryptocurrency
//   const existingCard = document.querySelector(`.card[data-crypto="${crypto}"]`);

//   if (existingCard) {
//     // Update the existing card
//     existingCard.querySelector("p").textContent = address;
//   } else {
//     // Create a new card
//     const card = document.createElement("div");
//     card.classList.add("card");
//     card.setAttribute("data-crypto", crypto);
//     card.innerHTML = `<h3>${crypto}</h3><p>${address}</p>`;
//     addressCards.appendChild(card);
//   }

//   // Clear the form fields after submission
//   cryptoSelect.value = "";
//   addressInput.value = "";
// }
