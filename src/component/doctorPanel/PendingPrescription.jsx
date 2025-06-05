
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { doctorCompletedPrescriptions, doctorPendingPrescriptions } from '../../redux/slices/userSlice';
import Pagination from '../Pagination';

const PendingPrescription = () => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const { pendingPrescription, completedPrescription, loading, error } = useSelector((state) => state.user);
    // const { completedPrescription } = useSelector((state) => state.user); //state.user, here user is slice name
    const [activeTab, setActiveTab] = useState('pending');
    const [hoveredTab, setHoveredTab] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 5;

    // Fetch pending prescription on component mount
    useEffect(() => {
        dispatch(doctorPendingPrescriptions());
        dispatch(doctorCompletedPrescriptions());
    }, [dispatch]);

    const toggleTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1); // Reset to first page when switching tabs
    };

    const getTabStyle = (tab) => {
        const isActive = activeTab === tab;
        const isHovered = hoveredTab === tab;

        return {
            color: isActive || isHovered ? 'var(--white)' : 'var(--theme-clr-2)',
            backgroundColor: isActive ? 'var(--theme-clr-2)' : 'var(--white)',
            border: '1px solid var(--theme-clr-2)',
            fontWeight: '500',
            fontSize: '18px',
            padding: '5px 30px',
            transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out'
        };
    };

    const currentData = activeTab === 'pending' ? pendingPrescription || [] : completedPrescription || [];
    const totalPages = Math.ceil(currentData.length / patientsPerPage);

    // Get current patients
    const indexOfLastPatient = currentPage * patientsPerPage;
    const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
    const currentPatients = currentData.slice(indexOfFirstPatient, indexOfLastPatient);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // Change page
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // Generate page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

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

                    <div className="doc-panel-body">
                        <div className="docpnl-sec-head">
                            <h1 className="h2-title">Pending Prescriptions</h1>
                        </div>
                        <div className="pending-prescriptions-wrp">
                            <div className="my-appointments-inr">
                                <div className="my-appointments-tab-header">
                                    <div className="">
                                        <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0, }}>
                                            <li className='cmn-btn' onClick={() => toggleTab('pending')}
                                                style={getTabStyle('pending')}
                                                onMouseEnter={() => setHoveredTab('pending')}
                                                onMouseLeave={() => setHoveredTab(null)} >
                                                Pending
                                            </li>
                                            <li className='cmn-btn' onClick={() => toggleTab('completed')}
                                                style={getTabStyle('completed')}
                                                onMouseEnter={() => setHoveredTab('completed')}
                                                onMouseLeave={() => setHoveredTab(null)}>
                                                Completed
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {activeTab === 'pending' && (
                                    <div className="myapintmnt-content-tab pending">
                                        <div className="pending-presc-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>S.no.</th>
                                                        <th>Patient Name</th>
                                                        <th>Symptom Upload Date</th>
                                                        <th>View Details</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                { currentPatients.length == 0 && <tr>
                                                    <td colSpan="8" style={{ textAlign: "center" }}>{loading ? "Loading..." : "No data found"}</td>
                                                </tr>}
                                                    {currentPatients.map((data, index) => (
                                                        <tr key={index}>
                                                            {/* <td>{index + 1}</td> */}
                                                            <td>{(currentPage - 1) * patientsPerPage + index + 1}</td>

                                                            {/* <td>{data.patient_name || `Unknown Patient ${data.id}`}</td> */}
                                                            <td><Link to="/patient-profile" state={{patientId:data.patient_id}}>{data.patient_name}</Link></td>
                                                            {/* <td>

                                                                <div className="date">{data.symptom_upload_date || 'N/A'}</div>
                                                                <div className="time">{data.uploadTime || ''}</div>
                                                            </td> */}

                                                            <td>
                                                                <div className="date">{data.symptom_upload_date?.split(' ')[0]}</div>
                                                                <div className="time">{data.symptom_upload_date?.split(' ').slice(1).join(' ')}</div>
                                                            </td>
                                                            <td><Link to="/PendingAssignedPrescriptionDetails" state={{ id: data.id, patientId:data.patient_id }} >View</Link></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'completed' && (
                                    <div className="myapintmnt-content-tab completed">
                                        <div className="pending-presc-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>S.no.</th>
                                                        <th>Patient Name</th>
                                                        <th>Symptom Upload Date</th>
                                                        <th>Respond Date</th>
                                                        <th>Download Prescription</th>
                                                        <th>View Profile</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentPatients.map((data, index) => (

                                                        <tr key={index}>
                                                            {/* <td>{index + 1}</td> */}
                                                            <td>{indexOfFirstPatient + index + 1}</td>

                                                            {/* <td>{data.patient_name}</td> */}
                                                            <td><Link to="/patient-profile" state={{patientId:data.patient_id}}>{data.patient_name}</Link></td>
                                                            <td>
                                                                <div className="date">{data.symptom_upload_date.split(' ')[0]}</div>
                                                                <div className="time">{data.symptom_upload_date.split(' ').slice(1).join(' ')}</div>
                                                            </td>
                                                            <td>
                                                            <div className="date">{data.respond_date?.split(' ')[0]}</div>
                                                            <div className="time">{data.respond_date?.split(' ').slice(1).join(' ')}</div>
                                                            </td>
                                                            <td>
                                                                <div className="dwnld-btn">
                                                                    {/* profilePic: (baseUrl+"/"+user.profile_path) || '',  */}
                                                                    <img src="./images/dwnld-icon.svg" alt="Download Icon" />
                                                                    <a href={(baseUrl+"/"+data.prescription_link)} download target="_blank">Download</a>
                                                                </div>
                                                            </td>
                                                            <td><Link to="/patient-profile" state={{patientId:data.patient_id , hideSchedule: true, source:"prescription"}}>View</Link></td>
                                                        </tr>

                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

{currentData.length > 0 && (
    <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages}
        onPageChange={handlePageChange} 
        onPrevious={prevPage}
        onNext={nextPage} 
    />
)}
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

export default PendingPrescription;

// import React, { useState } from 'react';
// import Header from './Header';
// import Footer from './Footer';
// import PendingAssignedPrescriptionDetails from './Pendingassignedprescriptiondetails';
// import CompletedAssignedPrescription from './Completeassignedprescription';
// import pendingfull from './PendingFullAssigned';
// import { Link } from 'react-router-dom';

// const PendingPrescription = () => {
//     const [activeTab, setActiveTab] = useState('pending');
//     const [hoveredTab, setHoveredTab] = useState(null);
//     const toggleTab = (tab) => {
//         setActiveTab(tab);
//     };

//     //Tab styles
//     // const activeTabStyle = {
//     //     color: 'var(--white)',
//     //     backgroundColor: 'var(--theme-clr-2)',
//     //     border: '1px solid var(--theme-clr-2)',

//     //     fontWeight: '500',
//     //     fontSize: '18px',
//     //     padding: '5px 30px'

//     // }

//     // const inactiveTabStyle = {
//     //     color: 'var(--theme-clr-2)',
//     //     backgroundColor: 'var(--white)',
//     //     border: '1px solid var(--theme-clr-2)',
//     //     fontWeight: '500',
//     //     fontSize: '18px',
//     //     padding: '5px 30px'
//     // }

//     const getTabStyle = (tab) => {
//         const isActive = activeTab === tab;
//         const isHovered = hoveredTab === tab;

//         return {
//             color: isActive || isHovered ? 'var(--white)' : 'var(--theme-clr-2)',
//             backgroundColor: isActive ? 'var(--theme-clr-2)' : 'var(--white)',
//             border: '1px solid var(--theme-clr-2)',
//             fontWeight: '500',
//             fontSize: '18px',
//             padding: '5px 30px',
//             // Add transition for smooth color change
//             transition: 'color 0.3s ease-in-out, background-color 0.3s ease-in-out'
//         };
//     };

//     const pendingData = [
//         { sno: 1, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 2, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 3, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 4, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 5, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 6, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 7, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 8, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 9, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' },
//         { sno: 10, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM' }
//     ];

//     const completedData = [
//         { sno: 1, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 2, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 3, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 4, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 5, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 6, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 7, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 8, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 9, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' },
//         { sno: 10, patientName: 'Patient Name', uploadDate: '21/12/2024', uploadTime: '10:40 PM', respondDate: '21/12/2024', respondTime: '10:40 PM' }
//     ];

//     return (
//         <>
//             <main className="doctor-panel">
//                 <div className="container-fluid">
//                     <div className="doc-panel-inr">
//                         <Header />
//                     </div>

//                     <div className="doc-panel-body">

//                         <div className="docpnl-sec-head">
//                             <h1 className="h2-title">Pending Prescriptions</h1>
//                         </div>
//                         <div className="pending-prescriptions-wrp">
//                             <div className="my-appointments-inr">
//                                 <div className="my-appointments-tab-header">
//                                     <div className="">
//                                         <ul style={{ display: 'flex', gap: '10px', listStyle: 'none', padding: 0, }}>
//                                             <li
//                                                 className='cmn-btn'
//                                                 onClick={() => toggleTab('pending')}
//                                                 style={getTabStyle('pending')}
//                                     onMouseEnter={() => setHoveredTab('pending')}
//                                     onMouseLeave={() => setHoveredTab(null)}
//                                             >
//                                                 Pending
//                                             </li>
//                                             <li
//                                                 className='cmn-btn'
//                                                 onClick={() => toggleTab('completed')}
//                                                 style={getTabStyle('completed')}
//                                                 onMouseEnter={() => setHoveredTab('completed')}
//                                                 onMouseLeave={() => setHoveredTab(null)}
//                                             >
//                                                 Completed
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </div>

//                                 {activeTab === 'pending' && (
//                                     <div className="myapintmnt-content-tab pending">
//                                         <div className="pending-presc-table">
//                                             <table>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>S.no.</th>
//                                                         <th>Patient Name</th>
//                                                         <th>Symptom Upload Date</th>
//                                                         <th>View Details</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {pendingData.map((data, index) => (
//                                                         <tr key={index}>
//                                                             <td>{data.sno}</td>
//                                                             <td>{data.patientName}</td>
//                                                             <td>
//                                                                 <div className="date">{data.uploadDate}</div>
//                                                                 <div className="time">{data.uploadTime}</div>
//                                                             </td>
//                                                             {/* <td><Link to="/PendingAssignedPrescriptionDetails">View</Link></td> */}
//                                                             <td><Link to="/PendingAssignedPrescriptionDetails">View</Link></td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}

//                                 {activeTab === 'completed' && (
//                                     <div className="myapintmnt-content-tab completed">
//                                         <div className="pending-presc-table">
//                                             <table>
//                                                 <thead>
//                                                     <tr>
//                                                         <th>S.no.</th>
//                                                         <th>Patient Name</th>
//                                                         <th>Symptom Upload Date</th>
//                                                         <th>Respond Date</th>
//                                                         <th>Download Prescription</th>
//                                                         <th>View Profile</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {completedData.map((data, index) => (
//                                                         <tr key={index}>
//                                                             <td>{data.sno}</td>
//                                                             <td>{data.patientName}</td>
//                                                             <td>
//                                                                 <div className="date">{data.uploadDate}</div>
//                                                                 <div className="time">{data.uploadTime}</div>
//                                                             </td>
//                                                             <td>
//                                                                 <div className="date">{data.respondDate}</div>
//                                                                 <div className="time">{data.respondTime}</div>
//                                                             </td>
//                                                             <td>
//                                                                 <div className="dwnld-btn">
//                                                                     <img src="./images/dwnld-icon.svg" alt="Download Icon" />
//                                                                     <a href="./images/dwnld-icon.svg" download>Download</a>
//                                                                 </div>
//                                                             </td>
//                                                             <td><Link to="/completed-appointments-profile">View</Link></td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div className="tablepagination">
//                                     <div className="tbl-pagination-inr">
//                                         <ul>
//                                             <li><a href="#url"><img src="./images/arrow-left-black.svg" alt="Icon" />Previous</a></li>
//                                             <li className="active"><a href="#url">1</a></li>
//                                             <li><a href="#url">2</a></li>
//                                             <li><a href="#url">3</a></li>
//                                             <li><a href="#url">4</a></li>
//                                             <li><a href="#url">5</a></li>
//                                             <li><a href="#url">...</a></li>
//                                             <li><a href="#url">10</a></li>
//                                             <li><a href="#url">Next<img src="./images/arrow-right-black.svg" alt="Icon" /></a></li>
//                                         </ul>
//                                     </div>
//                                     <div className="pages-select">
//                                         <form>
//                                             <div className="formfield">
//                                                 <label>Page</label>
//                                                 <select>
//                                                     <option value="1">1</option>
//                                                     <option value="2">2</option>
//                                                     <option value="3">3</option>
//                                                     <option value="4">4</option>
//                                                     <option value="5">5</option>
//                                                     <option value="6">6</option>
//                                                     <option value="7">7</option>
//                                                     <option value="8">8</option>
//                                                     <option value="9">9</option>
//                                                     <option value="10">10</option>
//                                                 </select>
//                                             </div>
//                                         </form>
//                                         <p>of 10</p>
//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                     </div>
//                     <Footer />
//                 </div></main>
//         </>
//     );
// };

// export default PendingPrescription;