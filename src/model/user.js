//FRONTEND RULE
//1. 함수, 메소드 이름은 Camel 컨벤션을 적용한다. (백엔드는 첫 단추를 스네이크로 하다보니 어쩔 수 없이 계속 했는데, 사용해본 결과 나는 카멜이 더 보기 편하다고 느낀다.)
//2. 단, req.body, req.params, req.query로 보내는 변수들은 스네이크로 유지한다. 이유는 백엔드와 변수 형식이 다르면 자칫 타이핑 에러가 날 가능성도 있을 것 같아서.

//052322 HTTP METHOD, url 모듈화
import { httpMethod, request } from "./common.js";
export { reqSignUp, reqCreateNickname };
//회원가입 request
//URL : /users/signup
async function reqSignUp(email, pwd, pwd_check) {
  const body = {
    email: email,
    pwd: pwd,
    pwd_check: pwd_check,
  };
  //052522 async/await 문으로 바꿔준다
  try {
    const response = await request(`users/signup`, httpMethod.post, body, {
      "Content-Type": "application/json",
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

//내 닉네임 등록 request
//서버 URL : /users/:users_id/ninkname
async function reqCreateNickname(user_id, nickname) {
  const body = {
    nickname: nickname,
  };

  try {
    const response = await request(
      `users/${user_id}/nickname`,
      httpMethod.post,
      body,
      {
        "Content-Type": "application/json",
      }
    );

    if (response.status === 409) {
      return 409;
    } else if (response.status === 400) {
      return 400;
    } else if (response.status === 204) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
  }
}

//내 관심분야 등록 request
//URL : /users/:users_id/fields
async function reqCreateField() {
  //dummy data
  //22.05.12 찾아보니 api 주소를 상황에 맞게 유동적으로 바꿔주어야 할 경우(req.params)에는 React의 props를 사용하면 된다고 한다. 일단 user_id는 고정값으로 둔다.
  const user_id = 50;
  const body = {
    field_id: 1,
  };

  try {
    const response = await request(
      `users/${user_id}/fields`,
      httpMethod.post,
      body
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//로그아웃 request
//URL : /users/logout
async function reqLogout() {
  //dummy data
  const url = `http://localhost:8080/users/logout`;
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await request(`users/logout`, httpMethod.post);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

//내 비밀번호 찾기 request : 비밀번호를 까먹어서 로그인을 못할 때 이메일로 초기화
//URL : /users/pwd_search
async function reqPwdSearch() {
  //dummy data
  const body = {
    email: "fetch_test16@gmail.com",
  };

  try {
    const response = await request(`users/pwd_search`, httpMethod.patch, body);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//내 비밀번호 변경 request : 이미 로그인 상태인 유저가 비밀번호를 바꾸고자 할 때
//URL : /users/pwd
async function reqPwdChange() {
  //dummy data
  const body = {
    pwd: "qwerQWER!qwer",
    new_pwd: "qwerQWER!",
    new_pwd_check: "qwerQWER!",
  };

  try {
    const response = await request(`users/pwd`, httpMethod.patch, body);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

//회원탈퇴 request
//URL : /users/signout
async function reqSignOut() {
  //dummy data
  const body = {
    pwd: "qwerQWER!",
  };

  try {
    const response = await request(`users/signout`, httpMethod.delete, body);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
