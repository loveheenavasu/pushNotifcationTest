import React, { useEffect, useState } from "react";
import { firestore, messaging } from "../firebase/Firebase";
import { useNavigate } from "react-router-dom";
import { getToken } from "firebase/messaging";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Chat from "./Messages";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function JoinGroup() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [userTokens,setUserTokens] = useState(null)


  const handleJoinGroup = async () => {
    try {
      // Generate a unique room ID using timestamp and random number
      const uniqueRoomId = Date.now() + Math.random().toString(36).substr(2, 9);

      // Check if the room with the generated room ID exists
      const roomRef = firestore.collection("rooms").doc(uniqueRoomId);
      const roomSnapshot = await roomRef.get();

      if (!roomSnapshot.exists && roomName !== "") {
        // If the room doesn't exist, create the room with the user-defined name
        await roomRef.set({ name: roomName, id: uniqueRoomId, FCMToken : userTokens }); // You can set other room data here

        // Navigate to the chat page with the unique room ID
        navigate(`/chat/${uniqueRoomId}`);
      } else {
        // If the room already exists, navigate to the chat page with the existing room's ID
        // navigate(`/chat/${uniqueRoomId}`);
        alert("Room Name kon bharega?/?????????????")
      }
    } catch (error) {
      console.error("Error joining group:", error.message);
    }
  };

  useEffect(() => {
    getToken(messaging, { vapidKey: `BOd5UVNfTVm0IglKifUK1IzxkfR31r9-9aHDSDoT47KqaTqs6XdD9SxCt5iIA40QcM-ACodGDpu4Li_Gc64RJT0` })
   .then((currentToken) => {
 
     if (currentToken) {
 
       console.log('currentToken ', currentToken);
       setUserTokens(currentToken)
     } else {
       
       console.log('Failed to generate the app registration token.');
     }
   })
   .catch((err) => {
 
     console.log('An error occurred when requesting to receive the token.', err);
   });
  
 }, [])
 

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
          Join Group
                    </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Name"
             
              autoComplete="Name"
              autoFocus
            />
           
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleJoinGroup}>
                Join Group
            </Button>
          
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}