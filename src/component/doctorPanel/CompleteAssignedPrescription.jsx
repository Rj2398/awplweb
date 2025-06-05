// import { Link } from 'react-router-dom';
// import Footer from '../doctorPanel/Footer';
// import Header from './Header';
// import PrescriptionModal from './PrescriptionModal';
// import { useState, useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';
// import { completePrescription, medicineSearch } from '../../redux/slices/userSlice';
// import { toast } from 'react-toastify';
// import { getPatientProfileData } from '../../redux/slices/patientProfileSlice';
 
// const CompletedAssignedPrescription = () => {
//   const location = useLocation();
//   const { id, patientId } = location.state || {};
//   const suggestionsRefs = useRef([]);
//   const dispatch = useDispatch();

//     const { patientProfileData } = useSelector((state) => state.patientProfile);
   
//     useEffect(() => {
//       if (patientId) {
//         dispatch(getPatientProfileData({ "patientId": patientId }));
//       }
//     }, [dispatch, patientId]);
   
//  const patientInfo = patientProfileData?.basic_information || {};

//   const { loading, error, completeAssignedPrescription, medicineSearch: medicineSearchResults } = useSelector((state) => state.user);
//   const [showModal, setShowModal] = useState(false);
//   const [debouncedQueries, setDebouncedQueries] = useState([]);
//   const [notes, setNotes] = useState('');
//   const [diagnosis, setDiagnosis] = useState('');
//   const [query, setQuery] = useState('');
//   const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);
//   const handleNotesChange = (e) => setNotes(e.target.value);
//   const handleDiagnosisChange = (e) => setDiagnosis(e.target.value);
//   const [searchTimeouts, setSearchTimeouts] = useState({});
//   const [activeMedicineIndex, setActiveMedicineIndex] = useState(null);
//   const [medicineErrors, setMedicineErrors] = useState([]);
//   const [medicines, setMedicines] = useState([
//     { medicineName: '', dosage: '', frequency: '', duration: '', suggestions: [], showSuggestion: false, isValid: false },
//   ]);
//   const addMoreMedicine = () => {
//     setMedicines([...medicines, {
//       medicineName: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       suggestions: [],
//       showSuggestion: false,
//       isValid: false
//     }]);
//   };
 
 
//   const handleMedicineChange = (index, field, value) => {
//     const updated = [...medicines];
//     updated[index][field] = value;
//     updated[index].isValid = false;
 
//     if (field === 'medicineName') {
//       // Debounce: clear previous timeout
//       setActiveMedicineIndex(index);
 
//       if (searchTimeouts[index]) {
//         clearTimeout(searchTimeouts[index]);
//       }
 
//       // Only search if input is not empty
//       if (value.trim().length > 0) {
//         const timeout = setTimeout(() => {
//           dispatch(medicineSearch({ query: value }));
//         }, 500);
 
//         setSearchTimeouts(prev => ({ ...prev, [index]: timeout }));
//       } else {
//         updated[index].suggestions = [];
//       }
 
//       const errors = [...medicineErrors];
//       errors[index] = '';
//       setMedicineErrors(errors);
//     }
 
//     setMedicines(updated);
//   };
 
 
//   useEffect(() => {
//     if (medicineSearchResults && activeMedicineIndex !== null) {
//       const updated = [...medicines];
//       updated[activeMedicineIndex].suggestions = medicineSearchResults;
//       setMedicines(updated);
//     }
//   }, [medicineSearchResults]);
 
 
//   const handleSuggestionSelect = (index, name) => {
//     const updated = [...medicines];
//     updated[index].medicineName = name;
//     updated[index].suggestions = [];
//     updated[index].isValid = true;
 
//     setMedicines(updated);
 
//     //
//     setMedicineErrors(prev => {
//       const newErrors = [...prev];
//       newErrors[index] = null;
//       return newErrors;
//     });
 
//     setActiveMedicineIndex(null);
//   };
 
//   useEffect(() => {
//     function handleClickOutside(event) {
//       setShowSuggestionsPopup(!showSuggestionsPopup)
//       const updated = [...medicines];
//       let changed = false;
 
//       medicines.forEach((med, i) => {
//         const ref = suggestionsRefs.current[i];
//         if (ref && !ref.contains(event.target) && med.suggestions.length > 0) {
//           updated[i].suggestions = [];
//           changed = true;
//         }
//       });
 
