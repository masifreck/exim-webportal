import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";
import CustomTextInput from "../../Components/CustomTextInput";
import API from "../../api/api";

export default function DepartmentPage() {

  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);

  const [page,setPage] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [total,setTotal] = useState(0);

  const [search,setSearch] = useState("");

  const [open,setOpen] = useState(false);

  const [formData,setFormData] = useState({
    id:null,
    name:""
  });

  /* ---------------- FETCH DEPARTMENTS ---------------- */

  const fetchDepartments = async()=>{

    try{

      setLoading(true);

      const {data} = await API.get(
        `/departments?page=${page+1}&limit=${pageSize}&search=${search}`
      );

      setRows(data.data);
      setTotal(data.total);

    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    fetchDepartments();
  },[page,pageSize,search]);

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (field,value)=>{

    setFormData({
      ...formData,
      [field]:value
    });

  };

  /* ---------------- SAVE DEPARTMENT ---------------- */

  const handleSave = async()=>{

    try{

      if(formData.id){

        await API.put(`/departments/${formData.id}`,{
          name:formData.name
        });

      }else{

        await API.post("/departments",{
          name:formData.name
        });

      }

      setOpen(false);
      setFormData({id:null,name:""});
      fetchDepartments();

    }catch(err){

      alert("Failed to save department");

    }

  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete this department?")) return;

    try{

      await API.delete(`/departments/${id}`);

      fetchDepartments();

    }catch(err){

      alert("Delete failed");

    }

  };

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = ()=>{

    const csv = new ExportToCsv({
      filename:"departments",
      useKeysAsHeaders:true
    });

    csv.generateCsv(rows);

  };

  /* ---------------- EDIT ---------------- */

  const handleRowClick = (params)=>{

    setFormData({
      id:params.row.id,
      name:params.row.name
    });

    setOpen(true);

  };

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = [

    {
      field:"id",
      headerName:"ID",
      width:80
    },

    {
      field:"name",
      headerName:"Department",
      flex:1
    },

    {
      field:"actions",
      headerName:"Actions",
      width:150,
      renderCell:(params)=>(
        <>
          <Button
            size="small"
            onClick={()=>handleRowClick(params)}
          >
            Edit
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

    <Box sx={{height:500,width:"100%"}}>

      <Box sx={{display:"flex",gap:2,mb:2}}>

        <Button
          variant="contained"
          onClick={()=>{

            setFormData({id:null,name:""});
            setOpen(true);

          }}
        >
          Add Department
        </Button>

        <Button
          variant="outlined"
          onClick={exportCSV}
        >
          Download CSV
        </Button>

  <TextField
  size="small"
  label="Search Department"
  value={search}
  onChange={(e)=>setSearch(e.target.value)}
  sx={{
    backgroundColor: "#f5f5f5",
    borderRadius: "6px"
  }}
/>

      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        pagination
        paginationMode="server"
        page={page}
        pageSize={pageSize}
        rowCount={total}
        pageSizeOptions={[5,10,20]}
        onPageChange={(newPage)=>setPage(newPage)}
        onPageSizeChange={(size)=>setPageSize(size)}
        slots={{toolbar:GridToolbar}}
        checkboxSelection
      />

      {/* MODAL */}

      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        sx={{
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}
      >

        <Box
          sx={{
            bgcolor:"#fff",
            p:3,
            width:{xs:"95%",sm:400},
            borderRadius:2
          }}
        >

          <h3>
            {formData.id ? "Edit Department" : "Add Department"}
          </h3>

          <CustomTextInput
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <Box sx={{mt:2,display:"flex",gap:2}}>

            <Button
              variant="contained"
              onClick={handleSave}
            >
              {formData.id ? "Update" : "Save"}
            </Button>

            <Button
              variant="outlined"
              onClick={()=>setOpen(false)}
            >
              Cancel
            </Button>

          </Box>

        </Box>

      </Modal>

    </Box>

  );

}