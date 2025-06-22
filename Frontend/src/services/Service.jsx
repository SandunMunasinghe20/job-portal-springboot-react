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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

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