//       if (changed) {
//         setMedicines(updated);
//       }
//     }
 
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [medicines]);
 
//   /// validation for medicine name
//   const isValidatemedicine = (medicineName, suggestions) => {
//     return suggestions.some(sug => sug.product_name === medicineName);
 
//   };
//   const handleSubmit = async () => {
//     // Validate required fields
//     if (!diagnosis || medicines.some(med =>
//       !med.medicineName || !med.dosage || !med.frequency || !med.duration
//     )) {
//       toast.error('All fields are required (marked with *)');
//       return;
//     }
 
//     // loop for medicine validation
//     const errors = [...medicineErrors];
 
//     for (let i = 0; i < medicines.length; i++) {
//       const med = medicines[i];
//       if (!med.isValid) {
//         errors[i] = 'Please select a valid medicine name from suggestions';
 
//       } else {
//         errors[i] = '';
//       }
 
//     }
//     setMedicineErrors(errors);
 
//     if (errors.some(err => err)) {
//       return;
//     }
 
 
//     const formData = {
//       symptom_id: id,
//       diagnosis,
//       notes,
//       medicines: medicines.map(med => ({
//         name: med.medicineName,
//         dosage: med.dosage,
//         frequency: med.frequency,
//         duration: med.duration
//       }))
//     };
//     console.log(formData, 'ffff')
 
//     const res = await dispatch(completePrescription(formData))
//     if (res.payload && res.payload.status) {
//       setShowModal(true);
 
//     }
 
 
 
//   };
 
 
//   return (
//     <main className="doctor-panel">
//       <div className="container-fluid">
//         <div className="doc-panel-inr">
//           <Header />
//         </div>
 
//         {/* Panel Body */}
//         <div className="doc-panel-body cap-pg">
//           <div className="vdoclscrn-patient-details-wrp">
//             <form onSubmit={(e) => e.preventDefault()}>
//               <div className="vdoclscrn-patient-details-wrp-inr">
//                 <div className="vdoclscrn-patient-details w-100">
//                   <div className="vdoclscrnpd-wrp">
//                     <h2>Patient Details:</h2>
//                     <div className="vdoclscrnpd">
//                       {[
//                             { label: "Patient Name", value: patientInfo.name || "N/A" },
//                             { label: "Age", value: patientInfo.age || "N/A" },
//                             { label: "Gender", value: patientInfo.gender || "N/A" },
//                             { label: "Height", value: patientInfo.height || "N/A" },
//                             { label: "Weight", value: patientInfo.weight || "N/A" },
//                             { label: "Contact No.", value: patientInfo.phone_no || "N/A" },
//                       ].map((item, index) => (
//                         <div key={index} className="vdoclscrnpd-grp">
//                           <span className="vdoclscrnpd-label">{item.label}</span>
//                           <span className="vdoclscrnpd-val">{item.value}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
 
//                   <div className="vdoclscrnpd-wrp">
//                     <div className="vdoclscrnpd-wrp">
//                       <h2>Report:</h2>
//                       {medicines.map((medicine, index) => (
//                         <div key={`medicine-${index}`} className="" ref={(el) => (suggestionsRefs.current[index] = el)} >
//                           <div className="vdoclscrnpd">
//                             <div className="formfield search-bar">
//                               <label>Medicine Name<span>*</span></label>
//                               <div className="search-input">
 
 
//                                 <input
//                                   type="text"
//                                   placeholder="Ibupro"
//                                   value={medicine.medicineName}
//                                   onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
//                                   autoComplete="off"
//                                 />
//                                 {medicineErrors[index] && (
//                                   <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
//                                     {medicineErrors[index]}
//                                   </div>
//                                 )}
 
 
//                                 <input type="submit" value="search" />
//                                 {activeMedicineIndex === index && medicine.medicineName && (
//                                   <ul
//                                     style={{
//                                       position: 'absolute',
//                                       backgroundColor: 'white',
//                                       border: '1px solid #ccc',
//                                       width: '100%',
//                                       maxHeight: '150px',
//                                       overflowY: 'auto',
//                                       zIndex: 10,
//                                       marginTop: 0,
//                                       paddingLeft: '10px',
//                                       listStyle: 'none',
//                                     }}
//                                   >
 
