import { request, httpMethod } from "./common.js";
import { reqProfileImage } from "./file.js";
import { reqLoginCheck, reqLogout } from "./user.js";
export { accountMenu };

const loginCheck = await reqLoginCheck();
const loggedinUserId = loginCheck.user_id;
if (loginCheck !== 400) {
  const loginBtn = document.querySelector(".header__log-out");
  const userAccountBtns = document.querySelector(".header__log-in");
  loginBtn.style.display = "none";
  userAccountBtns.style.display = "flex";
  accountMenu();
}

async function accountMenu() {
  const logout = document.getElementById("logout");
  const modal = document.getElementById("modal");
  const close = document.getElementsByClassName("close")[0];
  const logoutNoBtn = document.querySelector(".nobtn");
  const logoutYesBtn = document.querySelector(".yesbtn");

  // 로그인한 유저의 프로필 이미지 띄우기
  const getProfileImg = await reqProfileImage();
  const userImg = document.getElementById("profileImg");
  if(getProfileImg){
    userImg.setAttribute("src", getProfileImg);
  }

  // 드롭다운 메뉴 중 로그아웃을 눌렀을 때 로그아웃 모달창 띄우기
  logout.addEventListener("click", logoutModal);
  function logoutModal (){
    modal.style.display = "block"
    close.onclick = function() {
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if(event.target == modal) {
        modal.style.display = "none";
      }
    }
    logoutNoBtn.onclick = function() {
      modal.style.display = "none";
    }
    logoutYesBtn.onclick = async function() {
      const result = await reqLogout();
      if(result){
        window.location.href = "/";
      }
    }
  }
}
