export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  title: string;
  description?: string;
  type: ToastType;
};

export type ToastEvent = Omit<Toast, "type">;

export declare const TOAST_EVENT: string;

export declare const toast: {
  _dispatchToast(type: ToastType, details: ToastEvent): void;
  success(details: ToastEvent): void;
  error(details: ToastEvent): void;
  warning(details: ToastEvent): void;
  info(details: ToastEvent): void;
};
