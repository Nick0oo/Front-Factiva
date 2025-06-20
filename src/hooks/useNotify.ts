import { toast } from "sonner";

export const useNotify = () => {
  const notifySuccess = (message: string) => {
    toast.success("¡Éxito!", {
      description: message,
    });
  };

  const notifyError = (message: string) => {
    toast.error("Error", {
      description: message,
    });
  };

  const notifyInfo = (message: string) => {
    toast.info("Información", {
      description: message,
    });
  };

  const notifyPromise = (
    promise: Promise<any>,
    loading: string,
    success: string,
    error: string
  ) => {
    return toast.promise(promise, {
      loading: loading,
      success: (data) => success,
      error: (err: any) => err.response?.data?.message || err.message || error,
    });
  };


  return { notifySuccess, notifyError, notifyInfo, notifyPromise };
}; 