//Input validation → check if the data has the right format/type.
//clean/escape dangerous input to prevent injection attacks (like MongoDB operator injection or script injection).

function sanitizeInput(value) {
  if (typeof value !== "string") return value;
  return value.replace(/[<>{}$;]/g, "").trim();
}

//check for valid email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//check password strength
function isStrongPassword(password) {
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passRegex.test(password);
}

//General validation Wrapper
function validRegistrationInput({ name, email, password }) {
  const errors = [];
  if (!name || name.trim() < 2) {
    errors.push("Name must be atleast two characters long");
  }
  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }
  if (!password || !isStrongPassword(password)) {
    errors.push(
      "Password must be atleast 8 characters long and include uppercase, lowercase and a number"
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      password: sanitizeInput(password),
    },
  };
}

export default validRegistrationInput;
