// store/phoneSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type PhoneState = "connected" | "disconnected" | "oncall" | "ringing" | "onhold" | "calling" | "failed"
export type CallEndReason = "completed" | "failed" | "transferred" | null

interface PhoneSliceState {
  phoneState: PhoneState
  phoneNumber: string
  callStartTime: number | null
  callEndReason: CallEndReason
}

const initialState: PhoneSliceState = {
  phoneState: "disconnected",
  phoneNumber: "",
  callStartTime: null,
  callEndReason: null,
}

export const phoneSlice = createSlice({
  name: "phone",
  initialState,
  reducers: {
    setPhoneState: (state, action: PayloadAction<PhoneState>) => {
      state.phoneState = action.payload
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload
    },
    setCallStartTime: (state, action: PayloadAction<number>) => {
      state.callStartTime = action.payload
    },
    setCallEndReason: (state, action: PayloadAction<CallEndReason>) => {
      state.callEndReason = action.payload
    },
    resetCallData: (state) => {
      state.callStartTime = null
      state.callEndReason = null
      state.phoneNumber = ""
    },
  },
})

export const {
  setPhoneState,
  setPhoneNumber,
  setCallStartTime,
  setCallEndReason,
  resetCallData,
} = phoneSlice.actions

export default phoneSlice.reducer

