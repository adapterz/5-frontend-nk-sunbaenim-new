// 22.05.13
// METHOD 모듈화
const httpMethod = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};


// 22.05.13
// REQUEST MODULE
async function request(path, method, body, headers = {}) {
  const url = `http://localhost:8080/${path}`;
  const options = {
    method: method,
    headers: {
      // FIXME: GET 요청일 때 아래 헤더를 제외해야 한다. 고칠 방법 생각 필요.
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  let data = "";
  if (res.status === 204) { // 다른 status code까지 모듈화
    data = "NO CONTENT";
    return data;
  }
  data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw Error(data);
  }
}

// 22.05.13
// 게시글 생성 request
// URL : /articles
function reqCreateArticle() {
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

  request(`articles`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 게시글 수정 request
// URL : /articles
function reqEditArticle() {
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

  request(`articles`, httpMethod.patch, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 게시글 삭제 request
// URL : /articles/:article_id
function reqDeleteArticle() {
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
  request(`articles/${article_id}`, httpMethod.delete, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 게시글 상세 조회 request
// URL : /articles/:article_id
// 22.05.13
// TODO: 백엔드 API 상에서 게시물 상세 조회 API 작동 시 조회수도 같이 올라가도록 설계 되어 있다. 조회수를 올리려면 req.cookie를 확인할 수 있어야 하는데, 이 방법 보완이 필요.
function reqGetArticle() {
  // dummy data
  const article_id = 157;

  request(`articles/${article_id}`, httpMethod.get)
    .then((data) => {
      // writer: 작성자, title: 글제목, content: 글내용,
      // views: 조회수, comments: 댓글 총 개수, likes: 좋아요 총 개수
      const result =
        `writer: ${data["writer"]}\n
        title: ${data["article"].title}\n
        content: ${data["article"].content}\n
        views: ${data["article"].views}\n
        comments: ${data["article"].total_comments}\n
        likes: ${data["article"].total_likes}\n`

      console.log(result);
      // console.log(data["writer"], data["article"]);
    })
    .catch((error) => console.log(error));
}

// 22.05.13
// 내가 발행한/임시저장한 게시글 목록 조회 request
// URL : /articles/my/:is_published?page&size FIXME: url 너무 이상한거같다.
function reqGetMyArticles() {
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

  request(`articles/my/${is_published}?${query}`, httpMethod.get)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 게시글 목록 조회 request
// URL : /articles?limit&cursor&key
function reqGetArticles() {
  // dummy data
  // 쿼리로 들어갈 변수들의 정보, 전체 게시글 목록 조회는 cursor pagination 형식으로 구현
  // cursor: 조회된 목록의 첫번째 인덱스
  // limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
  // key: 검색어
  const query_info = {
    cursor: 0,
    limit: 10,
    key: "",
  };

  // 쿼리문으로 생성
  // TODO: Object.keys 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환
  const query = Object.keys(query_info)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(query_info[k]))
    .join("&");

  request(`articles?${query}`, httpMethod.get)
    .then((json) => {
      let result = "";
      for(let i = 0; i < json['data'].length; i++){
        result = result + `
          "id": ${json['data'][i].id}
          "user_id": ${json['data'][i].user_id}
          "title": ${json['data'][i].title}
          "create_at": ${json['data'][i].create_at}
          "comments": ${json['data'][i].total_comments}
          "likes": ${json['data'][i].total_likes}
        `;
      }
      // console.log(json['data']);
      console.log(result);
    })
    .catch((error) => console.log(error));
}

// 22.05.13
// 게시글 좋아요 생성 또는 취소 request
// URL : /articles/likes
function reqLikes() {
  // dummy data
  const body = {
    // 좋아요를 누른 유저의 Index
    user_id: 60,
    // 좋아요가 눌린 게시글의 Index
    article_id: 156
  };

  request(`articles/likes`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
