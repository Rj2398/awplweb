import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Video from "../../Video";
import Header from "../doctorPanel/Header";

import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  completePrescription,
  medicineSearch,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { getPatientProfileData } from "../../redux/slices/patientProfileSlice";
import { videoCallSubmit } from "../../redux/slices/dataSlice";

const VideoCall = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  //

  //
  const videoStreamRef = useRef(null);
  const location = useLocation();
  const { id, patientId, time_period } = location.state || {};
  const suggestionsRefs = useRef([]);
  const dispatch = useDispatch();

  const { patientProfileData } = useSelector((state) => state.patientProfile);
  // const time_period11 = "12:45 - 01:00 PM";
  // console.log(time_period, "time period*****");

  // code testted

  // const time_period11 = "03:30 - 03:36 PM";
  const [displayTime, setDisplayTime] = useState(""); // State for displaying HH:MM:SS or MM:SS elapsed

  console.log(time_period, "ksahfasdfjksdfsdfls");

  useEffect(() => {
    // Parse start and end times from the string
    const parts = time_period.split(" - ");
    const startTimeStr = parts[0]; // e.g., "03:30"
    const endTimeStr = parts[1]; // e.g., "03:36 PM"

    // --- Prepare Start Time (for the continuous counter) ---
    const [startHoursStr, startMinutesStr] = startTimeStr.split(":");
    let startHours = parseInt(startHoursStr, 10);
    const startMinutes = parseInt(startMinutesStr, 10);

    // Determine AM/PM for the start time.
    // Assuming if the end time is PM, the start time is also PM unless it crosses 12 AM.
    // This is a common pattern for time ranges. For robustness, you might need more complex parsing.
    const amPmForStartTime = endTimeStr.slice(-2); // Use AM/PM from end time for simplicity

    if (amPmForStartTime === "PM" && startHours !== 12) {
      startHours += 12;
    } else if (amPmForStartTime === "AM" && startHours === 12) {
      startHours = 0; // 12 AM (midnight)
    }

    // --- Prepare End Time (for the navigation trigger) ---
    const [endHoursStr, endMinutesStr] = endTimeStr.slice(0, -2).split(":");
    let endHours = parseInt(endHoursStr, 10);
    const endMinutes = parseInt(endMinutesStr, 10);
    const amPmForEndTime = endTimeStr.slice(-2);

    if (amPmForEndTime === "PM" && endHours !== 12) {
      endHours += 12;
    } else if (amPmForEndTime === "AM" && endHours === 12) {
      endHours = 0;
    }

    const updateTime = () => {
      const now = new Date(); // Current date and time

      // 1. Create the `actualStartTime` Date object for the continuous counter
      // This is 03:30 PM today.
      const actualStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        startHours,
        startMinutes,
        0 // Seconds
      );

      // 2. Create the `parsedEndTime` Date object for the navigation calculation
      // This is 03:36 PM today.
      const parsedEndTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        endHours,
        endMinutes,
        0
      );

      // 3. Calculate the `navigationTargetTime`: 5 minutes after `parsedEndTime`
      const navigationTargetTime = new Date(
        parsedEndTime.getTime() + 5 * 60 * 1000
      );

      // --- Navigation Check ---
      if (now.getTime() >= navigationTargetTime.getTime()) {
        console.log(
          "Navigating to /pendingprescription as 5 minutes passed after",
          endTimeStr
        );
        window.location.href = "/doctor-home";
        return; // Important: Stop further processing in this interval after navigation.
      }

      // --- Continuous Timer Display Logic (Always running from actualStartTime) ---
      let timeDifferenceInMilliseconds =
        now.getTime() - actualStartTime.getTime();

      // If the actual start time is in the future, show 00:00 initially or a countdown
      // For "always running" as in "always counting up since 03:30 PM, even if 03:30 PM hasn't come yet"
      // we might want to handle negative difference if `now` is before `actualStartTime`.
      // If you mean it only starts counting once 03:30 PM hits, then the logic needs adjustment.
      // Assuming "always running" means showing 00:00 until 03:30 PM, then counting up.
      if (timeDifferenceInMilliseconds < 0) {
        // If current time is before the actual start time
        // You could show a countdown to 03:30 PM, or just '00:00'
        setDisplayTime("00:00:00"); // Or adjust to show countdown if preferred
      } else {
        const totalSeconds = Math.floor(timeDifferenceInMilliseconds / 1000);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const formattedHours = String(hours).padStart(2, "0");
        const formattedMinutes = String(minutes).padStart(2, "0");
        const formattedSeconds = String(seconds).padStart(2, "0");

        // Display as HH:MM:SS (or just MM:SS if hours are 0)
        if (hours > 0) {
          setDisplayTime(
            `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
          );
        } else {
          setDisplayTime(`${formattedMinutes}:${formattedSeconds}`);
        }
      }
    };

    updateTime(); // Initial call
    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [time_period]); // Dependency array

  // code tested

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ patientId: patientId }));
    }
  }, [dispatch, patientId]);

  const patientInfo = patientProfileData?.basic_information || {};
  const {
    completeAssignedPrescription,
    loading,
    loading2,
    error,
    medicineSearch: medicineSearchResults,
    user,
  } = useSelector((state) => state.user);
  // const [showModal, setShowModal] = useState(false);
  const [debouncedQueries, setDebouncedQueries] = useState([]);
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [query, setQuery] = useState("");
  const [showSuggestionsPopup, setShowSuggestionsPopup] = useState(false);
  const handleNotesChange = (e) => setNotes(e.target.value);
  const handleDiagnosisChange = (e) => setDiagnosis(e.target.value);
  const [searchTimeouts, setSearchTimeouts] = useState({});
  const [activeMedicineIndex, setActiveMedicineIndex] = useState(null);
  const [medicineErrors, setMedicineErrors] = useState([]);
  const [medicines, setMedicines] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      suggestions: [],
      showSuggestion: false,
      isValid: false,
    },
  ]);

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addMoreMedicine = () => {
    setMedicines([
      ...medicines,
      {
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        suggestions: [],
        showSuggestion: false,
        isValid: false,
      },
    ]);
  };
  const [serverSuggestions, setServerSuggestions] = useState({});
  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    updated[index].isValid = false;

    if (field === "medicineName") {
      setActiveMedicineIndex(index);

      if (searchTimeouts[index]) {
        clearTimeout(searchTimeouts[index]);
      }

      // Only search if input is not empty
      if (value.trim().length > 0) {
        const timeout = setTimeout(() => {
          dispatch(medicineSearch({ query: value }));
        }, 500);

        setSearchTimeouts((prev) => ({ ...prev, [index]: timeout }));
      } else {
        updated[index].suggestions = [];
      }

      const errors = [...medicineErrors];
      errors[index] = "";
      setMedicineErrors(errors);
    }

    setMedicines(updated);
  };

  useEffect(() => {
    if (medicineSearchResults && activeMedicineIndex !== null) {
      const updated = [...medicines];
      updated[activeMedicineIndex].suggestions = medicineSearchResults;
      setMedicines(updated);
      setServerSuggestions((prev) => ({
        ...prev,
        [activeMedicineIndex]: medicineSearchResults,
      }));
    }
  }, [medicineSearchResults]);

  const handleSuggestionSelect = (index, name) => {
    const updated = [...medicines];
    updated[index].medicineName = name;
    updated[index].suggestions = [];
    updated[index].isValid = true;

    setMedicines(updated);

    setMedicineErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = "";
      return newErrors;
    });
    setServerSuggestions((prev) => ({
      ...prev,
      [index]: prev[index] ? prev[index] : [],
    }));

    setActiveMedicineIndex(null);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      setShowSuggestionsPopup(false);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [medicines]);

  /// validation for medicine name
  const isValidatemedicine = (medicineName, index) => {
    const suggestionsForIndex = serverSuggestions[index] || [];
    return suggestionsForIndex.some((sug) => sug.product_name === medicineName);
  };
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !diagnosis ||
      medicines.some(
        (med) =>
          !med.medicineName || !med.dosage || !med.frequency || !med.duration
      )
    ) {
      toast.error("All fields are required (marked with *)");
      return;
    }

    // loop for medicine validation
    const errors = [...medicineErrors];
    let hasErrors = false;

    medicines.forEach((med, i) => {
      if (!med.isValid) {
        const suggestionsForIndex = serverSuggestions[i] || [];
        const isValid = suggestionsForIndex.some(
          (sug) => sug.product_name === med.medicineName
        );

        if (!isValid) {
          errors[i] = "Please select a valid medicine name from suggestions";
          hasErrors = true;
        } else {
          errors[i] = "";
          // Update the isValid flag if it was valid but the flag wasn't set
          const updated = [...medicines];
          updated[i].isValid = true;
          setMedicines(updated);
        }
      } else {
        errors[i] = "";
      }
    });

    setMedicineErrors(errors);

    if (hasErrors) {
      return;
    }

    // if (errors.some(err => err)) {
    //   return;
    // }

    const formData = {
      // symptom_id: id,
      appointment_id: id,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      })),
    };
    console.log(formData, "ffff123412341234123412341");

    const res = dispatch(videoCallSubmit(formData));
    // if (res.payload && res.payload.status) {
    //   // setShowModal(true);
    //   navigate("/doctor-home")

    // }
  };

  const handleToggleMute = () => setIsMuted((prev) => !prev);

  const handleToggleCamera = () => {
    setIsCameraOn((prev) => {
      const newState = !prev;
      return newState;
    });
  };

  const handleEndCall = () => navigate("/doctor-home");

  // const formatTime = (totalSeconds) => {
  //   const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  //   const secs = String(totalSeconds % 60).padStart(2, '0');
  //   return `${minutes}:${secs}`;
  // };

  // const formatTime = (totalSeconds) => {
  //   const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  //   const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
  //     2,
  //     "0"
  //   );
  //   const secs = String(totalSeconds % 60).padStart(2, "0");
  //   return `${hours}:${minutes}:${secs}`;
  // };

  return (
    <main className="doctor-panel video-call-pg">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          {" "}
          <Header />{" "}
        </div>
        {/* Header */}
        {/* <div className="doc-panel-header">
            <div className="logo">
              <a href="doctor-home.html">
                <img src="./images/logo.png" alt="Logo" />
              </a>
            </div>
          </div> */}

        {/* Video Call Screen */}
        <div className="video-call-screen">
          <div className="vdo-call-scrn-row row">
            {/* Left side - Video */}
            <div className="vdo-call-scrn-left-wrp col-lg-6">
              <div className="vdoclscrn-left">
                <div className="vdo-screen">
                  <div className="vdo-screen-controls">
                    <div className="vdoscrn-controls-head">
                      <h1>{user.name}</h1>
                      <div className="vdoscrn-status-time-wrp">
                        <span className="vdoscrn-status live">LIVE</span>
                        <span className="vdoscrnduration-time">
                          {displayTime}
                        </span>
                      </div>
                    </div>
                    <div className="vdoscrn-controls-body">
                      <div className="vdoscrn-volume-con">
                        <img src="./images/speaker-icon.svg" alt="Icon" />
                        <input type="range" />
                      </div>
                    </div>
                    <div className="vdoscrn-controls-ftr">
                      <div className="vdoscrn-action-controls">
                        <button
                          className="vdo-toggle-btn"
                          onClick={handleToggleCamera}
                        >
                          <img
                            src={
                              isCameraOn
                                ? "./images/video-cam-icon.svg"
                                : "./images/video-camera-off-icon.svg"
                            }
                            alt="Camera Icon"
                            style={{
                              filter: !isCameraOn ? "invert(100%)" : "none",
                            }}
                          />
                        </button>

                        <button
                          className="vdo-call-end-btn"
                          onClick={handleEndCall}
                          style={{
                            borderRadius: "50%",
                            padding: "10px",
                          }}
                        >
                          <img
                            src="./images/call-icon.svg"
                            alt="Call End Icon"
                          />
                        </button>

                        {/* <button className="vdo-mute-toggle-btn">
                            <img src="./images/mic-icon.svg" alt="Icon" />
                          </button> */}
                        <button
                          className="vdo-mute-toggle-btn"
                          onClick={handleToggleMute}
                        >
                          <img
                            src={
                              isMuted
                                ? "./images/mic-off.svg"
                                : "./images/mic-icon.svg"
                            }
                            alt="Mic Icon"
                            style={{
                              filter: isMuted ? "invert(100%)" : "none", // Apply invert to make the mic-off icon white
                            }}
                          />
                        </button>
                      </div>

                      <div className="doc-vdo-scrn">
                        {/* <img
                            src="./images/doc-vdo-thumb.png"
                            alt="Doctor Video Thumbnail"
                          /> */}
                      </div>
                    </div>
                  </div>

                  <div className="patient-vdo-screen">
                    {/* <img src="./images/patient-video-thumb.png" alt="Patient Video Thumbnail" /> */}
                    <Video isCameraOn={isCameraOn} isMuted={isMuted} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Patient Details */}

            <div className="vdoclscrn-patient-details-wrp col-lg-6">
              {loading ? (
                <div className="loader-main">
                  <span className="loader"></span>
                </div>
              ) : (
                <form>
                  <div className="vdoclscrn-patient-details-wrp-inr">
                    <div className="vdoclscrn-patient-details">
                      <div className="vdoclscrnpd-wrp">
                        <h2>Patient Details:</h2>
                        <div className="vdoclscrnpd">
                          {[
                            {
                              label: "Patient Name",
                              value: patientInfo.name || "N/A",
                            },
                            { label: "Age", value: patientInfo.age || "N/A" },
                            {
                              label: "Gender",
                              value: patientInfo.gender
                                ? patientInfo.gender.charAt(0).toUpperCase() +
                                  patientInfo.gender.slice(1)
                                : "N/A",
                            },
                            {
                              label: "Height",
                              value: patientInfo.height || "N/A",
                            },
                            {
                              label: "Weight",
                              value: patientInfo.weight || "N/A",
                            },
                            {
                              label: "Contact No.",
                              value: patientInfo.phone_no || "N/A",
                            },
                          ].map((item, index) => (
                            <div className="vdoclscrnpd-grp" key={index}>
                              <span className="vdoclscrnpd-label">
                                {item.label}
                              </span>
                              <span className="vdoclscrnpd-val">
                                {item.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="vdoclscrnpd-wrp">
                        <h2>Report:</h2>

                        {medicines.map((medicine, index) => (
                          <div
                            key={`medicine-${index}`}
                            className=""
                            ref={(el) => (suggestionsRefs.current[index] = el)}
                          >
                            <div className="vdoclscrnpd">
                              <div className="formfield search-bar">
                                <label>
                                  Medicine Name<span>*</span>
                                </label>
                                <div className="search-input">
                                  <input
                                    type="text"
                                    placeholder="Ibupro"
                                    value={medicine.medicineName}
                                    onChange={(e) =>
                                      handleMedicineChange(
                                        index,
                                        "medicineName",
                                        e.target.value
                                      )
                                    }
                                    autoComplete="off"
                                  />

                                  <input type="submit" value="search" />
                                  {medicineErrors[index] && (
                                    <div
                                      style={{
                                        color: "red",
                                        // marginTop: "5px",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {medicineErrors[index]}
                                    </div>
                                  )}
                                  {activeMedicineIndex === index &&
                                    medicine.medicineName &&
                                    !medicineErrors[index] && (
                                      <ul
                                        style={{
                                          position: "absolute",
                                          backgroundColor: "white",
                                          border: "1px solid #ccc",
                                          width: "100%",
                                          maxHeight: "150px",
                                          overflowY: "auto",
                                          zIndex: 10,
                                          marginTop: -5,

                                          paddingLeft: "10px",
                                          listStyle: "none",
                                        }}
                                      >
                                        {medicine.suggestions.length > 0
                                          ? medicine.suggestions.map(
                                              (sug, i) => (
                                                <li
                                                  key={i}
                                                  onClick={() =>
                                                    handleSuggestionSelect(
                                                      index,
                                                      sug.product_name
                                                    )
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    padding: 5,
                                                  }}
                                                >
                                                  {sug.product_name}
                                                </li>
                                              )
                                            )
                                          : medicine.medicineName.trim()
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
                                <label>
                                  Dosage<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Dosage"
                                  value={medicine.dosage}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="formfield">
                                <label>
                                  Frequency<span>*</span>
                                </label>
                                <select
                                  value={medicine.frequency}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "frequency",
                                      e.target.value
                                    )
                                  }
                                  required
                                  style={{
                                    backgroundColor: "#F9F9F9",

                                    padding: "8px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    fontSize: "16px",
                                  }}
                                >
                                  <option value="">Select Frequency</option>
                                  <option value="1 time (in a day)">
                                    1 time (in a day)
                                  </option>
                                  <option value="2 times (in a day)">
                                    2 times (in a day)
                                  </option>
                                  <option value="3 times (in a day)">
                                    3 times (in a day)
                                  </option>
                                </select>
                              </div>

                              <div className="formfield">
                                <label>
                                  Duration<span>*</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Duration"
                                  value={medicine.duration}
                                  onChange={(e) =>
                                    handleMedicineChange(
                                      index,
                                      "duration",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>

                            <hr
                              style={{
                                border: "none",
                                height: "3px",
                                backgroundColor: "#333",
                                margin: "10px 0",
                              }}
                            />
                          </div>
                        ))}

                        <button
                          type="button"
                          className="orange-btn"
                          onClick={addMoreMedicine}
                          style={{
                            margin: "20px 0",
                            padding: 0,
                            minWidth: "150px",
                          }}
                        >
                          <img src="./images/plus-icon-circle.svg" alt="Icon" />{" "}
                          Add More
                        </button>
                      </div>

                      <div className="add-notes-wrp ">
                        <div className="formfield">
                          <label>Notes:</label>
                          {/* <input
                            type="text"
                            placeholder="Notes"
                            value={notes}
                            onChange={handleNotesChange}
                          /> */}
                          <textarea
                            placeholder="Notes..."
                            value={notes}
                            onChange={handleNotesChange}
                            rows={4}
                            style={{
                              width: "100%",
                              resize: "vertical",
                              backgroundColor: "#fff", // ✅ Fixes blue background
                              color: "#000", // ✅ Optional: ensure readable text
                              border: "1px solid #ccc", // Optional: better border
                              borderRadius: "4px", // Optional: softer corners
                              padding: "8px", // Optional: internal spacing
                            }}
                          />
                        </div>
                      </div>

                      <div className="add-notes-wrp vdoclscrnpd">
                        <div className="formfield">
                          <label>
                            Disease <span>*</span>
                          </label>
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
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                    {/* <button
                      type="submit"
                      className="orange-btn"
                      onClick={() => navigate("/doctor-home")}
                    >
                      Submit
                    </button> */}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VideoCall;
