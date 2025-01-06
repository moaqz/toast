export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  title: string;
  description?: string;
  type: ToastType;
};

export type ToastEvent = Omit<Toast, "type">;
