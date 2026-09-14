// login.js

const form =
  document.getElementById("loginForm");

const errorEl =
  document.getElementById("loginError");


async function redirectIfLoggedIn() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  if (session) {
    window.location.replace("index.html");
  }
}


redirectIfLoggedIn();


form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    errorEl.textContent = "";

    const email =
      document.getElementById("email")
        .value
        .trim();

    const password =
      document.getElementById("password")
        .value;


    const {
      error
    } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });


    if (error) {

      errorEl.textContent =
        "Invalid email or password.";

      return;
    }


    window.location.replace("index.html");
  }
);