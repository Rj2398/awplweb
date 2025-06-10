
import Header from '../component/doctorPanel/Header';
import Footer from '../component/doctorPanel/Footer';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPatientProfileData } from '../redux/slices/patientProfileSlice';

const PatientProfile = () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  const location = useLocation();
  const { patientId, appointmentId, hideSchedule, source } = location.state || {};
  console.log("patientIdPPPPPP", patientId);
  console.log("sourcePPPPPP", source);
  console.log("appointmentIdPPPPPPP", appointmentId);

  const dispatch = useDispatch();
  const { patientProfileData, loading } = useSelector((state) => state.patientProfile);

  const [showModal, setShowModal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);


  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ "patientId": patientId, "source": source }));
    }
  }, [dispatch, patientId, source]);




  const patientInfo = patientProfileData?.basic_information || {};



  const appointmentInfo = patientProfileData?.appointment_date_time || {};



  const appointmentHistory = patientProfileData?.appointment_history || {};



  const referredPatients = patientProfileData?.referred_patients || {};
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  // const convertTo24Hour = (timeStr) => {
  //   const [time, modifier] = timeStr.split(" ");
  //   let [hours, minutes] = time.split(":");
  
  //   hours = parseInt(hours, 10);
  
  //   if (modifier === "PM" && hours !== 12) {
  //     hours += 12;
  //   }
  //   if (modifier === "AM" && hours === 12) {
  //     hours = 0;
  //   }
  
  //   return `${String(hours).padStart(2, '0')}:${minutes}`;
  // };
  

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
            <div className="doc-panel-body has-texture">

              <div className="start-appointment cmn-mb">
                <div className="docpnl-sec-head text-center">
                  <h1 className="h2-title">Patient Profile</h1>
                  {/* <div className="back-btn"><a href="start-appointment.html"><img src="./images/left-arrow.svg" alt="Icon" /></a></div> */}
                  <div className="back-btn">
                    <Link to="#" onClick={(e) => {
                      e.preventDefault();
                      window.history.back();
                    }}>
                      <img src="./images/left-arrow.svg" alt="Back" />
                    </Link>
                  </div>
                </div>

                <div className="patient-details-wrp">

                  {/* <div className="patient-profile-wrp cmn-mb2"> */}
                  <div
                    className="patient-profile-wrp cmn-mb2"
                    style={
                      !patientProfileData?.basic_information?.is_referred
                        ? { width: '100%', maxWidth: '100%' }
                        : {}
                    }
                  >
                    {/* <div className="patient-profile">
                      <div className="patient-profile-inr"> */}
                    <div className="patient-profile" style={{
                      width: '100%',
                      maxWidth: '100%',
                      // padding: '0',
                      // margin: '0'
                    }}>
                      <div className="patient-profile-inr" style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'flex-start',
                        // padding: '0',
                        // margin: '0'
                      }}>

                        {/* Conditionally show patient profile image only if NOT referred */}
                        {!patientProfileData?.basic_information?.is_referred && (
                          <div className="patient-profile-left">
                            <div className="patient-profile-img-cover">
                              <div className="patient-profile-cover-inr">
                                <div className="patient-profile-img">
                                  <img src={`${baseUrl}/${patientInfo.patient_profile}`} alt="Patinet Profile Image" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {console.log(patientProfileData?.basic_information?.is_referred)}
                        <div className="patient-profile-right" style={{ maxWidth: patientProfileData?.basic_information?.is_referred ? "100%" : undefined }}>
                          <div className="patient-id">
                            <h2>{patientInfo.name}</h2>
                            <p className="dscode">{patientProfileData?.basic_information?.is_referred ? (
                              <>
                                <span style={{ color: 'black' }}>
                                  Referred by
                                </span>
                                <Link
                                  to="/patient-profile"
                                  state={{ patientId: patientProfileData?.basic_information?.referred_id }}
                                  style={{
                                    color: '#199fd9',
                                    textDecoration: 'underline',
                                    marginLeft: 5,
                                    display: 'inline'
                                  }}
                                >
                                  {patientProfileData?.basic_information?.referred_by}
                                </Link>
                              </>
                            ) : (
                              <span>(DS Code:{patientInfo.ds_code})</span>)}</p>
                          </div>
                          <div className="patient-info" style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '16px',
                            padding: '0 16px', // Optional padding
                          }}
                          >
                            <div className="patient-info-card" style={{
                              flex: '0 1 calc(25% - 12px)',
                              minWidth: '150px',
                            }}>
                              <h3>Gender</h3>
                              {/* <p>{patientInfo.gender}</p> */}
                              <p>{patientInfo.gender?.charAt(0).toUpperCase() + patientInfo.gender?.slice(1).toLowerCase()}</p>

                            </div>
                            <div className="patient-info-card" style={{
                              flex: '0 1 calc(25% - 12px)',
                              minWidth: '150px',
                            }}>
                              <h3>Age</h3>
                              <p>{patientInfo.age}</p>
                            </div>
                            <div className="patient-info-card" style={{
                              flex: '0 1 calc(25% - 12px)',
                              minWidth: '150px',
                            }}>
                              <h3>Height</h3>
                              <p>{patientInfo.height}</p>
                            </div>
                            <div className="patient-info-card" style={{
                              flex: '0 1 calc(25% - 12px)',
                              minWidth: '150px',
                            }}>
                              <h3>Weight</h3>
                              <p>{patientInfo.weight}</p>
                            </div>
                          </div>
                          {!patientProfileData?.basic_information?.is_referred && <div className="patient-info">
                            <div className="patient-info-card" >
                              <h3>Phone number</h3>
                              <p>{patientInfo.phone_no}</p>
                              {/* <a href="tel:3195550115">{patientInfo.phone}</a> */}
                            </div>
                            <div className="patient-info-card" >
                              <h3>Email ID</h3>
                              {/* <a href="mailto:patientname@gmail.com">{patientInfo.email}</a> */}
                              <p>{patientInfo.email}</p>
                            </div>
                          </div>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Date & Time - only show if appointment is present */}
                  {patientProfileData?.is_appointment_present && (
                    <div className="patient-basic-info cmn-mb2">
                      <h2>Appointment Date & Time</h2>
                      <div className="appointment-timing">
                        <div className="appointment-date">{appointmentInfo.date}</div>
                        <div className="appointment-time">{appointmentInfo.time}</div>
                        {/* <div className="appointment-time">{convertTo24Hour(appointmentInfo.time)}</div> */}
                      </div>
                    </div>
                  )}




                  {patientProfileData?.is_appointment_present && !patientProfileData?.basic_information?.is_referred && (
                    <div className="patient-detail-form-wrp cmn-mb2">
                      <form>
                        <div className="patient-dtl-form">

                          <div className="health-issues-symptoms cmn-mb2">
                          <h2>Appointment Details</h2>
                            <div className="health-symptoms-inr">

                              <div className="health-symptoms-content">
                                <div className="formfield white-input">
                                  <label>What symptoms are you facing? Please describe your symptoms in brief.</label>
                                  <input
                                    type="text"
                                    placeholder="Answer"
                                    value={patientProfileData?.appointment_details?.answer1 || 'No symptoms reported'}
                                    readOnly
                                  />

                                </div>
                                <div className="formfield white-input">
                                  <label>How long have you been experiencing these symptoms?</label>
                                  <input
                                    type="text"
                                    placeholder="Answer"
                                    value={patientProfileData?.appointment_details?.answer2 || 'No duration specified'}
                                    readOnly
                                  />
                                </div>
                                <div className="formfield white-input">
                                  <label>Any knows Diseases / Health Conditions you are facing?</label>
                                  <input
                                    type="text"
                                    placeholder="Parasitic diseases"
                                    value={patientProfileData?.appointment_details?.answer3 || 'No known diseases'}
                                    readOnly
                                  />
                                </div>
                                <div className="formfield white-input">
                                  <label>Any past medical conditions?</label>
                                  <input
                                    type="text"
                                    placeholder="Answer"
                                    value={patientProfileData?.appointment_details?.answer4 || 'No past conditions reported'}
                                    readOnly
                                  />
                                </div>
                              </div>
                              {/* View Uploaded Images */}
                              {Array.isArray(patientProfileData?.viewUploadedImages) && patientProfileData?.viewUploadedImages?.length > 0 && (
                              <div className="view-uploaded-images-wrp">
                                <h2 className="h5-title">View Uploaded Images</h2>



                                <div className="view-uploaded-img">
                                  {patientProfileData?.viewUploadedImages?.length > 0 ? (
                                    patientProfileData.viewUploadedImages.map((image, index) => (
                                      <div className="img-wrp" key={index}>
                                        <a href="#" onClick={(e) => {
                                          e.preventDefault();
                                          handleImageClick(image);
                                        }}>
                                          <img src={`${baseUrl}/${image.file_path}`} alt={`Symptom ${index + 1}`} />
                                        </a>
                                      </div>
                                    ))
                                  ) : (
                                    <p>No images uploaded</p>
                                  )}
                                </div>

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
                              </div>)}
                            </div>
                          </div>




                        </div>
                      </form>
                    </div>
                  )}



                  <div className="pending-prescriptions cmn-mb2 bg-blue">
                    <h2>Appointment History</h2>
                    <div className="pending-presc-table">
                      <table>
                        <thead>
                          <tr>
                            <th>S.no.</th>
                            <th>Appointment Date</th>
                            <th>Disease</th>
                            <th>View Prescription</th>
                          </tr>
                        </thead>
                        <tbody>

                          {appointmentHistory.length > 0 ? (
                            appointmentHistory.map((appointment, index) => (
                              <tr key={appointment.id || index}>
                                <td>{String(index + 1).padStart(2, '0')}</td>
                                <td>{appointment.appointment_date}</td>
                                <td>{appointment.diagnosis}</td>
                                <td>
                                  <Link to="/completed-appointment-screen" state={{ id: appointment.prescription_id, patientId: patientProfileData?.appointment_details?.patient_id, chat_id: appointment.chat_id }} className="link">View</Link>
                                  {/* <a href={`${baseUrl}/${appointment.prescription_path}`}>View</a> */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="text-center">
                                No Appointment history found
                              </td>
                            </tr>
                          )}


                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Conditionally show contact info only if NOT referred */}
                  {!patientProfileData?.basic_information?.is_referred && (
                    <div className="pending-prescriptions">
                      <h2>Referred Patient list</h2>
                      <div className="pending-presc-table">
                        <table>
                          <thead>
                            <tr>
                              <th>S.no.</th>
                              <th>Patient Name</th>
                              <th>Gender</th>
                              <th>Age</th>
                              <th>Weight (kg)</th>
                              <th>Height</th>
                              <th>View Profile</th>
                            </tr>
                          </thead>
                          <tbody>
                            {referredPatients.length > 0 ? (
                              referredPatients.map((patient, index) => (
                                <tr key={patient.id || index}>
                                  <td>{String(index + 1).padStart(2, '0')}</td>
                                  <td style={{ textAlign: 'left', paddingLeft: '35px', width: '200px' }}><Link to="/patient-profile" state={{ patientid: patientId }} className="no-underline-link" style={{ display: 'inline-block' }}>{patient.name}</Link></td>

                                  {/* <td>{patient.name}</td> */}
                                  {/* <td>{patient.gender}</td> */}
                              <td>{patientInfo.gender?.charAt(0).toUpperCase() + patientInfo.gender?.slice(1).toLowerCase()}</td>

                                  <td>{patient.age}</td>
                                  <td>{patient.weight}</td>
                                  <td>{patient.height}</td>
                                  <td>
                                    <Link to="/patient-profile" state={{ "referrer": patientInfo.name, "referrerDscode": patientInfo.ds_code, "id": patient.id, "patientId": patient.id }}>View Profile</Link>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="7" className="text-center">
                                  No Referred patients found
                                </td>
                              </tr>
                            )}


                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>



                {/* {!patientProfileData?.basic_information?.is_referred && !patientProfileData?.is_appointment_present && ( */}
                {!patientProfileData?.is_appointment_present && !hideSchedule && (
                  <div className="schedule-appoinment-btn">
                    <Link to="/schedule-appointment" state={{ patientId: patientId, appointmentId: appointmentId }} className="orange-btn">
                      Schedule Appointment
                    </Link>
                  </div>
                )}


              </div>

            </div>
          )}


          <Footer />
        </div>
      </main>
    </>
  );
};

export default PatientProfile; 
