import { useState, useEffect } from 'react';
import { DateRangePicker } from 'rsuite';
import 'rsuite/DateRangePicker/styles/index.css';
import { useDispatch, useSelector } from 'react-redux';

const MyAppointmentsSearch = ({ onFilterChange, onSearch, activeTab, onSearchDate ,}) => {
  const [patientName, setPatientName] = useState('');
  const [patients, setPatients] = useState([]);
  const [age, setAge] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [diagnosisOptions, setDiagnosisOptions] = useState([]);
  const [filters, setFilters] = useState({ name: '', age: '', diagnosis: '' });
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectingFromDate, setSelectingFromDate] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

 const[searchQuery,setSearchQuery] = useState('');

  const dispatch = useDispatch();
  const { completedAppointment } = useSelector((state) => state.appointments);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Reset the state when the component is mounted
  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    // Reset calendar and filters when tab changes
    resetForm();
    onSearchDate(null); // Clear any date filtering
    onFilterChange({ name: '', age: '', diagnosis: '' }); // Clear other filters
  }, [activeTab]);

  useEffect(() => {
    if (completedAppointment && completedAppointment.length > 0) {
      const uniqueDiagnoses = [
        ...new Set(
          completedAppointment
            .map(appt => appt.diagnosis)
            .filter(diagnosis =>
              diagnosis &&
              diagnosis.trim() !== "" &&
              diagnosis.trim() !== "-"
            )
        )
      ];
      setDiagnosisOptions(uniqueDiagnoses);
    }
  }, [completedAppointment]);

  const resetForm = () => {
    setPatientName('');
    setAge('');
    setFilters({ name: '', age: '', diagnosis: '' });
    setShowFilter(false);
    setFromDate('');
    setToDate('');
    setShowCalendar(false);
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
    setSearchQuery('');
  };

  const handleSearchChange=(e)=>{
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFilterToggle = () => {
    setShowFilter((prev) => !prev);
  };

  const changeMonth = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const weeks = [];
    let days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="empty-cell"></td>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelectedFrom = fromDate && fromDate.startsWith(`${day}/${currentMonth + 1}`);
      const isSelectedTo = toDate && toDate.startsWith(`${day}/${currentMonth + 1}`);

      days.push(
        <td
          key={`day-${day}`}
          className={`calendar-day ${isSelectedFrom ? 'selected-from' : ''} ${isSelectedTo ? 'selected-to' : ''}`}
          onClick={() => handleDateSelection(day)}
        >
          {day}
        </td>
      );

      // Start a new row after Saturday or at the end of the month
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
        days = [];
      }
    }

    return weeks;
  };

  const handleSelectDate = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    if (onSearchDate) {
      onSearchDate(value);
    }
  };

  // const handleDateSelection = (day) => {
  //   const selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;

  //   if (selectingFromDate) {
  //     setFromDate(selectedDate);
  //     setSelectingFromDate(false);
  //   } else {
  //     setToDate(selectedDate);
  //     setShowCalendar(false);

  //     // Convert dates to Date objects for comparison
  //     const fromParts = fromDate.split('/');
  //     const toParts = selectedDate.split('/');

  //     const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
  //     const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);

  //     // Call the parent component's date search handler
  //     onSearchDate([startDate, endDate]);
  //   }
  // };

  const handleDateSelection = (day) => {
    const selectedDate = `${day}/${currentMonth + 1}/${currentYear}`;

    if (selectingFromDate) {
      setFromDate(selectedDate);
      setSelectingFromDate(false);
    } else {
      setToDate(selectedDate);
      // Removed the auto-apply logic from here
    }
  };


  // const handleCalendarToggle = () => {
  //   setShowCalendar((prev) => !prev);
  //   setSelectingFromDate(true);
  //   // Reset dates when reopening calendar
  //   if (!showCalendar) {
  //     setFromDate('');
  //     setToDate('');
  //   }
  // };

  const handleCalendarToggle = () => {
    setShowCalendar((prev) => !prev);
    // Only reset if we're opening with no current selection
    if (!showCalendar && !fromDate && !toDate) {
      setSelectingFromDate(true);
    }
  };

  const handleFilterSubmit = (action) => {
    if (action === 'clear') {
      setFilters({ name: '', age: '', diagnosis: '' });
      onFilterChange({ name: '', age: '', diagnosis: '' });
      setShowFilter(false);
    } else {
      onFilterChange(filters);
      setShowFilter(false);
    }
  };

  // const handleClearDateFilter = () => {
  //   setFromDate('');
  //   setToDate('');
  //   setSelectingFromDate(true);
  //   // Call parent component with empty dates to clear filter
  //   onSearchDate([]);
  // };

  // const handleApplyDateFilter = () => {
  //   if (fromDate && toDate) {
  //     // Convert dates to Date objects for comparison
  //     const fromParts = fromDate.split('/');
  //     const toParts = toDate.split('/');

  //     const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
  //     const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);

  //     // Call the parent component's date search handler
  //     onSearchDate([startDate, endDate]);
  //     setShowCalendar(false);
  //   }
  // };

  const handleClearDateFilter = () => {
    setFromDate('');
    setToDate('');
    setSelectingFromDate(true);
    // Call parent component with null to clear filter
    onSearchDate(null); // or onSearchDate([]) depending on your parent component
    setShowCalendar(false); // Close the calendar when clearing
  };

  const handleApplyDateFilter = () => {
    if (fromDate && toDate) {
      // Convert dates to Date objects for comparison
      const fromParts = fromDate.split('/');
      const toParts = toDate.split('/');

      const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
      const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);

      // Ensure end date is at end of day
      endDate.setHours(23, 59, 59, 999);
      
      // Call the parent component's date search handler
      onSearchDate([startDate, endDate]);
      setShowCalendar(false);
    }
  };



  return (
    <div className="my-appointments-search-wrp" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
      {/* <div className='datepicker-wrp' style={(activeTab == "upcoming" || activeTab == "cancelled") ? { display: "none" } : {}}> */}
      <div className='datepicker-wrp' style={(activeTab == "upcoming") ? { display: "none" } : {}}>
        <input 
          type="text" 
          id="dateRangeInput" 
          placeholder="Select date range" 
          readOnly
          value={fromDate && toDate ? `${fromDate} - ${toDate}` : ''}
          onClick={handleCalendarToggle}
        />
        {showCalendar && (
          <div className="calendar-popup" style={{ 
            display: 'block', 
            position: 'absolute', 
            zIndex: 1000, 
            background: 'white', 
            padding: '0px', 
            borderRadius: '5px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
            width: '300px',  
            left: 0,  
            overflow: 'hidden',
          }}>
            <div className="calendar-header">
              <div className="cal-head-btn-wrp">
                <button 
                  type="button" 
                  className={`range-btn ${selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(true)}
                >
                  <span id="fromDateLabel">{fromDate || 'From Date'}</span>
                </button>
              </div>
              <div className="cal-head-btn-wrp">
                <button 
                  type="button" 
                  className={`range-btn ${!selectingFromDate ? 'active' : ''}`}
                  onClick={() => setSelectingFromDate(false)}
                >
                  <span id="toDateLabel">{toDate || 'To Date'}</span>
                </button>
              </div>
              
              <div className="monthyear-wrp w-100" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0' }}>
                <button 
                  type="button" 
                  className="arrow-btn" 
                  onClick={() => changeMonth(-1)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  &#x2190;
                </button>
                <span id="monthYearLabel" style={{ fontWeight: 'bold' }}>
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button 
                  type="button" 
                  className="arrow-btn" 
                  onClick={() => changeMonth(1)}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  &#x2192;
                </button>
              </div>
            </div>
            <table className="calendar-grid" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <th key={day} style={{ padding: '5px', textAlign: 'center' }}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renderCalendar()}
              </tbody>
            </table>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '10px', 
              borderTop: '1px solid #eee'
            }}>
              <button 
                onClick={handleClearDateFilter}
                style={{
                  padding: '5px 10px',
                  background: '#f5f5f5',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
              <button 
                onClick={handleApplyDateFilter}
                disabled={!fromDate || !toDate}
                style={{
                  padding: '5px 10px',
                  background: fromDate && toDate ? '#0066cc' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: fromDate && toDate ? 'pointer' : 'not-allowed'
                }}
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="formfield" style={activeTab == "completed" ? { display: "none" } : {}}>
        <input
          placeholder="Search anything here"
          type="text"
           value={searchQuery}
            onChange={handleSearchChange}
        />
        <input type="submit" />
      </div>

      <div className="past-patient-filter-wrp" style={activeTab === "cancelled" || activeTab === "upcoming" ? { display: "none" } : {}}>
        <button type="button" onClick={handleFilterToggle}>
          Filter
          <img src="./images/filter-icon.svg" alt="Icon" />
        </button>

        <div className={`filter-options-drpdn ${showFilter ? "active" : ""}`}>
          <form>
            <div className="filter-form">
              <div className="filter-grp">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleInputChange}
                  placeholder="Patient Name"
                />
              </div>
              <div className="filter-grp">
                <label>Age</label>
                <input
                  type="text"
                  name="age"
                  value={filters.age}
                  onChange={handleInputChange}
                  placeholder="Age"
                />
              </div>
              <div className="filter-grp">
                <label>Diagnosis</label>
                <select
                  name="diagnosis"
                  value={filters.diagnosis}
                  onChange={handleInputChange}
                >
                  <option value="">All Diagnoses</option>
                  {diagnosisOptions.map((diagnosis, index) => (
                    <option key={index} value={diagnosis}>
                      {diagnosis}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="filter-form-btn-wrp">
              <button
                type="button"
                className="orange-btn"
                onClick={() => handleFilterSubmit('clear')}
                style={{ borderRadius: 0 }}
              >
                Clear Filter
              </button>
              <button
                type="button"
                className="orange-btn"
                onClick={() => handleFilterSubmit('apply')}
                style={{ borderRadius: 0 }}
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsSearch;












// import { useState, useEffect } from 'react';
// import { DateRangePicker } from 'rsuite';
// import 'rsuite/DateRangePicker/styles/index.css';

// const MyAppointmentsSearch = ({ onFilterChange, onSearch, activeTab ,onSearchDate}) => {
//   const [patientName, setPatientName] = useState('');
//   const [age, setAge] = useState('');
//   const [disease, setDisease] = useState('');
//   const [showFilter, setShowFilter] = useState(false);

//   // Reset the state when the component is mounted
//   useEffect(() => {
//     resetForm();
//   }, []);

//   const resetForm = () => {
//     setPatientName('');
//     setAge('');
//     setDisease('');
//     setShowFilter(false);
//   };

//   const handleFilterToggle = () => {
//     setShowFilter((prev) => {
//       const newValue = !prev;
//       if (newValue) {
//         setPatientName('');
//         setAge('');
//         setDisease('');
//       }
//       return newValue;
//     });
//   };

//   const handleFilterSubmit = (e, action) => {
//     e.preventDefault();
//     if (action === 'clear') {
//       setPatientName('');
//       setAge('');
//       setDisease('');
//       onFilterChange({ patientName: '', age: '', disease: '' });
//     } else {
//       onFilterChange({
//         patientName,
//         age,
//         disease: disease || '',
//       });
//       setShowFilter(false);
//     }
//   };

//   const buttonStyle = {
//     backgroundColor: '#199fd9',
//     color: 'white',
//     border: 'none',
//     padding: '10px 20px',
//     cursor: 'pointer',
//     fontSize: '14px',
//     borderRadius: '5px',
//     margin: '5px',
//   };

//   const buttonHoverStyle = {
//     backgroundColor: '#199fd9',
//   };

//   return (
//     <div className="my-appointments-search-wrp" style={{display:"flex", justifyContent:"center", alignItems:"center", gap:"10px"}}>
//       <div className='datepicker-wrp' style={(activeTab == "upcoming" || activeTab ==  "cancelled") ? { display: "none" } : {}}>
//         <DateRangePicker format="MM/dd/yyyy" character=" - " placement='bottomEnd' onChange={(dateRange) => {onSearchDate(dateRange)}} onClean={() => { onSearchDate(null);  }} />
//       </div>
     
//       <div className="formfield" style={activeTab == "completed" ? { display: "none" } : {}}>
//         <input 
//           placeholder="Search anything here" 
//           type="text" 
//           onChange={(e) => onSearch(e.target.value.trim())}
//         />
//         <input type="submit" />
//       </div>

//       <div className="past-patient-filter-wrp" style={activeTab === "cancelled" || activeTab === "upcoming" ? { display: "none" } : {}}>

//         <button type="button" onClick={handleFilterToggle}> 
//           Filter
//           <img src="./images/filter-icon.svg" alt="Icon"/> 
//         </button>

//         <div className={`filter-options-drpdn ${showFilter ? "active" : ""}`}>
//           <div>
//             <div className="filter-form">
//               <div className="filter-grp">
//                 <label>Patient Name</label>
//                 <input type="text" placeholder="Patient Name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
//               </div>

//               <div className="filter-grp">
//                 <label>Age</label>
//                 <input type="text" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
//               </div>

//               <div className="filter-grp">
//                 <label>Disease</label>
//                 <select value={disease} onChange={(e) => setDisease(e.target.value)} >
//                   <option value="" disabled> Disease </option>
//                   <option value="Parasitic disease">Parasitic Disease</option>
//                 </select>
//               </div>

//             </div>

//             <div className="filter-form-btn-wrp">
//               <button type="button" onClick={(e) => handleFilterSubmit(e, 'clear')} style={{ padding:"10px 20px", cursor:"pointer", fontSize:"14px", borderRadius:"5px", margin:"5px"}} 
//               onMouseOver={(e) => {e.target.style.backgroundColor = '#199fd9', e.target.style.color = "white",
//                 e.target.style.border = "none"}}
//               onMouseOut={(e) => {e.target.style.backgroundColor = 'white', e.target.style.color = "black", e.target.style.border = "0.5px solid black" }}
//               >
//                 Clear Filter
//               </button>

//               <button type="button" onClick={(e) => handleFilterSubmit(e, 'apply')} style={buttonStyle}
//                 onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor) }
//                 onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor) } >
//                 Apply Filter
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyAppointmentsSearch;