// 1개의 게시글 데이터 fetch
import {
  reqGetArticle,
  reqLikes,
  reqGetLikes,
  reqDeleteArticle,
} from "./article.js";
// 게시글에 대한 댓글 데이터 fetch
import {
  reqCreateComment,
  reqGetComments,
  reqGetComment,
  reqEditComment,
  reqDeleteComment,
} from "./comment.js";
import { reqLoginCheck } from "./user.js";
import { accountMenu } from "./login_success.js";
import { reqArticleProfileImage } from "./file.js";
import { domain } from "./common.js";

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

// 로그인 안한 유저의 접근 시 경고창
const authenticationAlert = (alertText) => {
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
  loginNoBtn.onclick = function () {
    editorModal.style.display = "none";
  };
  loginYesBtn.onclick = async function () {
    window.location.href = "/login";
  };
};

// 댓글 형식이 옳지 않은 경우 경고창
const emptyAlert = (alertText) => {
  const editorModal = document.getElementById("editor__modal");
  const modalText = document.querySelector(".editor__modal-content__guide");
  const loginYesBtn = document.querySelector(".login-yesbtn");
  const loginNoBtn = document.querySelector(".login-nobtn");

  loginYesBtn.innerHTML = "OK";
  loginNoBtn.style.display = "none";
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
  loginYesBtn.onclick = async function () {
    editorModal.style.display = "none";
  };
};

// 게시물 작성 인가 확인용 버튼
const createPosting = document.querySelector(".article__create-btn");
createPosting.addEventListener("click", (e) => {
  if (!loggedinUserId) {
    e.preventDefault();
    authenticationAlert("Authentication required. \n Do you want to log in?");
  }
});

// ------------------ articles ------------------ //

// 게시글의 인덱스값을 url에서 가져옴
const articleId = window.location.pathname.substring(10);
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

// 게시글 컴포넌트 구현
const showArticle = async (articleData) => {
  const article = document.querySelector(".article__content");
  const wrapper = document.createElement("div");
  const userSection = document.createElement("section");
  const img = document.createElement("img");
  const userSectionDiv = document.createElement("div");
  const nickname = document.createElement("div");
  const date = document.createElement("div");
  const editDeleteContainer = document.createElement("div");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");
  const title = document.createElement("h2");
  const content = document.createElement("p");
  const reactionSection = document.createElement("section");
  const likeBtn = document.createElement("button");
  const likeImg = document.createElement("img");
  const views = document.createElement("span");
  const writerImg = await reqArticleProfileImage(
    articleData["article"].user_id
  );


  likeImg.setAttribute("src", "/like.png");
  editDeleteContainer.setAttribute("id", "edit-delete");
  editDeleteContainer.style.display = "none";
  wrapper.className = "article__content__container";
  userSection.className = "article__content__container-user";
  img.className = "article__content__container-user-img";
  nickname.className = "article__content--nickname";
  date.className = "article__content--date";
  title.className = "article__content--title";
  content.className = "article__content__container-words";
  reactionSection.className = "article__content__container-reaction";
  likeImg.className = "article__content--likes";
  likeBtn.className = "article__content--like-Btn";
  views.className = "article__content--views";
  editDeleteContainer.className = "article__content--edit-delete";
  editBtn.className = "edit";
  deleteBtn.className = "delete";

  nickname.innerHTML = articleData["writer"];
  const localDate = new Date(articleData["article"].create_at).toLocaleString();
  date.innerHTML = localDate.split(",", 1);
  title.innerHTML = articleData["article"].title;
  content.innerHTML = articleData["article"].content;
  views.innerHTML = articleData["article"].views + " Views";
  editBtn.innerHTML = "Edit";
  deleteBtn.innerHTML = "Delete";

  //로그인 상태에 따라 유저 게시물 수정 및 삭제 권한 부여
  if (loggedinUserId === articleData["article"].user_id) {
    editDeleteContainer.style.display = "block";
  }

  editDeleteContainer.append(editBtn, deleteBtn);
  likeBtn.append(likeImg);
  reactionSection.append(likeBtn, views);
  userSectionDiv.append(nickname, date);
  userSection.append(img, userSectionDiv, editDeleteContainer);
  wrapper.append(userSection, title, content, reactionSection);
  article.prepend(wrapper);

  const likeInfo = await reqGetLikes(articleData["article"].id);
  if (writerImg) {
    img.setAttribute("src", writerImg);
  } else {
    img.setAttribute("src", "/user_profile.png");
  }
  if(likeInfo.data === false){
    return likeImg.setAttribute("src", "/like.png");
  }
  if (likeInfo.data[0].is_liked === 1) {
    likeImg.setAttribute("src", "/liked.png");
  } else {
    likeImg.setAttribute("src", "/like.png");
  }
};
await showArticle(article);

