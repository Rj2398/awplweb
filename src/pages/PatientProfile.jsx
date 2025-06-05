
// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import { Link } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { getPatientProfileData } from '../redux/slices/patientProfileSlice';

// const PatientProfile = () => {
//   const location = useLocation();
//   const { patientId } = location.state || {};
//   console.log("patientId", patientId);

//   const dispatch = useDispatch();
//   const { patientProfileData, loading } = useSelector((state) => state.patientProfile);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL

//   useEffect(() => {
//     if (patientId) {
//       dispatch(getPatientProfileData({ "patientId": patientId }));
//     }
//   }, [dispatch, patientId]);


//   // const [patientInfo] = useState({
//   //   name: 'Patient Name',
//   //   dsCode: 'xxxx',
//   //   gender: 'Female',
//   //   age: 25,
//   //   height: '160cm',
//   //   weight: '55kg',
//   //   phone: '(319) 555-0115',
//   //   email: 'patientname@gmail.com',
//   // });

//   const patientInfo = patientProfileData?.basic_information || {};

//   // const [symptoms, setSymptoms] = useState('');
//   // const [duration, setDuration] = useState('');
//   // const [diseases, setDiseases] = useState('');
//   // const [pastConditions, setPastConditions] = useState('');

//   // const [appointmentInfo] = useState({
//   //   date: 'Thu May 14',
//   //   time: '10:00 - 10:15 AM',
//   // });

//   const appointmentInfo = patientProfileData?.appointment_date_time || {};

//   // const [appointmentHistory] = useState([
//   //   { id: 1, date: '22-Dec-2024', diagnosis: 'Malaria' },
//   //   { id: 2, date: '18-Sept-2024', diagnosis: 'Viral Fever' },
//   //   { id: 3, date: '10-Aug-2024', diagnosis: 'Covid' },
//   // ]);

//   const appointmentHistory = patientProfileData?.appointment_history || {};

//   // const [referredPatients] = useState([
//   //   { id: 1, name: 'Patient Name', gender: 'Male', age: 28, weight: '55kg', height: 26 },
//   //   { id: 2, name: 'Patient Name', gender: 'Female', age: 26, weight: '63kg', height: 55 },
//   //   { id: 3, name: 'Patient Name', gender: 'Female', age: 33, weight: '80kg', height: 43 },
//   // ]);

//   const referredPatients = patientProfileData?.referred_patients || {};

//   return (
//     <>
//       <main className="doctor-panel">
//         <div className="container-fluid">
//           <div className="doc-panel-inr">
//             <Header />
//           </div>
//           <div className="doc-panel-body has-texture">

//             <div className="start-appointment cmn-mb">
//               <div className="docpnl-sec-head text-center">
//                 <h1 className="h2-title">Patient Profile</h1>
//                 {/* <div className="back-btn"><a href="start-appointment.html"><img src="./images/left-arrow.svg" alt="Icon" /></a></div> */}
//                 <div className="back-btn">
//                   <Link to="#" onClick={(e) => {
//                     e.preventDefault();
//                     window.history.back();
//                   }}>
//                     <img src="./images/left-arrow.svg" alt="Back" />
//                   </Link>
//                 </div>
//               </div>

//               <div className="patient-details-wrp">

//                 <div className="patient-profile-wrp cmn-mb2">
//                   <div className="patient-profile">
//                     <div className="patient-profile-inr">
//                       {/* Conditionally show patient profile image only if NOT referred */}
//                       {!patientProfileData?.basic_information?.is_referred && (
//                         <div className="patient-profile-left">
//                         <div className="patient-profile-img-cover">
//                           <div className="patient-profile-cover-inr">
//                             <div className="patient-profile-img">
//                               <img src="./images/patient-profile-img.png" alt="Patinet Profile Image" />
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       )}

