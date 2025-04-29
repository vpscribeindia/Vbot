// src/components/Toast.jsx
import { toast } from "react-toastify";

export const showSuccess = (message) => {
  toast.success(message);
};

export const showError = (message) => {
  toast.error(message);
};

export const showWarning = (message) => {
  toast.warn(message);
};

export const showDelete = (message) => {
  toast.error(message);
};
