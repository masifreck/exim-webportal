import {
  Modal,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography
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
  departments,
  roles
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
          width:{ xs:"100%", sm:420 },
          maxHeight:"90vh",
          overflowY:"auto",
          bgcolor:"#fff",
          p:3,
          borderRadius:2,
          boxShadow:24
        }}
      >

        <Typography variant="h6" mb={2}>
          User Details
        </Typography>

        {/* EMPLOYEE ID */}
        <CustomTextInput
          label="Employee ID"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
        />

        {/* USERNAME */}
        <CustomTextInput
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* NAME */}
        <CustomTextInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* MOBILE */}
        <CustomTextInput
          label="Mobile No"
          name="mobile_no"
          value={formData.mobile_no}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <CustomTextInput
          label="Password"
          name="password"
          value={formData.password}
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

        {/* DEPARTMENT */}
        <CustomDropdown
          label="Department"
          name="department_id"
          value={formData.department_id}
          options={departments}
          onChange={handleChange}
        />

        {/* DESIGNATION */}
        <CustomDropdown
          label="Designation"
          name="designation_id"
          value={formData.designation_id}
          options={designations}
          onChange={handleChange}
        />

        {/* ROLE */}
        <CustomDropdown
          label="Role"
          name="role_id"
          value={formData.role_id}
          options={roles}
          onChange={handleChange}
        />

        {/* GENDER */}
        <CustomDropdown
          label="Gender"
          name="gender"
          value={formData.gender}
          options={[
            {value:"male",label:"Male"},
            {value:"female",label:"Female"},
            {value:"other",label:"Other"}
          ]}
          onChange={handleChange}
        />

        <Typography variant="subtitle1" mt={2}>
          Permissions
        </Typography>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.tbt}
              onChange={()=>handlePermission("tbt")}
            />
          }
          label="TBT"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.nearMe}
              onChange={()=>handlePermission("nearMe")}
            />
          }
          label="Near Miss"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.lineWalk}
              onChange={()=>handlePermission("lineWalk")}
            />
          }
          label="Line Walk"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.permissions.isAdmin}
              onChange={()=>handlePermission("isAdmin")}
            />
          }
          label="Is Admin"
        />

        <Box sx={{ mt:3 }}>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSave}
          >
            Save
          </Button>

          <Button
            sx={{ mt:1 }}
            fullWidth
            onClick={onClose}
          >
            Cancel
          </Button>

        </Box>

      </Box>

    </Modal>
  );
}