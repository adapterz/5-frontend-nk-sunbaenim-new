//052322 HTTP METHOD, url 모듈화
import { httpMethod, request } from "./common.js";

// 051322
// 게시글 생성 request
// URL : /articles
async function reqCreateArticle() {
  // dummy data
  const body = {
    // 게시물 작성자의 Index
    user_id: 51,
    title: "fetch test 2",
    content: "페치 게시물 테스트용 본문 더미 데이터입니다.",
    // 게시물의 주제를 카테고리화한 식별 숫자.(예: 스터디 모임 카테고리일 경우 숫자 4로 분류)
    category_id: 1,
    // is_publish이 1일 경우 발행된 게시물, 0일 경우 미발행 게시물을 말한다.
    is_published: 1,
  };

  try{
    //052422 async await 도입
    const response = await request(`articles`, httpMethod.post, body, {"Content-Type": "application/json"});
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 게시글 수정 request
// URL : /articles
async function reqEditArticle() {
  // dummy data
  const body = {
    // 작성자의 Index
    user_id: 64,
    // 게시글의 Index
    article_id: 158,
    // 수정할 게시글의 제목
    title: "fetch edit test 2",
    // 수정할 게시글의 본문
    content: "페치 게시글 수정 테스트용 본문 더미 데이터입니다.",
    // 수정할 게시글의 주제 카테고리
    category_id: 2,
  };

  try{
    //052422 async await 도입
    const response = await request(`articles`, httpMethod.patch, body, {"Content-Type": "application/json"});
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 게시글 삭제 request
// URL : /articles/:article_id
async function reqDeleteArticle() {
  // dummy data
  // 삭제할 게시글의 Index
  const article_id = 160;
  const body = {
    user_id: 64
  }

  // HTTP 메서드는 delete지만 실제 DB에서 create_at 변수(게시물 생성일자)는 Null 처리, delete_at 변수(게시물 삭제일자)에 삭제 날짜만 업로드하고 나머지 데이터는 유지함
  // DELETE request는 바디값이 없어야 하는 것이 일반적.
  // 따라서 삭제할 게시물 id는 바디가 아닌 url로 전달한다.
  // 여기서 전달하는 body 값은 API 테스트를 위한 dummy data
  try{
    //052422 async await 도입
    const response = await request(`articles/${article_id}`, httpMethod.delete, body, {"Content-Type": "application/json"});
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}


// 22.05.13
// 내가 발행한/임시저장한 게시글 목록 조회 request
// URL : /articles/my/:is_published?page&size FIXME: url 너무 이상한거같다.
async function reqGetMyArticles() {
  // dummy data
  // 쿼리로 들어갈 변수들의 정보, 내 발행/임시발행 목록 조회는 offset pagination 형식으로 구현
  // page: 페이지 숫자를 의미, size: 한 페이지 당 보여지는 게시물의 개수
  const query_info = {
    page: 1,
    size: 10,
  };
  // 쿼리문으로 생성
  const query = Object.keys(query_info)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(query_info[k]))
    .join("&");

  // 0은 임시 발행한 게시물을, 1은 유저가 발행한 게시물을 의미한다.
  const is_published = 1;

  try{
    //052422 async await 도입
    const response = await request(`articles/my/${is_published}?${query}`, httpMethod.get);
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 게시글 좋아요 생성 또는 취소 request
// URL : /articles/likes
async function reqLikes() {
  // dummy data
  const body = {
    // 좋아요를 누른 유저의 Index
    user_id: 60,
    // 좋아요가 눌린 게시글의 Index
    article_id: 156
  };

  try{
    //052422 async await 도입
    const response = await request(`articles/likes`, httpMethod.post, body, {"Content-Type": "application/json"});
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}

async function historyBack(){
  history.back();
}
