import { domain } from "./common.js";
import { reqLogin } from "../user.js";

const form = document.querySelector("#login");
const emailField = document.querySelector(".form-card__section-email");
const emailInput = emailField.querySelector("#email");
const pwdField = document.querySelector(".form-card__section-pwd");
const pwdInput = pwdField.querySelector("#pwd");
form.onclick = async (e) => {
  // 이메일 형식 유효성 검사
  const emailValidate = (email) => {
    return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
  };

  if (emailInput.value == "") {
    emailField.classList.add("shake");
    emailField.querySelector(".error-empty").style.display = "block";
    setTimeout(() => {
      emailField.classList.remove("shake");
    }, 500);
    return
  }

  if(!emailValidate || emailInput.value.length < 5 && emailInput.value.length > 0) {
    emailField.classList.add("shake");
    emailField.querySelector(".error-empty").style.display = "none";
    emailField.querySelector(".error-format").style.display = "block";
    setTimeout(() => {
      emailField.classList.remove("shake");
    }, 500);
    return
  } else {
    emailField.querySelector(".error-empty").style.display = "none";
    emailField.querySelector(".error-format").style.display = "none";
    emailInput.style.border = "solid rgb(53, 214, 53)";
  }

  if (pwdInput.value == "" || pwdInput.value.length < 5) {
    pwdField.classList.add("shake");
    pwdField.querySelector(".error-empty").style.display = "block";
    pwdInput.style.border = "none";
    setTimeout(() => {
      pwdField.classList.remove("shake");
    }, 500);
    return
  } else {
    pwdField.querySelector(".error-empty").style.display = "none";
    pwdInput.style.border = "solid rgb(53, 214, 53)";
  }

  const login = await reqLogin(emailInput.value, pwdInput.value);
  if(login === 401) {
    const modal = document.getElementById("modal");
    const close = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    close.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if(event.target == modal) {
        modal.style.display = "none";
      }
    }
    return
  }
  //localStorage.setItem('key', login.data);
  window.location.href = `${domain}/home`;
};
