// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { Button } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { getDoctorProfile, logout } from "../../redux/slices/userSlice";
// import { CgUnavailable } from "react-icons/cg";
// import { VscSymbolMethod } from "react-icons/vsc";
// import {
//   changeAppointmentNotificaiton,
//   checkToggleNotification,
//   notifyNewChatRes,
//   unreadCount,
// } from "../../redux/slices/notificationSlice";

// const Header = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loaction = useLocation();

//   const { user } = useSelector((state) => state.user);
//   const baseUrl = import.meta.env.VITE_BACKEND_URL;
//   const { unreadCounts, isNotificationActive } = useSelector(
//     (state) => state.notification
//   );
//   // console.log(isNotificationActive)
//   useEffect(() => {
//     dispatch(unreadCount());
//     dispatch(checkToggleNotification());
//   }, [dispatch]);

//   // Fetch doctor profile if not already fetched
//   useEffect(() => {
//     if (!user?.profile_path) {
//       dispatch(getDoctorProfile());
//     }
//   }, [dispatch, user]);

//   // Confirm logout
//   const handleDeleteConfirm = () => {
//     setShowModal(false);
//     localStorage.removeItem("doctor-app");
//     dispatch(logout());
//     navigate("/");
//   };

//   useEffect(() => {
//     dispatch(notifyNewChatRes());
//   }, [loaction?.pathname]);

//   const handleToggleChange = () => {
//     dispatch(
//       changeAppointmentNotificaiton({ isActive: !isNotificationActive })
//     );
//   };

//   return (
//     <>
//       {isSidebarOpen && (
//         <div
//           onClick={() => setIsSidebarOpen(false)}
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0, 0, 0, 0.3)",
//             // backgroundColor: "red",
//             zIndex: 999,
//           }}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className="sidebar"
//         style={{
//           transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
//           transition: "transform 0.3s ease-in-out",
//           position: "fixed",
//           left: 0,
//           top: 0,
//           width: "280px",
//           height: "100%",
//           backgroundColor: "#fff",
//           zIndex: 1000,
//         }}
//       >
//         <div className="sidebar-inr">
//           <div
//             className="sidebar-close"
//             onClick={() => setIsSidebarOpen(false)}
//             style={{ cursor: "pointer", padding: "10px", textAlign: "right" }}
//           >
//             <i className="fa-solid fa-times-circle"></i>
//           </div>
//           <div className="doc-profile-wrp">
//             <div className="doc-img ml-0 ms-0">
//               <img src={`${baseUrl}/${user?.profile_path}`} alt="Doctor" />
//             </div>
//             <div className="doc-profile-body">
//               <p>{user?.name || "Doctor Name"}</p>
//               <Link
//                 to="/UserProfile"
//                 className="view-profile"
//                 onClick={() => setIsSidebarOpen(false)}
//               >
//                 View my profile
//               </Link>
//             </div>
//           </div>

//           <div className="sidebar-nav">
//             <ul>
//               <li>
//                 <img
//                   src="/images/dash.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link to="/doctor-home" onClick={() => setIsSidebarOpen(false)}>
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <div className="notification-set">
//                   <div className="not-set-left">
//                     <img
//                       src="/images/notification-icon.svg"
//                       alt="Notification"
//                       style={{ height: "18px", width: "18px" }}
//                     />
//                     <span>Notification</span>
//                   </div>
//                   <div className="not-set-right">
//                     <div className="not-toggler">
//                       <input
//                         type="checkbox"
//                         id="notificationToggle"
//                         checked={isNotificationActive}
//                         onChange={handleToggleChange}
//                       />
//                       <label htmlFor="notificationToggle"></label>
//                     </div>
//                   </div>
//                 </div>
//               </li>

//               <li>
//                 <img
//                   src="/images/appointment-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link
//                   to="/my-appointments"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   My Appointments
//                 </Link>
//               </li>
//               <li>
//                 <img
//                   src="/images/pending-prescription-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link
//                   to="/pendingprescription"
//                   onClick={() => setIsSidebarOpen(false)}
//                 >
//                   Pending prescriptions
//                 </Link>
//               </li>
//               <li>
//                 <img
//                   src="/images/past-patients-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Link to="/pastpatient" onClick={() => setIsSidebarOpen(false)}>
//                   My Past Patients
//                 </Link>
//               </li>
//               {/* <li>
//                 <img src="/images/terms-of-service-icon.svg" alt="Icon" />
//                 <Link to="/terms">Terms of services</Link>
//               </li>
//               <li>
//                 <img src="/images/sidebar-nav-link-icon.svg" alt="Icon" />
//                 <Link to="/privacy">Privacy Policy</Link>
//               </li> */}

