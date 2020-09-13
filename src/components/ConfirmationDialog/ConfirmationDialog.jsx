import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@material-ui/core";

function ConfirmationDialog({ open, title, onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={onConfirm}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