//                       <div className="patient-profile-right">
//                         <div className="patient-id">
//                           <h2>{patientInfo.name}</h2>
//                           <p className="dscode">(DS Code:{patientInfo.ds_code})</p>
//                         </div>
//                         <div className="patient-info">
//                           <div className="patient-info-card">
//                             <h3>Gender</h3>
//                             <p>{patientInfo.gender}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Age</h3>
//                             <p>{patientInfo.age}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Height</h3>
//                             <p>{patientInfo.height}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Weight</h3>
//                             <p>{patientInfo.weight}</p>
//                           </div>
//                         </div>
//                         <div className="patient-info">
//                           <div className="patient-info-card">
//                             <h3>Phone number</h3>
//                             {/* <a href="tel:3195550115">{patientInfo.phone}</a> */}
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Email ID</h3>
//                             {/* <a href="mailto:patientname@gmail.com">{patientInfo.email}</a> */}
//                             <p>{patientInfo.email}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//   {/* Appointment Date & Time - only show if appointment is present */}
//   {patientProfileData?.is_appointment_present && (
//       <div className="patient-basic-info cmn-mb2">
//       <h2>Appointment Date & Time</h2>
//       <div className="appointment-timing">
//         <div className="appointment-date">{appointmentInfo.date}</div>
//         <div className="appointment-time">{appointmentInfo.time}</div>
//       </div>
//     </div>
//   )}


// {/* Appointment Details - only show if appointment is present */}

// {patientProfileData?.is_appointment_present && (
//   <div className="patient-detail-form-wrp cmn-mb2">
//   <form>
//     <div className="patient-dtl-form">

//       <div className="health-issues-symptoms cmn-mb2">
//         <h2>Appointment Details</h2>
//         <div className="health-symptoms-inr">

//           <div className="health-symptoms-content">
//             <div className="formfield white-input">
//               <label>What symptoms are you facing? Please describe your symptoms in brief.</label>
//               <input
//                 type="text"
//                 placeholder="Answer"
//                 value={patientProfileData?.appointment_details?.answer1 || 'No symptoms reported'}
//                 readOnly
//               />
//               {/* <div className="read-only-field">
//                 {patientProfileData?.appointment_details?.answer1 || 'No duration specified'}
//               </div> */}
//             </div>
//             <div className="formfield white-input">
//               <label>How long have you been experiencing these symptoms?</label>
//               <input
//                 type="text"
//                 placeholder="Answer"
//                 value={patientProfileData?.appointment_details?.answer2 || 'No duration specified'}
//                 readOnly
//               />
//             </div>
//             <div className="formfield white-input">
//               <label>Any knows Diseases / Health Conditions you are facing?</label>
//               <input
//                 type="text"
//                 placeholder="Parasitic diseases"
//                 value={patientProfileData?.appointment_details?.answer3 || 'No known diseases'}
//                 readOnly
//               />
//             </div>
//             <div className="formfield white-input">
//               <label>Any past medical conditions?</label>
//               <input
//                 type="text"
//                 placeholder="Answer"
//                 value={patientProfileData?.appointment_details?.answer4 || 'No past conditions reported'}
//                 readOnly
//               />
//             </div>
//           </div>
//           {/* View Uploaded Images */}
//           <div className="view-uploaded-images-wrp">
//             <h2 className="h5-title">View Uploaded Images</h2>
//             <div className="view-uploaded-img">
//               {/* <div className="img-wrp">
//                 <a href="./images/symptom-img.png" data-fancybox="symptoms">
//                   <img src="./images/symptom-img.png" alt="Symptoms Image" />
//                 </a>
//               </div>
//               <div className="img-wrp">
//                 <a href="./images/symptom-img.png" data-fancybox="symptoms">
//                   <img src="./images/symptom-img.png" alt="Symptoms Image" />
//                 </a>
//               </div>
//               <div className="img-wrp">
//                 <a href="./images/symptom-img.png" data-fancybox="symptoms">
//                   <img src="./images/symptom-img.png" alt="Symptoms Image" />
//                 </a>
//               </div> */}

//               {patientProfileData?.viewUploadedImages?.length > 0 ? (
//                 patientProfileData.viewUploadedImages.map((image, index) => (
//                   <div className="img-wrp" key={index}>
//                     <a href={`${baseUrl}/${image.file_path}`} data-fancybox="symptoms">
//                       <img src={`${baseUrl}/${image.file_path}`} alt={`Symptom ${index + 1}`} />
//                     </a>
//                   </div>
//                 )
//               )) : (
//                 <p>No images uploaded</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* <div className="health-issues-symptoms">
//         <h2>Health Issues & Symptoms</h2>
//         <div className="data-not-found">
//           <img src="./images/not-found.svg" alt="Icon" />
//           Data not found
//         </div>
//       </div> */}

