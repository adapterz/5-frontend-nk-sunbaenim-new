// 052522 게시글 상세 불러오기 기능 수행
import { httpMethod, request } from "./common.js";

// 게시글 상세 조회 request
// URL : /articles/:article_id
// TODO: 백엔드 API 상에서 게시물 상세 조회 API 작동 시 조회수도 같이 올라가도록 설계 되어 있다. 조회수를 올리려면 req.cookie를 확인할 수 있어야 하는데, 이 방법 보완이 필요.
const reqGetArticle = async () => {
  const articleId = window.location.pathname.substring(10);
  //052422 async await 도입
  //052522 게시글 데이터 가져오기
  const getArticle = async (articleId) => {
    try {
      const response = await request(`articles/${articleId}`, httpMethod.get);
      // data : 1개의 게시물 정보
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const article = await getArticle(articleId);
  // 게시물 관련 컴포넌트
  const showArticle = async (articleData) => {
    const article = document.querySelector(".article__content");
    const writerImg = document.createElement("img");
    const userSection = document.createElement("section");
    const userImg = document.createElement("button");
    const userSectionDiv = document.createElement("div");
    const nickname = document.createElement("div");
    const date = document.createElement("div");
    const title = document.createElement("h2");
    const content = document.createElement("p");
    const reactionSection = document.createElement("section");
    const likes = document.createElement("span");
    const bookmark = document.createElement("span");

    writerImg.setAttribute("src", `#`);
    writerImg.className = "article__content--thumbnail";
    userSection.className = "article__content--user";
    userImg.className = "article__content--user-img";
    nickname.className = "article__content--nickname";
    date.className = "article__content--date";
    title.className = "article__content--title";
    content.className = "article__content--words";
    reactionSection.className = "article__content--reaction";
    likes.className = "article__content--likes";
    bookmark.className = "article__content--bookmark";

    nickname.innerHTML = articleData["writer"];
    date.innerHTML = articleData["article"].create_at.substring(0, 10);
    title.innerHTML = articleData["article"].title;
    content.innerHTML = articleData["article"].content;
    likes.innerHTML = articleData["article"].total_likes + " Likes";
    bookmark.innerHTML = "Bookmark";

    reactionSection.append(likes, bookmark);
    userSectionDiv.append(nickname, date);
    userSection.append(userImg, userSectionDiv);
    article.prepend(writerImg, userSection, title, content, reactionSection);
  };
  await showArticle(article);
  // TODO: 다음 게시물 조회 컴포넌트
  const nextArticle = async () => {};
};
await reqGetArticle();

const reqGetComments = async () => {
  //052522 댓글 데이터 가져오기
  // more_comments : 다음 댓글이 있는지 없는지 알 수 있는 변수
  // next_cursor : 다음 댓글의 인덱스 번호
  let more_comments = false;
  let next_cursor = 0;
  const articleId = window.location.pathname.substring(10);
  const getComments = async (limit, cursor) => {
    try {
      const response = await request(
        `comments?article_id=${articleId}&limit=${limit}&cursor=${cursor}`
      );
      const data = await response.json();
      // paging의 정보 넣기
      more_comments = data["paging"].more_comments;
      next_cursor = data["paging"].next_cursor;
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const comments = await getComments(4, 0);
  // 댓글 관련 컴포넌트
  const showComment = async (commentsData) => {
    // FIXME: 대댓글 기능에 대한 구현 고민 필요
    for (let i = 0; i < commentsData["data"].length; i++) {
      const siblingTag = document.querySelector(".article__content--comment")
      const commentSection = document.createElement("section");
      const a = document.createElement("a");
      const commenterImg = document.createElement("img");
      const articleContents = document.createElement("article");
      const nickname = document.createElement("span");
      const content = document.createElement("p");
      const likes = document.createElement("span");
      const date = document.createElement("span");
      const replies = document.createElement("span");
      const replyBtn = document.createElement("button");

      a.setAttribute("href", `#`);
      replyBtn.setAttribute("type", "button");
      commentSection.className = "article__comment";
      commenterImg.className = "article__comment--user-img";
      articleContents.className = "article__comment--contents";
      nickname.className = "article__comment--user-nickname";
      likes.className = "article__comment--likes";
      replies.className = "article__comment--replies";
      date.className = "article__comment--create-at";
      replyBtn.className = "article__comment--reply-btn";

      nickname.innerHTML = commentsData["data"][i].user_id;
      date.innerHTML = commentsData["data"][i].create_at.substring(0, 10);
      content.innerHTML = commentsData["data"][i].content;
      likes.innerHTML = commentsData["data"][i].total_likes + " Likes";
      replies.innerHTML = commentsData["data"][i].total_replies + " Comments";
      replyBtn.innerHTML = "Reply";

      articleContents.append(nickname, content, likes, replies, date, replyBtn);
      a.append(commenterImg);
      commentSection.append(a, articleContents);
      siblingTag.after(commentSection);
    }
  };
  await showComment(comments);

  // More Comments 댓글을 눌렀을 때 다음 댓글이 조회되도록 하는 이벤트 생성
  document.getElementById("moreComments").addEventListener('click', async function(){
    try {
      if(more_comments){
        const response = await getComments(4, next_cursor+1);
        showComment(response);
      } else if(!more_comments){
        alert('댓글이 없습니다');
      }
    } catch (error) {
      console.log(error.message);
    }
  });
}
await reqGetComments();