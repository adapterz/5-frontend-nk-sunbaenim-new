//052322 HTTP METHOD, url 모듈화
import { httpMethod, defaultUrl, request } from "./common.js";

// 게시글 목록 조회 request
// URL : /articles?limit&cursor&key
async function reqGetArticles() {
  // 쿼리로 들어갈 변수들의 정보, 전체 게시글 목록 조회는 infinite pagination 형식으로 구현
  // cursor: 조회된 목록의 첫번째 인덱스
  // limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
  // key: 검색어

  // more_articles = 다음 게시물이 있는지 없는지 확인하는 변수
  let more_articles = false;
  // next_cursor = 다음 게시물의 인덱스 번호를 확인하는 변수
  let next_cursor = 0;
  // 게시물들을 서버로부터 가져오는 api
  const getArticles = async(cursor, limit) => {
    const response = await request(`articles?limit=${limit}&cursor=${cursor}&key=`, httpMethod.get);
    if(!response.ok){
      throw new Error(`error: ${response.status}`);
    }

    const data = await response.json();
    more_articles = data['paging'].more_articles;
    next_cursor = data['paging'].next_cursor;
    console.log(data);
    return data;
  }

  // 게시물 정보를 파싱하여 브라우저에 뿌려주는 함수
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

      // 게시물을 상세 조회할 수 있는 링크 연결
      a.setAttribute('href',`${defaultUrl}/article/${data['data'][i].id}`);
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
      likesDiv.innerHTML = data['data'][i].total_likes + " Likes";
      commentsDiv.innerHTML = data['data'][i].total_comments + " Comments";
      dateDiv.innerHTML = (data['data'][i].create_at).substring(0,10);
      span.innerHTML = data['data'][i].user_id;

      contentDiv.append(a, reactionsDiv);
      reactionsDiv.append(likesDiv, commentsDiv, dateDiv)
      li.append(contentDiv, span, button);
      ul.appendChild(li);
    }
  }

  // 다음 게시물들을 불러일으킬 때 more_articles가 true인 경우 다음 게시물을 파싱하여 브라우저에 띄우는 함수
  const loadArticles = async (cursor, limit) => {
    setTimeout(async () => {
      try{
        // cursor가 0인 이유 : 첫 화면을 위한 초기화
        if(cursor == 0 || more_articles){
          const response = await getArticles(cursor, limit);
          showArticles(response);
        }
      } catch (error) {
        console.log(error.message);
      }
    }, 500)
  }

  // 게시물 조회 초기화 (첫 페이지에는 게시물을 10개까지 가져온다)
  let limit = 10;
  // 페이지의 가장 밑으로 커서가 내려갔을 때, 다음 데이터가 있다면 추가로 서버로부터 게시물 데이터를 불러오는 함수
  // FIXME: document.documentElement로 시도했을 때 잘 작동하지 않음 -> 알고보니 해당 메소드는 IE나 Firefox에 적용되며 크롬일 경우 document.body로 해야 작동된다고 함.
  document.body.addEventListener('scroll', () => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = document.body;
    // TODO: 이 부분 완벽히 이해하지 못한 것 같다. 어느 정도 이상으로 스크롤을 내리면 내려가지 않는 현상
    if(scrollTop + clientHeight >= scrollHeight && more_articles){
      loadArticles(next_cursor, limit)
    }
  });

  loadArticles(0, 9);
}
reqGetArticles();