//Input validation → check if the data has the right format/type.
//clean/escape dangerous input to prevent injection attacks (like MongoDB operator injection or script injection).

export function sanitizeInput(value: string): string {
  if (typeof value !== "string") return value;
  return value.replace(/[<>{}$;]/g, "").trim();
}

//check for valid email
export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

//check password strength
export function isStrongPassword(password: string): boolean {
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passRegex.test(password);
}

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
}

//General validation Wrapper
export function validateRegistrationInput({ name, email, password }: RegistrationInput) {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push("Name must be atleast two characters long");
  }
  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }
  if (!password || isStrongPassword(password)) {
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

export default {
  sanitizeInput,
  isValidEmail,
  isStrongPassword,
  validateRegistrationInput,
};
