import { IconButton, Snackbar } from "@mui/joy";
import { useNotification } from "../context/NotificationContext";

const GlobalToast = () => {
  const { notification, setNotification } = useNotification();
  console.log("🚀 ~ GlobalToast ~ notification:", notification);

  return (
    <Snackbar
      variant="soft"
      color={notification.type}
      open={!!notification.message}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={() => setNotification({ message: "", type: "neutral" })}
      endDecorator={
        <IconButton
          onClick={() => setNotification({ message: "", type: "neutral" })}
          color={notification.type}
        >
          &#10005;
        </IconButton>
      }
    >
      {notification.message}
    </Snackbar>
  );
};

export default GlobalToast;