//                                     {medicine.suggestions.length > 0 ? (
//                                       medicine.suggestions.map((sug, i) => (
//                                         <li
//                                           key={i}
//                                           onClick={() => handleSuggestionSelect(index, sug.product_name)}
//                                           style={{ cursor: 'pointer', padding: 5 }}
//                                         >
//                                           {sug.product_name}
//                                         </li>
//                                       ))
//                                     ) : (
//                                       (showSuggestionsPopup &&  <li style={{ padding: 5, color: '#999' }} >
//                                         No data found
//                                       </li>)
//                                     )}
//                                   </ul>
//                                 )}
 
//                               </div>
 
//                             </div>
//                             <div className="formfield">
//                               <label>Dosage<span>*</span></label>
//                               <input
//                                 type="text"
//                                 placeholder="Dosage"
//                                 value={medicine.dosage}
//                                 onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
//                                 required
//                               />
//                             </div>
//                             <div className="formfield">
//                               <label>Frequency<span>*</span></label>
//                               <input
//                                 type="text"
//                                 placeholder="16"
//                                 value={medicine.frequency}
//                                 onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
//                                 required
//                               />
//                             </div>
//                             <div className="formfield">
//                               <label>Duration<span>*</span></label>
//                               <input
//                                 type="text"
//                                 placeholder="Duration"
//                                 value={medicine.duration}
//                                 onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
//                                 required
//                               />
//                             </div>
//                           </div>
//                           <hr style={{
//                             border: 'none',
//                             height: '3px',
//                             backgroundColor: '#333',
//                             margin: '10px 0'
//                           }} />
//                         </div>
//                       ))}
 
//                       <button type="button" className="orange-btn" onClick={addMoreMedicine} style={{ margin: '20px 0', padding: 0, minWidth: '150px' }}><img src="./images/plus-icon-circle.svg" alt="Icon" /> Add More</button>
 
//                     </div>
 
 
 
 
 
 
//                     <div className="add-notes-wrp vdoclscrnpd">
//                       <div className="formfield">
//                         <label>Notes:</label>
//                         <input
//                           type="text"
//                           placeholder="Notes"
//                           value={notes}
//                           onChange={handleNotesChange}
//                         />
//                       </div>
//                     </div>
 
//                     <div className="add-notes-wrp vdoclscrnpd">
//                       <div className="formfield">
//                         <label>Diagnosis <span>*</span></label>
//                         <input
//                           type="text"
//                           placeholder="Parasitic disease"
//                           value={diagnosis}
//                           onChange={handleDiagnosisChange}
//                         />
//                       </div>
//                     </div>
//                   </div>
 
 
 
//                   <button
//                     type="button"
//                     className="orange-btn"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                   >
//                     {loading ? 'Submitting...' : 'Submit'}
//                   </button>
//                   {/* <PrescriptionModal /> */}
 
//                   <PrescriptionModal show={showModal} handleClose={() => setShowModal(false)} />
 
 
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
 
 
 
//         <Footer />
//       </div>
//     </main>
//   );
// };
 
// export default CompletedAssignedPrescription;













import { Link } from 'react-router-dom';
import Footer from '../doctorPanel/Footer';
import Header from './Header';
import PrescriptionModal from './PrescriptionModal';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { completePrescription, medicineSearch } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { getPatientProfileData } from '../../redux/slices/patientProfileSlice';

