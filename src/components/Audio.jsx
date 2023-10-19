import React, { useState, useEffect, useRef } from "react";

const AudioChat = ({ socket }) => {
  const [stream, setStream] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const audioRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((userStream) => {
        setStream(userStream);
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });

    peerConnection.current = new RTCPeerConnection();

    socket.on("offer", async (offer) => {
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      console.log(answer,"answer");
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
      peerConnection.current.addIceCandidate(candidate);
    });

    peerConnection.current.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = (event) => {
        setAudioData(event.data);
      };
    };
  }, [socket]);

  const startStreaming = () => {
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.getAudioTracks()[0]);
    peerConnection.current.addStream(mediaStream);

    peerConnection.current.createOffer().then((offer) => {
      peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", offer);
    });
  };

  console.log(audioData,"audioDataaudioData");
  return (
    <div>
      <button onClick={startStreaming}>Start Streaming</button>
      <audio ref={audioRef} controls autoPlay />
      {audioData && (
        <audio ref={(audioElement) => audioElement.srcObject = audioData} controls autoPlay />
      )}
    </div>
  );
};

export default AudioChat;
