import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  firestore,
  messaging,
  onMessageListener,
  requestPermission,
} from "../firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMessaging } from "firebase/messaging";
import Messages from "./Messages";
import { Box, Button, Typography } from "@mui/material";

const ChatPage = () => {
  const { roomId } = useParams();
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState({ title: "", body: "" });

  console.log(roomId, "id");
  useEffect(() => {
    // Function to fetch room data based on the provided room ID
    const fetchRoomData = async () => {
      try {
        // Reference to the room document in Firestore using the room ID
        const roomRef = firestore.collection("rooms").doc(roomId);
        console.log(roomRef, "roomRef");

        // Get the room data
        const roomSnapshot = await roomRef.get();

        console.log(roomSnapshot.data(), "roomSnapshot.data()");

        if (roomSnapshot.exists) {
          // If the room exists, set the room data in state
          setUserData(roomSnapshot.data());
        } else {
          console.error("Room not found.");
        }
      } catch (error) {
        console.error("Error fetching room data:", error.message);
      }
    };

    // Call the fetchRoomData function when the component mounts
    fetchRoomData();
  }, [roomId]); // Include id in the dependency array to re-fetch when the ID changes

  const sendPushNotification = async (tokens, message) => {
    console.log(tokens, "tokensssssssss");
    try {
      const payload = {
        notification: {
          title: "New Chat Invitation",
          body: message,
        },
      };
      // if (tokens) {
      //   toast.success(
      //     `${payload.notification.title}: ${payload?.notification?.body}`,
      //     {
      //       duration: 60000,
      //       position: "top-right",
      //     }
      //   );
      // }

      await Promise.all(
        tokens.map(async (token) => {
          await getMessaging().send(token, payload);
          await toast.success(
            `${payload.notification.title}: ${payload?.notification?.body}`,
            {
              duration: 60000,
              position: "top-right",
            }
          );
        })
      );

      console.log("Push notifications sent successfully.");
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  };
  const handleInviteAll = async () => {
    try {
      const usersCollection = firestore.collection("rooms");
      const userDocs = await usersCollection.get();

      onMessageListener().then((payload) => {
        console.log(payload.notification, "onMessageListenerpayload");
        setNotification({
          title: payload?.notification?.title,
          body: payload?.notification?.body,
        });
        // Fetch the FCM tokens of all users from Firestore

        const userTokens = [];

        // Extract the FCM tokens from user documents
        userDocs.forEach((doc) => {
          const userData = doc.data();
          if (userData.FCMToken) {
            userTokens.push(userData.FCMToken);
            console.log(userTokens, "userTokens");
          }
        });

        toast.success(
          `${payload?.notification?.title}: ${payload?.notification?.body}`,
          {
            duration: 60000,
            position: "top-right",
          }
        );
        console.log(
          `${payload?.notification?.title}: ${payload?.notification?.body}`
        );
      });
      // Send the invitation message to all users
      // await sendPushNotification(
      //   userTokens,
      //   "You are invited to join a group!"
      // );

      console.log("Invitations sent successfully.");
    } catch (error) {
      console.error("Error inviting all users:", error);
    }
  };

  useEffect(() => {
    // requestPermission();
    const unsubscribe = onMessageListener().then((payload) => {
      console.log(payload.notification, "onMessageListenerpayload");
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
      toast.success(
        `${payload?.notification?.title}: ${payload?.notification?.body}`,
        {
          duration: 60000,
          position: "top-right",
        }
      );
      console.log(
        `${payload?.notification?.title}: ${payload?.notification?.body}`
      );
    });
    return () => {
      unsubscribe.catch((err) => console.log("failed: ", err));
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          my: 2,
          flexDirection:'column'
        }}
      >
        <Typography variant="h4">Chat App</Typography>
        {userData ? (
          <div>
            {/* <h3>Room Name: {userData.name}</h3> */}
            <Button
              onClick={() => handleInviteAll()}
              variant="contained"
              sx={{ my: 2 }}
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
      </Box>
      <Messages userData={userData} />
    </>
  );
};

export default ChatPage;