const CompletedAssignedPrescription = () => {
  const location = useLocation();
  const { id, patientId } = location.state || {};
  const suggestionsRefs = useRef([]);
  const dispatch = useDispatch();

  const { patientProfileData } = useSelector((state) => state.patientProfile);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ "patientId": patientId }));
    }
  }, [dispatch, patientId]);

  const patientInfo = patientProfileData?.basic_information || {};

  const { loading, error, completeAssignedPrescription, medicineSearch: medicineSearchResults } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [debouncedQueries, setDebouncedQueries] = useState([]);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [query, setQuery] = useState('');
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);
  const handleNotesChange = (e) => setNotes(e.target.value);
  const handleDiagnosisChange = (e) => setDiagnosis(e.target.value);
  const [searchTimeouts, setSearchTimeouts] = useState({});
  const [activeMedicineIndex, setActiveMedicineIndex] = useState(null);
  const [medicineErrors, setMedicineErrors] = useState([]);
  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', suggestions: [], showSuggestion: false, isValid: false },
  ]);
  const addMoreMedicine = () => {
    setMedicines([...medicines, {
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      suggestions: [],
      showSuggestion: false,
      isValid: false
    }]);
  };


  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    updated[index].isValid = false;

    if (field === 'medicineName') {
      // Debounce: clear previous timeout
      setActiveMedicineIndex(index);

      if (searchTimeouts[index]) {
        clearTimeout(searchTimeouts[index]);
      }

      // Only search if input is not empty
      if (value.trim().length > 0) {
        const timeout = setTimeout(() => {
          dispatch(medicineSearch({ query: value }));
        }, 500);

        setSearchTimeouts(prev => ({ ...prev, [index]: timeout }));
      } else {
        updated[index].suggestions = [];
      }

      const errors = [...medicineErrors];
      errors[index] = '';
      setMedicineErrors(errors);
    }

    setMedicines(updated);
  };


  useEffect(() => {
    if (medicineSearchResults && activeMedicineIndex !== null) {
      const updated = [...medicines];
      updated[activeMedicineIndex].suggestions = medicineSearchResults;
      setMedicines(updated);
    }
  }, [medicineSearchResults]);


  const handleSuggestionSelect = (index, name) => {
    const updated = [...medicines];
    updated[index].medicineName = name;
    updated[index].suggestions = [];
    updated[index].isValid = true;

    setMedicines(updated);

    //
    setMedicineErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });

    setActiveMedicineIndex(null);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      setShowSuggestionsPopup(!showSuggestionsPopup)
      const updated = [...medicines];
      let changed = false;

      medicines.forEach((med, i) => {
        const ref = suggestionsRefs.current[i];
        if (ref && !ref.contains(event.target) && med.suggestions.length > 0) {
          updated[i].suggestions = [];
          changed = true;
        }
      });

      if (changed) {
        setMedicines(updated);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [medicines]);

  /// validation for medicine name
  const isValidatemedicine = (medicineName, suggestions) => {
    return suggestions.some(sug => sug.product_name === medicineName);

  };
  const handleSubmit = async () => {
    // Validate required fields
    if (!diagnosis || medicines.some(med =>
      !med.medicineName || !med.dosage || !med.frequency || !med.duration
    )) {
      toast.error('All fields are required (marked with *)');
      return;
    }

    // loop for medicine validation
    const errors = [...medicineErrors];

    for (let i = 0; i < medicines.length; i++) {
      const med = medicines[i];
      if (!med.isValid) {
        errors[i] = 'Please select a valid medicine name from suggestions';

      } else {
        errors[i] = '';
      }

    }
    setMedicineErrors(errors);

    if (errors.some(err => err)) {
      return;
    }


    const formData = {
      symptom_id: id,
      diagnosis,
      notes,
      medicines: medicines.map(med => ({
        name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration
      }))
    };
    console.log(formData, 'ffff updated')

    const res = await dispatch(completePrescription(formData))
    if (res.payload && res.payload.status) {
      setShowModal(true);

    }

    console.log(formData, 'llllllllllllll updated')

  };


  return (
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


          <div className="doc-panel-body cap-pg">
            <div className="vdoclscrn-patient-details-wrp">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="vdoclscrn-patient-details-wrp-inr">
                  <div className="vdoclscrn-patient-details w-100">
                    <div className="vdoclscrnpd-wrp">
                      <h2>Patient Details:</h2>
                      <div className="vdoclscrnpd">
                        {[
                          { label: "Patient Name", value: patientInfo.name || "N/A" },
                          { label: "Age", value: patientInfo.age || "N/A" },
                          { label: "Gender", value: patientInfo.gender || "N/A" },
                          { label: "Height", value: patientInfo.height || "N/A" },
                          { label: "Weight", value: patientInfo.weight || "N/A" },
                          { label: "Contact No.", value: patientInfo.phone_no || "N/A" },
                        ].map((item, index) => (
                          <div key={index} className="vdoclscrnpd-grp">
                            <span className="vdoclscrnpd-label">{item.label}</span>
                            <span className="vdoclscrnpd-val">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="vdoclscrnpd-wrp">
                      <div className="vdoclscrnpd-wrp">
                        <h2>Report:</h2>
                        {medicines.map((medicine, index) => (
                          <div key={`medicine-${index}`} className="" ref={(el) => (suggestionsRefs.current[index] = el)} >
                            <div className="vdoclscrnpd">
                              <div className="formfield search-bar">
                                <label>Medicine Name<span>*</span></label>
                                <div className="search-input">


                                  <input
                                    type="text"
                                    placeholder="Ibupro"
                                    value={medicine.medicineName}
                                    onChange={(e) => handleMedicineChange(index, 'medicineName', e.target.value)}
                                    autoComplete="off"
                                  />



                                  <input type="submit" value="search" />
                                  {activeMedicineIndex === index && medicine.medicineName && !medicineErrors[index] && (
                                    <ul
                                      style={{
                                        position: 'absolute',
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        width: '100%',
                                        maxHeight: '150px',
                                        overflowY: 'auto',
                                        zIndex: 10,
                                        marginTop: 0,
                                        paddingLeft: '10px',
                                        listStyle: 'none',
                                      }}
                                    >

                                      {medicine.suggestions.length > 0 ? (
                                        medicine.suggestions.map((sug, i) => (
                                          <li
                                            key={i}
                                            onClick={() => handleSuggestionSelect(index, sug.product_name)}
                                            style={{ cursor: 'pointer', padding: 5 }}
                                          >
                                            {sug.product_name}
                                          </li>
                                        ))
                                      ) : medicine.medicineName.trim()
                                        .length > 0 &&
                                      !medicineErrors[index] && (
                                        <li
                                          style={{
                                            padding: 5,
                                            color: "#999",

                                          }}
                                        >
                                          No data found
                                        </li>
                                      )}
                                    </ul>
                                  )}

                                </div>

                              </div>
                              <div className="formfield">
                                <label>Dosage<span>*</span></label>
                                <input
                                  type="text"
                                  placeholder="Dosage"
                                  value={medicine.dosage}
                                  onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="formfield">
                                <label>Frequency<span>*</span></label>
                                <select
                                  value={medicine.frequency}
                                  onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                  required
                                  style={{
                                    backgroundColor: '#F9F9F9',
                                     
                                   
                                    padding: '8px',
                                    width: '100%',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                  }}
                                >
                                  <option value="">Select Frequency</option>
                                  <option value="1 time (in a day)">1 time (in a day)</option>
                                  <option value="2 times (in a day)">2 times (in a day)</option>
                                  <option value="3 times (in a day)">3 times (in a day)</option>
                                </select>
                              </div>


                              <div className="formfield">
                                <label>Duration<span>*</span></label>
                                <input
                                  type="text"
                                  placeholder="Duration"
                                  value={medicine.duration}
                                  onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                  required
                                />
                              </div>
                              {medicineErrors[index] && (
                                <div style={{ color: 'red', marginTop: '-5px', fontSize: '14px' }}>
                                  {medicineErrors[index]}
                                </div>
                              )}
                            </div>

                            <hr style={{
                              border: 'none',
                              height: '3px',
                              backgroundColor: '#333',
                              margin: '10px 0'
                            }} />
                          </div>
                        ))}

                        <button type="button" className="orange-btn" onClick={addMoreMedicine} style={{ margin: '20px 0', padding: 0, minWidth: '150px' }}><img src="./images/plus-icon-circle.svg" alt="Icon" /> Add More</button>

                      </div>






                      <div className="add-notes-wrp vdoclscrnpd">
                        <div className="formfield">
                          <label>Notes:</label>
                          <input
                            type="text"
                            placeholder="Notes"
                            value={notes}
                            onChange={handleNotesChange}
                          />
                        </div>
                      </div>

                      <div className="add-notes-wrp vdoclscrnpd">
                        <div className="formfield">
                          <label>Diagnosis <span>*</span></label>
                          <input
                            type="text"
                            placeholder="Parasitic disease"
                            value={diagnosis}
                            onChange={handleDiagnosisChange}
                          />
                        </div>
                      </div>
                    </div>



                    <button
                      type="button"
                      className="orange-btn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                    {/* <PrescriptionModal /> */}

                    <PrescriptionModal show={showModal} handleClose={() => setShowModal(false)} />


                  </div>
                </div>
              </form>
            </div>
          </div>
        )}



        <Footer />
      </div>
    </main>
  );
};

export default CompletedAssignedPrescription;