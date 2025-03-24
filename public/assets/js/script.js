"use strict";

const nav = document.querySelector(".navigation");
const header = document.querySelector(".header");
const headerMenuBtn = document.querySelector(".header__menu-btn");
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
const btnScrollTo = document.querySelector(".btn--scroll-to");
const sectionFeatures = document.querySelector("#section-features");
const sectionHero = document.querySelector(".section-hero");
const navigationList = document.querySelector(".navigation__list");
const accordionContainer = document.querySelector(
  ".operations__list-container"
);
const accordionHeading = document.querySelectorAll(".operations__heading");
const accordionContent = document.querySelectorAll(".operations__content");
const accordionImage = document.querySelectorAll(".operations__img");
const allSections = document.querySelectorAll(".section");

///////////////////////////////////////////////////////////
//Menu Button
headerMenuBtn.addEventListener("click", function (e) {
  this.classList.toggle("active");
  header.classList.toggle("navigation__open");
});

///////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////
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

// const togglePassword = document.querySelector(".togglePassword");
// const password = document.querySelector(".input__password");

// togglePassword.addEventListener("click", function () {
//   // toggle the type attribute
//   const type =
//     password.getAttribute("type") === "password" ? "text" : "password";
//   password.setAttribute("type", type);

//   // toggle
//   this.innerHTML = this.innerHTML === "SHOW" ? "HIDE" : "SHOW";
//   this.style.color = this.style.color === "gray" ? "#5f3cc5" : "gray";
//   this.style.fontWeight = this.style.fontWeight == 400 ? 500 : 400;
// });
///////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////
//Scroll into section when button click
btnScrollTo.addEventListener("click", function () {
  sectionFeatures.scrollIntoView({
    behavior: "smooth",
  });
});

///////////////////////////////////////////////////////////
//Page navigation
navigationList.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("navigation__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });

    header.classList.toggle("navigation__open");
    headerMenuBtn.classList.toggle("active");
  }
});

///////////////////////////////////////////////////////////
//Accordion
accordionContainer.addEventListener("click", function (e) {
  const item = e.target;
  const clicked = item.closest(".operations__heading");

  if (!clicked) return;

  //Remove active classes
  accordionHeading.forEach((a) =>
    a.classList.remove("operations__heading--active")
  );

  //Activate the clicked heading
  clicked.classList.add("operations__heading--active");

  //Remove active classes of accordion content
  accordionContent.forEach((c) =>
    c.classList.remove("operations__content--active")
  );

  //Remove active classes of accordion image
  accordionImage.forEach((i) => i.classList.remove("operations__img--active"));

  //Activate the content
  document
    .querySelector(`.operations__content--${clicked.dataset.accordion}`)
    .classList.add("operations__content--active");

  //Activate the image
  document
    .querySelector(`.operations__img--${clicked.dataset.accordion}`)
    .classList.add("operations__img--active");
});

///////////////////////////////////////////////////////////
//Sticky navigation
const headerHeight = header.getBoundingClientRect().height;
const stickyNavigation = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) document.body.classList.add("sticky");
  else document.body.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNavigation, {
  root: null,
  threshold: 0,
  rootMargin: `-${headerHeight}px`,
});
headerObserver.observe(sectionHero);

///////////////////////////////////////////////////////////
//Menu Animation
const handleHover = function (e) {
  if (e.target.classList.contains("navigation__link")) {
    const link = e.target;
    const siblings = link
      .closest(".navigation")
      .querySelectorAll(".navigation__link");

    siblings.forEach((element) => {
      if (element !== link) {
        element.style.color = this;
      }
    });
  }
};
nav.addEventListener("mouseover", handleHover.bind("var(--color-white-dark)"));
nav.addEventListener("mouseout", handleHover.bind("var(--color-grey)"));

///////////////////////////////////////////////////////////
//Reveal Section
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((s) => {
  sectionObserver.observe(s);
  s.classList.add("section--hidden");
});

///////////////////////////////////////////////////////////
//Lazy Loading Images

//selects images with data-src attribute
const imageTargets = document.querySelectorAll("img[data-src]");
const loadImage = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace the lazy load image with the data-src
  entry.target.src = entry.target.dataset.src;

  //Remove the feature__lazy-img class
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("feature__lazy-img");
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imageTargets.forEach((img) => imageObserver.observe(img));

///////////////////////////////////////////////////////////
//Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnPrevious = document.querySelector(".slider__btn--left");
  const btnNext = document.querySelector(".slider__btn--right");

  let currentSlide = 0;
  let maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
  };

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
  };

  const init = function () {
    goToSlide(0);
  };
  init();

  //Event handlers
  btnNext.addEventListener("click", nextSlide);
  btnPrevious.addEventListener("click", previousSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && previousSlide();
  });
};

slider();
