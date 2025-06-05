// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import CustomModal from '../component/CustomModal';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { doctorCanceledAppointment, patientAppointmentDetails } from '../redux/slices/myAppointmentSlice';


// const PatientDetails = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id, patientId, referrerDscode, referrer } = location.state || {};

//   const [showModal, setShowModal] = useState(false);
//   const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
//   const [cancelReason, setCancelReason] = useState('');


//   const dispatch = useDispatch();
//   const { patientAppointmentsDetail, doctorcancelledAppointment, patientAppointmentsDetailLoading, doctorcancelledLoading } = useSelector((state) => state.appointments);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL

//   useEffect(() => {
//     if (id) {
//       dispatch(patientAppointmentDetails({ "appointmentId": id }));
//     }
//   }, [dispatch, id]);

//   console.log("patientAppointmentsDetail", patientAppointmentsDetail);
//   console.log("id", id);
//   // console.log(patientAppointmentsDetail?.patientData?.time);


//   const handleCancelClick = (id) => {
//     // console.log({"appointment_id":id, "cancel_message":cancelReason});
//     // dispatch(doctorCanceledAppointment({"appointment_id":id, "cancel_message":cancelReason}))
//     setSelectedAppointmentId(id);
//     setShowModal(true);
//   };

//   const handleCancelConfirm = () => {
//     setShowModal(false);
//     setShowCancelReasonModal(true);
//   };

//   const handleCancelReasonSubmit = () => {
//     // API call 
//     console.log("Cancelled appointment ID:", selectedAppointmentId);
//     console.log("Reason:", cancelReason);
//     dispatch(doctorCanceledAppointment({
//       appointment_id: selectedAppointmentId,
//       cancel_message: cancelReason
//     }))
//       .then(() => {
//         // Refresh the upcoming appointments list after successful cancellation
//         // dispatch(getAllUpcomingAppointment());
//         setShowCancelReasonModal(false);
//         setCancelReason('');
//         setSelectedAppointmentId(null);
//         setShowSuccessModal(true);
//       })

//   };

//   return (
//     <>
//       <main className="doctor-panel">
//         <div className="container-fluid">
//           <div className="doc-panel-inr">
//             <Header />
//           </div>

//           <div className="doc-panel-body appoint-details-pg has-texture">
//             <div className="texture only-img">
//               <img src="/images/doctor-symbol.png" alt="Image" />
//             </div>
//             <div className="appointments">
//               <div className="start-appointment cmn-mb">
//                 <div className="docpnl-sec-head">
//                   <h1 className="h2-title">Appointment Details</h1>
//                   <div className="back-btn">
//                     <Link to="#" onClick={(e) => {
//                       e.preventDefault();
//                       window.history.back();
//                     }}>
//                       <img src="./images/left-arrow.svg" alt="Back" />
//                     </Link>
//                   </div>
//                 </div>

//                 {patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="refered-by-cd">
//                   <p>Referred by {referrer} ({referrerDscode})</p>
//                 </div>)}


//                 <div className="apointment-detail-card">
//                   {!patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="apoint-dtl-img">
//                     {/* <img src="/images/client-img-5.png" alt="Client" />  */}
//                     <img src={`${baseUrl}/${patientAppointmentsDetail?.patientData?.patient_profile}`} alt="Client" />
//                     {/* // isma miage backend se aegi. appointment details API. */}
//                   </div>)}
//                   <div className={`appoint-dtl-content ${patientAppointmentsDetail?.patientData?.is_referred_patient ? 'w-100 p-0' : ''}`}>
//                     <div className="appoint-dtl-left">
//                       <div className="appoint-dtl-head">
//                         {/* <h2 className="h3-title">Patient’s name</h2> */}
//                         <h2 className="h3-title">{patientAppointmentsDetail?.patientData?.patient_name}</h2>
//                       </div>
//                       <div className="appoint-btm">
//                         <p><img src="/images/clock-icon.svg" alt="Icon" />{patientAppointmentsDetail?.patientData?.dayDate}</p>
//                         <p className="appoint-time">{patientAppointmentsDetail?.patientData?.time}</p>
//                       </div>
//                     </div>
//                     <Link to="/patient-profile" state={{ patientId: patientId }} className="cmn-btn">View profile</Link>
//                   </div>
//                 </div>
//               </div>

