import { domain } from "./common.js";
import { reqCreateProfileImage } from "../file.js";
import { reqSignUp } from "../user.js";

const email = localStorage.getItem("email");
const pwd = localStorage.getItem("pwd");
if (!email || !pwd) {
  alert("Not allowed");
  window.location.href = `/login`;
}

const form = document.querySelector("#submit-btn");
form.addEventListener("click", createAccount);
async function createAccount(e) {
  e.preventDefault();
  const nicknameField = document.querySelector(".profile__section-nickname");
  const nickname = document.getElementById("nickname");

  if(!nickname.value){
    nicknameField.classList.add("shake");
    nicknameField.querySelector(".error-empty").style.display = "block";
    setTimeout(() => {
      nicknameField.classList.remove("shake");
    }, 500);
    return
  } else {
    nicknameField.querySelector(".error-empty").style.display = "none";
    nickname.style.border = "solid rgb(53, 214, 53)";
  }

  const result = await reqSignUp(email, pwd, pwd, nickname.value);
  if (result === 409){
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
  if (result === 400) {
    return document.querySelector(".error-empty").style.display = "block";
  }
  const userId = result['result'][0].id;
  const fileInput = document.querySelector("#img");

  if(fileInput.value){
    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);
    await reqCreateProfileImage(userId, formData);
  }

  window.location.href = `${domain}/welcome`;
}
