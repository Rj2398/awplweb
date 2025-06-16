// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { reminderPopup } from "../../redux/slices/notificationSlice";

// const GlobalReminderModal = ({ allData, date = "Wed May 28", time = "12:56 - 07:30 AM" }) => {
//   const [showReminderModal, setShowReminderModal] = useState(false);
//   const [reminderMessage, setReminderMessage] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const {reminderPopupData, loading} = useSelector((state) => state.notification);

//   useEffect(() => {
//     dispatch(reminderPopup());
//   }, [dispatch])

//   useEffect(() => {

//     const appointmentDateTime = getAppointmentDateTime(date, time);
//     if (!appointmentDateTime) return;

//     const now = new Date();
//     const diffInMs = appointmentDateTime.getTime() - now.getTime();
   
//     const reminders = [
//       { minutesBefore: 15 }, { minutesBefore: 5 }, { minutesBefore: 2 },
//       // { minutesBefore: 14 }, { minutesBefore: 13 }, { minutesBefore: 12 }, { minutesBefore: 11 }, 
//       // { minutesBefore: 10 }, { minutesBefore: 9 }, { minutesBefore: 8 }, { minutesBefore: 7 },
//       // { minutesBefore: 6 }, { minutesBefore: 4 }, { minutesBefore: 3 }, { minutesBefore: 1 },
//     ];
//     const timers = [];

//     reminders.forEach(({ minutesBefore }) => {
//       const reminderTime = diffInMs - minutesBefore * 60 * 1000;
//       if (reminderTime > 0) {
//         const timer = setTimeout(() => {
//           const msg = `Your Appointment Starts in ${minutesBefore} Minute(s)!`;

//           setReminderMessage(msg);
//           setShowReminderModal(true);

//           setTimeout(() => {
//             setShowReminderModal(false);
//           }, 5000);
//         }, reminderTime);
//         timers.push(timer);
//       }
//     });

//     if (diffInMs > 0) {
//       const logTimer = setTimeout(() => {
//         console.log("Timer is completed: Appointment time reached.");
//       }, diffInMs);
//       timers.push(logTimer);
//     }

//     return () => {
//       timers.forEach(clearTimeout);
//     };
//   }, [date, time, navigate]);

//   const getAppointmentDateTime = (dateStr, timeStr) => {
//     const [startTimeStr, endTimeStr] = timeStr.split(" - ");
//     let timeWithMeridian = startTimeStr.trim();

//     if (!/AM|PM/i.test(timeWithMeridian) && /AM|PM/i.test(endTimeStr)) {
//       const amPm = endTimeStr.trim().match(/AM|PM/i)[0];
//       timeWithMeridian += ` ${amPm}`;
//     }

//     const fullDateStr = `${dateStr} ${new Date().getFullYear()} ${timeWithMeridian}`;
//     const parsedDate = new Date(fullDateStr);

//     if (isNaN(parsedDate)) {
//       console.error("Invalid date/time format:", fullDateStr);
//       return null;
//     }

//     return parsedDate;
//   };

//   return (
//     <>
//       {showReminderModal && (
//         <div className="modal fade show" tabIndex="-1" 
//           style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} >
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content text-center position-relative shadow"
//               style={{ width: "400px", minHeight: "280px", borderRadius: "20px", padding: "30px 20px", }} >
              
//               <button type="button" onClick={() => setShowReminderModal(false)} 
//                 className="position-absolute top-0 end-0 m-3 border-0 bg-transparent" aria-label="Close" >
//                 <img src="./images/cross-blue.png" alt="Close Icon" style={{ width: "24px", height: "24px" }} />
//               </button>

//               <div className="modal-icon mb-3">
//                 <img src="./images/bell-icon.svg" alt="Reminder Icon" style={{ width: "40px", height: "40px" }} />
//               </div>

//               <div className="modal-header border-0 flex-column align-items-center p-0">
//                 <h2 className="fw-bold mb-2" style={{ fontSize: "22px", color: "#333" }}>
//                   Reminder:
//                 </h2>
//                 <p className="m-0" style={{ color: "#009CDE", fontWeight: "500" }}>
//                   {reminderMessage}
//                 </p>
//               </div>

//               <div className="modal-body p-0 mt-4">
//                 <div className="text-muted mb-2">
//                   Patient's Name:{" "}
//                   <span className="fw-medium" style={{ color: "#356598" }}>
//                     {/* {allData?.name || "John Smith"} */}
//                     {reminderPopupData?.patient_name || ""}
//                   </span>
//                 </div>

//                 <div className="text-muted">
//                   Date and Time:{" "}
//                   <span className="fw-medium" style={{ color: "#356598" }}>
//                     {date + ", " + time}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default GlobalReminderModal;








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reminderPopup } from "../../redux/slices/notificationSlice";

