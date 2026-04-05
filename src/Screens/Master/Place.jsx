import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";
import CustomTextInput from "../../components/CustomTextInput";
import API from "../../api/api";

const Place = () => {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    name: ""
  });

  const [errors, setErrors] = useState({
    name: ""
  });

  /* ---------------- FETCH ---------------- */

  const fetchPlaces = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/place?page=${page + 1}&limit=${pageSize}&search=${search}`
      );

      setRows(data.data);
      setTotal(data.total);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [page, pageSize, search]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    let isValid = true;
    let newErrors = { name: "" };

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Place name is required";
      isValid = false;
    } else if (formData.name.length < 3) {
      newErrors.name = "Minimum 3 characters required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });

    setErrors({
      ...errors,
      [field]: ""
    });
  };

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {

    if (!validate()) return;

    try {

      if (formData.id) {
        await API.put(`/place/${formData.id}`, {
          name: formData.name
        });
      } else {
        await API.post("/place", {
          name: formData.name
        });
      }

      setOpen(false);
      setFormData({ id: null, name: "" });
      fetchPlaces();

    } catch (err) {
      alert("Failed to save place");
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this place?")) return;

    try {
      await API.delete(`/place/${id}`);
      fetchPlaces();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ---------------- CSV ---------------- */

  const exportCSV = () => {
    const csv = new ExportToCsv({
      filename: "places",
      useKeysAsHeaders: true
    });

    csv.generateCsv(rows);
  };

  /* ---------------- EDIT ---------------- */

  const handleRowClick = (params) => {
    setFormData({
      id: params.row.id,
      name: params.row.name
    });

    setErrors({ name: "" });
    setOpen(true);
  };

  /* ---------------- COLUMNS ---------------- */

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80
    },
    {
      field: "name",
      headerName: "Place Name",
      flex: 1
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => handleRowClick(params)}
          >
            Edit
          </Button>

          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <Box sx={{ height: 500, width: "100%" }}>

      {/* TOP BAR */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>

        <Button
          variant="contained"
          onClick={() => {
            setFormData({ id: null, name: "" });
            setErrors({ name: "" });
            setOpen(true);
          }}
        >
          Add Place
        </Button>

        <Button
          variant="outlined"
          onClick={exportCSV}
        >
          Download CSV
        </Button>

        <TextField
          size="small"
          label="Search Place"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "6px"
          }}
        />

      </Box>

      {/* TABLE */}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        rowCount={total}
        pageSizeOptions={[5, 10, 20]}
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(size) => setPageSize(size)}
        slots={{ toolbar: GridToolbar }}
        checkboxSelection
      />

      {/* MODAL */}
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

          <h3>
            {formData.id ? "Edit Place" : "Add Place"}
          </h3>

          <CustomTextInput
            label="Place Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          {errors.name && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.name}
            </p>
          )}

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>

            <Button
              variant="contained"
              onClick={handleSave}
            >
              {formData.id ? "Update" : "Save"}
            </Button>

            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

          </Box>

        </Box>
      </Modal>

    </Box>
  );
};

export default Place;