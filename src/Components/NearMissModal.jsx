import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton,
  Divider
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import CustomTextInput from "./CustomTextInput";
import CustomDropdown from "./CustomDropdown";

export default function NearMissModal({
  open,
  onClose,
  formData,
  handleChange,
  handleSave,
  branches,
  locations,
  places,
  employees,
  consequences,
}) {

  /* ---------------- MULTI HANDLER ---------------- */

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

  /* ---------------- MULTI DROPDOWN ---------------- */

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

  /* ---------------- MULTI TEXT INPUT ---------------- */

  const renderMultiText = (label, field) => (
    <Box mt={2}>
      <Box display="flex" justifyContent="space-between">
        <Typography>{label}</Typography>
        <IconButton onClick={() => addField(field)}>
          <AddIcon />
        </IconButton>
      </Box>

      {(formData[field] || []).map((value, index) => (
        <Box key={index} display="flex" gap={1} mt={1}>
          <CustomTextInput
            label={`${label} ${index + 1}`}
            name={field}
            value={value}
            onChange={(field, val) => handleArrayChange(field, index, val)}
          />

          <IconButton color="error" onClick={() => removeField(field, index)}>
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );

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

        <Typography variant="h6">Near Miss</Typography>

        {/* DATE */}
        <CustomTextInput
          label="Date & Time"
          name="near_miss_datetime"
          type="datetime-local"
          value={formData.near_miss_datetime?.slice(0, 16) || ""}
          onChange={handleChange}
        />

        {/* BRANCH */}
        <CustomDropdown
          label="Branch"
          name="branch_id"
          value={formData.branch_id}
          options={branches}
          onChange={handleChange}
        />

        {/* INCIDENT LOCATION */}
        <CustomDropdown
          label="Incident Location"
          name="incidentlocation_id"
          value={formData.incidentlocation_id}
          options={locations}
          onChange={handleChange}
        />

        {/* PLACE */}
        <CustomDropdown
          label="Place of Incident"
          name="placeofincident_id"
          value={formData.placeofincident_id}
          options={places}
          onChange={handleChange}
        />

        {/* PERSONS LOGGING (MULTI DROPDOWN) */}
        {renderMultiDropdown("Persons Logging", "personslogin_id", employees)}

        {/* PERSONS INVOLVED (MULTI TEXT) */}
        {renderMultiText("Persons Involved", "personsinvolved")}

        <Divider sx={{ my: 2 }} />

        {/* CONSEQUENCE */}
        <CustomDropdown
          label="Possible Consequence"
          name="possibleconsequences_id"
          value={formData.possibleconsequences_id}
          options={consequences}
          onChange={handleChange}
        />

        {/* TEXT FIELDS */}
        <CustomTextInput
          label="Incident Description"
          name="incidentdescription"
          value={formData.incidentdescription}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Immediate Action"
          name="immediateactiontaken"
          value={formData.immediateactiontaken}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Root Cause Analysis"
          name="rootcauseanalysis"
          value={formData.rootcauseanalysis}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Corrective Action"
          name="correctiveaction"
          value={formData.correctiveaction}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Preventive Action"
          name="preventiveaction"
          value={formData.preventiveaction}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Responsibility"
          name="resposibility"
          value={formData.resposibility}
          onChange={handleChange}
        />

        {/* STATUS */}
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