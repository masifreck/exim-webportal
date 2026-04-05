import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ExportToCsv } from "export-to-csv";

import API from "../api/api";
import UserModal from "../Components/UserModal";

export default function User() {

  const [users,setUsers] = useState([]);
  const [loading,setLoading] = useState(false);

  const [page,setPage] = useState(0);
  const [pageSize,setPageSize] = useState(10);
  const [total,setTotal] = useState(0);

  const [search,setSearch] = useState("");

  const [open,setOpen] = useState(false);
  const [editingUser,setEditingUser] = useState(null);


const [branches,setBranches] = useState([]);
const [designations,setDesignations] = useState([]);
const [departments,setDepartments] = useState([]);
const [roles,setRoles] = useState([]);

  const emptyUser = {
    employee_id:"",
    username:"",
    name:"",
    mobile_no:"",
    password:"",
    branch_id:"",
    designation_id:"",
    department_id:"",
    role_id:"",
    gender:"male",
    is_active:true,
    permissions:{
      tbt:false,
      nearMe:false,
      lineWalk:false,
      isAdmin:false
    }
  };

  const [formData,setFormData] = useState(emptyUser);

  const handleChange = (field,value)=>{
    setFormData({...formData,[field]:value});
  };

  const handlePermission = (field)=>{
    setFormData({
      ...formData,
      permissions:{
        ...formData.permissions,
        [field]:!formData.permissions[field]
      }
    });
  };

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async()=>{

    try{

      setLoading(true);

      const {data} = await API.get(`/employees?page=${page+1}&limit=${pageSize}&search=${search}`);

      setUsers(data.data);
      setTotal(data.total);

    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }

  };

 
  const fetchDropdowns = async () => {

  const [branchRes,designationRes,departmentRes,roleRes] =
  await Promise.all([
    API.get("/branches"),
    API.get("/designations"),
    API.get("/departments"),
    API.get("/roles")
  ]);

  setBranches(
    branchRes.data.data.map(i=>({
      value:i.id,
      label:i.name
    }))
  );

  setDesignations(
    designationRes.data.data.map(i=>({
      value:i.id,
      label:i.name
    }))
  );

  setDepartments(
    departmentRes.data.data.map(i=>({
      value:i.id,
      label:i.name
    }))
  );

  setRoles(
    roleRes.data.data.map(i=>({
      value:i.id,
      label:i.name
    }))
  );

};
useEffect(()=>{
  fetchUsers();
  fetchDropdowns();
},[page,pageSize,search]);

  /* ---------------- CREATE / UPDATE USER ---------------- */

  const handleSave = async()=>{

    try{

      const payload = {
      //  employee_id:formData.employee_id,
        name:formData.name,
        mobile_no:formData.mobile_no,
        username:formData.username,
        password:formData.password,
        designation_id:formData.designation_id,
        department_id:formData.department_id,
        branch_id:formData.branch_id,
        role_id:formData.role_id,
        gender:formData.gender,
        is_active:true,
        is_tbt:formData.permissions.tbt,
        is_linewalk:formData.permissions.lineWalk,
        is_nearmiss:formData.permissions.nearMe,
        is_admin:formData.permissions.isAdmin
      };

      if(editingUser){

        await API.put(`/employees/${editingUser.id}`,payload);

      }else{

        await API.post("/employees",payload);

      }

      setOpen(false);
      fetchUsers();

    }catch(err){

      alert("Failed to save user");

    }

  };

  /* ---------------- DELETE USER ---------------- */

  const handleDelete = async(id)=>{

    if(!window.confirm("Delete user?")) return;

    await API.delete(`/employees/${id}`);

    fetchUsers();

  };

  /* ---------------- CSV EXPORT ---------------- */

  const exportCSV = ()=>{

    const csv = new ExportToCsv({
      filename:"users",
      useKeysAsHeaders:true
    });

    csv.generateCsv(users);

  };

  /* ---------------- TABLE COLUMNS ---------------- */

  const columns = [

    {field:"id",headerName:"ID",width:70},

    {field:"username",headerName:"Username",width:150},

    {field:"name",headerName:"Name",width:150},

    {field:"mobile_no",headerName:"Mobile",width:150},

    {field:"designation",headerName:"Designation",width:150},

    {field:"branch",headerName:"Branch",width:150},

    {
      field:"actions",
      headerName:"Actions",
      width:200,
      renderCell:(params)=>(
        <>
          <Button
            size="small"
            onClick={()=>{
              setEditingUser(params.row);
             setFormData({
  employee_id: params.row.employee_id || "",
  username: params.row.username || "",
  name: params.row.name || "",
  mobile_no: params.row.mobile_no || "",
  password: "",
  branch_id: params.row.branch_id || "",
  designation_id: params.row.designation_id || "",
  department_id: params.row.department_id || "",
  role_id: params.row.role_id || "",
  gender: params.row.gender || "male",
  is_active: params.row.is_active,

  permissions:{
    tbt: params.row.is_tbt === 1,
    nearMe: params.row.is_nearmiss === 1,
    lineWalk: params.row.is_linewalk === 1,
    isAdmin: params.row.is_admin === 1
  }
});
              setOpen(true);
            }}
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

    <Box sx={{height:600,width:"100%"}}>

      <Box sx={{display:"flex",gap:2,mb:2}}>

        <Button
          variant="contained"
          onClick={()=>{
            setEditingUser(null);
            setFormData(emptyUser);
            setOpen(true);
          }}
        >
          Add User
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

      <DataGrid
        rows={users}
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
        checkboxSelection
      />

      {loading && <CircularProgress/>}

  <UserModal
  open={open}
  onClose={()=>setOpen(false)}
  formData={formData}
  handleChange={handleChange}
  handlePermission={handlePermission}
  handleSave={handleSave}
  branches={branches}
  designations={designations}
  departments={departments}
  roles={roles}
/>

    </Box>
  );
}