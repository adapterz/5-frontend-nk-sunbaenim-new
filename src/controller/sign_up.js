import { domain } from "./common.js";
import { reqSignUp } from "../user.js";

const form = document.querySelector("#submit");
form.addEventListener("click", createAccount);

async function createAccount(){
  const email = document.getElementById("email").value;
  const pwd = document.getElementById("pwd").value;
  const pwd_check = document.getElementById("pwd_check").value;
  const checkbox = document.querySelector("#checkbox");

  if(checkbox.checked === false) {
    alert("동의해라..");
    return
  }
  const result = await reqSignUp(email, pwd, pwd_check);
  const userId = result['result'][0].id;
  sessionStorage.setItem('key', userId);
  console.log(userId);
  window.location.href = `${domain}/profile/${userId}`;
}

