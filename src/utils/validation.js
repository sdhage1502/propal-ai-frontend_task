import Joi from "joi";

// List of allowed single-level TLDs for email validation
const allowedTLDs = [
  "com",
  "org",
  "net",
  "biz",
  "co",
  "in",
  "edu",
  "gov",
];

// Additional allowed multi-level domains (e.g., co.in, org.in)
const allowedMultiLevelDomains = ["co.in", "org.in"];

// Validation schema for the login form
export const loginSchema = Joi.object({
  loginId: Joi.string()
    .required()
    .messages({
      "string.empty": "Email or Username is required",
    })
    .custom((value, helpers) => {
      // Check if loginId is an email (contains '@')
      if (value.includes("@")) {
        // First, validate email format with allowed TLDs
        const emailSchema = Joi.string()
          .email({ tlds: { allow: allowedTLDs } })
          .messages({
            "string.email": "Please enter a valid email address with an allowed domain (e.g., .com, .in)",
          });
        const { error: emailError } = emailSchema.validate(value);
        if (emailError) {
          // If basic email validation fails, check for multi-level domains
          const domain = value.split("@")[1];
          const isMultiLevelDomain = allowedMultiLevelDomains.some((multiLevel) =>
            domain.endsWith(`.${multiLevel}`)
          );
          if (!isMultiLevelDomain) {
            return helpers.error("string.email");
          }
        }
      } else {
        // Validate as username
        const usernameSchema = Joi.string().min(3).messages({
          "string.min": "Username must be at least 3 characters long",
        });
        const { error } = usernameSchema.validate(value);
        if (error) return helpers.error("string.min");
      }
      return value;
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
});

// Validation schema for the signup form
export const signupSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
    }),
  email: Joi.string()
    .required()
    .messages({
      "string.empty": "Email is required",
    })
    .custom((value, helpers) => {
      // First, validate email format with allowed TLDs
      const emailSchema = Joi.string()
        .email({ tlds: { allow: allowedTLDs } })
        .messages({
          "string.email": "Please enter a valid email address with an allowed domain (e.g., .com, .in)",
        });
      const { error: emailError } = emailSchema.validate(value);
      if (emailError) {
        // If basic email validation fails, check for multi-level domains
        const domain = value.split("@")[1];
        const isMultiLevelDomain = allowedMultiLevelDomains.some((multiLevel) =>
          domain.endsWith(`.${multiLevel}`)
        );
        if (!isMultiLevelDomain) {
          return helpers.error("string.email");
        }
      }
      return value;
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),
  phone: Joi.string()
    .allow("")
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be a 10-digit number",
    }),
});

// Function to validate the login form data
export const validateLogin = (data) => {
  const { error } = loginSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  }
  return null;
};

// Function to validate the signup form data
export const validateSignup = (data) => {
  const { error } = signupSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  }
  return null;
};