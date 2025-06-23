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
import { getDoctorProfile } from "../redux/slices/userSlice";

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

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user?.profile_path) {
      dispatch(getDoctorProfile());
    }
  }, [dispatch, user]);

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

  // New Condition Check for active appointments (status === 1)
  useEffect(() => {
    if (userdata?.upcomingAppointments) {
      const activeAppointment = userdata.upcomingAppointments.find(
        (appointment) => appointment.status === 1
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
    const reminderTimer = setTimeout(() => {}, 1000);

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

  const sendNotitficaion = (id) => {
    dispatch(
      sendPushNotification({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointmentId: id,
      })
    );
  };

  const handleCreateChannel = async (id) => {
    console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
    dispatch(
      getJoinVideoCall({
        // channelName: `JoinCall + ${DoctorLoginId?.id}`,
        appointmentId: id,
      })
    );
    //start video call button is not working at first time due to two dispatch
    // dispatch(
    //   sendPushNotification({
    //     // channelName: `JoinCall + ${DoctorLoginId?.id}`,
    //     appointment_id: id,
    //   })
    // );

    if (channelDetails) {
      navigate("/VideoCall", {
        state: {
          id: currentAppointment.appointment_id,
          patientId: currentAppointment.patient_id,
          name: currentAppointment?.patient_name,
          time_period: currentAppointment?.time,
        },
      });
      sendNotitficaion(id);
    }
  };

  // useEffect(() => {
  //   if (channelDetails) {
  //     navigate("/VideoCall", {
  //       state: {
  //         id: currentAppointment.appointment_id,
  //         patientId: currentAppointment.patient_id,
  //         name: currentAppointment?.patient_name,
  //       },
  //     });

  //     // Clear selectedAppointmentId to avoid duplicate navigation
  //     // setSelectedAppointmentId(null);
  //   }
  // }, [channelDetails]);

  // const convertTimeRangeTo24Hour = (timeRange) => {
  //   const [startTime, endTime] = timeRange.split(" - ");

  //   const convertTo24Hour = (timeStr) => {
  //     const [time, modifier] = timeStr.split(" ");
  //     let [hours, minutes] = time.split(":");

  //     if (modifier === "PM" && hours !== "12") {
  //       hours = parseInt(hours, 10) + 12;
  //     }
  //     if (modifier === "AM" && hours === "12") {
  //       hours = "00";
  //     }

  //     return `${String(hours).padStart(2, '0')}:${minutes}`;
  //   };

  //   const start24 = convertTo24Hour(startTime + " " + endTime.split(" ")[1]); // include AM/PM from endTime
  //   const end24 = convertTo24Hour(endTime);

  //   return `${start24} - ${end24}`;
  // };

  // const convertTo24HourTiming = (dateTimeStr) => {
  //   if (!dateTimeStr) return '';

  //   const parts = dateTimeStr.split(' ');
  //   if (parts.length < 2) return '';

  //   const [time, modifier] = [parts[1], parts[2]];
  //   let [hours, minutes] = time.split(':');
  //   hours = parseInt(hours, 10);

  //   if (modifier === "PM" && hours !== 12) {
  //     hours += 12;
  //   }
  //   if (modifier === "AM" && hours === 12) {
  //     hours = 0;
  //   }

  //   return `${String(hours).padStart(2, '0')}:${minutes}`;
  // };
  const isCancelDisabled = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return false;

    try {
      // Extract parts from the date (e.g., "Tue Jun 10")
      const [weekday, month, day] = dateStr.split(" ");
      const year = new Date().getFullYear(); // current year

      // Extract start time and AM/PM (e.g., "07:30 - 07:45 PM")
      const [startTime, endTimeWithPeriod] = timeStr.split(" - ");
      const period = endTimeWithPeriod.trim().slice(-2); // "AM" or "PM"
      const startTimeWithPeriod = `${startTime.trim()} ${period}`;

      // Combine date and time into a full string like: "Jun 10, 2025 07:30 PM"
      const dateTimeStr = `${month} ${day}, ${year} ${startTimeWithPeriod}`;
      const appointmentDateTime = new Date(dateTimeStr);
      const now = new Date();

      const diffInMs = appointmentDateTime - now;
      // const diffInHours = diffInMs / (1000 * 60 * 60);

      // Disable if appointment has passed or is within 2 hours
      // return diffInHours <= 2;
      // Disable only if appointment time has already passed this new functionality added
      return diffInMs <= 0;
    } catch (error) {
      console.error("Date parse error:", error);
      return false;
    }
  };

  const formatDate = (rawDateStr) => {
    if (!rawDateStr) return "N/A";

    // Append current year to complete the date
    const currentYear = new Date().getFullYear();
    const fullDateStr = `${rawDateStr} ${currentYear}`; // e.g., "Thu Jun 19 2025"

    const date = new Date(fullDateStr);
    if (isNaN(date)) return "Invalid Date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // JS months are 0-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      {/* <Header /> */}

      <main className="doctor-panel">
        <div className="container-fluid">
          <div
            className="doc-panel-inr"
            style={{ display: "flex", gap: "20px" }}
          >
            <div style={{ width: "100%" }}>
              <Header />
            </div>
            <div>
              <div className="doc-img">
                <img src={`${baseUrl}/${user?.profile_path}`} alt="Doctor" />
              </div>
              <div className="doc-profile-body">
                <p style={{ color: "#199FD9" }}>
                  {user?.name || "Doctor Name"}
                </p>
              </div>
            </div>
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
                  <div
                    className="start-appointment mt-0"
                    style={{ marginBottom: "60px" }}
                  >
                    <div className="docpnl-sec-head">
                      <h6 className="h2-title">Start Appointment</h6>
                      {/* // to decrease their size i add css of 35px fontsize in dasboard */}
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
                              <p>
                                Referred by DS: {currentAppointment.ds_code}
                              </p>
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
                            {/* <p className="appoint-time">{convertTimeRangeTo24Hour(currentAppointment.time)}</p> */}

                            <a
                              className="orange-btn"
                              onClick={() =>
                                handleCreateChannel(
                                  String(currentAppointment.appointment_id)
                                )
                              }
                              style={{ cursor: "pointer" }}
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
                      {visibleAppointments.length == 0 && (
                        <h3
                          style={{
                            textAlign: "center",
                            padding: "25px 0",
                            fontWeight: "bold",
                            color: "#356598",
                          }}
                        >
                          No upcoming appointments.
                        </h3>
                      )}
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
                                  referrerDscode: appointment.ds_code,
                                  referrer: appointment.referred_patient_name,
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
                                {/* <p className="appoint-time">{convertTimeRangeTo24Hour(appointment.time)}</p> */}
                              </div>

                              {/* Add min-height to maintain consistent space */}
                              <div style={{ minHeight: "24px" }}>
                                {appointment.is_referred_patient ? (
                                  // <p>Referred by DS Code: {appointment.ds_code}</p>
                                  <p>
                                    Referred by DS Code:{" "}
                                    {
                                      <span style={{ color: "#199FD9" }}>
                                        {appointment.ds_code}
                                      </span>
                                    }
                                  </p>
                                ) : (
                                  <p style={{ visibility: "hidden" }}>
                                    Placeholder
                                  </p>
                                )}
                              </div>
                              <h3>{appointment.patient_name}</h3>

                              <input
                                type="submit"
                                value="Cancel"
                                className="w-100"
                                onClick={() =>
                                  handleCancelClick(appointment.appointment_id)
                                }
                                disabled={isCancelDisabled(
                                  appointment.date,
                                  appointment.time
                                )}
                                style={{
                                  opacity: isCancelDisabled(
                                    appointment.date,
                                    appointment.time
                                  )
                                    ? 0.5
                                    : 1,
                                  cursor: isCancelDisabled(
                                    appointment.date,
                                    appointment.time
                                  )
                                    ? "not-allowed"
                                    : "pointer",
                                }}
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
                        onClick={() => navigate("/pendingprescription")}
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
                          {visiblePrescriptions.length == 0 && (
                            <tr>
                              <td colSpan="8" style={{ textAlign: "center" }}>
                                {loading ? "Loading..." : "No data found"}
                              </td>
                            </tr>
                          )}
                          {visiblePrescriptions.map((prescription, index) => (
                            <tr key={index}>
                              {/* <td>{index + 1}</td> */}
                              <td>{String(index + 1).padStart(2, "0")}</td>

                              <td
                                style={{
                                  textAlign: "left",
                                  paddingLeft: "45px",
                                  width: "200px",
                                }}
                              >
                                <Link
                                  to="/patient-profile"
                                  state={{ patientId: prescription.patient_id }}
                                  className="no-underline-link"
                                  style={{ display: "inline-block" }}
                                >
                                  {prescription.patient_name}
                                </Link>
                                {/* {(prescription?.ds_code &&
                                  <div className="time" style={{ color: "#199FD9" }}>
                                    (DS Code: {prescription.ds_code})
                                  </div>
                                )} */}
                                {prescription?.is_referred_patient == true ? (
                                  <div
                                    className="time"
                                    style={{
                                      color: "#199fd9",
                                      marginTop: "2px",
                                    }}
                                  >
                                    (Referred by DS Code: {prescription.ds_code}
                                    )
                                  </div>
                                ) : (
                                  <div
                                    className="time"
                                    style={{
                                      color: "#199fd9",
                                      marginTop: "2px",
                                    }}
                                  >
                                    (DS Code: {prescription.ds_code})
                                  </div>
                                )}
                              </td>
                              <td>
                                <div className="date">
                                  {/* {prescription.symptom_upload_date.split(" ")[0]} */}
                                  {/* {prescription.date} */}
                                  {formatDate(prescription.date)}
                                </div>
                                <div className="time">{prescription.time}</div>
                              </td>
                              <td>
                                <Link
                                  to="/patient-details"
                                  state={{
                                    id: prescription.appointment_id,
                                    patientId: prescription.patient_id,
                                    referrerDscode: prescription.ds_code,
                                    referrer:
                                      prescription.referred_patient_name,
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
              {/* <Footer /> */}
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
          <Footer />
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