//       {/* currently health-issues-symptoms show nhi hoga acc. vasu sir and pranab sir */}


//     </div>
//   </form>
// </div>
// )}



//                 <div className="pending-prescriptions cmn-mb2 bg-blue">
//                   <h2>Appointment History</h2>
//                   <div className="pending-presc-table">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>S.no.</th>
//                           <th>Appointment Date</th>
//                           <th>Diagnosis</th>
//                           <th>View Prescription</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {/* <tr>
//                           <td>1</td>
//                           <td>22-Dec-2024</td>
//                           <td>Malaria</td>
//                           <td><Link to="/completed-appointment-screen">View</Link></td>
//                         </tr>
//                         <tr>
//                           <td>2</td>
//                           <td>18-Sept-2024</td>
//                           <td>Viral Fever</td>
//                           <td><Link to="/completed-appointment-screen">View</Link></td>
//                         </tr>
//                         <tr>
//                           <td>3</td>
//                           <td>10-Aug-2024</td>
//                           <td>Covid</td>
//                           <td><Link to="/completed-appointment-screen">View</Link></td>
//                         </tr> */}
//                         {appointmentHistory.length > 0 ? (
//                           appointmentHistory.map((appointment, index) => (
//                             <tr key={appointment.id || index}>
//                               <td>{index + 1}</td>
//                               <td>{appointment.appointment_date}</td>
//                               <td>{appointment.diagnosis}</td>
//                               <td>
//                                 {/* <Link to="">View</Link> */}
//                                 <a href={`${baseUrl}/${appointment.prescription_path}`}>View</a>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="4" className="text-center">
//                               No Appointment history found
//                             </td>
//                           </tr>
//                         )}


//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Conditionally show contact info only if NOT referred */}
//                 {!patientProfileData?.basic_information?.is_referred && (
//                   <div className="pending-prescriptions">
//                   <h2>Referred Patient list</h2>
//                   <div className="pending-presc-table">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>S.no.</th>
//                           <th>Patient Name</th>
//                           <th>Gender</th>
//                           <th>Age</th>
//                           <th>Weight (kg)</th>
//                           <th>Height</th>
//                           <th>View Details</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {/* <tr>
//                           <td>1</td>
//                           <td>Patient Name</td>
//                           <td>Male</td>
//                           <td>28</td>
//                           <td>55kg</td>
//                           <td>26</td>
//                           <td><Link to="/referred-patient-full-details">View Details</Link></td>
//                         </tr>
//                         <tr>
//                           <td>2</td>
//                           <td>Patient Name</td>
//                           <td>Female</td>
//                           <td>26</td>
//                           <td>63kg</td>
//                           <td>55</td>
//                           <td><Link to="/referred-patient-full-details">View Details</Link></td>
//                         </tr>
//                         <tr>
//                           <td>3</td>
//                           <td>Patient Name</td>
//                           <td>Female</td>
//                           <td>33</td>
//                           <td>80kg</td>
//                           <td>43</td>
//                           <td><Link to="/referred-patient-full-details">View Details</Link></td>
//                         </tr> */}

//                         {referredPatients.length > 0 ? (
//                           referredPatients.map((patient, index) => (
//                             <tr key={patient.id || index}>
//                               <td>{index + 1}</td>
//                               <td>{patient.name}</td>
//                               <td>{patient.gender}</td>
//                               <td>{patient.age}</td>
//                               <td>{patient.weight}</td>
//                               <td>{patient.height}</td>
//                               <td>
//                                 <Link to="/patient-details" state={{"id":patient.id, "patientId": patient.id }}>View Details</Link>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="7" className="text-center">
//                               No Referred patients found
//                             </td>
//                           </tr>
//                         )}


//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//                 )}

//               </div>



//               {!patientProfileData?.basic_information?.is_referred && !patientProfileData?.is_appointment_present && (
//                 <div className="schedule-appoinment-btn">
//                 <Link to="/schedule-appointment" className="orange-btn">
//                   Schedule Appointment
//                 </Link>
//               </div>
//               )}


