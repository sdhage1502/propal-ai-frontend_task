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
  "mil",
  "info",
  "io",
  "me",
  "us",
  "uk",
];

// Additional allowed multi-level domains (e.g., co.in, org.in)
const allowedMultiLevelDomains = ["co.in", "org.in", "co.uk", "org.uk", "ac.in", "edu.in"];

// Custom email validation function to handle multi-level domains
const validateEmailWithCustomDomains = (value, helpers) => {
  const emailSchema = Joi.string().email({ tlds: { allow: allowedTLDs } });
  const { error: emailError } = emailSchema.validate(value);

  if (emailError) {
    const domain = value.split("@")[1];
    const isMultiLevelDomain = allowedMultiLevelDomains.some((multiLevel) =>
      domain.endsWith(`.${multiLevel}`)
    );
    if (!isMultiLevelDomain) {
      return helpers.message(
        `Please enter a valid email address with an allowed domain (e.g., .com, .in, .co.in)`
      );
    }
  }
  return value;
};

// Shared password schema (used in all forms)
const passwordSchema = Joi.string()
  .min(8) // Increased minimum length to 8 for better security
  .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  )
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
  });

// Shared username schema (used in Login and Signup)
const usernameSchema = Joi.string()
  .min(3)
  .max(30)
  .pattern(/^[a-zA-Z0-9_-]+$/)
  .messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username must not exceed 30 characters",
    "string.pattern.base":
      "Username can only contain letters, numbers, underscores, and hyphens",
  });

// Shared phone schema (used in Signup)
const phoneSchema = Joi.string()
  .allow("")
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .messages({
    "string.pattern.base":
      "Phone number must be a valid number (e.g., +1234567890 or 1234567890)",
  });

// Validation schema for the login form
export const loginSchema = Joi.object({
  loginId: Joi.string()
    .required()
    .messages({
      "string.empty": "Email or Username is required",
    })
    .custom((value, helpers) => {
      if (value.includes("@")) {
        return validateEmailWithCustomDomains(value, helpers);
      } else {
        const { error } = usernameSchema.validate(value);
        if (error) return helpers.message(error.details[0].message);
      }
      return value;
    }),
  password: passwordSchema.required(),
});

// Validation schema for the signup form
export const signupSchema = Joi.object({
  username: usernameSchema.required(),
  email: Joi.string()
    .required()
    .messages({
      "string.empty": "Email is required",
    })
    .custom(validateEmailWithCustomDomains),
  password: passwordSchema.required(),
  phone: phoneSchema,
});

// Validation schema for profile updates
export const profileUpdateSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      "string.empty": "Email is required",
    })
    .custom(validateEmailWithCustomDomains),
  password: passwordSchema.allow(""), // Password is optional
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

// Function to validate the profile update form data
export const validateProfileUpdate = (data) => {
  const { error } = profileUpdateSchema.validate(data, { abortEarly: false });
  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      errors[detail.path[0]] = detail.message;
    });
    return errors;
  }
  return null;
};