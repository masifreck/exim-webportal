import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";
import CustomTextInput from "../../Components/CustomTextInput";
import API from "../../api/api";

export default function RolePage() {

  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);

  const [page,setPage] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [total,setTotal] = useState(0);

  const [search,setSearch] = useState("");

  const [open,setOpen] = useState(false);

  const [formData,setFormData] = useState({
    id:null,
    name:"",
    description:""
  });

  /* ---------------- FETCH ROLES ---------------- */

  const fetchRoles = async()=>{

    try{

      setLoading(true);

      const {data} = await API.get(
        `/roles?page=${page+1}&limit=${pageSize}&search=${search}`
      );

      setRows(data.data);
      setTotal(data.total || data.data.length);

    }catch(err){

      console.log(err);

    }finally{

      setLoading(false);

    }

  };

  useEffect(()=>{
    fetchRoles();
  },[page,pageSize,search]);

  /* ---------------- FORM CHANGE ---------------- */

  const handleChange = (field,value)=>{

    setFormData({
      ...formData,
      [field]:value
    });

  };

  /* ---------------- SAVE ROLE ---------------- */

  const handleSave = async()=>{

    try{

      const payload = {
        name:formData.name,
        description:formData.description
      };

      if(formData.id){

        await API.put(`/roles/${formData.id}`,payload);

      }else{

        await API.post("/roles",payload);

      }

      setOpen(false);
      setFormData({id:null,name:"",description:""});
      fetchRoles();

    }catch(err){

      alert("Failed to save role");

    }

  };

  /* ---------------- DELETE ROLE ---------------- */

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete this role?")) return;

    try{

      await API.delete(`/roles/${id}`);

      fetchRoles();

    }catch(err){

      alert("Delete failed");

    }

  };

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = ()=>{

    const csv = new ExportToCsv({
      filename:"roles",
      useKeysAsHeaders:true
    });

    csv.generateCsv(rows);

  };

  /* ---------------- EDIT ---------------- */

  const handleRowClick = (params)=>{

    setFormData({
      id:params.row.id,
      name:params.row.name,
      description:params.row.description
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
      headerName:"Role",
      flex:2
    },

    {
      field:"description",
      headerName:"Description",
      flex:3
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

    <Box sx={{height:700,width:"100%"}}>

      <Box sx={{display:"flex",gap:2,mb:2}}>

        <Button
          variant="contained"
          onClick={()=>{
            setFormData({id:null,name:"",description:""});
            setOpen(true);
          }}
        >
          Add Role
        </Button>

        <Button
          variant="outlined"
          onClick={exportCSV}
        >
          Download CSV
        </Button>

        <TextField
          size="small"
          label="Search Role"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
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
            {formData.id ? "Edit Role" : "Add Role"}
          </h3>

          <CustomTextInput
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <CustomTextInput
            label="Description"
            name="description"
            value={formData.description}
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