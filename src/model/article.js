//052322 HTTP METHOD, url 모듈화
import { httpMethod, request } from "./common.js";
export { reqCreateArticle, reqGetMyArticles, reqGetArticle, reqGetArticles, reqLikes, reqGetLikes, reqDeleteArticle, reqEditArticle };

// 051322
// 게시글 생성 request
// URL : /articles
async function reqCreateArticle(title, content, category_id, is_published) {
  // dummy data
  const body = {
    title: title,
    content: content,
    category_id: category_id,
    is_published: is_published,
  };

  try{
    //052422 async await 도입
    const response = await request(`articles`, httpMethod.post, body, {"Content-Type": "application/json"});
    if (response.status === 201) {
      const data = response.json();
      console.log(data);
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 게시글 수정 request
// URL : /articles
async function reqEditArticle(article_id, title, content, category_id) {
  const body = {
    // 게시글의 Index
    article_id: article_id,
    // 수정할 게시글의 제목
    title: title,
    // 수정할 게시글의 본문
    content: content,
    // 수정할 게시글의 주제 카테고리
    category_id: category_id,
  };

  try{
    //052422 async await 도입
    const response = await request(`articles`, httpMethod.patch, body, {"Content-Type": "application/json"});
    console.log(response);
    return response
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 게시글 삭제 request
// URL : /articles/:article_id
async function reqDeleteArticle(articleId) {
  // HTTP 메서드는 delete지만 실제 DB에서 create_at 변수(게시물 생성일자)는 Null 처리, delete_at 변수(게시물 삭제일자)에 삭제 날짜만 업로드하고 나머지 데이터는 유지함
  // DELETE request는 바디값이 없어야 하는 것이 일반적.
  // 따라서 삭제할 게시물 id는 바디가 아닌 url로 전달한다.
  // 여기서 전달하는 body 값은 API 테스트를 위한 dummy data
  try{
    //052422 async await 도입
    const response = await request(`articles/${articleId}`, httpMethod.delete);
    return response
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
async function reqLikes(articleId) {
  const body = {
    // 좋아요가 눌린 게시글의 Index
    article_id: articleId
  };
  console.log(body);

  try{
    const response = await request(`articles/likes`, httpMethod.post, body, {"Content-Type": "application/json"});
    const data = await response.json();
    console.log(data);
    return data;
  } catch(error){
    console.log(error);
  }
}

// 22.06.13
// 게시글 좋아요 정보 확인
// URL : /articles/likes
async function reqGetLikes(articleId){
  try{
    const response = await request(`articles/likes/${articleId}`);
    const data = await response.json();
    return data;
  } catch(error){
    console.log(error);
  }
}

// 게시글 상세 조회 request
async function reqGetArticle(article_id) {
  try{
    const response = await request(`articles/${article_id}`);
    if(response.ok){
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}

// 게시글 목록 조회 request
// URL : /articles?limit&cursor&key
// infinite pagination
// cursor: 조회된 목록의 첫번째 인덱스
// limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
// key: 검색어
async function reqGetArticles(cursor, limit, key) {
  try{
    let defaultUrl = `articles?limit=${limit}&cursor=${cursor}&key=`;
    if(key){
      defaultUrl = `articles?limit=${limit}&cursor=${cursor}&key=${key}`
    }
    const response = await request(defaultUrl);
    if(response.ok){
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}