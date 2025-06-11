// import React, { useEffect, useState, useRef } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   addDoc,
//   doc, // Import doc
//   updateDoc, // Import updateDoc
//   where, // Import where for filtering
//   writeBatch, // Import writeBatch for efficient updates
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "./Firebase";

// function Chat({ chat_id, senderImg, receiverImg }) {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   const messagesEndRef = useRef(null);

//   const chatId = chat_id;
//   const ids = chat_id.split("_");
//   const myUserId = ids[1]; // Assuming ids[1] is the logged-in user's ID
//   const otherParticipantId = ids[2]; // Assuming ids[2] is the other participant's ID

//   // --- Helper functions for Date Separator ---
//   const formatDateForSeparator = (timestamp) => {
//     if (!timestamp) return "";
//     const date = new Date(timestamp);
//     return date.toLocaleDateString("en-GB", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const isSameDay = (timestamp1, timestamp2) => {
//     if (!timestamp1 || !timestamp2) return false;
//     const date1 = new Date(timestamp1);
//     const date2 = new Date(timestamp2);
//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   };
//   // --- End Helper functions ---

//   // useEffect for fetching messages and real-time updates
//   useEffect(() => {
//     if (!chatId) {
//       console.warn("chatId is missing, skipping message fetch.");
//       return;
//     }
//     const q = query(
//       collection(db, "chats", chatId, "messages"),
//       orderBy("timestamp", "asc")
//     );

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const msgs = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(msgs);
//     });

//     return () => unsubscribe();
//   }, [chatId]);

//   // useEffect for auto-scrolling
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // --- NEW useEffect for marking messages as 'seen' ---
//   useEffect(() => {
//     if (!chatId || !myUserId || !otherParticipantId) return;

//     // In your chat_id structure "AppointmentId_User1Id_User2Id",
//     // myUserId is ids[1] and otherParticipantId is ids[2].
//     // If myUserId is currently viewing the chat, they are the 'receiver' of messages
//     // sent by otherParticipantId. So we need to mark messages sent by otherParticipantId as seen.

//     const messagesToMarkQuery = query(
//       collection(db, "chats", chatId, "messages"),
//       where("senderId", "==", otherParticipantId), // Messages sent by the *other* person
//       where("seen", "==", false) // That have not yet been marked as seen
//     );

//     const unsubscribeSeenUpdater = onSnapshot(
//       messagesToMarkQuery,
//       (snapshot) => {
//         // Use a Firestore batch to update multiple documents efficiently
//         // This prevents multiple writes for multiple unseen messages
//         if (!snapshot.empty) {
//           const batch = writeBatch(db); // Create a batch

//           snapshot.docs.forEach((docSnap) => {
//             const messageRef = doc(db, "chats", chatId, "messages", docSnap.id);
//             batch.update(messageRef, { seen: true }); // Add update operation to the batch
//           });

//           // Commit the batch to apply all updates
//           batch
//             .commit()
//             .then(() => {
//               console.log(
//                 `Marked ${snapshot.docs.length} messages from ${otherParticipantId} as seen by ${myUserId} in chat ${chatId}`
//               );
//             })
//             .catch((error) => {
//               console.error("Error marking messages as seen:", error);
//             });
//         }
//       }
//     );

//     // Cleanup the listener when the component unmounts or dependencies change
//     return () => unsubscribeSeenUpdater();
//   }, [chatId, myUserId, otherParticipantId]); // Dependencies for this effect
//   // --- END NEW useEffect ---

//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     const clientTimestamp = Date.now();

//     try {
//       await addDoc(collection(db, "chats", chatId, "messages"), {
//         message: text,
//         senderId: myUserId,
//         receiverId: otherParticipantId,
//         timestamp: clientTimestamp,
//         seen: false, // Initialize as not seen when sending
//       });
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }

//     setText("");
//   };

