import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import API from "../api/api";

import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {

  const navigate = useNavigate();

  const [loading,setLoading] = useState(false);
  const [showPassword,setShowPassword] = useState(false);

  const [form,setForm] = useState({
    username:"",
    password:""
  });

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const handleLogin = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      const {data} = await API.post("/auth/login",form);

      localStorage.setItem("token",data.token);
      localStorage.setItem("user",JSON.stringify(data.user));

      navigate("/home");

    }catch(error){

      alert(
        error.response?.data?.message ||
        "Login failed"
      );

    }finally{
      setLoading(false);
    }

  };

  return (

    <Box
      sx={{
        minHeight:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        background:"linear-gradient(135deg,#0f2027,#203a43,#2c5364)"
      }}
    >

      <Container maxWidth="xs">

        <Paper
          elevation={12}
          sx={{
            p:4,
            borderRadius:4,
            textAlign:"center",
            backdropFilter:"blur(10px)",
            background:"rgba(255,255,255,0.95)"
          }}
        >

          {/* COMPANY LOGO */}
          <Box
            component="img"
            src="/EL-logo.png"
            alt="Company Logo"
            sx={{
              height:70,
              mb:2,
              objectFit:"contain"
            }}
          />

          <Typography
            variant="h4"
            fontWeight="bold"
            mb={0.5}
          >
            Welcome
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Login to your account
          </Typography>

          <form onSubmit={handleLogin}>

            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={form.username}
              onChange={handleChange}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <PersonIcon/>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword?"text":"password"}
              margin="normal"
              value={form.password}
              onChange={handleChange}
              InputProps={{
                startAdornment:(
                  <InputAdornment position="start">
                    <LockIcon/>
                  </InputAdornment>
                ),
                endAdornment:(
                  <InputAdornment position="end">
                    <IconButton
                      onClick={()=>setShowPassword(!showPassword)}
                    >
                      {showPassword?<VisibilityOff/>:<Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt:3,
                borderRadius:3,
                py:1.3,
                fontWeight:"bold",
                textTransform:"none",
                fontSize:16
              }}
              disabled={loading}
            >

              {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}

            </Button>

          </form>

        </Paper>

      </Container>

    </Box>

  );

};

export default LoginPage;