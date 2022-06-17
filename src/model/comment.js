import { httpMethod, request } from "./common.js";
export { reqCreateComment, reqGetComments, reqGetComment, reqEditComment, reqDeleteComment };

// 22.05.13
// 댓글 생성 request
// URL : /comments
async function reqCreateComment(article_id, content, orders, group_id) {
  const body = {
    // 댓글을 작성한 게시물의 Index
    article_id: article_id,
    // 댓글 내용
    content: content,
    // 생성되는 댓글이 대댓글일 경우, 대댓글의 순서를 식별하기 위함 (디폴트, 즉 부모 댓글일 경우는 0)
    orders: orders,
  };

  // 만약 생성되는 댓글이 대댓글일 경우, 부모의 식별 id를 입력 (디폴트, 즉 부모 댓글일 경우는 null)
  if(group_id){
    body.group_id = group_id;
  }

  try{
    const response = await request(`comments`, httpMethod.post, body, {"Content-Type": "application/json"});
    if (response.status === 201) {
      const data = response.json();
      console.log(data);
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 댓글 수정 request
// URL : /comments
async function reqEditComment(comment_id, content) {
  try{
    const body = {
    // 수정하려는 댓글의 Index
    comment_id: comment_id,
    // 수정한 댓글 내용
    content: content,
  };

    const response = await request(`comments`, httpMethod.patch, body, {"Content-Type": "application/json"});
    console.log(response);
    return response;
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 댓글 삭제 request
// URL : /comments/:comment_id
async function reqDeleteComment(commentId) {
  try{
    const response = await request(`comments/${commentId}`, httpMethod.delete);
    console.log(response);
    return response;
  } catch(error){
    console.log(error);
  }
}

// 게시글의 댓글 목록 조회 request
// URL : /comments?article_id&limit&cursor
// article_id: 댓글이 달린 게시글의 Index
// cursor: 조회된 목록의 첫번째 Index
// limit: cursor로부터 몇 개의 게시물을 가져올 지 결정
async function reqGetComments(article_id, limit, cursor) {
  try{
    const response = await request(`comments?article_id=${article_id}&limit=${limit}&cursor=${cursor}`);
    if(response.ok){
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}

// 게시글의 댓글 조회 request
async function reqGetComment(comment_id){
  try{
    const response = await request(`comments/${comment_id}`);
    if(response.ok){
      const data = await response.json();
      return data;
    } else {
      throw new Error();
    }
  } catch(error){
    console.log(error);
  }
}

// 22.05.13
// 댓글 좋아요 생성 또는 취소 request
// URL : /comments/likes
function reqLikes() {
  // dummy data
  const body = {
    // 좋아요를 누른 유저의 Index
    user_id: 60,
    // 좋아요가 눌린 댓글의 Index
    comment_id: 15
  };

  request(`comments/likes`, httpMethod.post, body)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
}
