import React from 'react'
import { useSelector } from 'react-redux'

const userAuth = () => {
    const {user} = useSelector((state:any) => state.auth);
  if(user){
    return {isAuthenticated: true, user}
  }
  else{
    return {isAuthenticated: false, user: null}
  }
}

export default userAuth
