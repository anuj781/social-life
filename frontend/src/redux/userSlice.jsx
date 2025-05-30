import { createSlice } from '@reduxjs/toolkit'
import { react } from 'react'

let userData = JSON.parse(localStorage.getItem('magicMedia'))
const initialState = {
    login: userData ? true : false,
    user:userData ? userData.user : '',
    token: userData ? userData.token : ''
}

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setState:(state , action)=>{
        // console.log(action.payload)
        localStorage.setItem('magicMedia',JSON.stringify(action.payload))
        state.login = true;
        state.user = action.payload.user;
        state.token = action.payload.token
    },
    logout:(state,action)=>{
     localStorage.removeItem('magicMedia')
     state.login = false;
     state.user = '',
     state.token = ''
    },
    forget:(state,action)=>{
     state.user = action.payload.user;
     state.resetToken = action.payload.resetToken
    },
     updateLoading:(state, action)=>{
      state.loading = action.payload
    },
        updatePic:(state, action)=>{
      let {name,url} = action.payload;
      let copyObj = {...userData}
      let user = {...copyObj.user, [name]:url}
      copyObj.user = user
   
    //   copyObj.user[name] = url;
     localStorage.setItem('jaduMedia',JSON.stringify(copyObj))

        state.user[name] = url;

    }
  },
 
  })


// Action creators are generated for each case reducer function
export const { setState , logout , forget ,updateLoading, updatePic} = userSlice.actions

export default userSlice.reducer