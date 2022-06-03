const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

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
// 비밀번호 찾기
app.get('/pwd', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/find_pwd.html'));
});
// 회원가입 1 : 메일 주소와 비밀번호 입력
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup.html'));
});
// 회원가입 2 : 닉네임 설정
app.get('/profile/:user_id', (req, res) => {
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
// (로그인 완료 후) 내 게시물 조회
app.get('/myposting', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_posting.html'));
});
// 회원 탈퇴
app.get('/account/delete', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/delete_user.html'));
});
// (로그인 완료 후) 내 계정 정보 조회/변경/탈퇴
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_account_setting.html'));
});
// 게시물 생성
app.get('/create', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/create_posting.html'));
});
// 게시글 목록 조회
app.get('/articles', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/articles.html'));
});
// 게시물 상세 조회
app.get('/articles/:article_id', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/view/pages/article.html'));
});


app.listen(PORT, function () {
  console.log("server start 3000");
});