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

export type ToastEventConfirm = Omit<ToastConfirm, "type">;
export type ToastEvent = Omit<Toast, "type"> | ToastEventConfirm;

export declare const TOAST_EVENT: string;

export declare const toast: {
  _dispatchToast(type: ToastType, details: ToastEvent): void;
  success(details: ToastEvent): void;
  error(details: ToastEvent): void;
  warning(details: ToastEvent): void;
  info(details: ToastEvent): void;
  confirm(details: ToastEvent): void;
};

export type ToastPosition = "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface ToasterAttributes {
  /**
   * Specifies the position where all toasts will be rendered.
   */
  position: ToastPosition;
  /**
   * Determines whether the toast can be dismissed by the user.
   * When true, a close button is added to the toast.
   */
  dismissable: boolean;
}
