import { ReactNode, createContext, useContext, useState } from "react";

const defaultType = "neutral";
type NotificationType =
  | "primary"
  | "neutral"
  | "success"
  | "warning"
  | "danger";
export type NotificationContextType = {
  setNotification: ({
    message,
    type,
  }: {
    message: string;
    type: NotificationType;
  }) => void;
  notification: {
    message: string;
    type: NotificationType;
  };
};

const NotificationContext = createContext<NotificationContextType>({
  setNotification: () => {},
  notification: {
    message: "",
    type: defaultType,
  },
});

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState({
    message: "",
    type: defaultType as NotificationType,
  });

  return (
    <NotificationContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
