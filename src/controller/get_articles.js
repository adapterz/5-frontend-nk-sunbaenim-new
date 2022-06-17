//052322 HTTP METHOD, url 모듈화
import { domain } from "./common.js";
import { reqLoginCheck } from "./user.js";
import { accountMenu } from "./login_success.js"
import { reqGetArticles, reqGetArticle } from "./article.js";
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

const createCommentAlert = (alertText) => {
  const editorModal = document.getElementById("editor__modal");
  const modalText = document.querySelector(".editor__modal-content__guide");
  const loginNoBtn = document.querySelector(".login-nobtn");
  const loginYesBtn = document.querySelector(".login-yesbtn");

  editorModal.style.display = "block";
  modalText.innerText = alertText;
  const close = document.getElementsByClassName(
    "editor__modal-content__close"
  )[0];
  close.onclick = function () {
    editorModal.style.display = "none";
  };
  window.onclick = function (event) {
    if (event.target == editorModal) {
      editorModal.style.display = "none";
    }
  };
  loginNoBtn.onclick = function() {
    editorModal.style.display = "none";
  };
  loginYesBtn.onclick = async function() {
    window.location.href = "/login";
  };
};

const createPosting = document.querySelector(".main-list__header--create-btn");
createPosting.addEventListener("click", (e) => {
  if(!loggedinUserId){
    e.preventDefault();
    createCommentAlert("Login please. \n Do you want to log in?");
  }
})

// more_articles = 다음 게시물이 있는지 없는지 확인하는 변수
let more_articles = false;
// next_cursor = 다음 게시물의 인덱스 번호를 확인하는 변수
let next_cursor = 0;
// 게시물들을 서버로부터 가져오는 api
const getArticles = async (cursor, limit, key) => {
  try {
    const response = await reqGetArticles(cursor, limit, key);
    more_articles = response["paging"].more_articles;
    next_cursor = response["paging"].next_cursor;
    return response;
  } catch (error) {
    console.log(error);
  }
};

// 게시물 정보를 파싱하여 브라우저에 뿌려주는 함수
const showArticles = async (data, ul) => {
  const parentUl = document.querySelector(ul);
  for (let i = 0; i < data["data"].length; i++) {
    const li = document.createElement("li");
    const contentDiv = document.createElement("div");
    const a = document.createElement("a");
    const reactionsDiv = document.createElement("div");
    const likesDiv = document.createElement("span");
    const commentsDiv = document.createElement("span");
    const dateDiv = document.createElement("div");
    const nicknameSpan = document.createElement("span");
    const img = document.createElement("img");
    const articleInfo = await reqGetArticle(data["data"][i].id);
    const writerImg = await reqArticleProfileImage(data["data"][i].user_id);
    const writer = await articleInfo.writer;
    
    // 게시물 작성자의 프로필 사진 설정
    if(writerImg){
      img.setAttribute("src", writerImg);
    } else {
      img.setAttribute("src", "/user_profile.png");
    }
    // 게시물을 상세 조회할 수 있는 링크 연결
    a.setAttribute(
      "href",
      `${domain}/articles/${data["data"][i].id}`
    );

    li.className = "main-list__article";
    contentDiv.className = "main-list__article--content";
    a.className = "main-list__article--title";
    reactionsDiv.className = "main-list__article--reactions";
    likesDiv.className = "likes";
    commentsDiv.className = "comments";
    dateDiv.className = "date";
    nicknameSpan.className = "main-list__article--nickname";
    img.className = "main-list__article--user-img";

    a.innerHTML = data["data"][i].title;
    likesDiv.innerHTML = data["data"][i].total_likes + " Likes";
    commentsDiv.innerHTML = data["data"][i].total_comments + " Comments";
    const localDate = new Date(data["data"][i].create_at).toLocaleString();
    dateDiv.innerHTML = localDate.substring(0, 9);
    nicknameSpan.innerHTML = writer;

    contentDiv.append(a, reactionsDiv);
    reactionsDiv.append(likesDiv, commentsDiv, dateDiv);
    li.append(contentDiv, nicknameSpan, img);
    parentUl.appendChild(li);
  }
};

// 다음 게시물들을 불러일으킬 때 more_articles가 true인 경우 다음 게시물을 파싱하여 브라우저에 띄우는 함수
const loadArticles = async (cursor, limit, key) => {
  setTimeout(async () => {
    try {
      // cursor가 0인 이유 : 첫 화면을 위한 초기화
      if (cursor == 0 || more_articles) {
        const response = await getArticles(cursor, limit, key);
        console.log(response);
        const ul = ".main-list__articles"
        showArticles(response, ul);
      }
    } catch (error) {
      console.log(error.message);
    }
  }, 500);
};

// 게시물 조회 초기화 (첫 페이지에는 게시물을 10개까지 가져온다)
let limit = 10;
// 페이지의 가장 밑으로 커서가 내려갔을 때, 다음 데이터가 있다면 추가로 서버로부터 게시물 데이터를 불러오는 함수
// FIXME: document.documentElement로 시도했을 때 잘 작동하지 않음 -> 알고보니 해당 메소드는 IE나 Firefox에 적용되며 크롬일 경우 document.body로 해야 작동된다고 함.
document.body.addEventListener("scroll", async() => {
  const { scrollTop, scrollHeight, clientHeight } = document.body;
  if (scrollTop + clientHeight >= scrollHeight - 0.5) {
    loadArticles(next_cursor, limit);
  }
}, {
  passive: true
});
loadArticles(0, 9);

const search = document.querySelector(".main-nav__icon--search-btn");
search.addEventListener("click", searchArticles);
async function searchArticles(e) {
  e.preventDefault();
  const keyword = document.querySelector(".main-nav__icon--search-text");
  const articleList = document.querySelector(".main-list__articles");
  const searchList = document.querySelector(".main-list__articles__search");
  const parentUl = ".main-list__articles__search"

  if(!keyword.value){
    alert("Please input keywords");
    window.location.reload();
    return
  }
  if(keyword.value){
    articleList.style.display = "none";
    if(searchList.firstElementChild){
      removeAllChildNodes(searchList);
    }
    const result = await getArticles(0, 30, keyword.value);
    await showArticles(result, parentUl);
    if(result.data.length === 0){
      const ul = document.querySelector(".main-list__articles__search")
      const li = document.createElement("li");
      li.innerHTML = "No result";
      ul.appendChild(li);
    }
  }
  keyword.value = "";
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}