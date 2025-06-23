// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Header from "../component/doctorPanel/Header";
// import Footer from "../component/doctorPanel/Footer";
// // import AgoraChat from "../component/doctorPanel/AgoraChat";
// import { useLocation } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { completeAppointmentPatientDetails } from "../redux/slices/prescriptionSlice";
// import { prescriptionDownload } from "../redux/slices/prescriptionSlice";

// const CompletedAppointment = () => {
//   const location = useLocation();
//   const { id, patientId } = location.state || {};
//   console.log("id", id);

//   const dispatch = useDispatch();
//   const {
//     completeAppointmentPatientDetail,
//     prescription_Download,
//     loading,
//     error,
//   } = useSelector((state) => state.prescriptions);

//   useEffect(() => {
//     if (id) {
//       dispatch(completeAppointmentPatientDetails({ prescriptionId: id }));
//       console.log("data", completeAppointmentPatientDetail);
//     }
//   }, [dispatch, id]);

//   const baseUrl = import.meta.env.VITE_BACKEND_URL;

//   const handleDownloadPrescription = () => {
//     console.log("Downloading prescription ID:", id);
//     dispatch(prescriptionDownload({ prescriptionId: id })).then((action) => {
//       if (prescriptionDownload.fulfilled.match(action)) {
//         // Create a blob from the response
//         const blob = new Blob([action.payload], { type: "application/pdf" });
//         // Create a download link
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement("a");
//         link.href = url;
//         // Set the filename (you might want to get this from headers or response)
//         link.setAttribute("download", `prescription-${id}.pdf`);
//         // Trigger the download
//         document.body.appendChild(link);
//         link.click();
//         // Clean up
//         document.body.removeChild(link);
//         window.URL.revokeObjectURL(url);
//       }
//     });
//   };

//   return (
//     <>
//       <main className="doctor-panel">
//         <div className="container-fluid">
//           <div className="doc-panel-inr">
//             <Header />
//           </div>
//           {loading ? (
//             <div className="loader-main">
//               <span className="loader"></span>
//             </div>
//           ) : (

//           <div className="doc-panel-body appoint-details-pg">
//             <div className="completed-appoint-scrn">
//               <div className="docpnl-sec-head">
//                 <h1 className="h2-title">Prescription Details</h1>
//                 <div className="back-btn">
//                   <Link
//                     to="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       window.history.back();
//                     }}
//                   >
//                     <img src="./images/left-arrow.svg" alt="Back" />
//                   </Link>
//                 </div>
//               </div>

//               <div className="completed-appoint-scrn-inr row">
//                 <div className="completed-appoint-scrn-left col-lg-6">
//                   <div className="apointment-detail-card cmn-mb2">
//                     <div className="apoint-dtl-img">
//                       {/* <img src="./images/client-img-5.png" alt="Client" /> */}
//                       <img
//                         src={`${baseUrl}/${completeAppointmentPatientDetail?.patientData?.patient_image}`}
//                         alt="Client"
//                       />
//                     </div>
//                     <div className="appoint-dtl-content">
//                       <div className="appoint-dtl-left">
//                         <div className="appoint-dtl-head">
//                           <h2 className="h4-title">
//                             {
//                               completeAppointmentPatientDetail?.patientData
//                                 ?.patient_name
//                             }
//                           </h2>
//                         </div>
//                         <div className="date h3-title">
//                           {
//                             completeAppointmentPatientDetail?.patientData
//                               ?.dayDate
//                           }
//                         </div>
//                         <div className="time">
//                           {completeAppointmentPatientDetail?.patientData?.time}
//                         </div>
//                       </div>
//                       <Link
//                         to="/patient-profile" state={{patientId:patientId}}
//                         className="cmn-btn"
//                       >
//                         View profile
//                       </Link>
//                     </div>
//                   </div>

