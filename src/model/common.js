export const httpMethod = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};

const defaultUrl = "http://localhost:8080"

export const request = (async (path, method, body, headers = {}) => {
  const url = defaultUrl + '/' + path;
  const options = {
    method: method,
    // cors 문제 해결을 위해 추가
    credential: "include",
    headers: {
      ...headers,
    },
    body: JSON.stringify(body),
  };

  const res = await fetch(url, options);
  return res;
})

// FIXME: 상태코드 모듈화 어떻게 적용할까..
export const status = ((res) => {
  let data = ""
  if(res.status === 204){
    data = "NO CONTENT";
    return data;
  } else if(res.status === 200 || res.status === 201) {
    data = res.json();
    return data;
  } else if (res.status === 400 || res.status === 401){
    data = "Client error";
    return data;
  } else if (res.status === 404){
    data = "Not found";
    return data;
  } else {
    throw new Error(res.status)
  }
})