import React, { useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CustomTextInput from "../../components/CustomTextInput";
import { designationData } from "../../Components/Data";

export default function DesignationPage() {

  const [rows, setRows] = useState(designationData);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: ""
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSave = () => {

    if (formData.id) {

      const updatedRows = rows.map((row) =>
        row.id === formData.id ? formData : row
      );

      setRows(updatedRows);

    } else {

      const newRow = {
        id: rows.length + 1,
        name: formData.name
      };

      setRows([...rows, newRow]);
    }

    setFormData({ id: null, name: "" });
    setOpen(false);
  };

  const handleRowClick = (params) => {

    setFormData({
      id: params.row.id,
      name: params.row.name
    });

    setOpen(true);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Designation", flex: 1 }
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => {
          setFormData({ id: null, name: "" });
          setOpen(true);
        }}
      >
        Add Designation
      </Button>

      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
        onRowClick={handleRowClick}
      />

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            bgcolor: "#fff",
            p: 3,
            width: { xs: "95%", sm: 400 },
            borderRadius: 2
          }}
        >

          <h3>{formData.id ? "Edit Designation" : "Add Designation"}</h3>

          <CustomTextInput
            label="Designation Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Button variant="contained" onClick={handleSave}>
            {formData.id ? "Update" : "Save"}
          </Button>

        </Box>
      </Modal>

    </Box>
  );
}