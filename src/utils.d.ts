import { ToastType, ToastPosition, ToastEvent } from "./toast";

export declare const toast: {
  _dispatchToast(type: ToastType, details: ToastEvent): void;
  success(details: ToastEvent): void;
  error(details: ToastEvent): void;
  warning(details: ToastEvent): void;
  info(details: ToastEvent): void;
  confirm(details: ToastEvent): void;
};

export declare const TOAST_EVENT: string;

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