// 게시글 삭제 이벤트
const deleteComponent = document.querySelector(".delete");
deleteComponent.addEventListener("click", deleteArticle);
async function deleteArticle() {
  const response = await reqDeleteArticle(articleId);
  if (response) {
    window.location.href = "/articles";
  }
}

// 게시글 수정 이벤트
const editComponent = document.querySelector(".edit");
editComponent.addEventListener("click", editArticle);
async function editArticle() {
  window.location.href = `/edit/${articleId}`;
}

// 다음 게시물 조회 컴포넌트
const nextArticle = async (articleData) => {
  const nextContainer = document.querySelector(".article__next--content");
  const nextWriterImg = document.createElement("img");
  const nextContentDiv = document.createElement("div");
  const nextContentLink = document.createElement("a");
  const nextWriterNickname = document.createElement("div");
  const writerImg = await reqArticleProfileImage(
    articleData["article"].user_id
  );

  if (writerImg) {
    nextWriterImg.setAttribute("src", writerImg);
  } else {
    nextWriterImg.setAttribute("src", "/user_profile.png");
  }

  nextWriterImg.className = "article__comment--user-img";
  nextContentLink.className = "article__next--content-title";
  nextContentLink.setAttribute(
    "href",
    `/articles/${articleData["article"].id}`
  );
  nextContentLink.innerHTML = articleData["article"].title + "</br>";
  nextWriterNickname.innerHTML = articleData["writer"];
  nextContentDiv.append(nextContentLink, nextWriterNickname);
  nextContainer.append(nextWriterImg, nextContentDiv);
};

// 다음 게시물 인덱스가 삭제된 게시물일 경우, 해당 게시물을 거르는 함수
async function findNextArticle(articleId) {
  for (let i = articleId - 1; i > 0; i--) {
    const nextArticleData = await getArticle(i);
    if (!nextArticleData) {
      continue;
    } else if (nextArticleData) {
      await nextArticle(nextArticleData);
      return;
    }
  }
}
await findNextArticle(articleId);

// 좋아요 생성 및 취소
const likeBtn = document.querySelector(".article__content--like-Btn");
likeBtn.addEventListener("click", likeEvent);
async function likeEvent() {
  const likedCheck = document.querySelector(".article__content--likes");
  if (!loggedinUserId) {
    authenticationAlert("Authentication required. \n Do you want to log in?");
    return;
  }
  const like = await reqLikes(article["article"].id);
  if (like.is_liked == 1) {
    likedCheck.src = `${domain}/liked.png`;
  }
  if (like.is_liked == 0) {
    likedCheck.src = `${domain}/like.png`;
  }
}

// ------------------ comments ------------------ //

// 댓글 데이터 가져오기
// more_comments : 다음 댓글이 있는지 없는지 알 수 있는 변수
// next_cursor : 다음 댓글의 인덱스 번호
let more_comments = false;
let next_cursor = 0;
const getComments = async (limit, cursor) => {
  try {
    const response = await reqGetComments(articleId, limit, cursor);
    // 댓글 페이지 정보 넣기
    more_comments = response["paging"].more_comments;
    next_cursor = response["paging"].next_cursor;
    return response;
  } catch (error) {
    console.log(error);
  }
};

// 게시글 첫 화면에 보이는 댓글 페이지
const comments = await getComments(4, 0);

// 댓글 추가 조회 시 컴포넌트 생성 함수
const showComments = async (commentsData) => {
  const siblingTag = document.querySelector(".article__comment__lists");
  for (let i = 0; i < commentsData["data"].length; i++) {
    const commentSection = document.createElement("section");
    const commenterImg = document.createElement("img");
    const articleContents = document.createElement("article");
    const nickname = document.createElement("span");
    const index = document.createElement("span");
    const commentContentContainer = document.createElement("div");
    const content = document.createElement("p");
    const date = document.createElement("span");
    const editDeleteContainer = document.createElement("span");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const commentId = commentsData["data"][i].id;
    const commentInfo = await reqGetComment(commentId);
    const writerNickname = commentInfo["writer"];
    const writerImg = await reqArticleProfileImage(
      commentsData["data"][i].user_id
    );

    if (writerImg) {
      commenterImg.setAttribute("src", writerImg);
    } else {
      commenterImg.setAttribute("src", "/user_profile.png");
    }

    index.setAttribute("id", "index");
    commentSection.className = "article__comment";
    commenterImg.className = "article__comment--user-img";
    articleContents.className = "article__comment--contents";
    nickname.className = "article__comment--user-nickname";
    commentContentContainer.className = "article__comment--container";
    content.className = "article__comment--container__content";
    date.className = "article__comment--container__create-at";
    editDeleteContainer.className = "article__comment--edit-delete";
    editBtn.className = "comment-edit";
    deleteBtn.className = "comment-delete";
    editDeleteContainer.style.display = "none";

    nickname.innerHTML = writerNickname;
    index.innerHTML = commentId;
    const localDate = new Date(
      commentsData["data"][i].create_at
    ).toLocaleString();
    date.innerHTML = localDate;
    content.innerHTML = commentsData["data"][i].content;
    editBtn.innerHTML = "Edit";
    deleteBtn.innerHTML = "Delete";

    index.hidden = true;
    // 로그인 상태에 따라 유저 게시물 수정 및 삭제 권한 부여
    if (loggedinUserId === commentInfo.result[0].user_id) {
      editDeleteContainer.style.display = "block";
    }
    nickname.appendChild(index);
    commentContentContainer.append(content, date);
    editDeleteContainer.append(editBtn, deleteBtn);
    articleContents.append(
      nickname,
      commentContentContainer,
      editDeleteContainer
    );
    commentSection.append(commenterImg, articleContents);

    if (commentsData["data"].length === 1) {
      return siblingTag.prepend(commentSection);
    }
    siblingTag.append(commentSection);
  }
};
await showComments(comments);

