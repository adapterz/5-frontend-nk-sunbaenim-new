export const httpMethod = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
};

export const status = ((res) => {
  let data = ""
  if(res.status === 204){
    data = "NO CONTENT";
    return data;
  } else if(res.status === 200 || res.status === 201) {
    data = res.json();
    return data;
  } else if (res.status === 400 || res.status === 401){
    data = "Client error";
    return data;
  } else if (res.status === 404){
    data = "Not found";
    return data;
  } else {
    throw new Error(res.status)
  }
})


export const defaultUrl = "http://localhost:8080"