//               <li>
//                   <img
//                     src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
//                     alt="Icon"
//                     style={{ height: "18px", width: "18px" }}
//                   />
//                 {/* <CgUnavailable style={{ height: "20px", width: "20px" }}/> */}
//                 <Link to="/doctorUnavailibility" onClick={() => setIsSidebarOpen(false)}>
//                  Mark Unavailability
//                 </Link>
//               </li>

//               <li>
//                   <img
//                     src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
//                     alt="Icon"
//                     style={{ height: "18px", width: "18px" }}
//                   />

//                 <Link to="/hod" onClick={() => setIsSidebarOpen(false)}>
//                  H.O.D
//                 </Link>
//               </li>

//               <li className="logout">
//                 <img
//                   src="/images/menu-logout-icon.svg"
//                   alt="Icon"
//                   style={{ height: "18px", width: "18px" }}
//                 />
//                 <Button
//                   variant="link"
//                   style={{
//                     textDecoration: "none",
//                     color: "black",
//                     fontWeight: "600",
//                     textTransform: "none",
//                   }}
//                   onClick={() => setShowModal(true)}
//                 >
//                   Logout <i className="fa-solid fa-chevron-right"></i>
//                 </Button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Top Header */}
//       <div
//         className="doc-panel-header"
//         style={{
//           display: "flex",
//           alignItems: "center",
//           padding: "15px 10px",
//           background: "#fff",
//           justifyContent: "space-between",
//         }}
//       >
//         <button
//           type="button"
//           className="docpnl-hdr-toggler"
//           onClick={() => setIsSidebarOpen(true)}
//           style={{
//             background: "transparent",
//             border: "none",
//             cursor: "pointer",
//           }}
//         >
//           <img src="/images/bars.svg" alt="Menu" />
//         </button>
//         <div className="logo">
//           <Link to="/doctor-home">
//             <img src="/images/logo.png" alt="Logo" />
//           </Link>
//         </div>
//         <div className="notifications">
//           <Link to="/notifications">
//             <img src="/images/notification-icon-2.svg" alt="Notification" />
//           </Link>
//           {unreadCounts > 0 && <span></span>}
//         </div>
//       </div>

//       {/* Logout Modal */}
//       {showModal && (
//         <div
//           className="modal fade show popup-wrp small-pop dash-pop"
//           tabIndex="-1"
//           style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-dialog-centered" role="document">
//             <div className="modal-content">
//               <button
//                 type="button"
//                 className="close"
//                 onClick={() => setShowModal(false)}
//                 aria-label="Close"
//               >
//                 <span aria-hidden="true">
//                   <img src="/images/cross-blue.png" alt="Close" />
//                 </span>
//               </button>
//               <div className="modal-icon">
//                 <img src="/images/logout-icon.svg" alt="Icon" />
//               </div>
//               <div className="modal-header">
//                 <h2>Logout</h2>
//                 <p>Are you sure you want to logout?</p>
//               </div>
//               <div className="modal-footer btn-wrp">
//                 <button
//                   type="button"
//                   className="cmn-btn"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="cmn-btn orange-btn"
//                   onClick={handleDeleteConfirm}
//                 >
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;
//
//
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { getDoctorProfile, logout } from "../../redux/slices/userSlice";
import { CgUnavailable } from "react-icons/cg";
import { VscSymbolMethod } from "react-icons/vsc";
import {
  changeAppointmentNotificaiton,
  checkToggleNotification,
  getAllNotifications,
  notifyNewChatRes,
  unreadCount,
} from "../../redux/slices/notificationSlice";

