import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../component/doctorPanel/Header';
import Footer from '../component/doctorPanel/Footer';
import CustomModal from '../component/CustomModal';
import MyAppointmentsSearch from '../component/MyAppointmentsSearch ';
import patientData from "../assets/patient.json"
import Pagination from '../component/Pagination';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { doctorCanceledAppointment, getAllCanceledAppointment, getAllCompletedAppointment, getAllUpcomingAppointment, getJoinVideoCall, sendPushNotification } from '../redux/slices/myAppointmentSlice';

const MyAppointments = () => {
    const navigate = useNavigate();
    const { channelDetails } = useSelector((state) => state.appointments);
    console.log(channelDetails, "jfaklshfsahdfks");
    const dispatch = useDispatch();
    const { upcommingAppointment, completedAppointment, cancelledAppointment, doctorcancelledAppointment, upcomingLoading, completedLoading, cancelledLoading, doctorcancelledLoading } = useSelector((state) => state.appointments);
    const baseUrl = import.meta.env.VITE_BACKEND_URL;


    const [activeTab, setActiveTab] = useState('upcoming');
    const [showModal, setShowModal] = useState(false);
    const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [cancelReason, setCancelReason] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const patientsPerPage = 8;

    const [filters, setFilters] = useState({
        patientName: '', age: '', disease: ''
    });

    const [filteredUpcomingPatients, setFilteredUpcomingPatients] = useState([]);
    const [filteredCompletedPatients, setFilteredCompletedPatients] = useState([]);
    const [filteredCancelledPatients, setFilteredCancelledPatients] = useState([]);



    useEffect(() => {
        dispatch(getAllUpcomingAppointment())
        dispatch(getAllCompletedAppointment())
        dispatch(getAllCanceledAppointment())
    }, [dispatch])

    useEffect(() => {
        // Reset to first page when tab changes
        setCurrentPage(1);
        setFilters({
            patientName: '',
            age: '',
            disease: ''
        });
        // Reset filtered patients to original data
        setFilteredUpcomingPatients(upcommingAppointment);
        setFilteredCompletedPatients(completedAppointment);
        setFilteredCancelledPatients(cancelledAppointment);
    }, [activeTab, upcommingAppointment, completedAppointment, cancelledAppointment]);

    console.log("$$$$$$$$$$$$", upcommingAppointment);


    useEffect(() => {
        setFilteredCompletedPatients(applyFilters(completedAppointment, 'completed'));
    }, [filters]);

    // Update the applyFilters function to properly filter completed patients
    const applyFilters = (patients, tab) => {
        return patients.filter(patient => {
            const nameMatch = !filters.patientName || patient.patient_name?.toLowerCase().includes(filters.patientName.toLowerCase());

            const ageMatch = !filters.age || patient.patient_age.toString().includes(filters.age);

            // For cancelled tab, skip disease matching since those patients might not have disease field
            if (tab === 'cancelled') {
                return nameMatch && ageMatch;
            }
            const diagnosisMatch = !filters.disease ||
                (patient.diagnosis &&
                    patient.diagnosis !== "-" &&
                    patient.diagnosis.toLowerCase() === filters.disease.toLowerCase());

            return nameMatch && ageMatch && diagnosisMatch;


        });
    };

    // Function to update filters from child component
    // const handleFilterChange = (newFilters) => {
    //     setFilters({
    //         patientName: newFilters.name || '',
    //         age: newFilters.age || '',
    //         disease: newFilters.diagnosis || ''
    //     });

    //     if (activeTab === 'completed') {
    //         const filtered = applyFilters(completedAppointment, 'completed');
    //         setFilteredCompletedPatients(filtered);
    //         setCurrentPage(1);
    //     }
    // };
    //for StartAppointment

    //   const [showAppointmentSection, setShowAppointmentSection] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);

    useEffect(() => {
        if (filteredUpcomingPatients) {
            const activeAppointment = filteredUpcomingPatients.find(
                appointment => appointment.status === 1
            );

            if (activeAppointment) {
                console.log("Found active appointment:", activeAppointment);
                setCurrentAppointment(activeAppointment); // Set the actual appointment object
                // setShowAppointmentSection(true);
            } else {
                setCurrentAppointment(null);
                // setShowAppointmentSection(false);
            }
        }
    }, [filteredUpcomingPatients]);

    const handleFilterChange = (newFilters) => {
        setFilters({
            patientName: newFilters.name || '',
            age: newFilters.age || '',
            disease: newFilters.diagnosis || ''
        });

        // Apply filters to the current active tab
        switch (activeTab) {
            case 'upcoming':
                setFilteredUpcomingPatients(applyFilters(upcommingAppointment, 'upcoming'));
                break;
            case 'completed':
                setFilteredCompletedPatients(applyFilters(completedAppointment, 'completed'));
                break;
            case 'cancelled':
                setFilteredCancelledPatients(applyFilters(cancelledAppointment, 'cancelled'));
                break;
            default:
                break;
        }
        setCurrentPage(1);
    };

    const appData = JSON.parse(localStorage.getItem("doctor-app") || "{}");
    const DoctorLoginId = appData.doctorData;

    console.log(DoctorLoginId?.id, "Doctor Data");

    // handle create channel to join call

    const handleCreateChannel = async (id) => {
        console.log(id, `JoinCall + ${DoctorLoginId?.id}`, "params of the data");
        dispatch(
            getJoinVideoCall({
                channelName: `JoinCall + ${DoctorLoginId?.id}`,
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

    const handleSearch = (query) => {
        const lowerQuery = query.toLowerCase().trim();
        const isNumeric = /^\d+$/.test(query);

        // Common search logic for all appointment types
        const searchPatients = (patients) => {
            return patients.filter(patient => {
                const patientAge = patient.patient_age?.toString() || '';
                const patientPhone = patient.patient_phone?.toString() || '';
                const dateStr = patient.datetime ? new Date(patient.datetime).getDate().toString() : '';
                if (isNumeric) {
                    return patientAge === query || patientPhone.includes(query)
                }
                return (
                    (patient.patient_name?.toLowerCase().includes(lowerQuery)) ||
                    (patient.patient_gender?.toLowerCase() === lowerQuery) ||
                    (patientPhone.includes(query)) ||

                    (dateStr.includes(lowerQuery)) ||
                    (patient.datetime?.toLowerCase().includes(lowerQuery)) ||
                    (activeTab === 'completed' && patient.diagnosis?.toLowerCase().includes(lowerQuery))
                );
            });
        };

        // Apply search to the appropriate tab
        switch (activeTab) {
            case 'upcoming':
                setFilteredUpcomingPatients(searchPatients(upcommingAppointment));
                break;
            case 'completed':
                setFilteredCompletedPatients(searchPatients(completedAppointment));
                break;
            case 'cancelled':
                setFilteredCancelledPatients(searchPatients(cancelledAppointment));
                break;
            default:
                break;
        }

        // Reset to first page when searching
        setCurrentPage(1);
    };
    // Updated parser to handle full date-time string
    const parseDDMMYYYYTime = (dateTimeStr) => {
        const [datePart, timePart, meridian] = dateTimeStr.split(' '); // Split into ["13/05/2025", "05:25", "PM"]
        const [day, month, year] = datePart.split('/').map(Number);
        let [hour, minute] = timePart.split(':').map(Number); // Now split "05:25" into [5, 25]

        // Convert 12-hour format to 24-hour format
        if (meridian === 'PM' && hour !== 12) hour += 12;
        if (meridian === 'AM' && hour === 12) hour = 0;

        const finalResult = new Date(year, month - 1, day, hour, minute);
        return finalResult;
    };

    // const handleSearchDate = (dateRange) => {
    //     if (dateRange == null) {
    //         setFilteredCompletedPatients(completedAppointment);
    //         return;
    //     }

    //     if (!dateRange || dateRange.length !== 2) return;

    //     const [startDate, endDate] = dateRange;

    //     const filtered = completedAppointment.filter((patient) => {
    //         const appointmentDate = parseDDMMYYYYTime(patient.datetime);
    //         return appointmentDate >= startDate && appointmentDate <= endDate;
    //     });

    //     setFilteredCompletedPatients(filtered);
    // };


    const handleSearchDate = (dateRange) => {
        if (dateRange == null) {
            // Reset to original data for the current tab
            switch (activeTab) {
                case 'completed':
                    setFilteredCompletedPatients(completedAppointment);
                    break;
                case 'cancelled':
                    setFilteredCancelledPatients(cancelledAppointment);
                    break;
                default:
                    break;
            }
            return;
        }

        if (!dateRange || dateRange.length !== 2) return;

        const [startDate, endDate] = dateRange;

        // Apply date filter to the appropriate tab
        switch (activeTab) {
            case 'completed':
                const filteredCompleted = completedAppointment.filter((patient) => {
                    const appointmentDate = parseDDMMYYYYTime(patient.datetime);
                    return appointmentDate >= startDate && appointmentDate <= endDate;
                });
                setFilteredCompletedPatients(filteredCompleted);
                break;

            case 'cancelled':
                const filteredCancelled = cancelledAppointment.filter((patient) => {
                    const appointmentDate = parseDDMMYYYYTime(patient.datetime);
                    return appointmentDate >= startDate && appointmentDate <= endDate;
                });
                setFilteredCancelledPatients(filteredCancelled);
                break;

            default:
                break;
        }
    };

    const handleCancelClick = (id) => {
        // console.log({"appointment_id":id, "cancel_message":cancelReason});
        // dispatch(doctorCanceledAppointment({"appointment_id":id, "cancel_message":cancelReason}))
        setSelectedAppointmentId(id);
        setShowModal(true);
    };

    const handleCancelConfirm = () => {
        setShowModal(false);
        setShowCancelReasonModal(true);
    };

    const handleCancelReasonSubmit = () => {
        // API call 
        console.log("Cancelled appointment ID:", selectedAppointmentId);
        console.log("Reason:", cancelReason);
        dispatch(doctorCanceledAppointment({
            appointment_id: selectedAppointmentId,
            cancel_message: cancelReason
        }))
            .then(() => {
                // Refresh the upcoming appointments list after successful cancellation
                dispatch(getAllUpcomingAppointment());
                setShowCancelReasonModal(false);
                setCancelReason('');
                setSelectedAppointmentId(null);
                setShowSuccessModal(true);
            })

    };

    // Calculate pagination for each tab
    const getPaginatedPatients = (patients) => {
        const indexOfLastPatient = currentPage * patientsPerPage;
        const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
        return patients?.slice(indexOfFirstPatient, indexOfLastPatient);
    };

    // Calculate total pages
    const getTotalPages = (patients) => {
        return Math.ceil(patients?.length / patientsPerPage);
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle next/previous
    const handleNext = () => {
        const totalPages = getTotalPages(
            activeTab === 'upcoming' ? filteredUpcomingPatients : activeTab === 'completed' ? filteredCompletedPatients : filteredCancelledPatients
        );
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // In your render method, before the return statement:
    const currentPatients = activeTab === 'upcoming' ? filteredUpcomingPatients : activeTab === 'completed' ? filteredCompletedPatients : filteredCancelledPatients;

    const totalPages = getTotalPages(currentPatients);
    const pageNumbers = [];

    // Create page number array with ellipsis logic
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        if (currentPage <= 3) {
            pageNumbers.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
    }
    const isWithinTwoHours = (dateTimeStr) => {
        const appointmentDate = parseDDMMYYYYTime(dateTimeStr);
        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        console.log(appointmentDate);
        return appointmentDate <= twoHoursFromNow;
    };


    return (
        <div className="doctor-panel">
            <div className="container-fluid">
                <div className="doc-panel-inr"> <Header /> </div>
                {upcomingLoading || completedLoading || cancelledLoading ? (
                    <div className="loader-main">
                        <span className="loader"></span>
                    </div>
                ) : (
                    <div className="doc-panel-body">
                        <div className="my-appointments-wrp">
                            <div className="my-appointments-inr">

                                {/* Tabs */}
                                <div className="my-appointments-tab-header">
                                    <div className="my-appointments-tab-head">
                                        <ul style={{ position: 'relative' }}>
                                            <li className="tab-bg"></li>
                                            <li style={activeTab == 'upcoming' ? { backgroundColor: 'white', borderRadius: "10px", color: '#356598' } : {}} onClick={() => setActiveTab('upcoming')} > Upcoming </li>
                                            <li style={activeTab == 'completed' ? { backgroundColor: 'white', borderRadius: "10px", color: '#356598' } : {}} onClick={() => setActiveTab('completed')} > Completed </li>
                                            <li style={activeTab == 'cancelled' ? { backgroundColor: 'white', borderRadius: "10px", color: '#356598' } : {}} onClick={() => setActiveTab('cancelled')} > Cancelled </li>
                                        </ul>
                                    </div>

                                    <MyAppointmentsSearch
                                        onFilterChange={handleFilterChange}
                                        onSearch={handleSearch}
                                        onSearchDate={handleSearchDate}
                                        activeTab={activeTab}
                                    />
                                </div>

                                {/* Tab Content */}
                                <div className="my-appointments-tab-content-wrp">
                                    {/* Upcoming */}
                                    <div className={`myapintmnt-content-tab ${activeTab === 'upcoming' ? 'upcoming' : ''}`} style={{ display: activeTab === 'upcoming' ? 'block' : 'none' }}>
                                        <div className="myapintmnt-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>S.no.</th>
                                                        <th>Name</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>Phone number</th>
                                                        <th>Appointment date</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {console.log("filteredUpcomingPatients1234: ", filteredUpcomingPatients)}
                                                    {getPaginatedPatients(filteredUpcomingPatients)?.length == 0 && <tr>
                                                        <td colSpan="8" style={{ textAlign: "center", padding: "25px 0" }}>No data found</td>
                                                    </tr>}
                                                    {getPaginatedPatients(filteredUpcomingPatients)?.map((patient, index) => (
                                                        <tr key={`upcoming-${index}`}>
                                                            {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                                            <td>{String((currentPage - 1) * patientsPerPage + index + 1).padStart(2, '0')}</td>
                                                            {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link> 
                                                                
                                                                <div className="time" style={{ color: "#199fd9" }}>
                                                                     (DS Code: {patient.ds_code})
                                                                </div>
                                                                

                                                            </td> */}

                                                            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />

                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <Link to="/patient-profile" state={{ patientId: patient.patient_id }}>
                                                                        <h3 style={{ margin: 0, textAlign: "left", }}>{patient.patient_name || "-"}</h3>
                                                                    </Link>
                                                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                                                    {(patient?.referred == true) ? (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (Referred by DS Code: {patient.ds_code})
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td style={{ margin: 0, padding: "0" }}>{patient.patient_age || "-"}</td>
                                                            {/* <td>{patient.patient_gender || "-"}</td> */}
                                                            <td>{patient.patient_gender?.charAt(0).toUpperCase() + patient.patient_gender?.slice(1).toLowerCase()}</td>
                                                            <td>{patient.patient_phone || "-"}</td>
                                                            <td>
                                                                {/* <div className="date h3-title">{patient.datetime}</div> */}
                                                                <div className="date h3-title">
                                                                    {patient.datetime.split(" ")[0]}
                                                                </div>
                                                                <div className="time">
                                                                    {patient.datetime.split(" ")[1]} {patient.datetime.split(" ")[2]}

                                                                </div>
                                                            </td>
                                                            {/* <td>
                                                                {patient.status === 1 ? (
                                                                    // <Link to="/videocall" className="orange-btn">Start Now</Link>
                                                                    <a className="orange-btn" style={{ cursor: "pointer" }} onClick={() => handleCreateChannel(patient.appointment_id)}>Start now</a>) : isWithinTwoHours(patient.datetime) ? (
                                                                        <div className="info-tooltip">
                                                                            <i className="fas fa-info-circle"></i>

                                                                        </div>
                                                                    ) : (
                                                                    <button type="button" className="cmn-btn blue-bg" onClick={() => handleCancelClick(patient.appointment_id)}>
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </td> */}
                                                            <td>
                                                                {patient.status === 1 ? (
                                                                    <a
                                                                        className="orange-btn"
                                                                        style={{ cursor: "pointer" }}
                                                                        onClick={() => handleCreateChannel(patient.appointment_id)}
                                                                    >
                                                                        Start now
                                                                    </a>
                                                                ) : (
                                                                    <button
                                                                        type="button"
                                                                        className="cmn-btn blue-bg"
                                                                        onClick={() => handleCancelClick(patient.appointment_id)}
                                                                        disabled={isWithinTwoHours(patient.datetime)} // disable if appointment time <= 2 hours
                                                                        style={{
                                                                            opacity: isWithinTwoHours(patient.datetime) ? 0.6 : 1,
                                                                            cursor: isWithinTwoHours(patient.datetime) ? "not-allowed" : "pointer",
                                                                        }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </td>

                                                            <td><Link to="/patient-profile" state={{ patientId: patient.patient_id, }} className="cmn-btn">View Profile</Link></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {filteredUpcomingPatients?.length > 0 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={getTotalPages(filteredUpcomingPatients)}
                                                onPageChange={handlePageChange}
                                                onPrevious={handlePrevious}
                                                onNext={handleNext}
                                            />
                                        )}

                                    </div>

                                    {/* Completed Tab */}
                                    <div className={`myapintmnt-content-tab ${activeTab === 'completed' ? 'completed' : ''}`} style={{ display: activeTab === 'completed' ? 'block' : 'none' }}>
                                        <div className="myapintmnt-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>S.no.</th>
                                                        <th>Name</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>Phone number</th>
                                                        <th>Appointment date</th>
                                                        <th>Disease</th>
                                                        <th>Prescription Details</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* {console.log("filteredCompletedPatients123456: ", filteredCompletedPatients)} */}
                                                    {getPaginatedPatients(filteredCompletedPatients)?.length == 0 && <tr>
                                                        <td colSpan="8" style={{ textAlign: "center", padding: "25px 0" }}>No data found</td>
                                                    </tr>}
                                                    {getPaginatedPatients(filteredCompletedPatients)?.map((patient, index) => (
                                                        <tr key={`completed-${index}`}>
                                                            {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                                            <td>{String((currentPage - 1) * patientsPerPage + index + 1).padStart(2, '0')}</td>
                                                            {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                               
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                                                            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />

                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <Link to="/patient-profile" state={{ patientId: patient.patient_id }}>
                                                                        <h3 style={{ margin: 0, textAlign: "left" }}>{patient.patient_name || "-"}</h3>
                                                                    </Link>
                                                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                                                    {(patient?.referred == true) ? (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (Referred by DS Code: {patient.ds_code})
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>{patient.patient_age || "-"}</td>
                                                            {/* <td>{patient.patient_gender || "-"}</td> */}
                                                            <td>{patient.patient_gender?.charAt(0).toUpperCase() + patient.patient_gender?.slice(1).toLowerCase()}</td>
                                                            <td>{patient.patient_phone || "-"}</td>
                                                            <td>
                                                                {/* <div className="date h3-title">{patient.datetime}</div> */}
                                                                <div className="date h3-title">
                                                                    {patient.datetime.split(" ")[0]}
                                                                </div>
                                                                <div className="time">
                                                                    {patient.datetime.split(" ")[1]} {patient.datetime.split(" ")[2]}

                                                                </div>
                                                            </td>
                                                            <td>{patient.diagnosis || "-"}</td>
                                                            <td><Link
                                                                to="/completed-appointment-screen"
                                                                state={{
                                                                    id: patient.prescription_id,
                                                                    patientId: patient.patient_id,
                                                                    chat_id: patient.chat_id,
                                                                }} style={{ color: '#199FD9', textDecoration: 'underline !important' }} className="text-primary text-decoration-underline"
                                                            >
                                                                View
                                                            </Link></td>
                                                            <td><Link to="/patient-profile" state={{ patientId: patient.patient_id, appointmentId: patient.appointment_id, source: "completed", hideSchedule: false }} className="cmn-btn">View Profile</Link></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {filteredCompletedPatients?.length > 0 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={getTotalPages(filteredCompletedPatients)}
                                                onPageChange={handlePageChange}
                                                onPrevious={handlePrevious}
                                                onNext={handleNext}
                                            />
                                        )}
                                    </div>

                                    {/* Cancelled Tab */}
                                    <div className={`myapintmnt-content-tab ${activeTab === 'cancelled' ? 'cancelled' : ''}`} style={{ display: activeTab === 'cancelled' ? 'block' : 'none' }}>
                                        <div className="myapintmnt-table">
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>S.no.</th>
                                                        <th>Name</th>
                                                        <th>Age</th>
                                                        <th>Gender</th>
                                                        <th>Phone number</th>
                                                        <th>Appointment date</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getPaginatedPatients(filteredCancelledPatients)?.length == 0 && <tr>
                                                        <td colSpan="8" style={{ textAlign: "center", padding: "25px 0" }}>No data found</td>
                                                    </tr>}
                                                    {getPaginatedPatients(filteredCancelledPatients)?.map((patient, index) => (
                                                        <tr key={`cancelled-${index}`}>
                                                            {/* <td>{(currentPage - 1) * patientsPerPage + index + 1}</td> */}
                                                            <td>{String((currentPage - 1) * patientsPerPage + index + 1).padStart(2, '0')}</td>
                                                            {/* <td>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />
                                                                
                                                                <Link to="/patient-profile" state={{ patientId: patient.patient_id }}><h3>{patient.patient_name || "-"}</h3></Link>

                                                            </td> */}
                                                            <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                                <img src={baseUrl + "/" + patient?.patient_profile} alt="Patient" />

                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <Link to="/patient-profile" state={{ patientId: patient.patient_id }}>
                                                                        <h3 style={{ margin: 0, textAlign: "left" }}>{patient.patient_name || "-"}</h3>
                                                                    </Link>
                                                                    {/* {(patient?.ds_code &&
                                                                        <div style={{ color: "#199fd9", marginTop: "2px" }}>
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )} */}
                                                                    {(patient?.referred == true) ? (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (Referred by DS Code: {patient.ds_code})
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            style={{
                                                                                color: "#199fd9",
                                                                                marginTop: "2px",
                                                                            }}
                                                                        >
                                                                            (DS Code: {patient.ds_code})
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>{patient.patient_age || "-"}</td>
                                                            {/* <td>{patient.patient_gender || "-"}</td> */}
                                                            <td>{patient.patient_gender?.charAt(0).toUpperCase() + patient.patient_gender?.slice(1).toLowerCase()}</td>
                                                            <td>{patient.patient_phone || "-"}</td>
                                                            <td>
                                                                {/* <div className="date h3-title">{patient.datetime}</div> */}
                                                                <div className="date h3-title">
                                                                    {patient.datetime.split(" ")[0]}
                                                                </div>
                                                                <div className="time">
                                                                    {patient.datetime.split(" ")[1]} {patient.datetime.split(" ")[2]}

                                                                </div>

                                                            </td>
                                                            <td><Link to="/patient-profile" state={{ patientId: patient.patient_id, appointmentId: patient.appointment_id, source: "cancelled", hideSchedule: false }} className="cmn-btn">View Profile</Link></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {filteredCancelledPatients?.length > 0 && (
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={getTotalPages(filteredCancelledPatients)}
                                                onPageChange={handlePageChange}
                                                onPrevious={handlePrevious}
                                                onNext={handleNext}
                                            />
                                        )}
                                    </div>

                                    {/* <Pagination currentPage={currentPage} totalPages={totalPages}
                                    onPageChange={handlePageChange} onPrevious={handlePrevious}
                                    onNext={handleNext} /> */}
                                </div>
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
            <CustomModal visible={showSuccessModal}
                title="Appointment Cancelled"
                subtitle="Your appointment is cancelled successfully."
                onConfirm={() => setShowSuccessModal(false)}
                onCancel={() => setShowSuccessModal(false)}
                actionType="success"
            />
        </div>
    );
};

export default MyAppointments;