//                   <div className="patient-details-wrp">
//                     <form>
//                       <div className="patient-dtl-form">
//                         <div className="patient-basic-info">
//                           <h2>Basic Information</h2>
//                           {/* <div className="row">
//                             {["Full Name", "Enter Your Height", "Enter Your Weight", "Gender", "Enter Age"].map((label, i) => (
//                               <div className="col-lg-12" key={i}>
//                                 <div className="formfield">
//                                   <label>{label}</label>
//                                   <input type="text" placeholder={label.includes("Name") ? "Name" : label.includes("Height") ? "26" : label.includes("Weight") ? "50kg" : label.includes("Gender") ? "Male" : "26"} />
//                                 </div>
//                               </div>
//                             ))}
//                           </div> */}
//                           <div className="row">
//                             <div className="col-lg-12">
//                               <div className="formfield">
//                                 <label>Full Name</label>
//                                 <input
//                                   type="text"
//                                   value={
//                                     completeAppointmentPatientDetail
//                                       ?.basicInformation?.patient_fullname || ""
//                                   }
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-lg-12">
//                               <div className="formfield">
//                                 <label>Enter Your Height</label>
//                                 <input
//                                   type="text"
//                                   value={
//                                     completeAppointmentPatientDetail
//                                       ?.basicInformation?.Patient_height || ""
//                                   }
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-lg-12">
//                               <div className="formfield">
//                                 <label>Enter Your Weight</label>
//                                 <input
//                                   type="text"
//                                   value={
//                                     completeAppointmentPatientDetail
//                                       ?.basicInformation?.Patient_weight || ""
//                                   }
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-lg-12">
//                               <div className="formfield">
//                                 <label>Gender</label>
//                                 <input
//                                   type="text"
//                                   value={
//                                     completeAppointmentPatientDetail
//                                       ?.basicInformation?.Patient_gender || ""
//                                   }
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             <div className="col-lg-12">
//                               <div className="formfield">
//                                 <label>Enter Age</label>
//                                 <input
//                                   type="text"
//                                   value={
//                                     completeAppointmentPatientDetail
//                                       ?.basicInformation?.patient_age || ""
//                                   }
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//                 {/* chat ********/}
//                 <div className="completed-appoint-scrn-right col-lg-6">
//                   <div className="completed-appoint-chat-scrn">
//                     <div className="chat-container">
//                       <div className="chat-footer">
//                         <div className="chat-input">
//                           <input type="text" placeholder="Type a message" />
//                           <div className="chat-file-upld">
//                             <input type="file" />
//                             <span className="attach-btn">
//                               <img src="./images/attach-icon.svg" alt="Icon" />
//                             </span>
//                           </div>
//                         </div>
//                         <button type="submit" className="send-btn">
//                           <img src="./images/send-icon.svg" alt="Icon" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           )}
//           <Footer />
//         </div>
//       </main>
//     </>
//   );
// };

