import { reqCreateProfileImage } from "../file.js";
import { reqCreateNickname } from "../user.js";

const userId = window.location.pathname.substring(9);
const key = sessionStorage.getItem("key");
if (userId !== key) {
  alert("접근 권한이 없습니다.");
  window.location.href = `/login`;
}

const file = document.querySelector("#submitFile");
file.addEventListener("click", createImg);
async function createImg() {
  const fileInput = document.querySelector("#img");
  const formData = new FormData();
  formData.append("avatar", fileInput.files[0]);

  const result = await reqCreateProfileImage(userId, formData);
  console.log(result);
}

const getNickname = document.querySelector("#submitNickname");
getNickname.addEventListener("click", createNickname);
async function createNickname() {
  const nicknameInput = document.getElementById("nickname").value;
  const result = await reqCreateNickname(userId, nicknameInput);

  if (result === 409)
    return document.querySelector(".nickname-validation").style.display = "block";

  if (result === 400)
    return document.querySelector(".nickname-empty").style.display = "block";
  
  if (result === 204)
  sessionStorage.removeItem('key');
  window.location.href = `/welcome`;

  console.log(result);
}
