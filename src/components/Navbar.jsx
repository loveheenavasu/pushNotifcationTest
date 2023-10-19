import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { ToastContainer } from "react-toastify";

export default function Navbar({ userData, handleInviteAll }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{background:'rgb(64 151 137)'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat App
          </Typography>
          {userData ? (
            <div>
              {/* <h3>Room Name: {userData.name}</h3> */}
              <Button
                onClick={() => handleInviteAll()}
                variant="outlined"
                sx={{ my: 2, color:"#fff", border:'1px solid #fff' }}
              >
                {" "}
                Inivte All
              </Button>
              {/* Display other room data here */}
            </div>
          ) : (
            <p>Loading room data...</p>
          )}
          <ToastContainer autoClose={4000} />
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
