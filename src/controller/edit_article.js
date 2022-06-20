// 1개의 게시글 데이터 fetch
import {
  reqGetArticle,
  reqEditArticle,
} from "./article.js";
import { reqLoginCheck } from "./user.js";
import { accountMenu } from "./login_success.js";
import { reqArticleProfileImage } from "./file.js";


// 인증 처리
// 로그인한 유저 : 유저 계정 버튼, 로그인 안한 유저 : 로그인 버튼
const loginCheck = await reqLoginCheck();
const loggedinUserId = loginCheck.user_id;
if (loginCheck !== 400) {
  const loginBtn = document.querySelector(".header__log-out");
  const userAccountBtns = document.querySelector(".header__log-in");
  loginBtn.style.display = "none";
  userAccountBtns.style.display = "flex";
  accountMenu();
}

// 게시글의 인덱스값을 url에서 가져옴
const articleId = window.location.pathname.substring(6);
// url의 게시글 아이디를 통해 게시글 데이터 확인
const getArticle = async (articleId) => {
  try {
    const response = await reqGetArticle(articleId);
    // response : 게시물 1개의 정보
    return response;
  } catch (error) {
    console.log(error);
  }
};
const article = await getArticle(articleId);

// 기존 게시글 정보를 수정 에디터에 보여주기
const showArticle = async (articleData) => {
  const titleArea = document.querySelector(".editor__container__title");
  const contentArea = document.querySelector(".editor__container__content");
  const categoryArea = document.querySelector(".editor__category");

  titleArea.value = articleData["article"].title;
  contentArea.innerHTML = articleData["article"].content;
  categoryArea.value = articleData["article"].category;
};
await showArticle(article);

// 게시글 수정하기
const contentSelector = document.querySelector(".editor__container__content");
let content;
contentSelector.addEventListener("input", async function(e){
  content = e.target.value;
  return content;
})
const editComponent = document.getElementById("posting");
editComponent.addEventListener("click", editArticle);
async function editArticle() {
  const title = document.querySelector(".editor__container__title").value;
  const category = document.querySelector(".editor__category").value;

  const response = await reqEditArticle(articleId, title, content, category);
  if(response){
    history.back();
  }
}