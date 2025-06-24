import { ToastType, ToastPosition, ToastEvent, ToastConfirmEvent, ToastRegularEvent } from "./toast";

export declare const toast: {
  _dispatchToast(type: ToastType, details: ToastEvent): void;
  success(details: ToastRegularEvent): void;
  error(details: ToastRegularEvent): void;
  warning(details: ToastRegularEvent): void;
  info(details: ToastRegularEvent): void;
  confirm(details: ToastConfirmEvent): void;
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
