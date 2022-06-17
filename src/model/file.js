import { request, server } from "./common.js";
export {
  reqCreateProfileImage,
  reqProfileImage,
  reqCreateThumbnail,
  reqArticleProfileImage,
};

// 22.05.14
// 프로필 이미지 등록 request
// URL : /files
async function reqCreateProfileImage(userId, formData) {
  const options = {
    method: "POST",
    body: formData,
  };
  try {
    const response = await fetch(`${server}/files/user/${userId}`, options);
    if (response.status === 204) {
      console.log("Profile image updated");
      return 204;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
  }
}

// 프로필 이미지 get request
// URL : /files/user
async function reqProfileImage() {
  try {
    const response = await request(`files/user`);
    if (response.ok === false) {
      return;
    } else {
      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      return imageUrl;
    }
  } catch (error) {
    console.log(error);
  }
}

// 특정 프로필 이미지 get request
async function reqArticleProfileImage(userId) {
  try {
    const response = await request(`files/user/${userId}`);
    if (response.ok === false) {
      return;
    } else {
      const data = await response.blob();
      const imageUrl = URL.createObjectURL(data);
      return imageUrl;
    }
  } catch (error) {
    console.log(error);
  }
}

// 22.05.14
// 게시물 이미지 등록 request
// URL : /files
async function reqCreateThumbnail(articleId, formData) {
  const options = {
    method: "POST",
    body: formData,
  };

  try {
    const response = await fetch(`${server}/files/${articleId}`, options);
    if (response.status === 204) {
      console.log("Images uploaded");
      return;
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);
  }
}
