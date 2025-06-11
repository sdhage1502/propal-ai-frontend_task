import Joi from "joi";

// Allowed domains
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
const allowedMultiLevelDomains = [
  "co.in",
  "org.in",
  "co.uk",
  "org.uk",
  "ac.in",
  "edu.in",
];

// Email validation
const validateEmail = (value, helpers) => {
  const { error } = Joi.string()
    .email({ tlds: { allow: allowedTLDs } })
    .validate(value);
  if (error) {
    const domain = value.split("@")[1];
    const valid = allowedMultiLevelDomains.some((multi) =>
      domain.endsWith(`.${multi}`)
    );
    if (!valid)
      return helpers.message(
        "Invalid email domain (e.g., use .com, .in, .co.in)"
      );
  }
  return value;
};

// Shared fields
const schemas = {
  username: Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .invalid(".", "..", "", "/")
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "string.pattern.base":
        "Username can only contain letters, numbers, underscores, or hyphens",
      "any.invalid": "Username cannot contain periods, slashes, or be empty",
    }),

  email: Joi.string().required().custom(validateEmail).messages({
    "string.empty": "Email is required",
  }),

  phone: Joi.string()
    .allow("")
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      "string.pattern.base": "Invalid phone number (e.g., +1234567890)",
    }),

  signupPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character (@$!%*?&)",
    }),

  loginPassword: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),

  updatePassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "string.min": "New password must be at least 8 characters",
      "string.pattern.base":
        "New password must include uppercase, lowercase, number, and special character (@$!%*?&)",
    }),
};

// Validation Schemas
export const loginSchema = Joi.object({
  loginId: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (value.includes("@")) return validateEmail(value, helpers);
      const { error } = schemas.username.validate(value);
      if (error) return helpers.message(error.details[0].message);
      return value;
    })
    .messages({ "string.empty": "Email or username is required" }),

  password: schemas.loginPassword,
});

export const signupSchema = Joi.object({
  username: schemas.username,
  email: schemas.email,
  phone: schemas.phone,
  password: schemas.signupPassword,
});

export const profileUpdateSchema = Joi.object({
  email: schemas.email,
  oldPassword: Joi.string().allow(""),
  newPassword: Joi.string()
    .allow("")
    .when("oldPassword", {
      is: Joi.string().min(1),
      then: schemas.updatePassword.required().messages({
        "string.empty":
          "New password is required when old password is provided",
      }),
    })
    .custom((value, helpers) => {
      const { oldPassword } = helpers.state.ancestors[0];
      if (oldPassword && value && value === oldPassword) {
        return helpers.message("New password must differ from old password");
      }
      return value;
    }),
});

// Generic validator
const validate = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  return error
    ? error.details.reduce(
        (acc, detail) => ({ ...acc, [detail.path[0]]: detail.message }),
        {}
      )
    : null;
};

// Exports
export const validateLogin = (data) => validate(loginSchema, data);
export const validateSignup = (data) => validate(signupSchema, data);
export const validateProfileUpdate = (data) =>
  validate(profileUpdateSchema, data);
