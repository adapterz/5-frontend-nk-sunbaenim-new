const fs = require("fs");
const http = require("http");
const https = require("https");
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();

// express.static 이 디렉토리에 있는 정적 파일은 호출되면 그대로 전송해줘! 라는 의미
app.use(express.static('src/model'));
app.use(express.static('src/controller'));
app.use(express.static('src/view/pages'));
app.use(express.static('src/view/styles'));
app.use(express.static('src/assets/images'));

// 홈화면
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/home.html'));
});
// 로그인
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/login.html'));
});
// 로그인 후 홈화면
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/home.html'));
});
// 비밀번호 찾기
app.get('/pwd', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/find_pwd.html'));
});
// 회원가입 1 : 메일 주소와 비밀번호 입력
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup.html'));
});
// 회원가입 2 : 닉네임 설정
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_profile.html'));
});
// 회원가입 3 : 서비스 분야 설정
app.get('/field', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_field.html'));
});
// 회원가입 4 : 회원가입 완료시 환영 문구 (홈으로 가기, 로그인 하기)
app.get('/welcome', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_welcome.html'));
});
// 내 게시물 조회
app.get('/myposting', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_posting.html'));
});
// 회원 탈퇴
app.get('/account/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/delete_user.html'));
});
// 내 계정 정보 조회/변경/탈퇴
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_account_setting.html'));
});
// 게시물 생성
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/create_article.html'));
});
// 게시물 수정
app.get('/edit/:article_id', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/edit_article.html'));
});
// 게시글 목록 조회
app.get('/articles', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/articles.html'));
});
// 게시물 상세 조회
app.get('/articles/:article_id', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/article.html'));
});


if (process.env.NODE_ENV === "production") {
  // production mode에서는 HTTPS로 접속하도록 해 줍니다.
  // .env 파일에서 KEY_URL을 불러와 줍니다.
  const KEY_URL = process.env.KEY_URL;
  const options = {
    key: fs.readFileSync(`${KEY_URL}/privkey.pem`),
    cert: fs.readFileSync(`${KEY_URL}/cert.pem`),
    ca: fs.readFileSync(`${KEY_URL}/chain.pem`),
  };

  // https 서버를 생성합니다.
  // key 파일 옵션과 라우팅 정보 등이 들어있는 app을 함께 넘깁니다.
  // https 포트 번호는 443입니다.
  https.createServer(options, app).listen(443, () => {
    console.log(`Listening at port 443`);
  });
} else {
  http.createServer(app).listen(3000, () => {
    console.log(`Listening at port 3000`);
  });
}