// export default CompletedAppointment;

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../component/doctorPanel/Header";
import Footer from "../component/doctorPanel/Footer";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { completeAppointmentPatientDetails } from "../redux/slices/prescriptionSlice";
import { prescriptionDownload } from "../redux/slices/prescriptionSlice";
import Chat from "../component/doctorPanel/Chat";
import Config from "../config/Constant";
const CompletedAppointment = () => {
  const location = useLocation();
  const { id, patientId, appointmentId, chat_id } = location.state || {};
  console.log("id", id, chat_id, "Chat idddd***************");

  const { user } = useSelector(({ user }) => user);

  console.log(Config.BaseUrl + user?.profile_path, "sdjflsjadkflsfj");

  // chat_id= Appointmentid_doctorid_patient_id

  const dispatch = useDispatch();
  const {
    completeAppointmentPatientDetail,
    prescription_Download,
    loading,
    error,
  } = useSelector((state) => state.prescriptions);

  useEffect(() => {
    if (id) {
      dispatch(completeAppointmentPatientDetails({ prescriptionId: id }));
      console.log("data", completeAppointmentPatientDetail);
    }
  }, [dispatch, id]);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const handleDownloadPrescription = () => {
    console.log("Downloading prescription ID:", id);
    dispatch(prescriptionDownload({ prescriptionId: id })).then((action) => {
      if (prescriptionDownload.fulfilled.match(action)) {
        // Create a blob from the response
        const blob = new Blob([action.payload], { type: "application/pdf" });
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        // Set the filename (you might want to get this from headers or response)
        link.setAttribute("download", `prescription-${id}.pdf`);
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <>
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
            <div className="doc-panel-body appoint-details-pg">
              <div className="completed-appoint-scrn">
                <div className="docpnl-sec-head">
                  <h1 className="h2-title">Prescription Details</h1>
                  <div className="back-btn">
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                      }}
                    >
                      <img src="./images/left-arrow.svg" alt="Back" />
                    </Link>
                  </div>
                </div>

                <div className="chat-header">
                  <a
                    href="./images/file-icon.svg"
                    className="orange-btn"
                    download
                    onClick={handleDownloadPrescription}
                  >
                    Download Prescription
                  </a>
                </div>

                <div className="completed-appoint-scrn-inr row">
                  <div className="completed-appoint-scrn-left col-lg-6">
                    <div className="apointment-detail-card cmn-mb2">
                      <div className="apoint-dtl-img">
                        {/* <img src="./images/client-img-5.png" alt="Client" /> */}
                        <img
                          src={`${baseUrl}/${completeAppointmentPatientDetail?.patientData?.patient_image}`}
                          alt="Client"
                        />
                      </div>
                      <div className="appoint-dtl-content">
                        <div className="appoint-dtl-left">
                          <div className="appoint-dtl-head">
                            <h2 className="h4-title">
                              {
                                completeAppointmentPatientDetail?.patientData
                                  ?.patient_name
                              }
                            </h2>
                          </div>
                          <div className="date h3-title">
                            {
                              completeAppointmentPatientDetail?.patientData
                                ?.dayDate
                            }
                          </div>
                          <div className="time">
                            {
                              completeAppointmentPatientDetail?.patientData
                                ?.time
                            }
                          </div>
                        </div>
                        <Link
                          // to="/completed-appointments-profile"
                          to="/patient-profile"
                          state={{
                            patientId: patientId,
                            source: "completed",
                            hideSchedule: false,
                          }}
                          className="cmn-btn"
                        >
                          View profile
                        </Link>
                      </div>
                    </div>

                    <div className="patient-details-wrp">
                      <form>
                        <div className="patient-dtl-form">
                          <div className="patient-basic-info">
                            <h2>Basic Information</h2>
                            {/* <div className="row">
                            {["Full Name", "Enter Your Height", "Enter Your Weight", "Gender", "Enter Age"].map((label, i) => (
                              <div className="col-lg-12" key={i}>
                                <div className="formfield">
                                  <label>{label}</label>
                                  <input type="text" placeholder={label.includes("Name") ? "Name" : label.includes("Height") ? "26" : label.includes("Weight") ? "50kg" : label.includes("Gender") ? "Male" : "26"} />
                                </div>
                              </div>
                            ))}
                          </div> */}
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="formfield">
                                  <label>Full Name</label>
                                  <input
                                    type="text"
                                    value={
                                      completeAppointmentPatientDetail
                                        ?.basicInformation?.patient_fullname ||
                                      ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="formfield">
                                  <label>Enter Your Height</label>
                                  <input
                                    type="text"
                                    value={
                                      completeAppointmentPatientDetail
                                        ?.basicInformation?.Patient_height || ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="formfield">
                                  <label>Enter Your Weight</label>
                                  <input
                                    type="text"
                                    value={
                                      completeAppointmentPatientDetail
                                        ?.basicInformation?.Patient_weight || ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="formfield">
                                  <label>Gender</label>
                                  <input
                                    type="text"
                                    value={
                                      completeAppointmentPatientDetail?.basicInformation?.Patient_gender.charAt(
                                        0
                                      ).toUpperCase() +
                                        completeAppointmentPatientDetail?.basicInformation?.Patient_gender.slice(
                                          1
                                        ) || ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <div className="formfield">
                                  <label>Enter Age</label>
                                  <input
                                    type="text"
                                    value={
                                      completeAppointmentPatientDetail
                                        ?.basicInformation?.patient_age || ""
                                    }
                                    readOnly
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>

                  <Chat
                    chat_id={chat_id}
                    senderImg={Config.BaseUrl + user?.profile_path}
                    receiverImg={`${baseUrl}/${completeAppointmentPatientDetail?.patientData?.patient_image}`}
                  />
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </main>
    </>
  );
};

export default CompletedAppointment;
