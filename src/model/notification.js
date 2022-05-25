// 22.05.14
// METHOD 모듈화
const httpMethod = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};

// 22.05.14
// REQUEST MODULE
async function request(path, method, body, headers = {}) {
  const url = `http://localhost:8080/${path}`;
  const options = {
    method: method,
    headers: {
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

// 22.05.14
// 알림 목록 조회 request
// URL : /notifications
function reqGetNotiList() {
  request(`notifications`, httpMethod.get)
    .then((json) => {
      let result = "";
      for (let i = 0; i < json["data"].length; i++) {
        // id: 알림 Index, article_id: 업데이트 된 게시물의 Index
        // comment_id: 업데이트 된 댓글의 Index
        // reaction: 알림 받은 항목의 종류(좋아요인지 댓글인지)
        // reaction_id: 좋아요 혹은 댓글을 단 유저의 Index
        result =
          result +
          `
        "id": ${json["data"][i].id}
        "article_id": ${json["data"][i].article_id}
        "comment_id": ${json["data"][i].comment_id}
        "reaction": ${json["data"][i].reaction}
        "reaction_id": ${json["data"][i].reaction_id}
      `;
      }
      console.log(result);
      console.log(json["data"]);
    })
    .catch((error) => console.log(error));
}

// 22.05.14
// 알림 목록의 내용 확인 request
// URL : /notifications/:notification_id
// FIXME: CORS 에러 발생
async function reqCheckNoti() {
  try {
    const notification_id = 7;
    const options = {
      method: httpMethod.get,
      redirect: "follow",
    };

    const res = await fetch(`notifications/${notification_id}`, options);

    if (res.redirected) return res.redirect(res.url);
  } catch (error) {
    console.log(error);
  }
}
