import { reqCreateArticle } from "./article.js";
import { reqCreateThumbnail } from "./file.js"
import { reqLoginCheck } from "./user.js";
import { accountMenu } from "./login_success.js";

// 인증 처리
// 로그인한 유저 : 유저 계정 버튼, 로그인 안한 유저 : 로그인 버튼
const loginCheck = await reqLoginCheck();
const loggedinUserId = loginCheck.user_id;
if (loginCheck !== 400) {
  accountMenu();
} else {
  window.location.href='/login';
}

const createEditorAlert = (alertText) => {
  const editorModal = document.getElementById("editor__modal");
  const modalText = document.querySelector(".editor__modal-content__guide");

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
};

// 포스팅 저장 후 반영된 게시글 페이지로 이동
const postingBtn = document.getElementById("posting");
postingBtn.addEventListener("click", createPosting);
async function createPosting (){
  const title = document.querySelector(".editor__container__title").value;
  const content = document.querySelector(".editor__container__content").value;
  const category = document.getElementById("category");
  category.addEventListener("change", selectOption);
  function selectOption (){
    const option = category.options[category.selectedIndex];
    const getCategoryId = option.value;
    return getCategoryId
  }
  const categoryId = selectOption();
  const is_published = 1;

  if(title.length < 2) {
    createEditorAlert("Title should be more than 2 words");
    return
  }
  if(content.length < 2) {
    createEditorAlert("Content cannot be empty");
    return
  }
  if(!categoryId) {
    createEditorAlert("Choose category id for your content");
    return
  }

  const posting = await reqCreateArticle(title, content, categoryId, is_published);

  // 포스팅이 성공적으로 업로드 되었을 경우, 이미지 파일 db에 썸네일 삽입
  if(posting){
    window.location.href = `/articles`
  } else {
    alert("error");
  }
}
