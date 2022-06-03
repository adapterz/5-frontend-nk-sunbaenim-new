import { httpMethod, request, domain } from "./common.js";

// 로그인 request
// URL : /users/login
const form = document.querySelector("#login");
form.addEventListener("click", reqLogin);

async function reqLogin() {
  // const form = document.querySelector("form"),
  //   emailField = form.querySelector(".form-card__section-email"),
  //   emailInput = emailField.querySelector(".email"),
  //   pwdField = form.querySelector(".form-card__section-pwd"),
  //   pwdInput = pwdField.querySelector(".password");

  // form.onsubmit = (e) => {
  //   e.preventDefault(); // preventing form from submitting
  //   if (emailInput.value == "") {
  //     emailField.classList.add("shake");
  //     emailField.querySelector(".error").style.display = "block";
  //   }
  //   if (pwdInput.value == "") {
  //     pwdField.classList.add("shake");
  //     pwdField.querySelector(".error").style.display = "block";
  //   }

  // };
  // setTimeout(() => {
  //   emailField.classList.remove("shake");
  //   pwdField.classList.remove("shake");
  // }, 500);

  try {
    const email = document.getElementById("email").value;
    const pwd = document.getElementById("pwd").value;
    const body = {
      email: email,
      pwd: pwd,
    };


    const response = await request("users/login", httpMethod.post, body, {
      "Content-Type": "application/json",
      Accept:'application/json',
    });
    
    await fetch("http://localhost:8080/users", {
        credentials: "include"
    })
  } catch (error) {
    console.log(error);
  }
}