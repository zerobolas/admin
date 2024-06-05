import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import DeleteForever from "@mui/icons-material/DeleteForever";

type DeleteModal = {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  onCancel: () => void;
  dialogContent: string;
};

function AlertDialogModal({
  open,
  onClose,
  onAccept,
  onCancel,
  dialogContent,
}: DeleteModal) {
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <ModalDialog variant="plain" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent>{dialogContent}</DialogContent>
          <DialogActions
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                onCancel();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => {
                onAccept();
                onClose();
              }}
            >
              <DeleteForever />
              Delete
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default AlertDialogModal;