//             </div>

//           </div>

//           <Footer />
//         </div>
//       </main>
//     </>
//   );
// };

// export default PatientProfile;








// import Header from '../component/doctorPanel/Header';
// import Footer from '../component/doctorPanel/Footer';
// import { Link } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { getPatientProfileData } from '../redux/slices/patientProfileSlice';

// const PatientProfile = () => {
//   const baseUrl = import.meta.env.VITE_BACKEND_URL
//   const location = useLocation();
//   const { patientId } = location.state || {};
//   console.log("patientId", patientId);

//   const dispatch = useDispatch();
//   const { patientProfileData, loading } = useSelector((state) => state.patientProfile);

//   useEffect(() => {
//     if (patientId) {
//       dispatch(getPatientProfileData({ "patientId": patientId }));
//     }
//   }, [dispatch, patientId]);




//   const patientInfo = patientProfileData?.basic_information || {};



//   const appointmentInfo = patientProfileData?.appointment_date_time || {};



//   const appointmentHistory = patientProfileData?.appointment_history || {};



//   const referredPatients = patientProfileData?.referred_patients || {};

//   return (
//     <>
//       <main className="doctor-panel">
//         <div className="container-fluid">
//           <div className="doc-panel-inr">
//             <Header />
//           </div>
//           <div className="doc-panel-body has-texture">

//             <div className="start-appointment cmn-mb">
//               <div className="docpnl-sec-head text-center">
//                 <h1 className="h2-title">Patient Profile</h1>
//                 {/* <div className="back-btn"><a href="start-appointment.html"><img src="./images/left-arrow.svg" alt="Icon" /></a></div> */}
//                 <div className="back-btn">
//                   <Link to="#" onClick={(e) => {
//                     e.preventDefault();
//                     window.history.back();
//                   }}>
//                     <img src="./images/left-arrow.svg" alt="Back" />
//                   </Link>
//                 </div>
//               </div>

//               <div className="patient-details-wrp">

//                 <div className="patient-profile-wrp cmn-mb2">
//                   <div className="patient-profile">
//                     <div className="patient-profile-inr">
//                       {/* Conditionally show patient profile image only if NOT referred */}
//                       {!patientProfileData?.basic_information?.is_referred && (
//                         <div className="patient-profile-left">
//                           <div className="patient-profile-img-cover">
//                             <div className="patient-profile-cover-inr">
//                               <div className="patient-profile-img">
//                                 <img src={`${baseUrl}/${patientInfo.patient_profile}`} alt="Patinet Profile Image" />
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                       {console.log(patientProfileData?.basic_information?.is_referred)}
//                       <div className="patient-profile-right" style={{ maxWidth: patientProfileData?.basic_information?.is_referred ? "100%" : undefined }}>
//                         <div className="patient-id">
//                           <h2>{patientInfo.name}</h2>
//                           <p className="dscode">{patientProfileData?.basic_information?.is_referred ? (
//                             <>
//                               <span style={{ color: 'black' }}>
//                                 Referred by
//                               </span>
//                               <span style={{ color: '#199fd9', textDecoration: 'underline', marginLeft: 5 }}>
//                                 {patientProfileData?.basic_information?.referred_by}

//                               </span>
//                             </>
//                           ) : (
//                             <span>DS Code:${patientInfo.ds_code}</span>)}</p>
//                         </div>
//                         <div className="patient-info">
//                           <div className="patient-info-card">
//                             <h3>Gender</h3>
//                             <p>{patientInfo.gender}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Age</h3>
//                             <p>{patientInfo.age}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Height</h3>
//                             <p>{patientInfo.height}</p>
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Weight</h3>
//                             <p>{patientInfo.weight}</p>
//                           </div>
//                         </div>
//                         {!patientProfileData?.basic_information?.is_referred && <div className="patient-info">
//                           <div className="patient-info-card">
//                             <h3>Phone number</h3>
//                             <p>{patientInfo.phone_no}</p>
//                             {/* <a href="tel:3195550115">{patientInfo.phone}</a> */}
//                           </div>
//                           <div className="patient-info-card">
//                             <h3>Email ID</h3>
//                             {/* <a href="mailto:patientname@gmail.com">{patientInfo.email}</a> */}
//                             <p>{patientInfo.email}</p>
//                           </div>
//                         </div>}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Appointment Date & Time - only show if appointment is present */}
//                 {patientProfileData?.is_appointment_present && (
//                   <div className="patient-basic-info cmn-mb2">
//                     <h2>Appointment Date & Time</h2>
//                     <div className="appointment-timing">
//                       <div className="appointment-date">{appointmentInfo.date}</div>
//                       <div className="appointment-time">{appointmentInfo.time}</div>
//                     </div>
//                   </div>
//                 )}




