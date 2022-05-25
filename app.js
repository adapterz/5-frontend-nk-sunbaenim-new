import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// express.static 이 디렉토리에 있는 정적 파일은 호출되면 그대로 전송해줘! 라는 의미
app.use(express.static('src/model'))
app.use(express.static('src/view/pages'));
app.use(express.static('src/view/styles'));
app.use(express.static('src/assets/images'));

app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/model/test.html'));
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/home.html'));
});

app.get('/login', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/login.html'));
});

app.get('/pwd', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/find_pwd.html'));
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup.html'));
});

app.get('/nickname', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_profile.html'));
});

app.get('/field', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_field.html'));
});

app.get('/welcome', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/signup_welcome.html'));
});

app.get('/myposting', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_posting.html'));
});

app.get('/account', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/mypage_account_setting.html'));
});

app.get('/articles', function(req, res) {
  res.sendFile(path.join(__dirname, '/src/view/pages/articles.html'));
});



app.listen(PORT, function () {
  console.log("server start 3000");
});

export default app;