//   return (
//     <div className="completed-appoint-scrn-right col-lg-6">
//       <div className="completed-appoint-chat-scrn">
//         <div
//           className="chat-container"
//           style={{ padding: "20px", maxHeight: "600px" }}
//         >
//           <div
//             className="chat-messages"
//             ref={messagesEndRef}
//             style={{
//               height: "400px",
//               overflowY: "scroll",
//               marginBottom: "10px",
//               WebkitOverflowScrolling: "touch",
//               overflowX: "hidden",
//             }}
//           >
//             {messages.map((msg, index) => {
//               const isMyMessage = msg.senderId === myUserId;
//               const messageBackgroundColor = isMyMessage
//                 ? "#d2f1ff"
//                 : "#eeeeee";
//               const messageJustifyContent = isMyMessage
//                 ? "flex-end"
//                 : "flex-start";

//               const myMessageBorderRadius = {
//                 borderTopLeftRadius: "12px",
//                 borderTopRightRadius: "4px",
//                 borderBottomLeftRadius: "12px",
//                 borderBottomRightRadius: "12px",
//               };
//               const otherMessageBorderRadius = {
//                 borderTopLeftRadius: "4px",
//                 borderTopRightRadius: "12px",
//                 borderBottomLeftRadius: "12px",
//                 borderBottomRightRadius: "12px",
//               };

//               let showDateSeparator = false;
//               if (msg.timestamp) {
//                 if (index === 0) {
//                   showDateSeparator = true;
//                 } else {
//                   const prevMsg = messages[index - 1];
//                   if (prevMsg && prevMsg.timestamp) {
//                     showDateSeparator = !isSameDay(
//                       msg.timestamp,
//                       prevMsg.timestamp
//                     );
//                   } else {
//                     showDateSeparator = true;
//                   }
//                 }
//               }

//               return (
//                 <React.Fragment key={msg.id}>
//                   {showDateSeparator && (
//                     <div
//                       style={{
//                         textAlign: "center",
//                         margin: "20px 0 10px",
//                         position: "relative",
//                         fontSize: "13px",
//                         color: "#666",
//                       }}
//                     >
//                       <span
//                         style={{
//                           backgroundColor: "#f0f2f5",
//                           padding: "5px 12px",
//                           borderRadius: "15px",
//                           boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
//                         }}
//                       >
//                         {formatDateForSeparator(msg.timestamp)}
//                       </span>
//                       <div
//                         style={{
//                           position: "absolute",
//                           top: "50%",
//                           left: "0",
//                           right: "0",
//                           height: "1px",
//                           backgroundColor: "#e0e0e0",
//                           zIndex: -1,
//                         }}
//                       ></div>
//                     </div>
//                   )}

//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: messageJustifyContent,
//                       margin: "8px 0",
//                       alignItems: "flex-end",
//                     }}
//                   >
//                     {!isMyMessage && (
//                       <div style={{ marginRight: "8px" }}>
//                         <img
//                           src={receiverImg}
//                           alt="Receiver Avatar"
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             borderRadius: "50%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     )}

//                     <div
//                       style={{
//                         padding: "10px 14px",
//                         backgroundColor: messageBackgroundColor,
//                         maxWidth: "70%",
//                         fontSize: "14px",
//                         boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
//                         display: "flex",
//                         flexDirection: "column",
//                         wordBreak: "break-word",
//                         ...(isMyMessage
//                           ? myMessageBorderRadius
//                           : otherMessageBorderRadius),
//                       }}
//                     >
//                       {msg.imageUrl && (
//                         <img
//                           src={msg.imageUrl}
//                           alt="Message attachment"
//                           style={{
//                             maxWidth: "100%",
//                             borderRadius: "8px",
//                             marginBottom:
//                               msg.message ||
//                               (msg.timestamp &&
//                                 typeof msg.timestamp === "number")
//                                 ? "8px"
//                                 : "0",
//                             display: "block",
//                           }}
//                         />
//                       )}

//                       {msg.message && <div>{msg.message}</div>}

//                       <div
//                         style={{
//                           fontSize: "10px",
//                           color: "#666",
//                           marginTop: "6px",
//                           textAlign: isMyMessage ? "right" : "left",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: isMyMessage
//                             ? "flex-end"
//                             : "flex-start",
//                           gap: "4px",
//                           alignSelf: "flex-end",
//                         }}
//                       >
//                         {msg.timestamp
//                           ? new Date(msg.timestamp).toLocaleTimeString([], {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })
//                           : ""}

