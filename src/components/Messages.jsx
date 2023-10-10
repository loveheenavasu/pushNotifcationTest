import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { app } from "../firebase/Firebase";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

const db = getFirestore(app);

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "66vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "55vh",
    overflowY: "auto",
  },
  Users: {
    height: "40vh",
    overflowY: "auto",
  },
});

const Messages = ({ userData }) => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  useEffect(() => {
    // Fetch users from Firestore
    const fetchUsers = async () => {
      const userCollection = collection(db, "rooms");
      const userSnapshot = await getDocs(userCollection);
      const usersData = userSnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  //   // Function to send a message
  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;

    const messageCollection = collection(db, "messages");
    const newMessage = {
      text: currentMessage,
      senderId: userData?.id, // Replace with the sender's ID
      timestamp: serverTimestamp(),
      name: userData?.name,
    };

    await addDoc(messageCollection, newMessage);
    setCurrentMessage("");
  };

  // Function to listen for incoming messages
  useEffect(() => {
    const messageCollection = collection(db, "messages");
    const q = query(messageCollection, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => doc.data());
      setMessages(messagesData);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const isCurrentUser = (message) => {
    // Replace userId with the actual user ID of the current user
    return message.senderId === userData?.id;
  };
  console.log(messages, "msgs");
  function formatFirestoreTimestamp(timestamp) {
    const date = new Date(timestamp?.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours =
      hours % 12 === 0 ? "12" : (hours % 12).toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  return (
    <div>
      <Grid container>
        <Grid item xs={12}>
          {/* <Typography variant="h5" className="header-message">
            Chat
          </Typography> */}
        </Grid>
      </Grid>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.borderRight500}>
          <List>
            <ListItem button key="RemySharp">
              <ListItemIcon>
                {/* <Avatar
                  alt={userData.name}
                  src="https://xsgames.co/randomusers/avatar.php?g=female"
                /> */}
              </ListItemIcon>
              {/* <ListItemText primary={userData.name}></ListItemText> */}
            </ListItem>
            <Typography variant="h5" className="header-message">
              Users List
            </Typography>
          </List>
          {/* sender */}
          <Divider />
          {/* <Grid item xs={12} style={{ padding: "10px" }}>
            <TextField
              id="outlined-basic-email"
              label="Search"
              variant="outlined"
              fullWidth
            />
          </Grid> */}
          <Divider />

          <List className={classes.Users}>
            {users.map((user) => (
              <ListItem key="RemySharp">
                <ListItemIcon>
                  <Avatar
                    alt="Remy Sharp"
                    src="https://xsgames.co/randomusers/avatar"
                  />
                </ListItemIcon>
                <ListItemText primary={user.name}>{user.name}</ListItemText>
                <ListItemText secondary="online" align="right"></ListItemText>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={9}>
          <List className={classes.messageArea}>
            {messages?.map((message, index) => (
              // <div
              //   key={index}
              //   style={{
              //     backgroundColor: ? "grey" : "green",
              //   }}
              //   className={isCurrentUser(message) ? "sent" : "received"}
              // >
              //   <p>{message.text}</p>
              // </div>

              <ListItem key={index}>
                <Grid container>
                  <Grid item xs={12}>
                    <ListItemText
                      align={isCurrentUser(message) ? "right" : "left"}
                      primary={message.text}
                      //   sx={{
                      //     backgroundColor: isCurrentUser(message)
                      //       ? "grey"
                      //       : "green",
                      //   }}
                      //   sx={{
                      //     width: isCurrentUser(message) ? "50%": "50%",
                      //     background: "#8080800d",
                      //     color: " black",
                      //     padding: "10px",
                      //     borderRadius: "11px 15px 0px 15px",
                      //   }}
                    >
                      {message.text}
                    </ListItemText>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      textAlign: isCurrentUser(message) ? "right" : "left",
                    }}
                  >
                    <span
                      //   align={isCurrentUser(message) ? "right" : "left"}
                      style={{ fontSize: "10px" , marginRight:"10px"}}
                      //   secondary={formatFirestoreTimestamp(message.timestamp)}
                    >
                      {formatFirestoreTimestamp(message.timestamp)}
                    </span>
                    <span style={{ fontSize: "12px" }}>
                      {isCurrentUser(message) ? "you" : message.name}
                    </span>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Grid container style={{ padding: "20px", marginTop: "50px" }}>
            <Grid item xs={11}>
              <TextField
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
            </Grid>
            <Grid xs={1} align="right">
              <Button
                onClick={sendMessage}
                variant="contained"
                sx={{
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                <SendRoundedIcon />
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Messages;
