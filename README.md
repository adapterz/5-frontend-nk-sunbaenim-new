# 5-frontend-nk-sunbaenim-new

## 📌 프로젝트명 및 제작 의도

IT인들을 위한 커뮤니티 사이트 SUNBAENIM의 프론트엔드 서버입니다.

### 사용한 언어

- html
- css
- JavaScript

## 📌 폴더 구조 설명

```
└── src
│  ├── assets (웹사이트 구성에 필요한 에셋)
│  │   └── images
│  └── controller (서버로부터 데이터를 가져와 브라우저에 반영할 로직)
│  │   ├── create_posting.js
│  │   ├── get_article.js
│  │   ├── get_articles.js
│  │   ├── login_success.js
│  │   ├── login.js
│  │   ├── myaccount.js
│  │   ├── profile.js
│  │   └── sign_up.js
│  └── model (서버로부터 데이터를 받아오기)
│  │   ├── article.js
│  │   ├── bookmark.js
│  │   ├── comment.js
│  │   ├── common.js
│  │   ├── file.js
│  │   ├── notification.js
│  │   ├── user.js
│  │   ├── create_posting.js
│  │   ├── get_article.js
│  │   ├── get_articles.js
│  │   ├── login_success.js
│  │   ├── login.js
│  │   ├── myaccount.js
│  │   ├── profile.js
│  │   └── sign_up.js
│  └── view (화면 구현)
│     └── pages
│     │  ├── article.html
│     │  ├── articles.html
│     │  ├── create_posting.html
│     │  ├── home.html
│     │  ├── login.html
│     │  ├── mypage_account.html
│     │  ├── signup.html
│     │  ├── signup_profile.html
│     │  └── signup_welcome.html
│     └── styles
│        　├── article.css
│        　├── articles.css
│        　├── create_posting.css
│        　├── home.css
│        　├── login.css
│        　├── mypage_account.css
│        　├── signup.css
│        　├── signup_profile.css
│        　├── signup_welcome.css
│        　└── normalize.css
├── app.js
├── package.json
└── package-lock.json
```


## 📌 웹 사이트 UI
<a href = "https://www.figma.com/file/18qggujvMI90ZveRJ8Z92F/Sunbaenim?node-id=0%3A1">링크</a>


## 📌 문제점과 해결 방법

- 인증과 인가 <br>
1. 문제점
로그인을 하기 위해 fetch 함수를 이용하여 로그인 API를 실행했고, 브라우저는 유저가 로그인했다는 응답을 받았다.
하지만 내 브라우저의 쿠키에는 세션 아이디가 저장되지 않았다.

2. 해결 방법
우선 API를 호출하는 클라이언트 서버와 백엔드 서버의 URL이 다르다는 것에서부터 시작해야 한다.
클라이언트 서버는 로그인 API로 POST 요청을 보냈고 백엔드 서버는 요청에 따라 자신의 서버에 세션 아이디를 생성했다는 알림을 보냈다.
언뜻 보기엔 문제가 없어보이나 한 가지 간과한 사실은 서버가 서로 다를 경우 쿠키를 공유하지 않는 다는 것이다.
이때까지만 해도 나는 당연히 서버에 로그인 요청을 보내면 브라우저에 자동으로 쿠키가 저장되는 줄로 알았다.
백엔드 서버한테 로그인한 결과값을 요청을 하지 않았는데 어떻게 브라우저에 쿠키를 저장할 수 있겠는가?
따라서 백엔드 서버에 로그인 결과를 보내주는 API를 따로 만들고, 클라이언트 서버에 로그인 정보를 받아올 수 있도록 GET 요청을 보내도록 고쳤더니 바로 브라우저에 세션 아이디가 저장된 쿠키가 저장됨을 확인하였다.



## 📌 추후에 코드 개선할 점들

1. 재사용성에 중점을 두고, 프론트엔드 파일 구성에 대해 고민해보기 <br>
   프론트엔드 파일 구성에 대해 아쉬움이 크다. 제공하는 서비스를 중심으로 구현하는 방향으로 프로젝트를 세팅했는데(ex 메인 페이지, 로그인 페이지 등..), 구현하는 동안 컴포넌트별로 구현할 걸 그랬나 싶은 순간이 많았다. 데이터만 달라질 뿐, 화면 상으로는 중복된 톤앤매너를 가지는 컴포넌트들이 많았는데, (ex 경고창, 모달 등) 서비스마다 서로 다른 html, css 파일로 구성하다보니 같은 형식의 컴포넌트임에도 class나 id가 달라 코드를 재사용하기 힘든 상황이 자주 발생했다.
2. html, css를 파싱하고 JavaScript로 데이터를 받아올 때, 이전 html/css 컴포넌트가 아주 잠깐 노출되는 문제 해결 필요<br>
3. UI가 개선된 반응형 페이지 구현하기 <br>
4. 마감으로 인해 적용하지 못한 API들 반영하기

## 📌 느낀점

1. 백엔드와 프론트엔드 개발자 사이의 업무 흐름에 대해 전반적으로 이해할 수 있었다. <br>
   백엔드와 프론트 모두 구현을 해보면서 업무 시 이런 이슈가 생길 수 있겠구나 싶은 순간들이 있었다. 예를 들어, 서버에서 가져온 데이터가 프론트엔드에서 구현하거나 판단하기 어려운 경우, 필요한 데이터인데 서버단에서 구현해두지 않은 경우를 마주했을 때. 실무 시 내가 짜는 코드가 다른 업무에 어떻게 영향을 미칠 것인지를 고려해야 한다는 걸 느꼈다.
2. html, css는 정말 어렵다. <br>
   그래서 정말 정말 잘하고 싶다. 이번 프로젝트를 진행하면서 개인적으로 html, css에 대한 스스로의 역량이 너무 부족하다고 느꼈다. 내가 쓰는 태그의 기능에 대한 깊은 이해(ex. button vs a vs input), CSS 방법론, 컴포넌트의 이해, 레이아웃, 반응형 등.. 공부가 정말 많이 필요하다.
3. 마감 vs 완성도 <br>
개발을 하기 전에도 완성도에 대한 집착 때문에 스트레스가 많았다. 이런 내 성향을 이번 프로젝트를 진행하면서 많이 내려놓으려 했다. 구현을 대충하려 했다는 뜻은 결코 아니고, 다만 완벽한 결과물보다 중요한 것은 일단 마감 기한까지 어떻게든 완성을 해내는 것이라고 판단했고, 그렇게 배웠기 때문이다. 그리고 사실 완성도라는 것은 지극히 주관적인 부분일 수 있다고 생각했다. 처음의 기획을 고집하기 보다 당장의 문제를 어떻게 유연하게 해결할 수 있는지 여러 가지의 방법론을 구현하는 것도 중요하겠단 생각이 들었다. 