//                         {isMyMessage &&
//                           (msg.seen ? (
//                             <span
//                               style={{
//                                 color: "#007bff",
//                                 marginLeft: "4px",
//                               }}
//                             >
//                               ✓✓
//                             </span>
//                           ) : (
//                             <span
//                               style={{
//                                 color: "#888",
//                                 marginLeft: "4px",
//                               }}
//                             >
//                               ✓
//                             </span>
//                           ))}
//                       </div>
//                     </div>

//                     {isMyMessage && (
//                       <div style={{ marginLeft: "8px" }}>
//                         <img
//                           src={senderImg}
//                           alt="Sender Avatar"
//                           style={{
//                             width: "40px",
//                             height: "40px",
//                             borderRadius: "50%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 </React.Fragment>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </div>
//           <form
//             onSubmit={sendMessage}
//             className="chat-footer"
//             style={{ display: "flex", alignItems: "center", gap: "10px" }}
//           >
//             <div
//               className="chat-input"
//               style={{ flex: 1, position: "relative" }}
//             >
//               <input
//                 type="text"
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 placeholder="Type a message"
//                 style={{
//                   width: "100%",
//                   padding: "10px 45px 10px 15px",
//                   borderRadius: "30px",
//                   border: "1px solid #ccc",
//                 }}
//               />
//               <div
//                 className="chat-file-upld"
//                 style={{
//                   position: "absolute",
//                   right: "10px",
//                   top: "50%",
//                   transform: "translateY(-50%)",
//                 }}
//               >
//                 <input type="file" style={{ display: "none" }} id="fileInput" />
//                 <label
//                   htmlFor="fileInput"
//                   className="attach-btn"
//                   style={{ cursor: "pointer" }}
//                 >
//                   <img src="./images/attach-icon.svg" alt="Attach" />
//                 </label>
//               </div>
//             </div>
//             <button type="submit" className="send-btn">
//               <img src="./images/send-icon.svg" alt="Icon" />
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chat;

// //
import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  where,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref, // For creating storage references
  uploadBytes, // For uploading bytes/files
  getDownloadURL, // For getting the public URL of an uploaded file
} from "firebase/storage"; // <--- Import Storage functions
import { v4 as uuidv4 } from "uuid"; // <--- Import uuid for unique filenames
import { db, storage } from "./Firebase"; // <--- Import storage here

