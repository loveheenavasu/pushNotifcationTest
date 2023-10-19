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
import axios from "axios";
import AudioChat from "./Audio";
import Navbar from "./Navbar";

const ChatPage = ({socket}) => {
  const { roomId } = useParams();
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [role, setRole] = useState("");
  console.log(userData, "userData");

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
          console.log(token, "token");
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
    Notfication();
  };

  useEffect(() => {
    requestPermission();
    const unsubscribe = onMessageListener().then((payload) => {
      console.log(payload, "onMessageListenerpayload");
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

  const Notfication = async () => {
    const usersCollection = firestore.collection("rooms");
    const userDocs = await usersCollection.get();
    // const notificationData = {
    //   title:"Notifcation",
    //   body:'You are invited to Group'
    // }
    const notification = {
      title: "Notifcation",
      body: "You are invited to Group",
    };
    const data = { title: "Notifcation", body: "You are invited to Group" };

    const registrationTokens = [];

    // Extract the FCM tokens from user documents
    userDocs.forEach((doc) => {
      const userData = doc.data();
      if (userData.FCMToken) {
        registrationTokens.push(userData.FCMToken);
      }
    });
    axios
      .post("http://localhost:3000/send-notification", {
        registrationTokens,
        notification: notification,
        data: data,
        tokenToExclude: userData?.FCMToken,
      })
      .then((response) => {
        console.log("Push notification sent:", response.data);
        if (response.status === 200) {
          toast.success(`${response.data.message}`, {
            duration: 60000,
            position: "top-right",
          });
          onMessageListener().then((payload) => {
            console.log(payload, "onMessageListenerpayload");
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
        }
      })
      .catch((error) => {
        console.error("Error sending push notification:", error);
      });
  };

  console.log(role, "role");
  return (
    <>
    <Navbar userData={userData} handleInviteAll={handleInviteAll} />
    <Messages userData={userData} />
    </>
  );
};

export default ChatPage;