const GlobalReminderModal = () => {
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {reminderPopupData, loading} = useSelector((state) => state.notification);

  const nowIST = new Date();

// Add 2 minutes to current IST time
// nowIST.setSeconds(nowIST.getSeconds() + 20);

              // FOR STATIC DATA TESTING 
  // const reminderPopupData = {
  //   appointment_datetime: nowIST.toISOString(), // static ISO date-time string
  //   patient_name: "Mock Patient"
  // };
  // const loading = false;

  useEffect(() => {
    dispatch(reminderPopup());
  }, [dispatch])

  // const reminderPopupData = {
  //   // appointment_datetime: "2025-06-13T13:00:00.000000Z", // 6:30 PM IST
  //   appointment_datetime: "2025-06-13T13:16:00.000Z", 
  //   patient_name: "Mock Patient"
  // };
  

  useEffect(() => {
    // console.log("Reminder Popup Data from backend11111111:", reminderPopupData);

    if (!reminderPopupData?.appointment_datetime) return;

    const appointmentDateTime = new Date(reminderPopupData.appointment_datetime);
    if (isNaN(appointmentDateTime)) {
      console.error("Invalid appointment datetime:", reminderPopupData.appointment_datetime);
      return;
    }

    const now = new Date();
    const diffInMs = appointmentDateTime.getTime() - now.getTime();
   
    const reminders = [
      { minutesBefore: 15 }, { minutesBefore: 5 }, { minutesBefore: 2 },
      // { minutesBefore: 14 }, { minutesBefore: 13 }, { minutesBefore: 12 }, { minutesBefore: 11 }, 
      // { minutesBefore: 10 }, { minutesBefore: 9 }, { minutesBefore: 8 }, { minutesBefore: 7 },
      // { minutesBefore: 6 }, { minutesBefore: 4 }, { minutesBefore: 3 }, { minutesBefore: 1 },
    ];
    const timers = [];

    reminders.forEach(({ minutesBefore }) => {
      const reminderTime = diffInMs - minutesBefore * 60 * 1000;
      if (reminderTime > 0) {
        const timer = setTimeout(() => {
          const msg = `Your Appointment Starts in ${minutesBefore} Minutes!`;

          setReminderMessage(msg);
          setShowReminderModal(true);

          // setTimeout(() => {
          //   setShowReminderModal(false);
          // }, 5000);
        }, reminderTime);
        timers.push(timer);
      }
    });

    if (diffInMs > 0) {
      const logTimer = setTimeout(() => {
        console.log("Timer is completed: Appointment time reached.");
      }, diffInMs);
      timers.push(logTimer);
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [reminderPopupData]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  // const getAppointmentDateTime = (dateStr, timeStr) => {
  //   const [startTimeStr, endTimeStr] = timeStr.split(" - ");
  //   let timeWithMeridian = startTimeStr.trim();

  //   if (!/AM|PM/i.test(timeWithMeridian) && /AM|PM/i.test(endTimeStr)) {
  //     const amPm = endTimeStr.trim().match(/AM|PM/i)[0];
  //     timeWithMeridian += ` ${amPm}`;
  //   }

  //   const fullDateStr = `${dateStr} ${new Date().getFullYear()} ${timeWithMeridian}`;
  //   const parsedDate = new Date(fullDateStr);

  //   if (isNaN(parsedDate)) {
  //     console.error("Invalid date/time format:", fullDateStr);
  //     return null;
  //   }

  //   return parsedDate;
  // };

  return (
    <>
      {showReminderModal && (
        <div className="modal fade show" tabIndex="-1" 
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }} >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content text-center position-relative shadow"
              style={{ width: "400px", minHeight: "280px", borderRadius: "20px", padding: "30px 20px", }} >
              
              <button type="button" onClick={() => setShowReminderModal(false)} 
                className="position-absolute top-0 end-0 m-3 border-0 bg-transparent" aria-label="Close" >
                <img src="./images/cross-blue.png" alt="Close Icon" style={{ width: "24px", height: "24px" }} />
              </button>

              <div className="modal-icon mb-3">
                <img src="./images/bell-icon.svg" alt="Reminder Icon" style={{ width: "40px", height: "40px" }} />
              </div>

              <div className="modal-header border-0 flex-column align-items-center p-0">
                <h2 className="fw-bold mb-2" style={{ fontSize: "22px", color: "#333" }}>
                  Reminder:
                </h2>
                <p className="m-0" style={{ color: "#009CDE", fontWeight: "500" }}>
                  {reminderMessage}
                </p>
              </div>

              <div className="modal-body p-0 mt-4">
                <div className="text-muted mb-2">
                  Patient's Name:{" "}
                  <span className="fw-medium" style={{ color: "#356598" }}>

                    {reminderPopupData?.patient_name || "Sunil"}
                  </span>
                </div>

                <div className="text-muted">
                  Date and Time:{" "}
                  <span className="fw-medium" style={{ color: "#356598" }}>
                    {formatDateTime(reminderPopupData?.appointment_datetime)}
                    {/* {formatDateTime("2025-06-13T13:00:00.000000Z")} */}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalReminderModal;