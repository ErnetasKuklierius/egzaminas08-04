// Registracijos elementai
const userNameReg = document.getElementById("userNameReg");
const emailReg = document.getElementById("emailReg");
const passwordReg = document.getElementById("passwordReg");
const submitReg = document.getElementById("submitReg");

// Prisijungimo elementai
const emailLogin = document.getElementById("emailLogin");
const passwordLogin = document.getElementById("passwordLogin");
const submitLog = document.getElementById("submitLog");

// Atvaizdavimo elementai
const root = document.getElementById("root");
const allAds = document.getElementById("allAds");
const myAds = document.getElementById("myAds");

// Skelbimu formos elementai
const title = document.getElementById("title");
const description = document.getElementById("description");
const price = document.getElementById("price");
const submitAd = document.getElementById("submitAd");
const adsContainer = document.getElementById("adsContainer");
const deleteBtn = document.getElementById("DeleteAdBtn");
const textRating = document.getElementById("textRating");
const adRating = document.getElementById("adRating")
const inputRating = document.getElementById("inputRating")
// URL
const URL = "http://localhost:3000";
let editingAdId = null;


const skelbimai = document.getElementById("skelbimai");
// Registracijos funkcija ====================================================
// POST
submitReg.addEventListener("click", (event) => {
  event.preventDefault();

  const userNameValue = userNameReg.value;
  const emailValue = emailReg.value;
  const passwordValue = passwordReg.value;

  console.log(userNameValue, emailValue, passwordValue);
  // /users/register
  fetch(`${URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userName: userNameValue,
      email: emailValue,
      password: passwordValue,
    }),
  })
    .then((resp) => resp.json())
    .then((data) => console.log(data));
});

// Prisijungimo funkcija
// POST

submitLog.addEventListener("click", (event) => {
  event.preventDefault();

  const emailValue = emailLogin.value;
  const passwordValue = passwordLogin.value;

  console.log(emailValue, passwordValue);

  fetch(`${URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: emailValue,
      password: passwordValue,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      localStorage.setItem("token", JSON.stringify(data));
      localStorage.setItem("loggedIn", 1);
      isLoggedIn();
    });
});

const getDataFromLS = JSON.parse(localStorage.getItem("token"));
let token = getDataFromLS?.token;

console.log(getDataFromLS ? "hello, " + getDataFromLS.email : "Guest");

// =========================
// sukurti skelbima
// POST /ads


function clearLS() {
  localStorage.clear();
  localStorage.setItem("loggedIn", 0);
  location.reload();
}

function isLoggedIn() {
  const check = localStorage.getItem("loggedIn");
  if (check == 1) {
    skelbimai.style.display = "block";
    logout.style.display = "block";
    register.style.display = "none"
    loginas.style.display = "none"
    console.log("prisijunges");
  } else {
    skelbimai.style.display = "none";
    console.log("ne");
  }
}
isLoggedIn();

function getToken() {
  const stored = localStorage.getItem("token");
  const parsed = stored ? JSON.parse(stored) : null;
  return parsed?.token;
}


submitAd.addEventListener("click", (event) => {
  event.preventDefault();

  const token = getToken();
  const user = getDataFromLS;
  const userId = user?._id;
  const userEmail = user?.email;

  const titleValue = title.value;
  const descriptionValue = description.value;
  const priceValue = price.value;

  if (!token) {
    alert("Log in first");
    return;
  }

  const payload = {
    title: titleValue,
    description: descriptionValue,
    price: priceValue,
    user: userId,
    userEmail: userEmail,
    role: role,
  };

  const url = editingAdId ? `${URL}/ads/${editingAdId}` : `${URL}/ads`;
  const method = editingAdId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Server response: " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      editingAdId = null; 
      submitAd.textContent = "Create Ad";
      title.value = "";
      description.value = "";
      price.value = "";
      allAds.click();
    })
    .catch((error) => console.error("Error:", error));
});


// =========================
// Display ads

const displayAds = (dataFromDB) => {
  adsContainer.innerHTML = "";
  const userId = getDataFromLS._id;
  const userRole = getDataFromLS.role;

  dataFromDB.forEach((ad) => {
    const card = document.createElement("div");
    card.className = "card";

    const adTitle = document.createElement("h4");
    adTitle.textContent = ad.title;

    const adDescription = document.createElement("p");
    adDescription.textContent = "Description: " + ad.description;

    const adPrice = document.createElement("p");
    adPrice.textContent = "Price: " + ad.price + "€";

    const adAuthor = document.createElement("p");
    adAuthor.textContent = "Author: " + ad.user;

    const adRating = document.createElement("p");
    adRating.textContent = "Rating " + ad.rating

    // if (userId === ad.user ) {
    //   const textRating = document.createElement("p");
    //   const inputRating = document.createElement("input")
    //   textRating.textContent = "Rate this: "
    //   card,appendChild(textRating);
    //   card.appendChild(inputRating);
    // }

    card.appendChild(adTitle);
    card.appendChild(adDescription);
    card.appendChild(adPrice);
    card.appendChild(adAuthor);
    // card.appendChild(adRating);

    if (userId === ad.user || userRole === "admin") {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.backgroundColor = "red";

      deleteBtn.addEventListener("click", () => {
        const confirmDelete = confirm("Are you sure you want to delete this ad?");
        if (confirmDelete) {
          fetch(`${URL}/ads/${ad._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error("Failed to delete ad");
              }
              return res.json();
            })
            .then(() => {
              alert("Ad deleted successfully");
              allAds.click(); 
            })
            .catch((err) => console.error(err));
        }
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.backgroundColor = "orange";

      editBtn.addEventListener("click", () => {
        title.value = ad.title;
        description.value = ad.description;
        price.value = ad.price;
        editingAdId = ad._id;
        submitAd.textContent = "Update Ad";
      });

      card.appendChild(deleteBtn);
      card.appendChild(editBtn);
    }

    adsContainer.appendChild(card);
  });
};



// =========================
// get user ads from db


allAds.addEventListener("click", () => {
  adsContainer.innerHTML = "";
  fetch(`${URL}/ads`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Server response: " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      displayAds(data);
    });
});

myAds.addEventListener("click", () => {
  adsContainer.innerHTML = "";
  fetch(`${URL}/ads/myAds`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Server response: " + res.status);
      }
      return res.json();
    })
    .then((data) => {
      console.log("My ads:", data);
      displayAds(data);
    })
    .catch((err) => console.error("Error fetching my ads:", err));
});


