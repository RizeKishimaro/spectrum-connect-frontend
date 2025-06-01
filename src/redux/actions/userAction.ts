// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SIPDetails {
  SIPTech: string;
  firstName: string;
  lastName: string;
  name: string;
  password: string;
  phoneNumber: string;
  sipPassword: string;
  sipUname: string;
  status: string;
  systemCompanyId: number;
  updatedAt: string;
  profilePicture: string;
}

export interface User {
  id: string;
  name: string;
  user: SIPDetails;
}


interface UserState {
  user: User | null
}

const initialState: UserState = {
  user: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    }
  }
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer

