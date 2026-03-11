import {
  Modal,
  Box,
  Button,
  Checkbox,
  FormControlLabel
} from "@mui/material";

import CustomTextInput from "./CustomTextInput";
import CustomDropdown from "./CustomDropdown";

export default function UserModal({
  open,
  onClose,
  formData,
  handleChange,
  handlePermission,
  handleSave,
  branches,
  designations,
  locations
}) {
  return (
  <Modal
  open={open}
  onClose={onClose}
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    p: 2
  }}
>
  <Box
    sx={{
      width: {
        xs: "100%",   // mobile
        sm: 420       // tablet + desktop
      },
      maxHeight: "90vh",
      overflowY: "auto",
      bgcolor: "#fff",
      p: 3,
      borderRadius: 2,
      boxShadow: 24
    }}
  >
        <h3>User Details</h3>

        <CustomTextInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <CustomTextInput
          label="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
        />

        <CustomTextInput
          label="App Password"
          name="appPassword"
          value={formData.appPassword}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Branch"
          name="branchId"
          value={formData.branchId}
          options={branches}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Designation"
          name="designation"
          value={formData.designation}
          options={designations}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Location"
          name="location"
          value={formData.location}
          options={locations}
          onChange={handleChange}
        />

        <h4>Permissions</h4>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.tbt}
              onChange={() => handlePermission("tbt")}
            />
          }
          label="TBT"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.nearMe}
              onChange={() => handlePermission("nearMe")}
            />
          }
          label="Near Me"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.lineWalk}
              onChange={() => handlePermission("lineWalk")}
            />
          }
          label="Line Walk"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.isAdmin}
              onChange={() => handlePermission("isAdmin")}
            />
          }
          label="Is Admin"
        />

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>

          <Button sx={{ ml: 2 }} onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}