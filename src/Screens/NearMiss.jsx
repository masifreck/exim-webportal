import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";

import API from "../api/api";
import NearMissModal from "../Components/NearMissModal";

export default function NearMiss() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
const [branches,setBranches] = useState([]);
const [locations,setLocations] = useState([]);
const [places,setPlaces] = useState([]);
const [employees,setEmployees] = useState([]);
const [consequences,setConsequences] = useState([]);

const emptyForm = {
  near_miss_datetime: "",
  branch_id:"",
  incidentlocation_id: "",
  placeofincident_id: "",
  personslogin_id: [""],
  personsinvolved: [""],
  possibleconsequences_id: "",
  incidentdescription: "",
  immediateactiontaken: "",
  rootcauseanalysis: "",
  correctiveaction: "",
  preventiveaction: "",
  resposibility: "",
  status_id: ""
};

  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
const fetchDropdowns = async () => {

  const [
    branchRes,
    locationRes,
    placeRes,
    empRes,
    consRes,
  ] = await Promise.all([
    API.get("/branches"),
    API.get("/locations"),
    API.get("/place"),
    API.get("/employees/dropdown"),
    API.get("/possible"),
  ]);

  setBranches(branchRes.data.data.map(i=>({value:i.id,label:i.name})));
  setLocations(locationRes.data.data.map(i=>({value:i.id,label:i.name})));
  setPlaces(placeRes.data.data.map(i=>({value:i.id,label:i.name})));
  setEmployees(empRes.data.data.map(i=>({value:i.id,label:i.name})));
  setConsequences(consRes.data.data.map(i=>({value:i.id,label:i.name})));
  
};
  /* ---------------- FETCH ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        `/near-miss?page=${page + 1}&limit=${pageSize}&search=${search}`
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
        personslogin_id: formData.personslogin_id,
        personsinvolved: formData.personsinvolved
      };

      if (editing) {
        await API.put(`/near-miss/${editing.id}`, payload);
      } else {
        await API.post(`/near-miss`, payload);
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

    await API.delete(`/near-miss/${id}`);
    fetchData();
  };

  /* ---------------- CSV ---------------- */

  const exportCSV = () => {
    const csv = new ExportToCsv({
      filename: "near-miss",
      useKeysAsHeaders: true
    });

    csv.generateCsv(data);
  };

  /* ---------------- COLUMNS ---------------- */

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "incidentdescription", headerName: "Description", width: 200 },
    { field: "resposibility", headerName: "Responsibility", width: 150 },
    { field: "status", headerName: "Status", width: 120 },

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
            personslogin_id: params.row.personslogin_id || [],
            personsinvolved: params.row.personsinvolved || []
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
          Add Near Miss
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

  <NearMissModal
  open={open}
  onClose={() => setOpen(false)}
  formData={formData}
  handleChange={handleChange}
  handleSave={handleSave}

  // ✅ ADD THESE PROPS
  branches={branches}
  locations={locations}
  places={places}
  employees={employees}
  consequences={consequences}

/>

    </Box>
  );
}