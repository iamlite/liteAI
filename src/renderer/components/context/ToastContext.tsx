import React, {
  createContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import Toast from './Toast';

interface ToastContextType {
  addToast: (message: string, type: string) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message: string, type: string = 'success') => {
    const newToast = {
      id: Date.now(),
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const toastContextValue = useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast]
  );

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => removeToast(toast.id)}
          index={index}
        />
      ))}
    </ToastContext.Provider>
  );
}

export { ToastContext, ToastProvider };
