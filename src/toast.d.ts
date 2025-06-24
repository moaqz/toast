export type ToastType = "success" | "error" | "warning" | "info" | "confirm";

export type ToastConfirm = {
  title: string;
  description?: string
  type: "confirm";
  duration?: number | "none";
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export type Toast = {
  title: string;
  description?: string;
  type: ToastType;
  duration?: number | "none";
} | ToastConfirm;

export type ToastPosition = "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastEventConfirm = Omit<ToastConfirm, "type">;
export type ToastEvent = Omit<Toast, "type"> | ToastEventConfirm;
