import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    signoutMessage: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: state => {
            state.loading = true
            state.error = null
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },

        updateStart: state => {
            state.loading = true
            state.error = null
        },
        updateFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.currentUser = action.payload
        },
        deleteStart: state => {
            state.loading = true
            state.error = null
        },
        deleteSuccess: state => {
            state.loading = false
            state.error = null
            state.currentUser = null
        },
        deleteFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        signoutSuccess: (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = null
            state.signoutMessage = action.payload
        },
        alertDone: state => {
            state.signoutMessage = null
        },
        setErrorNull:state=>{
            state.error = null
        }
    },
})

export const {
    signInStart,
    signInSuccess,
    signInFailure,
    updateStart,
    updateFailure,
    updateSuccess,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    signoutSuccess,
    alertDone,
    setErrorNull
} = userSlice.actions

export default userSlice.reducer
