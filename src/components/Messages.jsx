import React, { useState, useEffect, useRef } from "react";
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
import EmojiPicker from "emoji-picker-react";
import ".././style.css";
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
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Audio from "./Audio";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const db = getFirestore(app);

const Messages = ({ userData }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isEmojiPicker, setIsEmojiPicker] = useState(false);

  const handleEmojiPicker = () => {
    setIsEmojiPicker(!isEmojiPicker);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPicker]);

  const handleClickOutside = (event) => {
    const emojiPickerElement = document.querySelector(".emoji-picker");
    if (emojiPickerElement && !emojiPickerElement.contains(event.target)) {
      setIsEmojiPicker(false);
    }
  };
  const mostRecentMessageRef = useRef(null);

  const handleEmojiClick = (emoji) => {
    const emojiValue = emoji.emoji; // Get the emoji value

    // Append the emoji to the current message text
    setCurrentMessage((prevMessage) => prevMessage + emojiValue);
  };
  // CSS styles applied directly to components
  const chatSectionStyle = {
    width: "100%",
    height: "85vh",
  };

  const usersListStyle = {
    height: "40vh",
    overflowY: "auto",
  };

  const messageAreaStyle = {
    height: "65vh",
    overflowY: "auto",
    paddingBottom: "80px",
    // background:"red"
  };

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

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage.trim() === "") return;

    const messageCollection = collection(db, "messages");
    const newMessage = {
      text: currentMessage,
      senderId: userData?.id,
      timestamp: serverTimestamp(),
      name: userData?.name,
    };

    // await addDoc(messageCollection, newMessage);
    await addDoc(messageCollection, newMessage)
      .then(() => {
        // Scroll to the most recent message
        if (mostRecentMessageRef.current) {
          mostRecentMessageRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
      })
      .catch((error) => {
        console.error("Error adding message: ", error);
      });
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
    return message.senderId === userData?.id;
  };

  function formatFirestoreTimestamp(timestamp) {
    const date = new Date(timestamp?.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours =
      hours % 12 === 0 ? "12" : (hours % 12).toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents line breaks when Shift+Enter is pressed
      sendMessage(); // Call the sendMessage function when Enter is pressed
    }
  };

  return (
    <div>
      <Grid container component={Paper} style={chatSectionStyle}>
        <Grid item xs={3} style={{ borderRight: "1px solid #e0e0e0" }}>
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
          <List style={usersListStyle}>
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
        <Grid
          item
          xs={9}
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            backgroundImage: "url(/images/bg1.jpeg)",
            position: "relative",
          }}
        >
          <List style={messageAreaStyle}>
            {messages?.map((message, index) => (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isCurrentUser(message)
                    ? "flex-end"
                    : "flex-start",
                }}
                ref={(element) =>
                  // Assign a ref to the most recent message
                  index === messages.length - 1 && (mostRecentMessageRef.current = element)
                }
              >
                <Grid
                  container
                  sx={{
                    width: "50%",
                    background: isCurrentUser(message)
                      ? "rgb(220 249 198)"
                      : "#fff",
                    borderRadius: isCurrentUser(message)
                      ? "16px 0px 16px 16px"
                      : "0px 16px 16px 16px",
                    padding: "3px 20px",
                  }}
                >
                  <Grid item xs={12}>
                    <ListItemText
                      align={isCurrentUser(message) ? "right" : "left"}
                      primary={message.text}
                      className={
                        isCurrentUser(message)
                          ? "userMessageClass"
                          : "otherUserMessageClass"
                      }
                    >
                      <div class="talk-bubble tri-right round border right-top">
                        <div class="talktext">
                          <p>{message.text}</p>
                        </div>
                      </div>
                    </ListItemText>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      textAlign: isCurrentUser(message) ? "right" : "left",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        marginRight: "10px",
                        color: "gray",
                      }}
                    >
                      {formatFirestoreTimestamp(message.timestamp)}
                    </span>
                    <span style={{ fontSize: "9px", color: "gray" }}>
                      {isCurrentUser(message) ? "you" : message.name}
                    </span>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>

          <Grid
            container
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              marginTop: "0px",
              background: "rgb(240 240 240)",
              position: "absolute",
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Grid xs={1.1}>
              <Button variant="text" onClick={handleEmojiPicker}>
                <TagFacesIcon style={{ color: "rgb(64 151 137)" }} />
              </Button>
              {isEmojiPicker && (
                <Box
                  className="emoji-picker"
                  sx={{
                    display: "flex",
                    width: "400px",
                    height: "460px",
                    position: "absolute",
                    zIndex: 9999,
                    bottom: "64px",
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={(emoji) => handleEmojiClick(emoji)}
                  />
                </Box>
              )}
            </Grid>

            <Grid
              item
              xs={9.5}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <input
                style={{
                  width: "100%",
                  border: "none",
                  padding: "15px",
                  borderRadius: "65px",
                }}
                id="outlined-basic-email"
                label="Type Something"
                fullWidth
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
            </Grid>
            <Grid xs={1.1} align="right">
              <Button
                onClick={sendMessage}
                variant="contained"
                style={{
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // height: "50px",
                  background: "rgb(64 151 137)",
                  padding: "14px 18px",
                }}
                onKeyDown={(e)=>console.log(e.target)} 
                size="small"
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
