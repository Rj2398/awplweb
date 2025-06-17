import { Link } from "react-router-dom";
import Footer from "../doctorPanel/Footer";
import Header from "./Header";
import PrescriptionModal from "./PrescriptionModal";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  completePrescription,
  medicineSearch,
} from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import { getPatientProfileData } from "../../redux/slices/patientProfileSlice";

//

const Data = [
  {
    id: 41,
    product_code: "100",
    product_name: "Joint Curator Oil",
    unit: "mililiter",
    product_group: null,
    created_at: "2025-06-12T09:27:57.000000Z",
    updated_at: "2025-06-12T09:27:57.000000Z",
    deleted_at: null,
  },
  {
    id: 42,
    product_code: "101",
    product_name: "Viraldoc Pravahi kwath",
    unit: "mililiter",
    product_group: null,
    created_at: "2025-06-12T09:28:22.000000Z",
    updated_at: "2025-06-12T09:28:22.000000Z",
    deleted_at: null,
  },
  {
    id: 43,
    product_code: "102",
    product_name: "Vitamin D2 tablet",
    unit: "number",
    product_group: null,
    created_at: "2025-06-12T09:28:38.000000Z",
    updated_at: "2025-06-12T09:28:38.000000Z",
    deleted_at: null,
  },
  {
    id: 44,
    product_code: "103",
    product_name: "Calcium Tablet",
    unit: "number",
    product_group: null,
    created_at: "2025-06-12T09:28:53.000000Z",
    updated_at: "2025-06-12T09:28:53.000000Z",
    deleted_at: null,
  },
  {
    id: 46,
    product_code: "106",
    product_name: "Paracetamol",
    unit: "number",
    product_group: null,
    created_at: "2025-06-13T14:20:13.000000Z",
    updated_at: "2025-06-16T09:26:37.000000Z",
    deleted_at: null,
  },
];

const CompletedAssignedPrescription = () => {
  const location = useLocation();
  const { id, patientId } = location.state || {};
  const suggestionsRefs = useRef([]);
  const dispatch = useDispatch();
  const [choosenItem, setChoosenItem] = useState({});
  console.log(choosenItem, "choosen item get from **********");

  const { patientProfileData } = useSelector((state) => state.patientProfile);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientProfileData({ patientId: patientId }));
    }
  }, [dispatch, patientId]);

  const patientInfo = patientProfileData?.basic_information || {};

  const {
    loading,
    loading2,
    error,
    completeAssignedPrescription,
    medicineSearch: medicineSearchResults,
  } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
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
      isSelectedFromSuggestions: false,
    },
  ]);

  console.log(medicines[0]?.suggestions, "**************************");

  console.log(medicineSearchResults, "hello data comes from here***");
  //
  //
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
        isSelectedFromSuggestions: false,
      },
    ]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;

    // Reset the selection flag if medicine name is changed manually
    if (field === "medicineName") {
      updated[index].isSelectedFromSuggestions = false;

      // Debounce logic remains the same
      setActiveMedicineIndex(index);
      if (searchTimeouts[index]) clearTimeout(searchTimeouts[index]);

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
    }
  }, [medicineSearchResults]);

  const handleSuggestionSelect = (index, name) => {
    const updated = [...medicines];
    updated[index].medicineName = name;
    updated[index].suggestions = [];
    updated[index].isSelectedFromSuggestions = true; // Set flag when selected from suggestions

    setMedicines(updated);

    setMedicineErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = null;
      return newErrors;
    });

    setActiveMedicineIndex(null);
  };
  const handleSetObj = (item) => {
    console.log(item, "choosen item Get from here***");

    // Update the medicines state
    setMedicines((prevMedicines) => {
      // Create a shallow copy of the medicines array
      const updatedMedicines = [...prevMedicines];

      // Ensure there's at least one medicine object to update
      if (updatedMedicines.length > 0) {
        // Create a new object for the first medicine entry
        // and set the desired properties
        updatedMedicines[0] = {
          ...updatedMedicines[0], // Keep all existing properties of the first object
          dosage: "2", // Set dosage to "2"
          frequency: "3", // Set frequency to "3"
          duration: "4 months", // Set duration to "4 months"
          // You might also want to set isSelectedFromSuggestions to true here
          isSelectedFromSuggestions: true,
        };
      }

      // Return the new array to update the state
      return updatedMedicines;
    });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      setShowSuggestionsPopup(!showSuggestionsPopup);
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
  const isValidatemedicine = (medicineName, suggestions) => {
    return suggestions.some((sug) => sug.product_name === medicineName);
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
      toast.error("All fields are required (marked with *)", {
        toastId: "required-fields-toast",
        style: {
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
      });
      return;
    }

    // Check if medicine names were selected from suggestions
    const errors = [...medicineErrors];
    let hasErrors = false;

    medicines.forEach((med, i) => {
      if (!med.isSelectedFromSuggestions) {
        errors[i] = "Please select a valid medicine name from suggestions";
        hasErrors = true;
      } else {
        errors[i] = "";
      }
    });

    setMedicineErrors(errors);
    if (hasErrors) return;

    const formData = {
      symptom_id: id,
      diagnosis,
      notes,
      medicines: medicines.map((med) => ({
        name: med.medicineName,
        dosage: med.dosage,
        frequency: med.frequency,
        duration: med.duration,
      })),
    };

    try {
      const res = dispatch(completePrescription(formData));

      // Check both the action result and the payload
      if (res.payload?.status === true) {
        setShowModal(true);
      } else {
        toast.error(res.payload?.message || "Failed to complete prescription");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the prescription");
      console.error("Submission error:", error);
    }
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
                          {
                            label: "Patient Name",
                            value: patientInfo.name || "N/A",
                          },
                          { label: "Age", value: patientInfo.age || "N/A" },
                          {
                            label: "Gender",
                            value: patientInfo.gender || "N/A",
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
                          <div key={index} className="vdoclscrnpd-grp">
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
                      <div className="vdoclscrnpd-wrp">
                        <h2>Prescriptions:</h2>
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
                                          marginTop: 0,
                                          paddingLeft: "10px",
                                          listStyle: "none",
                                        }}
                                      >
                                        {medicine.suggestions.length > 0
                                          ? medicine.suggestions.map(
                                              (sug, i) => (
                                                <li
                                                  key={i}
                                                  onClick={() => {
                                                    handleSuggestionSelect(
                                                      index,
                                                      sug.product_name
                                                    ),
                                                      handleSetObj(sug);
                                                  }}
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
                              {medicineErrors[index] && (
                                <div
                                  style={{
                                    color: "red",
                                    marginTop: "-5px",
                                    fontSize: "14px",
                                  }}
                                >
                                  {medicineErrors[index]}
                                </div>
                              )}
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
                          <img
                            src="./images/plus-icon-circle.svg"
                            alt="Icon"
                            style={{
                              marginRight: "8px",
                              verticalAlign: "middle",
                            }} // 👈 spacing between icon and text
                          />
                          Add More
                        </button>
                      </div>

                      {/* //vdoclscrnpd in first line of div this class was also added  */}

                      <div className="add-notes-wrp">
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
                      Submit
                    </button>
                    {/* <PrescriptionModal /> */}

                    <PrescriptionModal
                      show={showModal}
                      handleClose={() => setShowModal(false)}
                    />
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
