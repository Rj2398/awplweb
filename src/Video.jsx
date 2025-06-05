import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const Video = ({ isCameraOn, isMuted }) => {
  const location = useLocation();
  const { name } = location.state || {};
  const firstLetter = name.charAt(0); // or name[0]

  console.log(firstLetter, "fkasjdfksahfsaghfhskld");

  const { channelDetails } = useSelector((state) => state.appointments);
  console.log(
    channelDetails?.appId,
    channelDetails?.token,
    channelDetails?.channelName,
    channelDetails?.uid,
    "videoCall"
  );
  const APP_ID = channelDetails?.appId;
  const TOKEN = channelDetails?.token;

  const CHANNEL = channelDetails?.channelName;

  const uid = 0;

  const localVideoRef = useRef(null);
  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);

  const [remoteUsers, setRemoteUsers] = useState({});

  useEffect(() => {
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const initAgora = async () => {
      try {
        await client.current.join(APP_ID, CHANNEL, TOKEN, uid);

        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
        localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();

        localVideoTrack.current.play(localVideoRef.current);

        await client.current.publish([
          localAudioTrack.current,
          localVideoTrack.current,
        ]);

        // Remote user joins
        client.current.on("user-published", async (user, mediaType) => {
          await client.current.subscribe(user, mediaType);
          if (mediaType === "video") {
            const playerContainerId = `remote-player-${user.uid}`;
            setTimeout(() => {
              user.videoTrack?.play(playerContainerId);
            }, 300);
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }

          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...user,
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
            },
          }));

          // if (mediaType === "video") {
          //   user.videoTrack.play(`remote-player-${user.uid}`);
          // }
          // if (mediaType === "audio") {
          //   user.audioTrack.play();
          // }
        });

        // Remote user updates (e.g., mute/unmute)
        client.current.on("user-updated", (user) => {
          const playerContainerId = `remote-player-${user.uid}`;
          if (user.hasVideo && user.videoTrack) {
            setTimeout(() => {
              user.videoTrack.play(playerContainerId);
            }, 300);
          }
          setRemoteUsers((prevUsers) => ({
            ...prevUsers,
            [user.uid]: {
              ...user,
              audioMuted: !user.hasAudio,
              videoMuted: !user.hasVideo,
            },
          }));
        });

        // Remote user leaves
        client.current.on("user-unpublished", (user, mediaType) => {
          setRemoteUsers((prevUsers) => {
            const updatedUsers = { ...prevUsers };
            delete updatedUsers[user.uid];
            return updatedUsers;
          });
        });

        client.current.on("user-left", async (user) => {
          setRemoteUsers((prevUsers) => {
            const updatedUsers = { ...prevUsers };
            delete updatedUsers[user.uid];
            return updatedUsers;
          });
          if (localAudioTrack.current) localAudioTrack.current.close();
          if (localVideoTrack.current) localVideoTrack.current.close();
          await client.current.leave();
          // window.location.href ="/doctorhome";
        });
      } catch (error) {
        console.error("Agora error:", error);
      }
    };

    initAgora();

    return () => {
      const leaveChannel = async () => {
        if (localAudioTrack.current) localAudioTrack.current.close();
        if (localVideoTrack.current) localVideoTrack.current.close();
        await client.current?.leave();
        setRemoteUsers({});
      };
      leaveChannel();
    };
  }, []);

  useEffect(() => {
    if (localVideoTrack.current && localVideoRef.current) {
      localVideoTrack.current.play(localVideoRef.current);
    }
  }, [remoteUsers]);

  useEffect(() => {
    if (localVideoTrack.current) {
      localVideoTrack.current.setEnabled(isCameraOn);
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (localAudioTrack.current) {
      localAudioTrack.current.setEnabled(!isMuted);
    }
  }, [isMuted]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "700px",
        backgroundColor: "#000",
      }}
    >
      {/* Remote videos */}
      <div
        id="remote-video"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "90%",
          backgroundColor: "#0c0d0f",
          zIndex: 1,
        }}
      >
        {Object.entries(remoteUsers).map(([uid, user]) => (
          <div
            key={uid}
            id={`remote-player-${uid}`}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              backgroundColor: "#0c0d0f",
            }}
          >
            {/* Status Overlay */}
            {/* <div
              style={{
                position: "absolute",
                bottom: 50,
                left: 10,
                backgroundColor: "red",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "14px",
                zIndex: 5,
                // backgroundColor: "white",
              }}
            >
              Video: {user.videoMuted ? "Off" : "On"} <br />
              Audio: {user.audioMuted ? "Off" : "On"}
            </div> */}
          </div>
        ))}
      </div>

      {/* Local video preview */}
      <div style={{ position: "relative", height: "100vh" }}>
        {isCameraOn ? (
          <div
            ref={localVideoRef}
            style={{
              position: "absolute",
              bottom: -20,
              right: 20,
              width: "150px",
              height: "200px",
              backgroundColor: "#222",
              zIndex: 2,
              borderRadius: 8,
              overflow: "hidden",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: 20,
              width: "150px",
              height: "200px",
              backgroundColor: "#0c0d0f",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "48px",
              fontWeight: "bold",
              zIndex: 2,
            }}
          >
            {/* {firstLetter} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
