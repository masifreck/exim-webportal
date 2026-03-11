import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import UserModal from "../Components/UserModal";
import { usersData } from "../Components/usedata";

export default function User() {

  const [users, setUsers] = useState(usersData);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const emptyUser = {
    username: "",
    name: "",
    mobile: "",
    branchId: "",
    designation: "",
    location: "",
    appPassword: "",
    permissions: {
      tbt: false,
      nearMe: false,
      lineWalk: false,
      isAdmin: false
    }
  };

  const [formData, setFormData] = useState(emptyUser);

  const branches = [
    { value: "BR01", label: "Kanpur" },
    { value: "BR02", label: "Delhi" }
  ];

  const designations = [
    { value: "Manager", label: "Manager" },
    { value: "Supervisor", label: "Supervisor" }
  ];

  const locations = [
    { value: "Kanpur", label: "Kanpur" },
    { value: "Delhi", label: "Delhi" }
  ];

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePermission = (field) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [field]: !formData.permissions[field]
      }
    });
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? formData : u)));
    } else {
      const newUser = { ...formData, id: users.length + 1 };
      setUsers([...users, newUser]);
    }

    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "mobile", headerName: "Mobile", width: 150 },

    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => {
            setEditingUser(params.row);
            setFormData(params.row);
            setOpen(true);
          }}
        >
          Edit
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => {
          setEditingUser(null);
          setFormData(emptyUser);
          setOpen(true);
        }}
      >
        Add User
      </Button>

      <DataGrid
        rows={users}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />

      <UserModal
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handlePermission={handlePermission}
        handleSave={handleSave}
        branches={branches}
        designations={designations}
        locations={locations}
      />

    </Box>
  );
}