function Chat({ chat_id, senderImg, receiverImg }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null); // <--- New state for selected image
  console.log(imageFile, "sjdfklashdfjksahdfjhdfk");
  const [isUploading, setIsUploading] = useState(false); // <--- New state for upload status

  const messagesEndRef = useRef(null);

  const chatId = chat_id;
  const ids = chat_id.split("_");
  const myUserId = ids[1];
  const otherParticipantId = ids[2];

  // --- Helper functions for Date Separator ---
  const formatDateForSeparator = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const isSameDay = (timestamp1, timestamp2) => {
    if (!timestamp1 || !timestamp2) return false;
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  // --- End Helper functions ---

  // useEffect for fetching messages and real-time updates
  useEffect(() => {
    if (!chatId) {
      console.warn("chatId is missing, skipping message fetch.");
      return;
    }
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // useEffect for auto-scrolling
  useEffect(() => {
    // Scroll to bottom when messages change, but only if the user hasn't scrolled up manually
    // or if it's the initial load.
    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
      // Only scroll to bottom if we are already at the bottom or very close to it
      // This prevents interrupting user if they are reading older messages
      if (
        scrollHeight - scrollTop < clientHeight + 200 ||
        messages.length <= 1
      ) {
        // 200px tolerance
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // --- NEW useEffect for marking messages as 'seen' ---
  useEffect(() => {
    if (!chatId || !myUserId || !otherParticipantId) return;

    const messagesToMarkQuery = query(
      collection(db, "chats", chatId, "messages"),
      where("senderId", "==", otherParticipantId),
      where("seen", "==", false)
    );

    const unsubscribeSeenUpdater = onSnapshot(
      messagesToMarkQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const batch = writeBatch(db);

          snapshot.docs.forEach((docSnap) => {
            const messageRef = doc(db, "chats", chatId, "messages", docSnap.id);
            batch.update(messageRef, { seen: true });
          });

          batch
            .commit()
            .then(() => {
              console.log(
                `Marked ${snapshot.docs.length} messages from ${otherParticipantId} as seen by ${myUserId} in chat ${chatId}`
              );
            })
            .catch((error) => {
              console.error("Error marking messages as seen:", error);
            });
        }
      }
    );

    return () => unsubscribeSeenUpdater();
  }, [chatId, myUserId, otherParticipantId]);
  // --- END NEW useEffect ---

  // --- New Function for Image Selection ---
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // --- Function to clear selected image preview ---
  const clearImage = () => {
    setImageFile(null);
    // Also clear the file input's value if it's a controlled component
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = ""; // Clear the file input value
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    // Check if there's text or an image to send
    if (!text.trim() && !imageFile) {
      return; // Nothing to send, exit the function
    }

    // Set uploading state to prevent multiple sends
    setIsUploading(true);

    const clientTimestamp = Date.now(); // Client-side timestamp for immediate display
    let messageData = {
      senderId: myUserId,
      receiverId: otherParticipantId,
      timestamp: clientTimestamp, // Use client timestamp for optimistic UI
      seen: false, // Seen status applies to all messages, including images
    };

    try {
      if (imageFile) {
        // 1. Upload image to Firebase Storage
        const imageFileName = `chat_images/${chatId}/${uuidv4()}-${
          imageFile.name
        }`;

        const storageReference = ref(storage, imageFileName);
        console.log(storageReference, "storage reference data***");

        const uploadTaskSnapshot = await uploadBytes(
          storageReference,
          imageFile
        );
        console.log(uploadTaskSnapshot, "upload task*****");
        const imageUrl = await getDownloadURL(uploadTaskSnapshot.ref);

        messageData = {
          ...messageData,
          type: "image", // Mark as image message
          imageUrl: imageUrl, // Store the download URL
          message: text.trim() ? text : null, // Optional: caption for the image
        };
      } else {
        // It's a plain text message
        messageData = {
          ...messageData,
          type: "text", // Mark as text message
          message: text,
        };
      }

      // 2. Add message to Firestore
      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      // Clear inputs and states after successful send
      setText("");
      setImageFile(null); // Clear selected image
      clearImage(); // Ensure file input is reset too
    } catch (error) {
      console.error("Error sending message:", error);
      // You might want to show a user-friendly error message here
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  return (
    <div className="completed-appoint-scrn-right col-lg-6">
      <div className="completed-appoint-chat-scrn">
        <div
          className="chat-container"
          style={{ padding: "20px", maxHeight: "600px" }}
        >
          <div
            className="chat-messages"
            ref={messagesEndRef}
            style={{
              height: "400px",
              overflowY: "scroll",
              marginBottom: "10px",
              WebkitOverflowScrolling: "touch",
              overflowX: "hidden",
            }}
          >
            {messages.map((msg, index) => {
              const isMyMessage = msg.senderId === myUserId;
              const messageBackgroundColor = isMyMessage
                ? "#d2f1ff"
                : "#eeeeee";
              const messageJustifyContent = isMyMessage
                ? "flex-end"
                : "flex-start";

              const myMessageBorderRadius = {
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "4px",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              };
              const otherMessageBorderRadius = {
                borderTopLeftRadius: "4px",
                borderTopRightRadius: "12px",
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
              };

              let showDateSeparator = false;
              if (msg.timestamp) {
                if (index === 0) {
                  showDateSeparator = true;
                } else {
                  const prevMsg = messages[index - 1];
                  // Use the actual timestamp from Firestore for comparison, not clientTimestamp
                  // For newly sent messages, `timestamp` will be a number. For old messages, it might be a Firestore Timestamp object.
                  const prevTimestamp = prevMsg.timestamp?.toDate
                    ? prevMsg.timestamp.toDate().getTime()
                    : prevMsg.timestamp;
                  const currentTimestamp = msg.timestamp?.toDate
                    ? msg.timestamp.toDate().getTime()
                    : msg.timestamp;

                  if (prevMsg && prevTimestamp) {
                    showDateSeparator = !isSameDay(
                      currentTimestamp,
                      prevTimestamp
                    );
                  } else {
                    showDateSeparator = true;
                  }
                }
              }

              return (
                <React.Fragment key={msg.id}>
                  {showDateSeparator && (
                    <div
                      style={{
                        textAlign: "center",
                        margin: "20px 0 10px",
                        position: "relative",
                        fontSize: "13px",
                        color: "#666",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#f0f2f5",
                          padding: "5px 12px",
                          borderRadius: "15px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      >
                        {formatDateForSeparator(
                          msg.timestamp?.toDate
                            ? msg.timestamp.toDate().getTime()
                            : msg.timestamp
                        )}
                      </span>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "0",
                          right: "0",
                          height: "1px",
                          backgroundColor: "#e0e0e0",
                          zIndex: -1,
                        }}
                      ></div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: messageJustifyContent,
                      margin: "8px 0",
                      alignItems: "flex-end",
                    }}
                  >
                    {!isMyMessage && (
                      <div style={{ marginRight: "8px" }}>
                        <img
                          src={receiverImg}
                          alt="Receiver Avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        padding: "10px 14px",
                        backgroundColor: messageBackgroundColor,
                        maxWidth: "70%",
                        fontSize: "14px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        wordBreak: "break-word",
                        ...(isMyMessage
                          ? myMessageBorderRadius
                          : otherMessageBorderRadius),
                      }}
                    >
                      {/* --- Conditional Rendering for Image vs. Text --- */}
                      {msg.type === "image" && msg.imageUrl && (
                        <img
                          src={msg.imageUrl}
                          alt="Message attachment"
                          style={{
                            maxWidth: "100%",
                            borderRadius: "8px",
                            marginBottom: msg.message ? "8px" : "0", // Add margin only if there's a caption
                            display: "block",
                          }}
                        />
                      )}

                      {/* Display message/caption only if it exists */}
                      {msg.message && <div>{msg.message}</div>}

                      <div
                        style={{
                          fontSize: "10px",
                          color: "#666",
                          marginTop: "6px",
                          textAlign: isMyMessage ? "right" : "left",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: isMyMessage
                            ? "flex-end"
                            : "flex-start",
                          gap: "4px",
                          alignSelf: "flex-end",
                        }}
                      >
                        {msg.timestamp
                          ? new Date(
                              msg.timestamp?.toDate
                                ? msg.timestamp.toDate().getTime()
                                : msg.timestamp
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}

                        {isMyMessage &&
                          (msg.seen ? (
                            <span
                              style={{
                                color: "#007bff",
                                marginLeft: "4px",
                              }}
                            >
                              ✓✓
                            </span>
                          ) : (
                            <span
                              style={{
                                color: "#888",
                                marginLeft: "4px",
                              }}
                            >
                              ✓
                            </span>
                          ))}
                      </div>
                    </div>

                    {isMyMessage && (
                      <div style={{ marginLeft: "8px" }}>
                        <img
                          src={senderImg}
                          alt="Sender Avatar"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })}
            {/* This div is for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          {/* --- Image Preview Section (New) --- */}
          {imageFile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                marginBottom: "10px",
                border: "1px solid #eee",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Selected preview"
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "#555" }}>
                  {imageFile.name}
                </span>
              </div>
              <button
                type="button"
                onClick={clearImage}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff4d4d",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "5px",
                  lineHeight: "1",
                }}
                disabled={isUploading}
              >
                &times;
              </button>
            </div>
          )}
          {/* --- End Image Preview Section --- */}

          <form
            onSubmit={sendMessage}
            className="chat-footer"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <div
              className="chat-input"
              style={{ flex: 1, position: "relative" }}
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={
                  isUploading ? "Uploading image..." : "Type a message"
                }
                style={{
                  width: "100%",
                  padding: "10px 45px 10px 15px",
                  borderRadius: "30px",
                  border: "1px solid #ccc",
                }}
                disabled={isUploading} // Disable text input during upload
              />
              <div
                className="chat-file-upld"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {/* Connect your existing file input */}
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="fileInput"
                  accept="image/*" // Accept only image files
                  onChange={handleImageChange} // Handle file selection
                  disabled={isUploading} // Disable file input during upload
                />
                <label
                  htmlFor="fileInput"
                  className="attach-btn"
                  style={{ cursor: "pointer" }}
                >
                  <img src="./images/attach-icon.svg" alt="Attach" />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="send-btn"
              disabled={isUploading || (!text.trim() && !imageFile)} // Disable if uploading, or no text/image
            >
              <img src="./images/send-icon.svg" alt="Icon" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
