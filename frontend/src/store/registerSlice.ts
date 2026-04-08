import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

type RegisterErrors = {
  password: string;
  confirmPassword: string;
};

type RegisterState = {
  formData: RegisterFormData;
  errors: RegisterErrors;
  hasSubmitted: boolean;
};

const initialState: RegisterState = {
  formData: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  },
  errors: {
    password: "",
    confirmPassword: "",
  },
  hasSubmitted: false,
};

const getPasswordError = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  if (!/[!@#$%^&*(),.?\":{}|<>_\-\[\]/`~+=;' ]/.test(password)) {
    return "Password must include at least one special character.";
  }
  return "";
};

export const validateRegistrationForm = (formData: RegisterFormData) => ({
  password: getPasswordError(formData.password),
  confirmPassword: formData.password !== formData.confirmPassword ? "Passwords do not match." : "",
});

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateField: <K extends Exclude<keyof RegisterFormData, "terms">>(
      state: RegisterState,
      action: PayloadAction<{ field: K; value: RegisterFormData[K] }>,
    ) => {
      const { field, value } = action.payload;
      state.formData[field] = value;

      if (field === "password") {
        state.errors.password = getPasswordError(state.formData.password);
        state.errors.confirmPassword = "";
      }

      if (field === "confirmPassword") {
        state.errors.confirmPassword = "";
      }
    },
    setTerms(state, action: PayloadAction<boolean>) {
      state.formData.terms = action.payload;
    },
    submitAttempt(state) {
      state.hasSubmitted = true;
      state.errors = validateRegistrationForm(state.formData);
    },
    resetRegisterForm(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { updateField, setTerms, submitAttempt, resetRegisterForm } = registerSlice.actions;
export default registerSlice.reducer;
