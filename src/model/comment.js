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
      // FIXME: GET 요청일 때 아래 헤더를 제외해야 한다. 고칠 방법 생각
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  let data = "";
  if (res.status === 204) {
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
// 댓글 생성 request
// URL : /comments
function reqCreateComment() {
  // dummy data
  const body = {
    // 댓글을 작성한 게시물의 Index
    article_id: 158,
    // 댓글 작성자의 Index
    user_id: 51,
    // 댓글 내용
    content: "페치 테스트용 댓글 더미 데이터입니다.",
    // 생성되는 댓글이 대댓글일 경우, 대댓글의 순서를 식별하기 위함 (디폴트, 즉 부모 댓글일 경우는 0)
    orders: 0,
    // 만약 생성되는 댓글이 대댓글일 경우, 부모의 식별 id를 입력 (디폴트, 즉 부모 댓글일 경우는 null)
    group_id: null,
  };

  request(`comments`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 댓글 수정 request
// URL : /comments
function reqEditComment() {
  // dummy data
  const body = {
    // 댓글 수정하는 유저의 Index
    user_id: 51,
    // 수정하려는 댓글의 Index
    comment_id: 15,
    // 수정한 댓글 내용
    content: "페치 테스트용 댓글 수정 더미 데이터입니다.",
  };

  request(`comments`, httpMethod.patch, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 댓글 삭제 request
// URL : /comments/:comment_id
function reqDeleteComment() {
  // dummy data
  // 삭제하려는 댓글의 Index
  const comment_id = 13;
  const body = {
    user_id: 39
  }
  // DELETE 메소드는 body 값을 전달하지 않는다.
  // API 테스트를 위한 유저 식별값 전달. (원래는 session으로 전달 된다)
  request(`comments/${comment_id}`, httpMethod.delete, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.13
// 게시글의 댓글 목록 조회 request
// URL : /comments?article_id&limit&cursor
function reqGetComments() {
  // dummy data
  // 쿼리로 들어갈 변수들의 정보
  // 전체 게시글 목록 조회는 cursor pagination 형식으로 구현
  // article_id: 댓글이 달린 게시글의 Index
  // cursor: 조회된 목록의 첫번째 Index
  // limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
  const query_info = {
    article_id: 14,
    cursor: 0,
    limit: 10,
  };

  // 쿼리문으로 생성
  // TODO: Object.keys 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환
  const query = Object.keys(query_info)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(query_info[k]))
    .join("&");

  request(`comments?${query}`, httpMethod.get)
    .then((json) => {
      let result = "";
      for(let i = 0; i < json['data'].length; i++){
      // id: 댓글 Index, user_id: 댓글 작성자, content: 글내용,
      // create_at: 댓글 생성일, comments: 댓글 총 개수, likes: 좋아요 총 개수
      // group_id: 대댓글일 경우 부모의 id 입력
      // class: 대댓글일 경우 자식을 의미하는 1, 부모인 경우 0
      // orders: 대댓글일 경우 순서를 의미, 부모인 경우 0
        result = result + `
          "id": ${json['data'][i].id}
          "user_id": ${json['data'][i].user_id}
          "content": ${json['data'][i].content}
          "create_at": ${json['data'][i].create_at}
          "comments": ${json['data'][i].total_replies}
          "likes": ${json['data'][i].total_likes}
          "group_id": ${json['data'][i].group_id}
          "class": ${json['data'][i].class}
          "orders": ${json['data'][i].orders}
        `;
      }
      // console.log(json['data']);
      console.log(result);
    })
    .catch((error) => console.log(error));
}

// 22.05.13
// 댓글 좋아요 생성 또는 취소 request
// URL : /comments/likes
function reqLikes() {
  // dummy data
  const body = {
    // 좋아요를 누른 유저의 Index
    user_id: 60,
    // 좋아요가 눌린 댓글의 Index
    comment_id: 15
  };

  request(`comments/likes`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
