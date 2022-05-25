//052322 HTTP METHOD, url 모듈화
import { httpMethod, defaultUrl } from "./common.js";

// 22.05.13
// POST MODULE
async function request(path, method, body, headers = {}) {
  const url = defaultUrl + '/' + path;
  const options = {
    method: method,
    headers: {
      ...headers,
    },
    body: JSON.stringify(body),
  };
  const res = await fetch(url, options);
  return res;
}

// 22.05.13
// 게시글 목록 조회 request
// URL : /articles?limit&cursor&key
async function reqGetArticles() {
  // dummy data
  // 쿼리로 들어갈 변수들의 정보, 전체 게시글 목록 조회는 cursor pagination 형식으로 구현
  // cursor: 조회된 목록의 첫번째 인덱스
  // limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
  // key: 검색어

  let more_articles = false;
  let next_cursor = 0;
  const getArticles = async(cursor, limit, key) => {
    const response = await request(`articles?limit=${limit}&cursor=${cursor}&key=`, httpMethod.get);
    if(!response.ok){
      throw new Error(`error: ${response.status}`);
    }

    const data = await response.json();
    more_articles = data['paging'].more_articles;
    next_cursor = data['paging'].next_cursor;
    return data;
  }


  const showArticles = (data) => {
    for(let i = 0; i < data['data'].length; i++){
      const ul = document.querySelector('.main-list__articles');
      const li = document.createElement('li');
      const contentDiv = document.createElement('div');
      const a = document.createElement('a');
      const reactionsDiv = document.createElement('div');
      const likesDiv = document.createElement('div');
      const commentsDiv = document.createElement('div');
      const dateDiv = document.createElement('div');
      const span = document.createElement('span');
      const button = document.createElement('button');

      a.setAttribute('href','#');
      li.className = 'main-list__article';
      contentDiv.className = 'main-list__article--content';
      a.className = 'main-list__article--title';
      reactionsDiv.className = 'main-list__article--reactions';
      likesDiv.className = 'likes';
      commentsDiv.className = 'comments';
      dateDiv.className = 'date';
      span.className = 'main-list__article--nickname';
      button.className = 'main-list__article--user-img';

      a.innerHTML = data['data'][i].title;
      likesDiv.innerHTML = data['data'][i].total_likes;
      commentsDiv.innerHTML = data['data'][i].total_comments;
      dateDiv.innerHTML = data['data'][i].create_at;
      span.innerHTML = data['data'][i].user_id;

      contentDiv.append(a, reactionsDiv);
      reactionsDiv.append(likesDiv, commentsDiv, dateDiv)
      li.append(contentDiv, span, button);
      ul.appendChild(li);
    }
  }

  const loadArticles = async (cursor, limit) => {
    setTimeout(async () => {
      try{
        if(cursor== 0 || more_articles){
          const response = await getArticles(cursor, limit);
          showArticles(response);
        }
      } catch (error) {
        console.log(error.message);
      }
    }, 500)
  }


  let limit = 10;

  document.body.addEventListener('scroll', () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.documentElement;

    if(scrollTop + clientHeight >= scrollHeight - 5 && more_articles){
      loadArticles(next_cursor, limit)
    }
  }, {
    passive: true
  });

  loadArticles(0, 10);

  // request(`articles?${query}`, httpMethod.get)
  //   .then((json) => {
  //     let result = "";
  //     for(let i = 0; i < json['data'].length; i++){
  //       result = result + `
  //         "id": ${json['data'][i].id}
  //         "user_id": ${json['data'][i].user_id}
  //         "title": ${json['data'][i].title}
  //         "create_at": ${json['data'][i].create_at}
  //         "comments": ${json['data'][i].total_comments}
  //         "likes": ${json['data'][i].total_likes}
  //       `;
  //     }
  //     console.log(result);
  //   })
  //   .catch((error) => console.log(error));
}
reqGetArticles();