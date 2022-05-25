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
// 북마크 목록 및 검색 목록 조회 request
// URL : /bookmarks?page&size
function reqGetBookmarks() {
  // dummy data
  // 쿼리로 들어갈 변수들의 정보, 북마크 목록 및 검색 목록 조회는 offset pagination 형식으로 구현.
  // 왜 offset과 cursor 방식으로 나누어서 구현하였는가?
  // 전체 게시판은 스크롤 방식, 내 게시판은 페이지 조회 방식으로 기획했기 때문. (그런데 구현해 나가면서 api가 불필요하게 많다는 느낌이 들었습니다.)
  // page: 페이지 숫자를 의미, size: 한 페이지 당 보여지는 게시물의 개수
  // key: 검색어
  const query_info = {
    page: 1,
    size: 10,
    key: ""
  };
  // 쿼리문으로 생성
  const query = Object.keys(query_info)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(query_info[k]))
    .join("&");

  request(`bookmarks?${query}`, httpMethod.get)
    .then((json) => {
      let result = "";
      for(let i = 0; i < json['data'].length; i++){
        result = result + `
          "id": ${json['data'][i].id}
          "article_id": ${json['data'][i].article_id}
          "user_id": ${json['data'][i].user_id}
          "title": ${json['data'][i].title}
          "content": ${json['data'][i].content}
          "create_at": ${json['data'][i].create_at}
          "comments": ${json['data'][i].total_comments}
          "likes": ${json['data'][i].total_likes}
        `;
      }
      console.log(json['data']);
      console.log(result);
    })
    .catch((error) => console.log(error));
}


// 22.05.14
// 북마크 상세 조회 request
// URL : /bookmarks/:bookmark_id
function reqGetBookmark() {
  // dummy data
  const bookmark_id = 11;

  request(`bookmarks/${bookmark_id}`, httpMethod.get)
    .then((json) => {
      // article_id: 북마크된 게시글 Index,
      // user_id: 북마크된 게시글 작성자 Index,
      // title: 글제목, content: 글내용,
      // create_at: 글 생성일자, views: 조회수
      // comments: 댓글 총 개수, likes: 좋아요 총 개수
      const result =
        `article_id: ${json["data"][0].id}
        user_id: ${json["data"][0].user_id}
        title: ${json["data"][0].title}
        content: ${json["data"][0].content}
        create_at: ${json["data"][0].create_at}
        views: ${json["data"][0].views}
        comments: ${json["data"][0].total_comments}
        likes: ${json["data"][0].total_likes}`

      console.log(result);
      console.log(json);
    })
    .catch((error) => console.log(error));
}

// 22.05.14
// 북마크 생성 request
// URL : /bookmarks
function reqCreateBookmark(){
  // dummy data
  const body = {
    // 북마크하려는 작성자의 Index
    user_id: 51,
    // 북마크하려는 게시글의 Index
    article_id: 154
  };

  request(`bookmarks`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

// 22.05.14
// 북마크 삭제 request
// URL : /bookmarks/:bookmark_id
function reqDeleteBookmark(){
  // dummy data
  // 삭제할 북마크의 Index
  const bookmark_id = 13;
  const body = {
    // 북마크 삭제하는 작성자의 Index
    user_id: 51
  };

  request(`bookmarks/${bookmark_id}`, httpMethod.delete, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}