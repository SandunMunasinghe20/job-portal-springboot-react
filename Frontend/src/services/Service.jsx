
export default function validateEmail({ email }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return "Email is required";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email address";
  }

  return "";
}

export function validatePassword({ password }) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

  if (!password) {
    return "Password is required";
  }

  if (!passwordRegex.test(password)) {
    return (
      "Password must:\n" +
      "* Be at least 8 characters\n" +
      "* Contain uppercase and lowercase letters\n" +
      "* Include a number\n" +
      "* Include a special character"
    );
  }

  return "";
}

export async function fetchFromBackend({ url, method, body }) {
  const token = localStorage.getItem("auth-token");
  console.log("auth token is : ", token);
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: body ? JSON.stringify(body) : null,
    });

    return response;
  } catch (error) {
    console.log("An error occured while fetching from Server:", error);
    return "An error occured while fetching from Server.";
  }
}
