import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomTextInput from "./CustomTextInput";
import CustomDropdown from "./CustomDropdown";

const BASE_URL = "http://localhost:8000/";

export default function TBTModal({
  open,
  onClose,
  formData,
  handleChange,
  handleSave,
  handlePermission,
  departments,
  supervisors,
  sections,
  employees,
  itemofIntrest
}) {

  const [newFiles, setNewFiles] = useState({});
  const [removedFiles, setRemovedFiles] = useState({});

  /* ---------------- MULTI DROPDOWN ---------------- */

  const handleArrayChange = (field, index, value) => {
    const updated = [...(formData[field] || [])];
    updated[index] = value;
    handleChange(field, updated);
  };

  const addField = (field) => {
    handleChange(field, [...(formData[field] || []), ""]);
  };

  const removeField = (field, index) => {
    const updated = [...(formData[field] || [])];
    updated.splice(index, 1);
    handleChange(field, updated);
  };

  const renderMultiDropdown = (label, field, options) => (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography>{label}</Typography>
        <IconButton onClick={() => addField(field)}>
          <AddIcon />
        </IconButton>
      </Box>

      {(formData[field] || []).map((value, index) => (
        <Box key={index} display="flex" gap={1} mt={1}>
          <CustomDropdown
            label={`${label} ${index + 1}`}
            name={field}
            value={value}
            options={options}
            onChange={(field, val) => handleArrayChange(field, index, val)}
          />

          <IconButton color="error" onClick={() => removeField(field, index)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

  /* ---------------- FILE HANDLING ---------------- */

  const getFileUrl = (file) => BASE_URL + file.replace(/\\/g, "/");

  const removeFile = (field, file) => {
    handleChange(
      field,
      (formData[field] || []).filter(f => f !== file)
    );

    setRemovedFiles(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), file]
    }));
  };

  const handleFileUpload = (field, e) => {
    setNewFiles(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), ...e.target.files]
    }));
  };

  const renderAttachments = (label, field, uploadKey) => (
    <Box mt={2}>
      <Typography>{label}</Typography>

      <Box display="flex" gap={2} flexWrap="wrap">

        {/* OLD FILES */}
        {(formData[field] || []).map((file, index) => {
          const url = getFileUrl(file);

          return (
            <Box key={index} position="relative">
              {file.match(/\.(jpg|jpeg|png)$/i) ? (
                <img src={url} width={100} height={100} />
              ) : (
                <Button onClick={() => window.open(url)}>PDF</Button>
              )}

              <IconButton
                size="small"
                color="error"
                onClick={() => removeFile(field, file)}
                sx={{ position: "absolute", top: -8, right: -8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}

        {/* NEW FILES */}
        {(newFiles[uploadKey] || []).map((file, index) => {
          const preview = URL.createObjectURL(file);

          return (
            <Box key={index} position="relative">
              {file.type.startsWith("image") ? (
                <img src={preview} width={100} height={100} />
              ) : (
                <Button onClick={() => window.open(preview)}>PDF</Button>
              )}

              <IconButton
                size="small"
                color="error"
                onClick={() =>
                  setNewFiles(prev => ({
                    ...prev,
                    [uploadKey]: prev[uploadKey].filter((_, i) => i !== index)
                  }))
                }
                sx={{ position: "absolute", top: -8, right: -8 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}

      </Box>

      <input
        type="file"
        multiple
        onChange={(e) => handleFileUpload(uploadKey, e)}
      />
    </Box>
  );

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = () => {

    const data = new FormData();

 // only send normal fields
Object.keys(formData).forEach(key => {

  // ❌ skip attachment fields
  if (
    key.includes("attachment")
  ) return;

  data.append(key, JSON.stringify(formData[key]));
});

    Object.keys(newFiles).forEach(field => {
      newFiles[field].forEach(file => {
        data.append(field, file);
      });
    });

    data.append("removedFiles", JSON.stringify(removedFiles));

    handleSave(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        width: 500,
        maxHeight: "90vh",
        overflowY: "auto",
        bgcolor: "#fff",
        p: 3,
        borderRadius: 2
      }}>

        <Typography variant="h6">TBT Details</Typography>

        <CustomTextInput
          label="Date"
          name="tbt_datetime"
          type="datetime-local"
          value={formData.tbt_datetime?.slice(0, 16) || ""}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Department"
          name="department_id"
          value={formData.department_id}
          options={departments}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Section"
          name="section_id"
          value={formData.section_id}
          options={sections}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Supervisor"
          name="supervision_id"
          value={formData.supervision_id}
          options={supervisors}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Contractor"
          name="contractorR_id"
          value={formData.contractorR_id}
          options={employees}
          onChange={handleChange}
        />

        {renderMultiDropdown("Contract Employees", "contract_emp_ids", employees)}

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.point_discussed || false}
              onChange={() => handlePermission("point_discussed")}
            />
          }
          label="Point Discussed"
        />

        <CustomTextInput
          label="Discussion"
          name="point_discussed_dis"
          value={formData.point_discussed_dis}
          onChange={handleChange}
        />

        <Divider sx={{ my: 2 }} />

        <CustomTextInput
          label="General Observation"
          name="item_general_dis"
          value={formData.item_general_dis}
          onChange={handleChange}
        />

        {renderAttachments("General Attachments", "item_general_attachment", "itemGeneralAttachment")}

        <Divider sx={{ my: 2 }} />

        {renderMultiDropdown("Item Interest", "item_interest_ids", itemofIntrest)}

        <CustomTextInput
          label="Interest Description"
          name="item_interest_dis"
          value={formData.item_interest_dis}
          onChange={handleChange}
        />

        {renderAttachments("Interest Attachments", "item_interest_attachment", "itemInterestAttachment")}

        <Divider sx={{ my: 2 }} />

        <CustomTextInput
          label="SOP"
          name="sop_dis"
          value={formData.sop_dis}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Reminder"
          name="reminder_dis"
          value={formData.reminder_dis}
          onChange={handleChange}
        />

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.safety_message || false}
              onChange={() => handlePermission("safety_message")}
            />
          }
          label="Safety Message"
        />

        <CustomTextInput
          label="Safety Description"
          name="safety_message_description"
          value={formData.safety_message_description}
          onChange={handleChange}
        />

        {renderAttachments("Safety Attachments", "safety_message_attachment", "safetyMAttachment")}

        <Divider sx={{ my: 2 }} />

        {renderAttachments("TBT Attachments", "tbt_attachment", "tbtAttachment")}

        <Box mt={3}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
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