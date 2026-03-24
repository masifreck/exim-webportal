import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomTextInput from "./CustomTextInput";
import CustomDropdown from "./CustomDropdown";

import API from "../api/api";

const BASE_URL = "http://localhost:8000/";

export default function TBTModal({
  open,
  onClose,
  formData,
  handleChange,
  handleUpdate,
  departments,
  supervisors,
  sections,
  employees,
  itemofIntrest
}) {

  const [dropdowns,setDropdowns] = useState({});
  const [newFiles,setNewFiles] = useState({});
  const [removedFiles,setRemovedFiles] = useState({});

  /* ---------------- FETCH DROPDOWNS ---------------- */





  /* ---------------- MULTI DROPDOWN ---------------- */

  const handleArrayChange = (field,index,value)=>{
    const updated = [...(formData[field] || [])];
    updated[index] = value;
    handleChange(field, updated);
  };

  const addField = (field)=>{
    handleChange(field, [...(formData[field] || []), ""]);
  };

  const removeField = (field,index)=>{
    const updated = [...(formData[field] || [])];
    updated.splice(index,1);
    handleChange(field, updated);
  };

  const renderMultiDropdown = (label, field, options)=>(
    <Box mt={2}>

      <Box display="flex" justifyContent="space-between">
        <Typography>{label}</Typography>

        <IconButton onClick={()=>addField(field)}>
          <AddIcon/>
        </IconButton>
      </Box>

      {(formData[field] || []).map((value,index)=>(
        <Box key={index} display="flex" gap={1} mt={1}>

          <CustomDropdown
            label={`${label} ${index+1}`}
            name={`${field}_${index}`}
            value={value}
            options={options}
            onChange={(e)=>handleArrayChange(field,index,e.target.value)}
          />

          <IconButton color="error" onClick={()=>removeField(field,index)}>
            <RemoveIcon/>
          </IconButton>

        </Box>
      ))}

    </Box>
  );

  /* ---------------- FILE HANDLING ---------------- */

  const getFileUrl = (file)=>{
    return BASE_URL + file.replace(/\\/g,"/");
  };

  const removeFile = (field,file)=>{

    handleChange(
      field,
      (formData[field] || []).filter(f=>f !== file)
    );

    setRemovedFiles(prev=>({
      ...prev,
      [field]: [...(prev[field] || []), file]
    }));
  };

  const handleFileUpload = (field,e)=>{
    setNewFiles(prev=>({
      ...prev,
      [field]: [...(prev[field] || []), ...e.target.files]
    }));
  };

  const renderAttachments = (label, field)=>(
    <Box mt={2}>

      <Typography>{label}</Typography>

      <Box display="flex" gap={2} flexWrap="wrap">

        {(formData[field] || []).map((file,index)=>{

          const url = getFileUrl(file);

          return(
            <Box key={index} position="relative">

              {file.match(/\.(jpg|jpeg|png)$/i) ? (
                <img src={url} width={100}/>
              ) : (
                <Button onClick={()=>window.open(url)}>PDF</Button>
              )}

              <IconButton
                size="small"
                color="error"
                onClick={()=>removeFile(field,file)}
                sx={{position:"absolute",top:0,right:0}}
              >
                <DeleteIcon/>
              </IconButton>

            </Box>
          );
        })}

      </Box>

      <input
        type="file"
        multiple
        onChange={(e)=>handleFileUpload(field,e)}
      />

    </Box>
  );

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = ()=>{

    const data = new FormData();

    Object.keys(formData).forEach(key=>{
      data.append(key, JSON.stringify(formData[key]));
    });

    Object.keys(newFiles).forEach(field=>{
      newFiles[field].forEach(file=>{
        data.append(field,file);
      });
    });

    data.append("removedFiles", JSON.stringify(removedFiles));

    handleUpdate(data);
  };

  return (

    <Modal open={open} onClose={onClose}
      sx={{display:"flex",justifyContent:"center",alignItems:"center",p:2}}
    >

      <Box
        sx={{
          width:{xs:"100%",sm:500},
          maxHeight:"90vh",
          overflowY:"auto",
          bgcolor:"#fff",
          p:3,
          borderRadius:2
        }}
      >

        <Typography variant="h6" mb={2}>
          TBT Details
        </Typography>

        {/* DATE */}
        <CustomTextInput
          label="Date"
          name="tbt_datetime"
          type="datetime-local"
          value={formData.tbt_datetime?.slice(0,16) || ""}
          onChange={handleChange}
        />

        {/* DROPDOWNS */}
        <CustomDropdown
          label="Department"
          name="department_id"
          value={formData.department_id}
          options={departments || []}
          onChange={handleChange}
        />

        <CustomDropdown
          label="Section"
          name="section_id"
          value={formData.section_id}
          options={sections || []}
          onChange={handleChange}
        />
    <CustomDropdown
          label="Supervisor"
          name="supervisor_id"
          value={formData.department_id}
          options={supervisors || []}
          onChange={handleChange}
        />

        {/* MULTI SELECT */}
        {renderMultiDropdown("Contract Employee","contract_emp_ids",employees || [])}
        {renderMultiDropdown("Item Interest","item_interest_ids",itemofIntrest || [])}

        {/* TEXT FIELDS */}
        <CustomTextInput label="Discussion" name="point_discussed_dis" value={formData.point_discussed_dis} onChange={handleChange}/>
        <CustomTextInput label="General Observation" name="item_general_dis" value={formData.item_general_dis} onChange={handleChange}/>
        <CustomTextInput label="Item Interest Description" name="item_interest_dis" value={formData.item_interest_dis} onChange={handleChange}/>
        <CustomTextInput label="SOP" name="sop_dis" value={formData.sop_dis} onChange={handleChange}/>
        <CustomTextInput label="Reminder" name="reminder_dis" value={formData.reminder_dis} onChange={handleChange}/>
        <CustomTextInput label="Safety Message" name="safety_message_description" value={formData.safety_message_description} onChange={handleChange}/>

        {/* ATTACHMENTS */}
        {renderAttachments("General Attachments","item_general_attachment")}
        {renderAttachments("Interest Attachments","item_interest_attachment")}
        {renderAttachments("Safety Attachments","safety_message_attachment")}
        {renderAttachments("TBT Attachments","tbt_attachment")}

        <Box mt={3}>
          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Update
          </Button>

          <Button fullWidth sx={{mt:1}} onClick={onClose}>
            Cancel
          </Button>
        </Box>

      </Box>

    </Modal>
  );
}