import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";

import API from "../api/api";
import LineWalkModal from "../Components/LineWalkModal";

export default function LineWalk() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [areas, setAreas] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const emptyForm = {
    line_walk_datetime: "",
    author_id: "",
    area_id: "",
    duration: "",
    employeesinvolved: [""],
    observations: "",
    actiontaken: "",
    status_id: "",
    feedbackdiscription: "",
    feedbackaction: "",
    resopibleperson_id: ""
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  /* ---------------- DROPDOWNS ---------------- */

  const fetchDropdowns = async () => {
    const [areaRes, empRes, statusRes] = await Promise.all([
      API.get("/area"),
    API.get("/employees/dropdown"),
     
    ]);

    setAreas(areaRes.data.data.map(i => ({ value: i.id, label: i.name })));
    setEmployees(empRes.data.data.map(i => ({ value: i.id, label: i.name })));

  };

  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/line-walk?page=${page + 1}&limit=${pageSize}&search=${search}`
      );

      setData(data.data);
      setTotal(data.total);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdowns();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, search]);

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        employeesinvolved: formData.employeesinvolved
      };

      if (editing) {
        await API.put(`/line-walk/${editing.id}`, payload);
      } else {
        await API.post(`/line-walk`, payload);
      }

      setOpen(false);
      fetchData();

    } catch (err) {
      alert("Error saving data");
    }
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete record?")) return;

    await API.delete(`/line-walk/${id}`);
    fetchData();
  };

  /* ---------------- CSV ---------------- */

  const exportCSV = () => {
    const csv = new ExportToCsv({
      filename: "line-walk",
      useKeysAsHeaders: true
    });

    csv.generateCsv(data);
  };

  /* ---------------- COLUMNS ---------------- */

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "duration", headerName: "Duration", width: 120 },
    { field: "observations", headerName: "Observations", width: 200 },
    { field: "actiontaken", headerName: "Action Taken", width: 200 },
      {
    field: "feedbackdiscription",
    headerName: "Feedback Description",
    width: 220
  },
     {
    field: "feedbackaction",
    headerName: "Feedback Action",
    width: 200
  },
 {
    field: "created_at",
    headerName: "Created At",
    width: 180,
    valueFormatter: (params) =>
      params.value ? new Date(params.value).toLocaleString() : ""
  },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => {
              setEditing(params.row);
              setFormData({
                ...emptyForm,
                ...params.row,
                employeesinvolved: params.row.employeesinvolved || []
              });
              setOpen(true);
            }}
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
    <Box sx={{ height: 600, width: "100%" }}>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>

        <Button
          variant="contained"
          onClick={() => {
            setEditing(null);
            setFormData(emptyForm);
            setOpen(true);
          }}
        >
          Add Line Walk
        </Button>

        <Button variant="outlined" onClick={exportCSV}>
          Export CSV
        </Button>

        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </Box>

      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        pagination
        page={page}
        pageSize={pageSize}
        rowCount={total}
        paginationMode="server"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        pageSizeOptions={[5, 10, 20]}
        slots={{ toolbar: GridToolbar }}
      />

      {loading && <CircularProgress />}

      <LineWalkModal
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSave}
        areas={areas}
        employees={employees}
     
      />

    </Box>
  );
}