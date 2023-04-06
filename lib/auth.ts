export const login = async (username: string, password: string) => {
  const url = "/api/login";
  const data = {
    username,
    password,
  };
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })

  return response;
};

export const signup = async (
  name: string,
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  openaiToken: string
) => {
  const url = "/api/signup";
  const data = {
    name,
    username,
    email,
    password,
    confirmPassword,
    openaiToken,
  };

  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })

  return response;
};

export const logout = async () => {
  const url = "/api/logout";
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (res.status === 200) {
        res.json;
      } else {
        throw Error(`Failed with status: ${res.status}`);
      }
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export interface CustomError extends Error {
  status: number;
  info: any;
}

export const post = async (url: string, body: string = '{}') => {
  const res = await fetch(url, {
    method: "POST",
    body: body,
    next: { revalidate: 10 },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    
    const info = await res.json();
    const error = new Error(info.message) as CustomError
    // Attach extra info to the error object.
    error.info = info; 
    error.status = res.status
    throw error
  }

  return res.json();
}