const Header = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loaction = useLocation();

  const { user } = useSelector((state) => state.user);
  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const { unreadCounts, isNotificationActive } = useSelector(
    (state) => state.notification
  );

  //

  const { doctorNotifications, loading, error } = useSelector(
    (state) => state.notification
  );

  const count = doctorNotifications?.unread_new_message_count;
  // console.log(isNotificationActive)
  useEffect(() => {
    dispatch(unreadCount());
    dispatch(checkToggleNotification());
  }, [dispatch]);

  // Fetch doctor profile if not already fetched
  useEffect(() => {
    if (!user?.profile_path) {
      dispatch(getDoctorProfile());
    }
  }, [dispatch, user]);

  // Confirm logout
  const handleDeleteConfirm = () => {
    setShowModal(false);
    localStorage.removeItem("doctor-app");
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    dispatch(notifyNewChatRes());

    dispatch(getAllNotifications());
  }, [loaction?.pathname]);

  const handleToggleChange = () => {
    dispatch(
      changeAppointmentNotificaiton({ isActive: !isNotificationActive })
    );
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            // backgroundColor: "red",
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className="sidebar"
        style={{
          transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          position: "fixed",
          left: 0,
          top: 0,
          width: "280px",
          height: "100%",
          backgroundColor: "#fff",
          zIndex: 1000,
        }}
      >
        <div className="sidebar-inr">
          <div
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            style={{ cursor: "pointer", padding: "10px", textAlign: "right" }}
          >
            <i className="fa-solid fa-times-circle"></i>
          </div>
          <div className="doc-profile-wrp">
            <div className="doc-img ml-0 ms-0">
              <img src={`${baseUrl}/${user?.profile_path}`} alt="Doctor" />
            </div>
            <div className="doc-profile-body">
              <p>{user?.name || "Doctor Name"}</p>
              <Link
                to="/UserProfile"
                className="view-profile"
                onClick={() => setIsSidebarOpen(false)}
              >
                View my profile
              </Link>
            </div>
          </div>

          <div className="sidebar-nav">
            <ul>
              <li>
                <img
                  src="/images/dash.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link to="/doctor-home" onClick={() => setIsSidebarOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <div className="notification-set">
                  <div className="not-set-left">
                    <img
                      src="/images/notification-icon.svg"
                      alt="Notification"
                      style={{ height: "18px", width: "18px" }}
                    />
                    <span>Notification</span>
                  </div>
                  <div className="not-set-right">
                    <div className="not-toggler">
                      <input
                        type="checkbox"
                        id="notificationToggle"
                        checked={isNotificationActive}
                        onChange={handleToggleChange}
                      />
                      <label htmlFor="notificationToggle"></label>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <img
                  src="/images/appointment-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link
                  to="/my-appointments"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <img
                  src="/images/pending-prescription-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link
                  to="/pendingprescription"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Pending prescriptions
                </Link>
              </li>
              <li>
                <img
                  src="/images/past-patients-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Link to="/pastpatient" onClick={() => setIsSidebarOpen(false)}>
                  My Past Patients
                </Link>
              </li>
              {/* <li>
                <img src="/images/terms-of-service-icon.svg" alt="Icon" />
                <Link to="/terms">Terms of services</Link>
              </li>
              <li>
                <img src="/images/sidebar-nav-link-icon.svg" alt="Icon" />
                <Link to="/privacy">Privacy Policy</Link>
              </li> */}

              <li>
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                {/* <CgUnavailable style={{ height: "20px", width: "20px" }}/> */}
                <Link
                  to="/doctorUnavailibility"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  Mark Unavailability
                </Link>
              </li>

              <li>
                <img
                  src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/database-delete-icon.png"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />

                <Link to="/hod" onClick={() => setIsSidebarOpen(false)}>
                  H.O.D
                </Link>
              </li>

              <li className="logout">
                <img
                  src="/images/menu-logout-icon.svg"
                  alt="Icon"
                  style={{ height: "18px", width: "18px" }}
                />
                <Button
                  variant="link"
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "600",
                    textTransform: "none",
                  }}
                  onClick={() => setShowModal(true)}
                >
                  Logout <i className="fa-solid fa-chevron-right"></i>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Top Header */}
      <div
        className="doc-panel-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 10px",
          background: "#fff",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          className="docpnl-hdr-toggler"
          onClick={() => setIsSidebarOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <img src="/images/bars.svg" alt="Menu" />
        </button>
        <div className="logo">
          <Link to="/doctor-home">
            <img src="/images/logo.png" alt="Logo" />
          </Link>
        </div>
        <div className="notifications">
          <Link to="/notifications">
            <img src="/images/notification-icon-2.svg" alt="Notification" />
          </Link>
          {/* {unreadCounts > 0 && <span></span>} */}

          {count > 0 && (
            <div
              style={{
                backgroundColor: "red",
                width: count > 9 ? "25px" : "20px",
                height: "20px",
                borderRadius: "10px",
                color: "white",
                position: "absolute",
                top: -10,
                right: 0,
              }}
            >
              <p
                style={{
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                {count > 9 ? "9+" : count}
              </p>
            </div>
          )}

          {/* If count is 0, then check unreadCounts */}
          {count === 0 && unreadCounts > 0 && (
            <span></span> // An empty span will render as nothing visible
          )}
        </div>
      </div>

      {/* Logout Modal */}
      {showModal && (
        <div
          className="modal fade show popup-wrp small-pop dash-pop"
          tabIndex="-1"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <button
                type="button"
                className="close"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <span aria-hidden="true">
                  <img src="/images/cross-blue.png" alt="Close" />
                </span>
              </button>
              <div className="modal-icon">
                <img src="/images/logout-icon.svg" alt="Icon" />
              </div>
              <div className="modal-header">
                <h2>Logout</h2>
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer btn-wrp">
                <button
                  type="button"
                  className="cmn-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="cmn-btn orange-btn"
                  onClick={handleDeleteConfirm}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
