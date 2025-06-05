import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import CustomModal from "../component/CustomModal";
import { useDispatch, useSelector } from "react-redux";
// import { doctorHomeDashboard } from '../redux/slices/userSlice';
import { doctorHomeDashboard } from "../redux/slices/dataSlice";
import {
  doctorCanceledAppointment,
  getJoinVideoCall,
  sendPushNotification,
} from "../redux/slices/myAppointmentSlice";

const DoctorHome = () => {
  const navigate = useNavigate();
  const appData = JSON.parse(localStorage.getItem("doctor-app") || "{}");
  const DoctorLoginId = appData.doctorData;

  console.log(DoctorLoginId?.id, "Doctor Data");

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  // const {userdata, loading} = useSelector((state) => state.dataSlice)
  const { userdata, loading, error } = useSelector((state) => state.userdata);

  const { channelDetails } = useSelector((state) => state.appointments);
  console.log(channelDetails, "jfaklshfsahdfks");

  useEffect(() => {
    dispatch(doctorHomeDashboard());
  }, [dispatch]);

  // const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllPrescriptions, setShowAllPrescriptions] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [canOpenModal, setCanOpenModal] = useState(true);
  const handleCloseModal = () => setModalOpen(false);

  //for StartAppointment
  // State to track if we should show the start appointment section
  const [showAppointmentSection, setShowAppointmentSection] = useState(false);
  // State to store the current appointment that matches the time
  const [currentAppointment, setCurrentAppointment] = useState(null);



  // New helper functions to parse the date and time strings
  // const parseDisplayDate = (dateStr) => {
  //   // Example: "Mon May 19" -> May 19, current year
  //   const [weekday, month, day] = dateStr.split(" ");
  //   const year = new Date().getFullYear();
  //   return new Date(`${month} ${day}, ${year}`);
  // };

  // const parseTimeRange = (timeStr) => {
  //   // Example: "01:30 - 01:45 PM" -> { start: "01:30 PM", end: "01:45 PM" }
  //   const [startTime, endTime] = timeStr.split(" - ");
  //   const period = endTime.includes("AM") ? "AM" : "PM";
  //   return {
  //     start: `${startTime} ${period}`,
  //     end: endTime,
  //   };
  // };


  // const isCurrentTimeInRange = (dateStr, timeStr) => {
  //   try {
  //     const date = parseDisplayDate(dateStr);
  //     const { start, end } = parseTimeRange(timeStr);

  //     const startDateTime = new Date(`${date.toDateString()} ${start}`);
  //     const endDateTime = new Date(`${date.toDateString()} ${end}`);
  //     const now = new Date();

  //     return now >= startDateTime && now <= endDateTime;
  //   } catch (error) {
  //     console.error("Error parsing date/time:", error);
  //     return false;
  //   }
  // };

  // Updated useEffect for checking appointments
  // useEffect(() => {
  //   if (userdata?.upcomingAppointments) {
  //     const checkForCurrentAppointments = () => {
  //       const matchingAppointment = userdata.upcomingAppointments.find(
  //         (appointment) => {
  //           // return isCurrentTimeInRange(appointment.date, appointment.time);
  //           return isCurrentTimeInRange("Mon June 02", "02:44 - 07:30 PM"); // working for both start and end time.
  //         }
  //       );

  //       if (matchingAppointment) {
  //         console.log("Found matching appointment:", matchingAppointment);
  //         setCurrentAppointment(matchingAppointment);
  //         setShowAppointmentSection(true);
  //       } else {
  //         setShowAppointmentSection(false);
  //         setCurrentAppointment(null);
  //       }
  //     };

  //     // Check immediately
  //     checkForCurrentAppointments();

  //     // Set up interval to check every 30 seconds
  //     const checkInterval = setInterval(checkForCurrentAppointments, 30000);

  //     return () => clearInterval(checkInterval);
  //   }
  // }, [userdata]);

  // New Condition Check for active appointments (status ===1)
  // useEffect(() => {
  //   if(userdata?.upcomingAppointments){
  //     const activeAppointment = userdata.upcomingAppointments.find(
  //       appointment => appointment.status === 1
  //     );
  //     if (true){
  //       console.log("Found active appointment:", activeAppointment);
  //       setCurrentAppointment(true);
  //       setShowAppointmentSection(true);
  //     } else{
  //       setCurrentAppointment(null);
  //       setShowAppointmentSection(false);
  //     }
  //   }
  // }, [userdata?.upcomingAppointments]);

  // New Condition Check for active appointments (status === 1)
useEffect(() => {
  if (userdata?.upcomingAppointments) {
    const activeAppointment = userdata.upcomingAppointments.find(
      appointment => appointment.status === 1
    );
    
    if (activeAppointment) {
      console.log("Found active appointment:", activeAppointment);
      setCurrentAppointment(activeAppointment); // Set the actual appointment object
      setShowAppointmentSection(true);
    } else {
      setCurrentAppointment(null);
      setShowAppointmentSection(false);
    }
  }
}, [userdata?.upcomingAppointments]);

// useEffect(() => {
//   // Simulate an active appointment (status = 1)
//   const testAppointment = {
//     appointment_id: 123, // Example ID
//     patient_id: 456, // Example patient ID
//     patient_name: "Test Patient",
//     patient_profile: "default-profile.jpg", // Example image
//     date: "Mon June 03", // Example date
//     time: "02:30 - 03:00 PM", // Example time
//     status: 1, // Force status = 1 (active)
//     is_referred_patient: false, // Example
//     ds_code: null, // Example
//   };

//   setCurrentAppointment(testAppointment);
//   setShowAppointmentSection(true);

//   // Optional: Log to confirm it's working
//   console.log("TEST MODE: Forcing static appointment", testAppointment);
// }, []);

  const handleCancelClick = (id) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleCancelConfirm = () => {
    setShowModal(false);
    setShowCancelReasonModal(true);
  };

  const handleCancelReasonSubmit = () => {
    console.log("Cancelled appointment ID:", selectedAppointmentId);
    console.log("Reason:", cancelReason);

    dispatch(
      doctorCanceledAppointment({
        appointment_id: selectedAppointmentId,
        cancel_message: cancelReason,
      })
    ).then(() => {
      // Refresh the upcoming appointments list after successful cancellation
      dispatch(doctorHomeDashboard());
      setShowCancelReasonModal(false);
      setCancelReason("");
      setSelectedAppointmentId(null);
      setShowSuccessModal(true);
    });
  };

  useEffect(() => {
    const reminderTimer = setTimeout(() => {

    }, 1000);

    const appointmentTimer = setTimeout(() => {
      setShowAppointmentSection(true); // Show the appointment section after the reminder
    }, 3000); // 2 minutes for the appointment section to appear

    return () => {
      clearTimeout(reminderTimer); // Clear the reminder timer
      clearTimeout(appointmentTimer); // Clear the appointment section timer
    };
  }, []);

  // Get upcoming appointments and pending prescriptions from API data
  const upcomingAppointments = userdata?.upcomingAppointments || [];
  const pendingPrescriptions = userdata?.pendingPrescriptions || [];

  // Determine which appointments/prescriptions to show based on "See all" state
  const visibleAppointments = showAllAppointments
    ? upcomingAppointments
    : upcomingAppointments.slice(0, 4);

  const visiblePrescriptions = showAllPrescriptions
    ? pendingPrescriptions
    : pendingPrescriptions.slice(0, 3);

  // handle create channel to join call

  const handleCreateChannel = async (id) => {
    console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
    dispatch(
      getJoinVideoCall({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointmentId: id,
      })
    );

    dispatch(
      sendPushNotification({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointment_id: id,
      })
    );

    if (channelDetails) {
      navigate("/VideoCall", {
        state: {
          id: currentAppointment.appointment_id,
          patientId: currentAppointment.patient_id,
          name: currentAppointment?.patient_name,
        },
      });
    }
  };
  // const handleCreateChannel = async (id) => {
  //   console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
    
  //   try {
  //     await dispatch(
  //       getJoinVideoCall({
  //         channelName: `JoinCall + ${DoctorLoginId?.id}`,
  //         appointmentId: id,
  //       })
  //     ).unwrap(); // unwrap() throws if the action rejects
  
  //     await dispatch(
  //       sendPushNotification({
  //         appointment_id: id,
  //       })
  //     ).unwrap();
  
  //     navigate("/VideoCall", {
  //       state: {
  //         id: currentAppointment.appointment_id,
  //         patientId: currentAppointment.patient_id,
  //         name: currentAppointment?.patient_name,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Failed to create video channel:", error);
  //     // Show error message to user
  //   }
  // };

  //FOR TESTING WITH STATIC DATA

  // const handleCreateChannel = async (id) => {
  //   console.log("TEST MODE: Simulating video call for appointment ID:", id);
  
  //   // Simulate Redux dispatch (optional)
  //   dispatch(
  //     getJoinVideoCall({
  //       channelName: `JoinCall + ${DoctorLoginId?.id}`,
  //       appointmentId: id,
  //     })
  //   ).then(() => {
  //     console.log("TEST MODE: Video channel created successfully");
  //     navigate("/VideoCall", {
  //       state: {
  //         id: currentAppointment?.appointment_id || 123, // Fallback to test ID
  //         patientId: currentAppointment?.patient_id || 456, // Fallback
  //         name: currentAppointment?.patient_name || "Test Patient", // Fallback
  //       },
  //     });
  //   });
  // };

  return (
    <>
      {/* <Header /> */}

      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>
          {loading ? (
            <div className="loader-main">
              <span className="loader"></span>
            </div>
          ) : (
          <div className="doc-panel-body">
            <div className="appointments">
              {/* Start Appointment */}
              {showAppointmentSection && currentAppointment && (
                <div className="start-appointment cmn-mb">
                  <div className="docpnl-sec-head">
                    <h1 className="h2-title">Start Appointment</h1>
                  </div>
                  <div className="apointment-detail-card">
                    <div className="apoint-dtl-img">
                      <img
                        src={`${baseUrl}/${currentAppointment.patient_profile}`}
                        alt={currentAppointment.patient_name}
                      />
                    </div>
                    <div className="appoint-dtl-content">
                      <div className="appoint-dtl-left">
                        <div className="appoint-dtl-head">
                          <h2 className="h3-title">
                            {currentAppointment.patient_name}
                          </h2>
                          {currentAppointment.is_referred_patient && (
                            <p>Referred by DS: {currentAppointment.ds_code}</p>
                          )}
                        </div>
                        <div className="appoint-btm">
                          <p>
                            <img src="/images/clock-icon.svg" alt="Icon" />
                            {currentAppointment.date}
                          </p>
                          <p className="appoint-time">
                            {currentAppointment.time}
                          </p>
                          {/* <a
                            // to="/VideoCall"
                            // state={{
                            //   id: currentAppointment.appointment_id,
                            //   patientId: currentAppointment.patient_id,
                            // }}
                            className="orange-btn" style={{cursor:"pointer"}}
                            onClick={() =>
                              handleCreateChannel(
                                currentAppointment.appointment_id
                              )
                            }
                          >
                            Start now
                          </a> */}
                          <a
                              className="orange-btn"
                              onClick={() =>
                                handleCreateChannel(String(currentAppointment.appointment_id))
                              }
                            >
                              Start now
                            </a>
                            
                          {console.log(
                            "patientId123:",
                            currentAppointment.patient_id
                          )}
                        </div>
                      </div>
                      <Link
                        to="/patient-profile"
                        state={{ patientId: currentAppointment.patient_id }}
                        className="cmn-btn"
                      >
                        View profile
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="upcoming-apoints cmn-mb">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Upcoming Appointments</h1>
                  <button
                    className="cmn-btn"
                    onClick={() => setShowAllAppointments(!showAllAppointments)}
                  >
                    {showAllAppointments ? "Show less" : "See all"}
                  </button>
                </div> */}
                <div className="upcoming-apoints cmn-mb">
                  <div className="docpnl-sec-head">
                    <h1 className="h2-title">Upcoming Appointments</h1>
                    <button
                      className="cmn-btn"
                      onClick={() => navigate("/my-appointments")}
                    >
                      See all
                    </button>
                  </div>
                {/* Upcoming Appointments */}
                <div className="appointments-row-wrp cmn-mb">
                  <div className="appointments-row row">
                    {visibleAppointments.map((appointment, idx) => (
                      <div
                        className="appointment-card-wrp col-lg-3 col-md-4 col-sm-6"
                        key={idx}
                      >
                        <div className="appointment-card">
                          <div className="card-img">
                            <img
                              src={
                                `${baseUrl}/${appointment.patient_profile}` ||
                                ""
                              }
                              alt={appointment.patient_name}
                            />
                          </div>
                          <div className="card-body">
                            <Link
                              to="/patient-details"
                              state={{
                                id: appointment.appointment_id,
                                patientId: appointment.patient_id,
                                referrerDscode:appointment.ds_code,
                                referrer:appointment.referred_patient_name
                              }}
                              className="cmn-btn"
                            >
                              View full detail
                            </Link>
                            {console.log(
                              "appointment_id for patient details",
                              appointment.appointment_id
                            )}
                            <div className="appointment-datetime">
                              <p className="date">{appointment.date}</p>
                              <p className="time">{appointment.time}</p>
                            </div>
                            {appointment.is_referred_patient && (
                              <p>Referred by DS Code: {appointment.ds_code}</p>
                            )}
                            <h3>{appointment.patient_name}</h3>
                           
                            <input
                              type="submit"
                              value="Cancel"
                              className="w-100"
                              onClick={() =>
                                handleCancelClick(appointment.appointment_id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pending-prescriptions">
                    <div className="docpnl-sec-head">
                      <h2>Pending Prescriptions</h2>
                      <button
                        className="cmn-btn"
                        onClick={() => navigate("/pendingprescription")

                        }
                      >
                        See all
                      </button>
                    </div>
                  <div className="pending-presc-table">
                    <table>
                      <thead>
                        <tr>
                          <th>S.no.</th>
                          <th>Patient Name</th>
                          <th>Upload Date</th>
                          <th>View Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visiblePrescriptions.map((prescription, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <Link to="/patient-profile" state={{ patientId: prescription.patient_id }} ><td>{prescription.patient_name}</td></Link>
                            <td>
                              <div className="date">
                                {prescription.symptom_upload_date.split(" ")[0]}
                              </div>
                              <div className="time">
                                {prescription.symptom_upload_date.split(" ")[1]}
                              </div>
                            </td>
                            <td>
                              <Link
                                to="/PendingAssignedPrescriptionDetails"
                                state={{
                                  id: prescription.symptom_id,
                                  patientId: prescription.patient_id,
                                }}
                              >
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Footer />
          </div>
          )}
          {!showAppointmentSection && showReminderModal && (
            <div
              className="modal fade show"
              tabIndex="-1"
              style={{
                display: "block",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div
                  className="modal-content text-center position-relative shadow"
                  style={{
                    width: "400px",
                    minHeight: "280px",
                    borderRadius: "20px",
                    padding: "30px 20px",
                  }}
                >
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={() => setShowReminderModal(false)}
                    className="position-absolute top-0 end-0 m-3 border-0 bg-transparent"
                    aria-label="Close"
                  >
                    <img
                      src="./images/cross-blue.png"
                      alt="Close Icon"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </button>

                  {/* Modal Icon */}
                  <div className="modal-icon mb-3">
                    <img
                      src="./images/bell-icon.svg"
                      alt="Reminder Icon"
                      style={{ width: "40px", height: "40px" }}
                    />
                  </div>

                  {/* Header */}
                  <div className="modal-header border-0 flex-column align-items-center p-0">
                    <h2
                      className="fw-bold mb-2"
                      style={{ fontSize: "22px", color: "#333" }}
                    >
                      Reminder:
                    </h2>
                    <p
                      className="m-0"
                      style={{ color: "#009CDE", fontWeight: "500" }}
                    >
                      Your Appointment Starts in 2 Minutes!
                    </p>
                  </div>

                  {/* Body */}
                  <div className="modal-body p-0 mt-4">
                    <div className="text-muted mb-2">
                      Patient’s Name:{" "}
                      <span className="fw-medium" style={{ color: "#356598" }}>
                        John Smith
                      </span>
                    </div>
                    <div className="text-muted">
                      Date and Time:{" "}
                      <span className="fw-medium" style={{ color: "#356598" }}>
                        December 26, 2024, 3:00 PM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <CustomModal
          visible={showModal}
          title="Cancel Appointment"
          subtitle="Are you sure you want to cancel the appointment?"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowModal(false)}
          actionType="cancel"
        />

        {/* Reason Input Modal */}
        <CustomModal
          visible={showCancelReasonModal}
          title="Cancel Appointment"
          subtitle="Reason for cancellation"
          inputField={true}
          inputValue={cancelReason}
          onInputChange={(value) => setCancelReason(value)}
          onCancel={() => {
            setShowCancelReasonModal(false);
            setCancelReason("");
          }}
          onConfirm={handleCancelReasonSubmit}
          actionType="info"
        />

        {/* Success Modal */}
        <CustomModal
          visible={showSuccessModal}
          title="Appointment Cancelled"
          subtitle="Your appointment is cancelled successfully."
          onConfirm={() => setShowSuccessModal(false)}
          onCancel={() => setShowSuccessModal(false)}
          actionType="success"
        />
      </main>
    </>
  );
};

export default DoctorHome;
