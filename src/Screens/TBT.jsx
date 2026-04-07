import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";
import DownloadIcon from "@mui/icons-material/Download";
import API from "../api/api";
import TBTModal from "../Components/TBTModal";

function TBT() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [sections, setSections] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [itemofIntrest, setItemofIntreset] = useState([]);

  const [search, setSearch] = useState("");
  const [editingTBT, setEditingTBT] = useState(null);
  const [open, setOpen] = useState(false);

  const emptyTBT = {
    tbt_datetime: "",
    department_id: "",
    section_id: "",
    supervision_id: "",
    contractorR_id: "",
    contract_emp_ids: [],
    point_discussed: false,
    point_discussed_dis: "",
    item_general_dis: "",
    item_general_attachment: [],
    item_interest_ids: [],
    item_interest_dis: "",
    item_interest_attachment: [],
    sop_dis: "",
    reminder_dis: "",
    safety_message: false,
    safety_message_description: "",
    safety_message_attachment: [],
    tbt_attachment: []
  };

  const [formData, setFormData] = useState(emptyTBT);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handlePermission = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  /* ---------------- FETCH ---------------- */

  const fetchTBT = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/tbt?page=${page + 1}&limit=${pageSize}&search=${search}`
      );

      setRows(data.data);
      setTotal(data.total_records);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {

    const [
      departmentsRes,
      supervisorsRes,
      sectionRes,
      employeesRes,
      itemRes
    ] = await Promise.all([
      API.get("/departments"),
      API.get("/employees/supervisor"),
      API.get("/section"),
      API.get("/employees/dropdown"),
      API.get("/itemofitrest"),
    ]);

    setDepartments(departmentsRes.data.data.map(i => ({ value: i.id, label: i.name })));
    setSupervisors(supervisorsRes.data.data.map(i => ({ value: i.id, label: i.name })));
    setSections(sectionRes.data.data.map(i => ({ value: i.id, label: i.name })));
    setEmployees(employeesRes.data.data.map(i => ({ value: i.id, label: i.name })));
    setItemofIntreset(itemRes.data.data.map(i => ({ value: i.id, label: i.name })));
  };

  useEffect(() => {
    fetchTBT();
    fetchDropdowns();
  }, [page, pageSize, search]);

  /* ---------------- SAVE (CREATE + UPDATE) ---------------- */

  const handleSave = async (formDataPayload) => {

    try {

      if (editingTBT) {
        await API.put(`/tbt/update/${editingTBT.id}`, formDataPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await API.post(`/tbt/create`, formDataPayload, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setOpen(false);
      fetchTBT();

    } catch (err) {
      console.log(err);
      alert("Save failed");
    }
  };

  /* ---------------- OPEN MODAL ---------------- */

  const openModal = (row) => {
    setEditingTBT(row);
    setFormData(row);
    setOpen(true);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;

    await API.delete(`/tbt/delete/${id}`);
    fetchTBT();
  };

  const getDepartmentName = (id) => {
  return departments.find((d) => d.value === id)?.label || "-";
};

const getSectionName = (id) => {
  return sections.find((s) => s.value === id)?.label || "-";
};

const getSupervisorName = (id) => {
  return supervisors.find((s) => s.value === id)?.label || "-";
};

  /* ---------------- GRID ---------------- */
const exportCSV = () => {

  const csvData = rows.map((row) => ({
    ID: row.id,
    Date: row.tbt_datetime
      ? new Date(row.tbt_datetime).toLocaleString()
      : "-",
    Department: getDepartmentName(row.department_id),
    Section: getSectionName(row.section_id),
    Supervisor: getSupervisorName(row.supervision_id),
    Discussed: row.point_discussed ? "Yes" : "No",
    Discussion: row.point_discussed_dis || "-",
    GeneralObservation: row.item_general_dis || "-",
    SafetyMessage: row.safety_message ? "Yes" : "No"
  }));

  const options = {
    fieldSeparator: ",",
    filename: "TBT_Report",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: true
  };

  const csvExporter = new ExportToCsv(options);
  csvExporter.generateCsv(csvData);
};
const columns = [
  { field: "id", headerName: "ID", width: 70 },

  {
    field: "tbt_datetime",
    headerName: "Date",
    width: 180,
    renderCell: ({ row }) =>
      row?.tbt_datetime
        ? new Date(row.tbt_datetime).toLocaleString()
        : "-"
  },

  {
    field: "department_id",
    headerName: "Department",
    width: 160,
    renderCell: ({ row }) =>
      getDepartmentName(row?.department_id)
  },

  {
    field: "section_id",
    headerName: "Section",
    width: 160,
    renderCell: ({ row }) =>
      getSectionName(row?.section_id)
  },

  {
    field: "supervision_id",
    headerName: "Supervisor",
    width: 160,
    renderCell: ({ row }) =>
      getSupervisorName(row?.supervision_id)
  },

  {
    field: "point_discussed",
    headerName: "Discussed",
    width: 120,
    renderCell: ({ row }) =>
      row?.point_discussed ? "Yes" : "No"
  },

  {
    field: "point_discussed_dis",
    headerName: "Discussion",
    width: 250,
    renderCell: ({ row }) => row?.point_discussed_dis || "-"
  },

  {
    field: "item_general_dis",
    headerName: "General Observation",
    width: 250,
    renderCell: ({ row }) => row?.item_general_dis || "-"
  },

  {
    field: "safety_message",
    headerName: "Safety Msg",
    width: 120,
    renderCell: ({ row }) =>
      row?.safety_message ? "Yes" : "No"
  },

  {
    field: "actions",
    headerName: "Actions",
    width: 220,
    renderCell: ({ row }) => (
      <>
        <Button size="small" onClick={() => openModal(row)}>
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(row.id)}
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
      setEditingTBT(null);
      setFormData(emptyTBT);
      setOpen(true);
    }}
  >
    + New TBT
  </Button>

<Button
  variant="outlined"
  color="success"
  startIcon={<DownloadIcon />}
  onClick={exportCSV}
>
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
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        page={page}
        pageSize={pageSize}
        rowCount={total}
        paginationMode="server"
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => setPageSize(s)}
        slots={{ toolbar: GridToolbar }}
      />

      {loading && <CircularProgress />}

      <TBTModal
        open={open}
        onClose={() => setOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSave}
        handlePermission={handlePermission}
        departments={departments}
        supervisors={supervisors}
        sections={sections}
        employees={employees}
        itemofIntrest={itemofIntrest}
      />

    </Box>
  );
}

export default TBT;