//                 {patientProfileData?.is_appointment_present && (
//                   <div className="patient-detail-form-wrp cmn-mb2">
//                     <form>
//                       <div className="patient-dtl-form">

//                         <div className="health-issues-symptoms cmn-mb2">
//                           <h2>Appointment Details</h2>
//                           <div className="health-symptoms-inr">

//                             <div className="health-symptoms-content">
//                               <div className="formfield white-input">
//                                 <label>What symptoms are you facing? Please describe your symptoms in brief.</label>
//                                 <input
//                                   type="text"
//                                   placeholder="Answer"
//                                   value={patientProfileData?.appointment_details?.answer1 || 'No symptoms reported'}
//                                   readOnly
//                                 />

//                               </div>
//                               <div className="formfield white-input">
//                                 <label>How long have you been experiencing these symptoms?</label>
//                                 <input
//                                   type="text"
//                                   placeholder="Answer"
//                                   value={patientProfileData?.appointment_details?.answer2 || 'No duration specified'}
//                                   readOnly
//                                 />
//                               </div>
//                               <div className="formfield white-input">
//                                 <label>Any knows Diseases / Health Conditions you are facing?</label>
//                                 <input
//                                   type="text"
//                                   placeholder="Parasitic diseases"
//                                   value={patientProfileData?.appointment_details?.answer3 || 'No known diseases'}
//                                   readOnly
//                                 />
//                               </div>
//                               <div className="formfield white-input">
//                                 <label>Any past medical conditions?</label>
//                                 <input
//                                   type="text"
//                                   placeholder="Answer"
//                                   value={patientProfileData?.appointment_details?.answer4 || 'No past conditions reported'}
//                                   readOnly
//                                 />
//                               </div>
//                             </div>
//                             {/* View Uploaded Images */}
//                             <div className="view-uploaded-images-wrp">
//                               <h2 className="h5-title">View Uploaded Images</h2>
//                               <div className="view-uploaded-img">


//                                 {patientProfileData?.viewUploadedImages?.length > 0 ? (
//                                   patientProfileData.viewUploadedImages.map((image, index) => (
//                                     <div className="img-wrp" key={index}>
//                                       <a href={`${baseUrl}/${image.file_path}`} data-fancybox="symptoms">
//                                         <img src={`${baseUrl}/${image.file_path}`} alt={`Symptom ${index + 1}`} />
//                                       </a>
//                                     </div>
//                                   )
//                                   )) : (
//                                   <p>No images uploaded</p>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>




//                       </div>
//                     </form>
//                   </div>
//                 )}



//                 <div className="pending-prescriptions cmn-mb2 bg-blue">
//                   <h2>Appointment History</h2>
//                   <div className="pending-presc-table">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>S.no.</th>
//                           <th>Appointment Date</th>
//                           <th>Diagnosis</th>
//                           <th>View Prescription</th>
//                         </tr>
//                       </thead>
//                       <tbody>

//                         {appointmentHistory.length > 0 ? (
//                           appointmentHistory.map((appointment, index) => (
//                             <tr key={appointment.id || index}>
//                               <td>{index + 1}</td>
//                               <td>{appointment.appointment_date}</td>
//                               <td>{appointment.diagnosis}</td>
//                               <td>
//                                 {/* <Link to="">View</Link> */}
//                                 <a href={`${baseUrl}/${appointment.prescription_path}`}>View</a>
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan="4" className="text-center">
//                               No Appointment history found
//                             </td>
//                           </tr>
//                         )}