//               <div className="patient-details-wrp">
//                 <form>
//                   <div className="patient-dtl-form">
//                     <div className="patient-basic-info cmn-mb2">
//                       <h2>Basic Information</h2>
//                       <div className="row">
//                         <div className="col-lg-4 col-md-4 col-sm-6">
//                           <div className="formfield">
//                             <label>Full Name</label>
//                             <input type="text" placeholder="Name" value={patientAppointmentsDetail?.basicInformation?.name} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-4 col-md-4 col-sm-6">
//                           <div className="formfield">
//                             <label>Enter Your Height</label>
//                             <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.height} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-4 col-md-4 col-sm-6">
//                           <div className="formfield">
//                             <label>Enter Your Weight</label>
//                             <input type="text" placeholder="50kg" value={patientAppointmentsDetail?.basicInformation?.weight} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-4 col-md-4 col-sm-6">
//                           <div className="formfield">
//                             <label>Gender</label>
//                             <input type="text" placeholder="Male" value={patientAppointmentsDetail?.basicInformation?.gender} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-4 col-md-4 col-sm-6">
//                           <div className="formfield">
//                             <label>Enter Age</label>
//                             <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.age} readOnly />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* <div className="health-issues-symptoms cmn-mb2">
//                       <h2>Health Issues & Symptoms</h2>
//                       <div className="data-not-found">
//                         <img src="/images/not-found.svg" alt="Icon" />
//                         Data not found
//                       </div>
//                     </div> */}

//                     {/* <div className="scheduled-call-consultations cmn-mb2">
//                       <h2>Scheduled Call Consultations</h2>
//                       {[1, 2, 3, 4].map((num) => (
//                         <div className="col-lg-12" key={num}>
//                           <div className="formfield">
//                             <label>{num}. Lorem ipsum dolor sit amet, consectetur</label>
//                             <input type="text" placeholder="Answer" />
//                           </div>
//                         </div>
//                       ))}
//                     </div> */}
//                     <div className="scheduled-call-consultations cmn-mb2">
//                       <h2>Scheduled Call Consultations</h2>
//                       <div className="row">
//                         <div className="col-lg-12">
//                           <div className="formfield">
//                             <label>1. Lorem ipsum dolor sit amet, consectetur</label>
//                             <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer1} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-12">
//                           <div className="formfield">
//                             <label>2. Lorem ipsum dolor sit amet, consectetur</label>
//                             <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer2} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-12">
//                           <div className="formfield">
//                             <label>3. Lorem ipsum dolor sit amet, consectetur</label>
//                             <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer3} readOnly />
//                           </div>
//                         </div>
//                         <div className="col-lg-12">
//                           <div className="formfield">
//                             <label>3. Lorem ipsum dolor sit amet, consectetur</label>
//                             <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer4} readOnly />
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* <div className="view-uploaded-images-wrp">
//                       <h2>View Uploaded Images</h2>
//                       <div className="view-uploaded-img">
//                         {[1, 2, 3].map((i) => (
//                           <div className="img-wrp" key={i}>
//                             <a href="/images/symptom-img.png" data-fancybox="symptoms">
//                               <img src="/images/symptom-img.png" alt="Symptoms" />
//                             </a>
//                           </div>
//                         ))}
//                       </div>
//                     </div> */}

//                     {/* Uploaded Images */}
//                     {Array.isArray(patientAppointmentsDetail?.symptomFiles) && patientAppointmentsDetail?.symptomFiles.length > 0 && (
//                       <div className="view-uploaded-images-wrp">
//                         <h2>View Uploaded Images</h2>
//                         <div className="view-uploaded-img">
//                           {patientAppointmentsDetail?.symptomFiles
//                             .filter(file => file.file_type.toLowerCase().match(/jpg|jpeg|png|gif/))
//                             .map((file, index) => (
//                               <div className="img-wrp" key={index}>
//                                 <a href={`${baseUrl}/${file.file_path}`} data-fancybox="symptoms">
//                                   <img src={`${baseUrl}/${file.file_path}`} alt={`Symptom Image ${index + 1}`} />
//                                 </a>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
//                     )}


//                     <div className="btn-wrp">
//                       {/* <a href="#url" className="orange-btn">Cancel</a> */}
//                       <button type="button" className="orange-btn" onClick={() => handleCancelClick(id)}>
//                         Cancel
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>

//           <Footer />
//         </div>

//         {/* First Confirmation Modal */}
//         <CustomModal
//           visible={showModal}
//           title="Cancel Appointment"
//           subtitle="Are you sure you want to cancel the appointment?"
//           onConfirm={handleCancelConfirm}
//           onCancel={() => setShowModal(false)}
//           actionType="cancel"
//         />

