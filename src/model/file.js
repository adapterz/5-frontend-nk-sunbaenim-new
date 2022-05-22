// 22.05.14
// 프로필 이미지 등록 request
// URL : /files
async function reqCreateProfileImage(){
  const file = 'dummy.jpg';
  const formData = new FormData();
  formData.append('avatar', file);

  const user_id = 51
  const url = `http://localhost:8080/files/${user_id}`;
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

// 22.05.14
// 게시물 이미지 등록 request
// URL : /files
async function reqCreateProfileImage(){
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