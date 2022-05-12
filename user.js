//FRONTEND RULE
//1. 함수, 메소드 이름은 Camel 컨벤션을 적용한다. (백엔드는 첫 단추를 스네이크로 하다보니 어쩔 수 없이 계속 했는데, 사용해본 결과 나는 카멜이 더 보기 편하다고 느낀다.)
//2. 단, req.body, req.params, req.query로 보내는 변수들은 스네이크로 유지한다. 이유는 백엔드와 변수 형식이 다르면 자칫 타이핑 에러가 날 가능성도 있을 것 같아서.

//POST METHOD
async function post(path, body, headers = {}) {
  const url = `http://localhost:8080/${path}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  let data = "";
  //아래 조건문을 구현한 이유 : 204 상태코드인 경우 res.json() 값이 없어 에러가 뜨기 때문에, 204인 경우 null을 반환하도록 설정
  if (res.status === 204) {
    data = "null";
    return data;
  }
  data = await res.json();

  if (res.ok) {
    return data;
  } else {
    throw Error(data);
  }
}

//회원가입 request
//URL : /users/signup
function reqSignUp() {
  //dummy data
  const body = {
    email: "fetch_test17@gmail.com",
    pwd: "qwerQWER!",
    pwd_check: "qwerQWER!",
  };

  //왜 async await를 안쓰고 then문을 사용하였는가?
  //이유 : post 함수를 모듈화 하여 비동기 처리를 한번 해주었고, then이 가독성을 해칠 수준의 nested-then문이 아니어서 우선은 이렇게 구현하였습니다만, async await으로 바꾸어야 할까요?
  post(`users/signup`, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

//내 닉네임 등록 request
//URL : /users/:users_id/ninkname
function reqCreateNickname() {
  //dummy data
  //찾아보니 api 주소를 상황에 맞게 유동적으로 바꿔주어야 할 경우(req.params)에는 React의 props를 사용하면 된다고 한다. 일단 user_id는 고정값으로 둔다.
  const user_id = 50;
  const body = {
    nickname: "fetchcatcher",
  };
  post(`users/${user_id}/nickname`, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
// reqCreateNickname()

//내 관심분야 등록 request
//URL : /users/:users_id/fields
function reqCreateField() {
  //dummy data
  //찾아보니 api 주소를 상황에 맞게 유동적으로 바꿔주어야 할 경우(req.params)에는 React의 props를 사용하면 된다고 한다. 일단 user_id는 고정값으로 둔다.
  const user_id = 50;
  const body = {
    field_id: 1,
  };
  //field_id category
  // 1. FE : 1
  // 2. BE : 2
  // 3. Full-stack : 3
  // 4. iOS : 4
  // 5. Android : 5
  // 6. AI : 6
  post(`users/${user_id}/fields`, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}

//로그인 request
//URL : /users/login
function reqLogin() {
  //dummy data
  const body = {
    email: "fetch_test16@gmail.com",
    pwd: "qwerQWER!qwer",
  };
  post(`users/login`, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
reqLogin()

//로그아웃 request
//URL : /users/logout
function reqLogout() {
  //dummy data
  const url = `http://localhost:8080/users/logout`;
  const options = {
    method: "POST",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, options)
    //여기서 바로 console.log(res.json())을 하게 되면 pending이 떠버린다. 왜? 아직 응답 데이터를 받아오지 않았으니까.
    //일단 데이터를 받아오고 난 다음에 새로 res 변수를 선언해서 콘솔 로그에 찍어야 원하는 값을 확인할 수 있다.
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
}

//내 비밀번호 찾기 request : 비밀번호를 까먹어서 로그인을 못할 때 이메일로 초기화
//URL : /users/pwd_search
function reqPwdSearch() {
  //dummy data
  const body = {
    email: "fetch_test16@gmail.com",
  };
  const url = `http://localhost:8080/users/pwd_search`;
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
}

//내 비밀번호 변경 request : 이미 로그인 상태인 유저가 비밀번호를 바꾸고자 할 때
//URL : /users/pwd
function reqPwdChange() {
  //dummy data
  const body = {
    pwd: "qwerQWER!qwer",
    new_pwd: "qwerQWER!",
    new_pwd_check: "qwerQWER!",
  };
  const url = `http://localhost:8080/users/pwd`;
  const options = {
    method: "PATCH",
    //req.session.user_id값을 서버에 주기 위해 추가
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
}
reqPwdChange()

//회원탈퇴 request
//URL : /users/signout
function reqSignOut() {
  //dummy data
  const body = {
    pwd: "qwerQWER!",
  };
  const url = `http://localhost:8080/users/signout`;
  const options = {
    method: "DELETE",
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  fetch(url, options)
    .then((res) => console.log(res))
    .catch((error) => console.log(error));
}
