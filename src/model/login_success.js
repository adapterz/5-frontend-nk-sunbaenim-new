import { httpMethod, request } from "./common.js";

// 만약 세션 스토리지에 유저 아이디가 있다면?
// 1. 계정 드롭다운 메뉴로 변경
// 2. 드롭다운 메뉴 내 정보를 유저 아이디에 맞는 값으로 변경

const reqLogInHome = async () => {
  if(sessionStorage.getItem("key")){
    console.log(sessionStorage.getItem("key").user_id);

    const logout =  document.querySelector(".header__log-out");
    logout.style.display = "none";

    const login = document.querySelector(".header__log-in");
    login.style.display = "block";
  }
}
reqLogInHome();