//         {/* Second Modal for Reason */}
//         <CustomModal
//           visible={showCancelReasonModal}
//           title="Cancel Appointment"
//           subtitle="Reason for cancellation"
//           inputField={true}
//           inputValue={cancelReason}
//           onInputChange={(value) => setCancelReason(value)}
//           onCancel={() => {
//             setShowCancelReasonModal(false);
//             setCancelReason('');
//           }}
//           onConfirm={handleCancelReasonSubmit}
//           actionType="info"
//         />

//         {/* Success Modal */}
//         <CustomModal visible={showSuccessModal}
//           title="Appointment Cancelled"
//           subtitle="Your appointment is cancelled successfully."
//           onConfirm={() => {
//             setShowSuccessModal(false);
//             navigate('/doctor-home');
//           }}
//           onCancel={() => setShowSuccessModal(false)}
//           actionType="success"
//         />
//       </main>



//       {/* Logout Modal */}
//       {/* <div
//         className="modal fade popup-wrp small-pop dash-pop"
//         id="logOut"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="logoutModal"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content">
//             <div className="modal-icon">
//               <img src="/images/logout-icon.svg" alt="Icon" />
//             </div>
//             <div className="modal-header">
//               <h2>Logout</h2>
//               <p>Are you sure you want to logout?</p>
//             </div>
//             <div className="modal-footer btn-wrp">
//               <button type="button" className="cmn-btn" data-bs-dismiss="modal">Cancel</button>
//               <Link to="/login" className="cmn-btn orange-btn">Logout</Link>
//             </div>
//           </div>
//         </div>
//       </div> */}
//     </>
//   );
// };

// export default PatientDetails;







import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../component/doctorPanel/Header';
import Footer from '../component/doctorPanel/Footer';
import CustomModal from '../component/CustomModal';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { doctorCanceledAppointment, patientAppointmentDetails } from '../redux/slices/myAppointmentSlice';

const PatientDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, patientId, referrerDscode, referrer } = location.state || {};
  console.log(referrerDscode,"reffer");
 

  const [showModal, setShowModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const dispatch = useDispatch();
  const { patientAppointmentsDetail, doctorcancelledAppointment, patientAppointmentsDetailLoading, doctorcancelledLoading, } = useSelector((state) => state.appointments);
  const baseUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (id) {
      dispatch(patientAppointmentDetails({ "appointmentId": id }));
    }
  }, [dispatch, id]);

  console.log("patientAppointmentsDetail", patientAppointmentsDetail);
  console.log("id", id);

  const handleCancelClick = (id) => {
    setSelectedAppointmentId(id);
    setShowModal(true);
  };

  const handleCancelConfirm = () => {
    setShowModal(false);
    setShowCancelReasonModal(true);
  };

  const handleCancelReasonSubmit = () => {
    dispatch(doctorCanceledAppointment({
      appointment_id: selectedAppointmentId,
      cancel_message: cancelReason
    }))
      .then(() => {
        setShowCancelReasonModal(false);
        setCancelReason('');
        setSelectedAppointmentId(null);
        setShowSuccessModal(true);
      })
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  return (
    <>
      <main className="doctor-panel">
        <div className="container-fluid">
          <div className="doc-panel-inr">
            <Header />
          </div>
          {patientAppointmentsDetailLoading ? (
            <div className="loader-main">
              <span className="loader"></span>
            </div>
          ) : (
            <div className="doc-panel-body appoint-details-pg has-texture">
              <div className="texture only-img">
                <img src="/images/doctor-symbol.png" alt="Image" />
              </div>
              <div className="appointments">
                <div className="start-appointment cmn-mb">
                  <div className="docpnl-sec-head">
                    <h1 className="h2-title">Appointment Details</h1>
                    <div className="back-btn">
                      <Link to="#" onClick={(e) => {
                        e.preventDefault();
                        window.history.back();
                      }}>
                        <img src="./images/left-arrow.svg" alt="Back" />
                      </Link>
                    </div>
                  </div>

                  {patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="refered-by-cd">
                    <p>Referred by {referrer} ({referrerDscode})</p>
                  </div>)}

                  <div className="apointment-detail-card">
                    {!patientAppointmentsDetail?.patientData?.is_referred_patient && (<div className="apoint-dtl-img">
                      <img src={`${baseUrl}/${patientAppointmentsDetail?.patientData?.patient_profile}`} alt="Client" />
                    </div>)}
                    <div className={`appoint-dtl-content ${patientAppointmentsDetail?.patientData?.is_referred_patient ? 'w-100 p-0' : ''}`}>
                      <div className="appoint-dtl-left">
                        <div className="appoint-dtl-head">
                          <h2 className="h3-title">{patientAppointmentsDetail?.patientData?.patient_name}</h2>
                        </div>
                        <div className="appoint-btm">
                          <p><img src="/images/clock-icon.svg" alt="Icon" />{patientAppointmentsDetail?.patientData?.dayDate}</p>
                          <p className="appoint-time">{patientAppointmentsDetail?.patientData?.time}</p>
                        </div>
                      </div>
                      <Link to="/patient-profile" state={{ patientId: patientId , hideSchedule: true}} className="cmn-btn">View profile</Link>
                    </div>
                  </div>
                </div>

                <div className="patient-details-wrp">
                  <form>
                    <div className="patient-dtl-form">
                      <div className="patient-basic-info cmn-mb2">
                        <h2>Basic Information</h2>
                        <div className="row">
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Full Name</label>
                              <input type="text" placeholder="Name" value={patientAppointmentsDetail?.basicInformation?.name} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Enter Your Height</label>
                              <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.height} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Enter Your Weight</label>
                              <input type="text" placeholder="50kg" value={patientAppointmentsDetail?.basicInformation?.weight} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Gender</label>
                              <input type="text" placeholder="Male" value={patientAppointmentsDetail?.basicInformation?.gender} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="formfield">
                              <label>Enter Age</label>
                              <input type="text" placeholder="26" value={patientAppointmentsDetail?.basicInformation?.age} readOnly />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="scheduled-call-consultations cmn-mb2">
                        <h2>Scheduled Call Consultations</h2>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>1. How long are you suffering from this disease?</label>
                              <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer1} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>2. Any other problem which you would like to share related to your problem?</label>
                              <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer2} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>3. Do you have any history of this disease?</label>
                              <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer3} readOnly />
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="formfield">
                              <label>4. Are you taking any medicines? If yes, please share the name of medicine and since how long you are taking this medicine?</label>
                              <input type="text" placeholder="Answer" value={patientAppointmentsDetail?.symptomAnswers?.answer4} readOnly />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Uploaded Images */}
                      {Array.isArray(patientAppointmentsDetail?.symptomFiles) && patientAppointmentsDetail?.symptomFiles.length > 0 && (
                        <div className="view-uploaded-images-wrp">
                          <h2>View Uploaded Images</h2>
                          <div className="view-uploaded-img">
                            {patientAppointmentsDetail?.symptomFiles
                              .filter(file => file.file_type.toLowerCase().match(/jpg|jpeg|png|gif/))
                              .map((file, index) => (
                                <div className="img-wrp" key={index}>
                                  <a href="#" onClick={(e) => {
                                    e.preventDefault();
                                    handleImageClick(file);
                                  }}>
                                    <img src={`${baseUrl}/${file.file_path}`} alt={`Symptom Image ${index + 1}`} />
                                  </a>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <div className="btn-wrp">
                        <button type="button" className="orange-btn" onClick={() => handleCancelClick(id)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>

        {/* First Confirmation Modal */}
        <CustomModal
          visible={showModal}
          title="Cancel Appointment"
          subtitle="Are you sure you want to cancel the appointment?"
          onConfirm={handleCancelConfirm}
          onCancel={() => setShowModal(false)}
          actionType="cancel"
        />

        {/* Second Modal for Reason */}
        <CustomModal
          visible={showCancelReasonModal}
          title="Cancel Appointment"
          subtitle="Reason for cancellation"
          inputField={true}
          inputValue={cancelReason}
          onInputChange={(value) => setCancelReason(value)}
          onCancel={() => {
            setShowCancelReasonModal(false);
            setCancelReason('');
          }}
          onConfirm={handleCancelReasonSubmit}
          actionType="info"
        />

        {/* Success Modal */}
        <CustomModal
          visible={showSuccessModal}
          title="Appointment Cancelled"
          subtitle="Your appointment is cancelled successfully."
          onConfirm={() => {
            setShowSuccessModal(false);
            navigate('/doctor-home');
          }}
          onCancel={() => setShowSuccessModal(false)}
          actionType="success"
        />

        {/* Image Modal */}
        {/* Image Modal */}
        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1050,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
          }}>
            {/* Close button - fixed at top right corner of screen */}
            <button
              onClick={() => setShowImageModal(false)}
              style={{
                position: 'fixed',
                right: '30px',
                top: '30px',
                zIndex: 1060,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              aria-label="Close"
            >
              <img
                src="/images/cross-blue.png"
                alt="Close"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </button>

            {/* Image container - centered both horizontally and vertically */}
            <div style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={`${baseUrl}/${selectedImage.file_path}`}
                alt="Enlarged view"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default PatientDetails;