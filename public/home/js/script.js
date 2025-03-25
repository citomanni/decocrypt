"use strict";

const btnOpenModal = document.querySelectorAll(".btn--open-modal");
const btnCloseModal = document.querySelectorAll(".btn--close-modal");
const btnOpenLoginModal = document.querySelectorAll(".btn--open-login-modal");
const btnCloseLoginModal = document.querySelectorAll(".btn--close-login-modal");
const btnOpenForgotPasswordModal = document.querySelectorAll(
  ".btn--open-forgot-password-modal"
);
const btnCloseForgotPasswordModal = document.querySelectorAll(
  ".btn--close-forgot-password-modal"
);
const btnCloseLogin = document.querySelectorAll(".btn--close-login");
const btnCloseRegister = document.querySelectorAll(".btn--close-register ");
const btnRegister = document.querySelector(".btn--register ");
const btnLogin = document.querySelector(".btn--login ");
const modal = document.querySelector(".modal");
const registerForm = document.querySelector(".register__form");
const loginForm = document.querySelector(".login__form");
const loginModal = document.querySelector(".login_modal");
const forgotPasswordModal = document.querySelector(".forgot_password_modal");
const overlay = document.querySelector(".overlay");

//Modal
const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
const closeRegister = function () {
  modal.classList.add("hidden");
};

///// SUBMIT REGISTER FORM
btnRegister.addEventListener("click", function (event) {
  clearErrorMessages(registerForm);

  if (!validateForm(registerForm)) {
    event.preventDefault();
  } else {
    registerForm.submit();
    registerForm.reset();
  }
});

function validateForm(form) {
  const inputs = form.querySelectorAll("input[required]");
  let formIsValid = true;

  for (const input of inputs) {
    if (!input.value.trim()) {
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.textContent = `${getFieldName(input)} is required.`;
      if (getFieldName(input) === "Password") {
        input.parentNode.parentNode.appendChild(errorMessage);
      } else {
        input.parentNode.appendChild(errorMessage);
      }
      formIsValid = false;
    }
  }
  return formIsValid;
}

function getFieldName(input) {
  const label = registerForm.querySelector(`label[for="${input.id}"]`);
  return label ? label.textContent : "This field";
}

function clearErrorMessages(form) {
  // Remove all error messages
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((errorMessage) => errorMessage.remove());
}

btnCloseRegister.forEach((btn) => btn.addEventListener("click", closeRegister));
btnOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.forEach((btn) => btn.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Login Modal
const openLoginModal = function (e) {
  e.preventDefault();

  loginModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeLoginModal = function () {
  loginModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

const closeLogin = function () {
  loginModal.classList.add("hidden");
};

btnCloseLogin.forEach((btn) => btn.addEventListener("click", closeLogin));
btnOpenLoginModal.forEach((btn) =>
  btn.addEventListener("click", openLoginModal)
);
btnCloseLoginModal.forEach((btn) =>
  btn.addEventListener("click", closeLoginModal)
);
overlay.addEventListener("click", closeLoginModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !loginModal.classList.contains("hidden")) {
    closeLoginModal();
  }
});

btnLogin.addEventListener("click", async function (event) {
  clearErrorMessages(loginForm);

  if (!validateForm(loginForm)) {
    event.preventDefault();
  } else {
    //loginForm.submit();
    //loginForm.reset();

    const emailInput = document.querySelector(".login-email");
    const passwordInput = document.querySelector(".login-pass");

    const formData = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    try {
      // Send a PUT request to the /users/:id route
      const loginResponse = await fetch(`/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!loginResponse.ok) {
        //throw new Error(`login failed: ${loginResponse.statusText}`);
        const errorMessage = document.createElement("div");
        errorMessage.className = "error-message";
        errorMessage.textContent = "Wrong login credentials!";
        passwordInput.parentNode.parentNode.appendChild(errorMessage);

        return;
      }
      loginForm.submit();
      loginForm.reset();
    } catch (error) {
      console.error("Authentication error", error);
    }
    ///////
  }
});

//TOGGLE PASSWORD

const togglePasswordLogin = document.querySelector(".togglePasswordLogin");
const passwordLogin = document.querySelector(".input__passwordLogin");

togglePasswordLogin.addEventListener("click", function () {
  togglePasswordVisibility(passwordLogin, togglePasswordLogin);
});

const togglePasswordSignup = document.querySelector(".togglePasswordSignup");
const passwordSignup = document.querySelector(".input__passwordSignup");

togglePasswordSignup.addEventListener("click", function () {
  togglePasswordVisibility(passwordSignup, togglePasswordSignup);
});

function togglePasswordVisibility(passwordInput, toggleButton) {
  // toggle the type attribute
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // toggle button text and styles
  toggleButton.innerHTML = toggleButton.innerHTML === "SHOW" ? "HIDE" : "SHOW";
  toggleButton.style.color =
    toggleButton.style.color === "gray" ? "#5f3cc5" : "gray";
  toggleButton.style.fontWeight =
    toggleButton.style.fontWeight == 400 ? 500 : 400;
}


//FORGOT PASSWORD Modal
const openForgotPasswordModal = function (e) {
  e.preventDefault();

  forgotPasswordModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeForgotPasswordModal = function () {
  forgotPasswordModal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnOpenForgotPasswordModal.forEach((btn) =>
  btn.addEventListener("click", openForgotPasswordModal)
);
btnCloseForgotPasswordModal.forEach((btn) =>
  btn.addEventListener("click", closeForgotPasswordModal)
);
overlay.addEventListener("click", closeForgotPasswordModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !forgotPasswordModal.classList.contains("hidden")) {
    closeForgotPasswordModal();
  }
});


// Subscribe Section

// Toast Function to show message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Style for toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#333';
    toast.style.color = 'white';
    toast.style.padding = '10px';
    toast.style.borderRadius = '5px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '1000';

    // Append to body
    document.body.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Subscribe Button Event
const subscribeButton = document.querySelector('.subscribe-btn');
const emailInput = document.querySelector('.cta-section__subscribe__input');

subscribeButton.addEventListener('click', function() {
    const email = emailInput.value.trim();

    if (email) {
        showToast(`Thank you for subscribing with ${email}!`);
        emailInput.value = ''; // Clear the input field after subscribe
    } else {
        showToast('Please enter a valid email address.');
    }
});
