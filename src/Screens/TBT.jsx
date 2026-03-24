import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";

import API from "../api/api";
import TBTModal from "../Components/TBTModal"; // ✅ IMPORT MODAL

function TBT() {

  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);

  const [page,setPage] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [total,setTotal] = useState(0);

const [departments,setDepartments] = useState([]);
const [supervisors, setSupervisors]=useState([]);
const [sections, setSections]=useState([]);
const [employees, setEmployees]=useState([]);
const [itemofIntrest, setItemofIntreset]=useState([])

  const [search,setSearch] = useState("");
  const [editingTBT,setEditingTBT] = useState(null);
  const [open,setOpen] = useState(false);
  const [formData,setFormData] = useState({});

  const emptyTBT ={
    //all feilds should be empty 
  }
  /* ---------------- FETCH TBT ---------------- */
const handleUpdate = async(formDataPayload)=>{

  try{

    await API.put(
      `/tbt/update/${formData.id}`,
      formDataPayload,
      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
    );

    setOpen(false);
    fetchTBT();

  }catch(err){

    console.log(err);
    alert("Update failed");

  }

};
  const fetchTBT = async()=>{

    try{

      setLoading(true);

      const {data} = await API.get(
        `/tbt?page=${page+1}&limit=${pageSize}&search=${search}`
      );

      setRows(data.data);
      setTotal(data.count);

    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

    }

  };

  const fetchDropdowns = async ()=> {
    const [departmentsRes , supervisorsRes, sectionRes, employeesRes, itemRes ]=
    await Promise.all([
      API.get("/departments"),
      API.get("/employees/supervisor"),
       API.get("/section"),
        API.get("/employees/dropdown"),
         API.get("/itemofitrest"),
    ]);
    setDepartments(
      departmentsRes.data.data.map(i=>({
        value:i.id,
        label:i.name
      }))
    );

     setSupervisors(
      supervisorsRes.data.data.map(i=>({
        value:i.id,
        label:i.name
      }))
    );

     setSections(
      sectionRes.data.data.map(i=>({
        value:i.id,
        label:i.name
      }))
    );

     setEmployees(
      employeesRes.data.data.map(i=>({
        value:i.id,
        label:i.name
      }))
    );

     setItemofIntreset(
      itemRes.data.data.map(i=>({
        value:i.id,
        label:i.name
      }))
    );

  }
  useEffect(()=>{

    fetchTBT();
fetchDropdowns();
  },[page,pageSize,search]);

  /* ---------------- OPEN MODAL ---------------- */

  const openModal = (row)=>{

    setFormData(row);
    setOpen(true);

  };

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (field,value)=>{

    setFormData(prev=>({
      ...prev,
      [field]:value
    }));

  };
const handleSave = async ()=>{
  try{
    if(editingTBT){

        await API.put(`/employees/${editingUser.id}`,payload);

      }else{

        await API.post("/employees",payload);

      }

      setOpen(false);
      fetchTBT();
  }catch(err){

      alert("Failed to save user");

    }
}
  /* ---------------- UPDATE ---------------- */



  /* ---------------- DELETE ---------------- */

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete this record?")) return;

    try{
      await API.delete(`/tbt/delete/${id}`);
      fetchTBT();
    }catch(err){
      console.log(err);
      alert("Delete failed");
    }

  };

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = ()=>{

    const csv = new ExportToCsv({
      filename:"tbt_records",
      useKeysAsHeaders:true
    });

    csv.generateCsv(rows);

  };

  /* ---------------- GRID COLUMNS ---------------- */

  const columns = [

    {field:"id",headerName:"ID",width:70},

    {
      field:"tbt_datetime",
      headerName:"Date",
      width:180
    },

    {
      field:"department_id",
      headerName:"Department",
      width:120
    },

    {
      field:"section_id",
      headerName:"Section",
      width:120
    },

    {
      field:"point_discussed_dis",
      headerName:"Discussion",
      width:250
    },

    {
      field:"actions",
      headerName:"Actions",
      width:220,
      renderCell:(params)=>(

        <>
          <Button
            size="small"
            onClick={()=>openModal(params.row)}
          >
            View
          </Button>

          <Button
            size="small"
            color="error"
            onClick={()=>handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>

      )
    }

  ];

  return (

    <Box sx={{height:600,width:"100%"}}>

      {/* Toolbar */}

      <Box sx={{display:"flex",gap:2,mb:2}}>

        <Button
          variant="contained"
          color="success"
          onClick={()=>{
             setEditingTBT(null);
            setFormData(emptyTBT);
            setOpen(true);
          }
          }
        >
          + New TBT
        </Button>

        <Button
          variant="outlined"
          onClick={exportCSV}
        >
          Export CSV
        </Button>

        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

      </Box>

      {/* DataGrid */}

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        page={page}
        pageSize={pageSize}
        rowCount={total}
        paginationMode="server"
        onPageChange={(newPage)=>setPage(newPage)}
        onPageSizeChange={(size)=>setPageSize(size)}
        pageSizeOptions={[5,10,20]}
        slots={{toolbar:GridToolbar}}
       
      />

      {loading && <CircularProgress />}

      {/* ✅ MODAL COMPONENT */}

      <TBTModal
        open={open}
        onClose={()=>setOpen(false)}
        formData={formData}
        handleChange={handleChange}
        handleUpdate={handleUpdate}
        handleSave={handleSave}
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