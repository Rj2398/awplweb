import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../Api.js";
import { toast } from "react-toastify";

// for unauthenticated user
function logouterror() {
    toast.error("Token Expired")
    localStorage.removeItem("doctor-app");
    setTimeout(() => {
        window.location.href = "/";
    }, 1000);
}

//Get Patient Profile data

export const getPatientProfileData = createAsyncThunk("doctor/getPatientProfileData", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.getPatientProfileData(formData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const patientProfileSlice = createSlice({
    name: "patientProfile",
    initialState: {
        patientProfileData: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(getPatientProfileData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPatientProfileData.fulfilled, (state, action) => {
                state.loading = false;
                state.patientProfileData = action.payload?.data;

            })
            .addCase(getPatientProfileData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch users";
                if (action.payload.message == "Unauthenticated.") {
                    logouterror();
                }
            })
    }
});

export default patientProfileSlice.reducer;