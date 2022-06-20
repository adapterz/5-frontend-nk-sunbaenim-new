import { reqLoginCheck, reqCreateNickname, reqPwdChange, reqSignOut, reqLogout } from "./user.js";
import { accountMenu } from "./login_success.js";
import { reqArticleProfileImage, reqCreateProfileImage } from "./file.js";

// 인증 처리
// 로그인한 유저 : 유저 계정 버튼, 로그인 안한 유저 : 로그인 버튼
const loginCheck = await reqLoginCheck();
const loggedinUserId = loginCheck.user_id;
const loginBtn = document.querySelector(".header__log-out");
const userAccountBtns = document.querySelector(".header__log-in");
if (loginCheck !== 400) {
  loginBtn.style.display = "none";
  userAccountBtns.style.display = "flex";
  await accountMenu();
} else {
  loginBtn.style.display = "block";
  userAccountBtns.style.display = "none";
  window.location.href='/login';
}


const editAlert = (alertText) => {
  const editorModal = document.getElementById("edit-modal");
  const modalText = document.querySelector(".edit-modal-content__text");

  editorModal.style.display = "block";
  modalText.innerText = alertText;
  const close = document.getElementsByClassName("edit-close")[0];
  close.onclick = function () {
    editorModal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == editorModal) {
      editorModal.style.display = "none";
    }
  };
};

const successAlert = (text) => {
  const editorModal = document.getElementById("success-modal");
  const modalText = document.querySelector(".success-modal-content__text");

  editorModal.style.display = "block";
  modalText.innerText = text;
  const close = document.getElementsByClassName("success-close")[0];
  close.onclick = function () {
    editorModal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == editorModal) {
      editorModal.style.display = "none";
    }
  };
};

// 기존 유저 프로필 사진 받아오기
async function updateProfileImg() {
  const profileImg = document.querySelector(".account__profile-img");
  const getProfileImg = await reqArticleProfileImage(loggedinUserId);
  if (getProfileImg !== 400) {
    profileImg.setAttribute("src", `${getProfileImg}`);
  }
}
await updateProfileImg();

// 유저 프로필 업데이트
const imgSubmitBtn = document.querySelector(".img-submit-btn");
imgSubmitBtn.addEventListener("click", imgSubmit);
async function imgSubmit() {
  const fileInput = document.getElementById("img");
  if (!fileInput.value) {
    return editAlert("No update in profile image");
  }
  if (fileInput.value) {
    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);
    console.log(formData);
    console.log(loggedinUserId);
    const result = await reqCreateProfileImage(loggedinUserId, formData);
    if(result === 204){
      window.location.reload();
    }
  }
}

// 유저 닉네임 업데이트
const nicknameSubmitBtn = document.querySelector(".nickname-submit-btn");
nicknameSubmitBtn.addEventListener("click", nicknameSubmit);
async function nicknameSubmit() {
  const nickname = document.getElementById("nickname").value;
  if (!nickname) {
    return editAlert("Please input your nickname 😉");
  }

  const checkNicknameValidation = await reqCreateNickname(
    nickname
  );
  if (checkNicknameValidation === 409) {
    return editAlert(`Already Existed Nickname.
    Please choose another nickname for your account 😉`);
  }
  successAlert("Nickname Updated!");
}

// 비밀번호 업데이트
const pwdSubmitBtn = document.querySelector(".pwd-submit-btn");
pwdSubmitBtn.addEventListener("click", pwdSubmit);
async function pwdSubmit() {
  const pwdField = document.querySelector(".pwd");
  const newPwdField = document.querySelector(".new");
  const checkPwdField = document.querySelector(".check");
  const pwd = document.getElementById("pwd");
  const newPwd = document.getElementById("newPwd");
  const pwdCheck = document.getElementById("pwdCheck");

  // 비밀번호가 공란이거나 5글자 이하인 경우
  if (pwd.value == "" || pwd.value.length < 5) {
    pwdField.querySelector(".error-empty").style.display = "block";
    return;
  } else {
    pwdField.querySelector(".error-empty").style.display = "none";
    pwd.style.border = "solid rgb(53, 214, 53)";
  }

  if(newPwd.value == "" || newPwd.value.length < 5){
    newPwdField.querySelector(".error-empty").style.display = "block";
    return;
  } else {
    newPwdField.querySelector(".error-empty").style.display = "none";
    newPwd.style.border = "solid rgb(53, 214, 53)";
  }

  // 비밀번호와 비밀번호 확인이 일치하지 않는 경우
  if (newPwd.value !== pwdCheck.value) {
    checkPwdField.querySelector(".error-format").style.display = "block";
    return;
  } else {
    checkPwdField.querySelector(".error-format").style.display = "none";
    newPwd.style.border = "solid rgb(53, 214, 53)";
  }

  const result = await reqPwdChange(pwd.value, newPwd.value, pwdCheck.value);
  if(result === 401){
    return editAlert("Unauthorized user");
  }
  successAlert("Password Updated!");
}

// 회원 탈퇴창 띄우기
const signOutBtn = document.querySelector(".delete-btn");
signOutBtn.addEventListener("click", signOutSubmit);
async function signOutSubmit() {
  const signoutField = document.getElementById("signout-modal");
  signoutField.style.display = "block";

  const close = document.querySelector(".signout-close");
  close.onclick = function () {
    signoutField.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == signoutField) {
      signoutField.style.display = "none";
    }
  };

  const submit = document.querySelector(".signout-yesbtn");
  submit.addEventListener("click", signoutPwdCheck);

}

async function signoutPwdCheck(){
  const pwdField = document.querySelector(".signout-modal-content");
  const pwd = document.querySelector(".signout-modal__password").value;

  //비밀번호가 공란이거나 5글자 이하인 경우
  if (pwd == "" || pwd.length < 5) {
    pwdField.querySelector(".error-empty").style.display = "block";
    return;
  }

  const result = await reqSignOut(pwd);
  if(result === 401){
    pwdField.querySelector(".error-invalid").style.display = "block";
    return
  }
  await reqLogout();
  window.location.href= `/account/delete`
}