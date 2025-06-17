import React, { useState, useEffect } from 'react';
import Header from '../component/doctorPanel/Header';
import Footer from '../component/doctorPanel/Footer';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'rsuite';
import { TimeRangePicker } from 'rsuite';
import { deleteDoctorPhoto, doctorPhotoUpdate, doctorProfileUpdate, getDoctorProfile } from '../redux/slices/userSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user)
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  useEffect(() => {
    dispatch(getDoctorProfile())
  }, [dispatch])

  // console.log(data)
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    profilePic: '',
    // profilePic: '/images/my-profile-img.png',
  });

  const [unavailability, setUnavailability] = useState({
    date: null,
    timeRange: [],
  })
  

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.contact_no || '',
        experience: user.experience || '',
        profilePic: (baseUrl + "/" + user.profile_path) || '', // updated here
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Preview the uploaded image immediately
  //   const imageUrl = URL.createObjectURL(file);
  //   // setProfile((prev) => ({ ...prev, profilePic: imageUrl }));

  //   // Send file to backend using FormData
  //   // const formData = new FormData();
  //   // formData.append('profileImage', file);

  //   // console.log(formData);
  //   try {
  //     const res = await dispatch(doctorPhotoUpdate({"profileImage":imageUrl}));
  //     console.log(res);
  //     if (res.payload && res.payload.status) {
  //       // After successful upload, refresh profile to get permanent URL
  //       await dispatch(getDoctorProfile());
  //     }
  //   } catch (error) {
  //     // Revert to previous image if upload fails
  //     setProfile((prev) => ({ ...prev, profilePic: user.profile_path || '/images/my-profile-img.png' }));
  //     console.log("there is some issue in your upload image")
  //   }
  // };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create temporary preview (optional, for immediate UI feedback)
    const imageUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, profilePic: imageUrl }));

    // Create FormData to send the actual file
    const formData = new FormData();
    formData.append('profileImage', file); // Make sure this matches what your backend expects

    try {
      const res = await dispatch(doctorPhotoUpdate(formData));

      if (res.payload && res.payload.status) {
        // After successful upload, refresh profile to get permanent URL from backend
        await dispatch(getDoctorProfile());
      } else {
        // If upload fails, revert to previous image
        setProfile((prev) => ({ ...prev, profilePic: user.profile_path || '/images/my-profile-img.png' }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setProfile((prev) => ({ ...prev, profilePic: user.profile_path || '/images/my-profile-img.png' }));
    }
  };

  const handleRemoveImage = async () => {
    // setProfile((prev) => ({ ...prev, profilePic: '' }));
    try {
      const res = await dispatch(deleteDoctorPhoto());

      if (res.payload && res.payload.status) {
        // After successful deletion, refresh profile
        await dispatch(getDoctorProfile());

        // //Update local State
        // setProfile(prev => ({
        //   ...prev,
        //   profilePic: '/images/my-profile-img.png' //default image
        // }))
      } else {
        console.log("failed to delete image");
      }
    } catch (error) {
      console.log("Error deleting image", error);
    }
  };

  const handleSave = async () => {

    const res = await dispatch(doctorProfileUpdate({ "name": profile.fullName, "contact_no": profile.phone, "experience": profile.experience, }))
    console.log(res)
    // console.log(res.payload.data)
    if (res.payload && res.payload.status) {
      await dispatch(getDoctorProfile());
      setIsEditing(false); // Switch back to view mode

    }

  };

  const handleCancel = () => {
    setIsEditing(false); // Switch back to view mode without saving
  };

  if (loading) return (<div className='loader-main'> <span class="loader"></span> </div>)
  return (
    <main className="doctor-panel my-profile-pg">
      <div className="container-fluid">
        <div className="doc-panel-inr">
          <Header />
        </div>

        <div className="doc-panel-body">
          <div className="docpnl-sec-head">
            <h1 className="h2-title">My Profile</h1>
          </div>

          <div className="my-profile-details">
            <div className="my-profile-img-wrp">
              <div className="my-profile-img">
                {profile.profilePic && (
                  <img
                    src={profile.profilePic || '/images/my-profile-img.png'}
                    alt="My Profile"
                  />
                )}
              </div>

              {isEditing && (
                <>
                  <label className="orange-btn" style={{ marginTop: '10px' }}>
                    <FaPlus style={{ marginRight: '6px' }} />
                    Upload New Picture
                    <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
                  </label>
                  <button className="cmn-btn" onClick={handleRemoveImage} style={{ marginTop: '10px' }}>
                    Remove
                  </button>
                </>
              )}
            </div>

            <div className="my-profile-details-inr">
              {!isEditing ? (
                <>
                  <form>
                    <div className="my-profile-details-form">
                      <div className="input-grp">
                        <label>Full Name</label>
                        <input type="text" value={profile.fullName} readOnly />
                      </div>
                      <div className="input-grp">
                        <label>Email ID</label>
                        <input type="email" value={profile.email} readOnly />
                      </div>
                      <div className="input-grp">
                        <label>Phone number</label>
                        <input type="tel" value={profile.phone} readOnly />
                      </div>
                      <div className="input-grp">
                        <label>Experience</label>
                        <input type="text" value={profile.experience} readOnly />
                      </div>
                      <div className="input-grp">
                        <label>Doctor Unavailability</label>
                        <div style={{display:"flex", gap:"10px"}}>
                          <DatePicker format="MMM dd, yyyy" />
                          <TimeRangePicker format="hh:mm aa" showMeridiem />
                          <button className="orange-btn" style={{padding:"24px 0", fontSize:"20px", fontWeight:"500",}}> Save
                          </button>
                        </div>

                      </div>
                    </div>
                  </form>

                  <div className="btn-wrp">
                    <button className="orange-btn" onClick={() => setIsEditing(true)}>
                      <img src="./images/pencil-icon.svg" alt="Edit" /> Edit profile
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="my-profile-details-form">
                    <div className="input-grp">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        placeholder="Enter full name" // Placeholder added
                      />
                    </div>
                    {/* <div className="input-grp">
                        <label>Email ID</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          placeholder="Enter email ID" 
                        />
                      </div> */}
                    <div className="input-grp">
                      <label>Phone number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number" // Placeholder added
                      />
                    </div>
                    <div className="input-grp">
                      <label>Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        placeholder="Experience" // Placeholder added
                      />
                    </div>
                  </div>

                  <div className="btn-wrp" style={{ display: 'flex', gap: '15px' }}>
                    <button className="orange-btn" onClick={handleSave}>
                      Save Changes
                    </button>
                    <button className="cmn-btn" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Logout Modal */}
      <div
        className="modal fade popup-wrp small-pop dash-pop"
        id="logOut"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-icon">
              <img src="./images/logout-icon.svg" alt="Icon" />
            </div>
            <div className="modal-header">
              <h2>Logout</h2>
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-footer btn-wrp">
              <button type="button" className="cmn-btn" data-bs-dismiss="modal">
                Cancel
              </button>
              <a href="login.html" className="cmn-btn orange-btn">
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
