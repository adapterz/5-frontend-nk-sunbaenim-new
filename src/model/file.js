import { server } from "./common.js";
export { reqCreateProfileImage, reqCreateArticleImage };

// 22.05.14
// 프로필 이미지 등록 request
// URL : /files
async function reqCreateProfileImage(userId, formData){
  const options = {
    method: "POST",
    body: formData,
  };
  console.log(options)

  try{
    const response = await fetch(`${server}/files/${userId}`, options);
    if(response.status === 204){
      console.log("Profile image updated")
      return
    } else {
      throw new Error();
    }
  } catch(error) {
    console.log(error);
  }
}

// 22.05.14
// 게시물 이미지 등록 request
// URL : /files
async function reqCreateArticleImage(){
  const file = 'dummy.jpg';
  const formData = new FormData();
  formData.append('article_files', file);

  const url = `http://localhost:8080/files`;
  const options = {
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData,
  };

  fetch(url, options)
  .then((data) => console.log(data))
    .catch((error) => console.log(error));
}