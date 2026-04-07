import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import CustomTextInput from "./CustomTextInput";
import CustomDropdown from "./CustomDropdown";

export default function LineWalkModal({
  open,
  onClose,
  formData,
  handleChange,
  handleSave,
  areas,
  employees,
  
}) {

  /* ---------------- MULTI EMPLOYEE ---------------- */

  const handleArrayChange = (index, value) => {
    const updated = [...(formData.employeesinvolved || [])];
    updated[index] = value;
    handleChange("employeesinvolved", updated);
  };

  const addField = () => {
    handleChange("employeesinvolved", [...(formData.employeesinvolved || []), ""]);
  };

  const removeField = (index) => {
    const updated = [...(formData.employeesinvolved || [])];
    updated.splice(index, 1);
    handleChange("employeesinvolved", updated);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          bgcolor: "#fff",
          p: 3,
          borderRadius: 2
        }}
      >

        <Typography variant="h6">Line Walk</Typography>

        {/* DATE */}
        <CustomTextInput
          label="Date & Time"
          name="line_walk_datetime"
          type="datetime-local"
          value={formData.line_walk_datetime?.slice(0, 16) || ""}
          onChange={handleChange}
        />

        {/* AUTHOR */}
        <CustomDropdown
          label="Author"
          name="author_id"
          value={formData.author_id}
          options={employees}
          onChange={handleChange}
        />

        {/* AREA */}
        <CustomDropdown
          label="Area"
          name="area_id"
          value={formData.area_id}
          options={areas}
          onChange={handleChange}
        />

        {/* DURATION */}
        <CustomTextInput
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
        />

        {/* EMPLOYEES INVOLVED */}
        <Box mt={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Employees Involved</Typography>
            <IconButton onClick={addField}>
              <AddIcon />
            </IconButton>
          </Box>

          {(formData.employeesinvolved || []).map((val, index) => (
            <Box key={index} display="flex" gap={1} mt={1}>
              <CustomDropdown
                label={`Employee ${index + 1}`}
                value={val}
                options={employees}
                onChange={(field, value) => handleArrayChange(index, value)}
              />

              <IconButton color="error" onClick={() => removeField(index)}>
                <RemoveIcon />
              </IconButton>
            </Box>
          ))}
        </Box>

        {/* OBSERVATION */}
        <CustomTextInput
          label="Observations"
          name="observations"
          value={formData.observations}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Action Taken"
          name="actiontaken"
          value={formData.actiontaken}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Status"
          name="status_id"
          value={formData.status_id}
                  options={[
            { value: 1, label: "Open" },
            { value: 2, label: "Pending" },
            { value: 3, label: "Closed" }
          ]}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Feedback Description"
          name="feedbackdiscription"
          value={formData.feedbackdiscription}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Feedback Action"
          name="feedbackaction"
          value={formData.feedbackaction}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Responsible Person"
          name="resopibleperson_id"
          value={formData.resopibleperson_id}
          options={employees}
          onChange={handleChange}
        />

        <Box mt={3}>
          <Button variant="contained" fullWidth onClick={handleSave}>
            Save
          </Button>

          <Button fullWidth sx={{ mt: 1 }} onClick={onClose}>
            Cancel
          </Button>
        </Box>

      </Box>
    </Modal>
  );
}