//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Conditionally show contact info only if NOT referred */}
//                 {!patientProfileData?.basic_information?.is_referred && (
//                   <div className="pending-prescriptions">
//                     <h2>Referred Patient list</h2>
//                     <div className="pending-presc-table">
//                       <table>
//                         <thead>
//                           <tr>
//                             <th>S.no.</th>
//                             <th>Patient Name</th>
//                             <th>Gender</th>
//                             <th>Age</th>
//                             <th>Weight (kg)</th>
//                             <th>Height</th>
//                             <th>View Details</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {referredPatients.length > 0 ? (
//                             referredPatients.map((patient, index) => (
//                               <tr key={patient.id || index}>
//                                 <td>{index + 1}</td>
//                                 <td>{patient.name}</td>
//                                 <td>{patient.gender}</td>
//                                 <td>{patient.age}</td>
//                                 <td>{patient.weight}</td>
//                                 <td>{patient.height}</td>
//                                 <td>
//                                   <Link to="/patient-details" state={{"referrer":patientInfo.name, "referrerDscode":patientInfo.ds_code, "id":patient.id, "patientId": patient.id }}>View Details</Link>
//                                 </td>
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="7" className="text-center">
//                                 No Referred patients found
//                               </td>
//                             </tr>
//                           )}


//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//               </div>



//               {!patientProfileData?.basic_information?.is_referred && !patientProfileData?.is_appointment_present && (
//                 <div className="schedule-appoinment-btn">
//                   <Link to="/schedule-appointment" className="orange-btn">
//                     Schedule Appointment
//                   </Link>
//                 </div>
//               )}


//             </div>

//           </div>

//           <Footer />
//         </div>
//       </main>
//     </>
//   );
// };

// export default PatientProfile; 







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
  const { patientId, appointmentId ,hideSchedule, source} = location.state || {};
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

                  <div className="patient-profile-wrp cmn-mb2">
                    <div className="patient-profile">
                      <div className="patient-profile-inr">
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
                              <span>DS Code:${patientInfo.ds_code}</span>)}</p>
                          </div>
                          <div className="patient-info">
                            <div className="patient-info-card">
                              <h3>Gender</h3>
                              <p>{patientInfo.gender}</p>
                            </div>
                            <div className="patient-info-card">
                              <h3>Age</h3>
                              <p>{patientInfo.age}</p>
                            </div>
                            <div className="patient-info-card">
                              <h3>Height</h3>
                              <p>{patientInfo.height}</p>
                            </div>
                            <div className="patient-info-card">
                              <h3>Weight</h3>
                              <p>{patientInfo.weight}</p>
                            </div>
                          </div>
                          {!patientProfileData?.basic_information?.is_referred && <div className="patient-info">
                            <div className="patient-info-card">
                              <h3>Phone number</h3>
                              <p>{patientInfo.phone_no}</p>
                              {/* <a href="tel:3195550115">{patientInfo.phone}</a> */}
                            </div>
                            <div className="patient-info-card">
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
                      </div>
                    </div>
                  )}




                  {patientProfileData?.is_appointment_present && !patientProfileData?.basic_information?.is_referred  && (
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
                              </div>
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
                            <th>Diagnosis</th>
                            <th>View Prescription</th>
                          </tr>
                        </thead>
                        <tbody>

                          {appointmentHistory.length > 0 ? (
                            appointmentHistory.map((appointment, index) => (
                              <tr key={appointment.id || index}>
                                <td>{index + 1}</td>
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
                              <th>View Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {referredPatients.length > 0 ? (
                              referredPatients.map((patient, index) => (
                                <tr key={patient.id || index}>
                                  <td>{index + 1}</td>
                                  <Link to="/patient-profile" state={{ patientid: patientId }} ><td>{patient.name}</td></Link>

                                  {/* <td>{patient.name}</td> */}
                                  <td>{patient.gender}</td>
                                  <td>{patient.age}</td>
                                  <td>{patient.weight}</td>
                                  <td>{patient.height}</td>
                                  <td>
                                    <Link to="/patient-details" state={{ "referrer": patientInfo.name, "referrerDscode": patientInfo.ds_code, "id": patient.id, "patientId": patient.id }}>View Details</Link>
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
