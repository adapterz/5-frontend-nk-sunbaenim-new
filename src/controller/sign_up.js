import { domain } from "./common.js";

const form = document.querySelector("#submit");
const emailField = document.querySelector(".form__section-email");
const pwdField = document.querySelector(".form__section-pwd__init");
const pwdCheckField = document.querySelector(".form__section-pwd__check");
const email = document.getElementById("email");
const pwd = document.getElementById("pwd");
const pwdCheck = document.getElementById("pwdCheck");
const checkbox = document.getElementById("checkbox");

form.onclick = async (e) => {
  e.preventDefault();
  // 이메일 형식 유효성 검사
  const emailValidate = (email) => {
    return String(email)
    .toLowerCase()
    .match(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
  };
  // 입력한 이메일 값이 없을 경우
  if (email.value == "") {
    emailField.classList.add("shake");
    emailField.querySelector(".error-empty").style.display = "block";
    setTimeout(() => {
      emailField.classList.remove("shake");
    }, 500);
    return
  }

  // 입력한 이메일이 이메일 형식이 아니거나 5글자 이하인 경우
  if(emailValidate(email.value) === null || email.value.length < 5 && email.value.length > 0) {
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
    email.style.border = "solid rgb(53, 214, 53)";
  }

  // 비밀번호가 공란이거나 5글자 이하인 경우
  if (pwd.value == "" || pwd.value.length < 5) {
    pwdField.classList.add("shake");
    pwdField.querySelector(".error-empty").style.display = "block";
    pwd.style.border = "none";
    setTimeout(() => {
      pwdField.classList.remove("shake");
    }, 500);
    return
  }

  // 비밀번호와 비밀번호 확인이 일치하지 않는 경우
  if (pwd.value !== pwdCheck.value) {
    pwdCheckField.classList.add("shake");
    pwdCheckField.querySelector(".error-format").style.display = "block";
    pwdCheck.style.border = "none";
    setTimeout(() => {
      pwdCheckField.classList.remove("shake");
    }, 500);
    return
  } else {
    pwdCheckField.querySelector(".error-format").style.display = "none";
    pwd.style.border = "solid rgb(53, 214, 53)";
    pwdCheck.style.border = "solid rgb(53, 214, 53)";
  }

  // 개인정보 이용 가입 동의
  if(checkbox.checked === false) {
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


  localStorage.setItem('email', email.value);
  localStorage.setItem('pwd', pwd.value);
  window.location.href = `${domain}/profile`;
}