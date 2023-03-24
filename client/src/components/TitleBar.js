import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
// import CameraIcon from '@mui/icons-material/PhotoCamera';

const TitleBar = ({ text, link, linkText }) => {
  let navigate = useNavigate();

  const handleNavigate = () => {
    navigate(link);
  };
  return (
    <AppBar position="relative">
      <Toolbar>
        {/* <CameraIcon sx={{ mr: 2 }} /> */}
        <Grid container direction="row" spacing={4}>
          <Grid item xs={12} sm={6} md={10} lg={10}>
            <Typography variant="h6" color="inherit" noWrap>
              {text}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2} lg={2}>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={handleNavigate}
            >
              {linkText}
            </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default TitleBar;