// 댓글 삭제 이벤트
const deleteCommentComponent = document.querySelector(".comment-delete");
if (deleteCommentComponent) {
  deleteCommentComponent.addEventListener("click", deleteComment);
  async function deleteComment() {
    const commentId = document.getElementById("index");
    const response = await reqDeleteComment(commentId.innerText);
    if (response) {
      window.location.href = `/articles/${articleId}`;
    }
  }
}

// 댓글 수정 이벤트
const editCommentComponent = document.querySelector(".comment-edit");
if (editCommentComponent) {
  editCommentComponent.addEventListener("click", editComment);
  async function editComment() {
    const container = document.querySelector(".article__comment--container");
    const btnContainer = document.querySelector(
      ".article__comment--edit-delete"
    );
    const nickname = document.querySelector(".article__comment--user-nickname");
    await editEditor(nickname);
    const commentId = document.getElementById("index");
    const commentInfo = await reqGetComment(commentId.innerText);
    const textarea = document.getElementById("text");
    textarea.innerHTML = commentInfo.result[0].content;
    btnContainer.style.display = "none";
    container.style.display = "none";

    const cancelBtn = document.querySelector(".article__comment--cancel-btn");
    cancelBtn.addEventListener("click", function() {
      const textarea = document.querySelector(".article__comment__reply-section");
      nickname.removeChild(textarea);
      btnContainer.style.display = "block";
      container.style.display = "block";
    })

    const submitBtn = document.getElementById("submit");
    submitBtn.addEventListener("click", async function() {
      const commentId = document.getElementById("index");
      const editedComment = document.getElementById("text");
      const response = await reqEditComment(commentId.innerText, editedComment.value);
      if(response){
        window.location.reload();
      }
    })
  }
}

// More Comments 댓글을 눌렀을 때 다음 댓글이 조회되도록 하는 이벤트 생성
document
  .getElementById("moreComments")
  .addEventListener("click", async function () {
    try {
      if (more_comments) {
        const response = await getComments(4, next_cursor + 1);
        await showComments(response);
      } else if (!more_comments) {
        alert("댓글이 없습니다");
      }
    } catch (error) {
      console.log(error.message);
    }
  });

// 댓글 생성 이벤트
const commentCreateBtn = document.getElementById("comment");
commentCreateBtn.addEventListener("click", createComment);
async function createComment() {
  let content = document.querySelector(".commentContent").value;
  // 댓글 작성 권한 확인
  if (!loggedinUserId) {
    authenticationAlert("Authentication required. \n Do you want to log in?");
    return;
  }
  // 댓글 본문 유효성 검사
  if (content.length < 1) {
    emptyAlert("Comment cannot be empty");
    return;
  }

  const orders = 0;
  const posting = await reqCreateComment(articleId, content, orders);
  if (posting) {
    const addComment = await getComments(1, 0);
    next_cursor = next_cursor - 4;
    await showComments(addComment);
  } else {
    alert("comment error");
  }
}

// 수정 댓글창 생성 컴포넌트 함수
const editEditor = async (t) => {
  const section = document.createElement("section");
  const textarea = document.createElement("textarea");
  const submitBtn = document.createElement("input");
  const cancelBtn = document.createElement("button");
  section.className = "article__comment__reply-section";
  textarea.style.width = "80%";
  textarea.setAttribute("id", "text");
  textarea.className = "commentContent";
  submitBtn.setAttribute("type", "submit");
  submitBtn.setAttribute("id", "submit");
  submitBtn.className = "commentSubmit";
  cancelBtn.className = "article__comment--cancel-btn";
  cancelBtn.innerHTML = "Cancel";
  section.append(textarea, submitBtn, cancelBtn);
  t.append(section);
};
