const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(
  document.querySelector("#modal-signup")
);
//Create a password-based account
function createUser(event) {
  event.preventDefault();
  const email = signupForm["input-email-signup"].value;
  const pwd = signupForm["input-password-signup"].value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, pwd)
    .then(() => {
      signupFeedback.style = `color:green`;
      signupFeedback.innerText = `Sign completed`;
      setTimeout(function () {
        signupModal.hide();
      }, 1000);
    })
    .catch((error) => {
      signupFeedback.style = `color:crimson`;
      signupFeedback.innerText = `${error.message}`;
      signupForm.reset();
    });
}

const btnCancel = document.querySelectorAll(".btn-cancel").forEach((btn) => {
  btn.addEventListener("click", () => {
    signupForm.reset();
    signupFeedback.innerHTML = ``;
  });
});

const btnCancel2 = document.querySelectorAll(".btn-cancel2").forEach((btn) => {
  btn.addEventListener("click", () => {
    loginForm.reset();
    loginFeedback.innerHTML = ``;
  });
});

const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", () => {
  firebase.auth().signOut();
  console.log("logout completed");
});

firebase.auth().onAuthStateChanged((user) => {
  console.log("User: ", user);
  // getList(user)
  setupUI(user);
});

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", loginUser);

const loginFeedback = document.querySelector("#feedback-msg-login");
const loginModal = new bootstrap.Modal(document.querySelector("#modal-login"));

//Login account
function loginUser(event) {
  event.preventDefault();
  const email = loginForm["input-email-login"].value;
  const pwd = loginForm["input-password-login"].value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, pwd)
    .then(() => {
      loginFeedback.style = `color:green`;
      loginFeedback.innerText = `Login completed`;
      setTimeout(function () {
        loginModal.hide();
      }, 1000);
    })
    .catch((error) => {
      loginFeedback.style = `color:crimson`;
      loginFeedback.innerText = `${error.message}`;
      loginForm.reset();
    });
}
