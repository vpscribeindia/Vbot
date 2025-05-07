import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@mui/material";

/**
 * DeleteConfirmationDialog Component
 *
 * Props:
 * - openConfirmation: boolean (dialog open state)
 * - handleClose: function (close dialog)
 * - confirmDelete: function (confirm deletion action)
 */
const DeleteConfirmationDialog = ({
  openConfirmation,
  handleClose,
  confirmDelete
}) => {
  return (
    <Dialog
      open={openConfirmation}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this transcript? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={confirmDelete} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
