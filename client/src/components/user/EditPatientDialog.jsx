import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

/**
 * EditPatientDialog Component
 *
 * Props:
 * - editModalOpen: boolean (whether dialog is open)
 * - setEditModalOpen: function (to close dialog)
 * - editedName: string (current edited name)
 * - setEditedName: function (update edited name)
 * - handleUpdatePatientName: function (save updated name)
 */
const EditPatientDialog = ({
  editModalOpen,
  setEditModalOpen,
  editedName,
  setEditedName,
  handleUpdatePatientName
}) => {
  return (
    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
      <DialogTitle>Edit Patient Name</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Patient Name"
          type="text"
          fullWidth
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditModalOpen(false)} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUpdatePatientName}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPatientDialog;
