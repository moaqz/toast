export type ToastType = "success" | "error" | "warning" | "info" | "confirm";

export interface BaseToast {
  title: string;
  description?: string;
  duration?: number | "none";
}

export interface ToastConfirm extends BaseToast {
  type: "confirm";
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export interface RegularToast extends BaseToast {
  type: Exclude<ToastType, "confirm">;
}

export type Toast = RegularToast | ToastConfirm;

export type ToastPosition = "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastConfirmEvent = Omit<ToastConfirm, "type">;
export type ToastRegularEvent = BaseToast;
export type ToastEvent = ToastRegularEvent | ToastConfirmEvent;
