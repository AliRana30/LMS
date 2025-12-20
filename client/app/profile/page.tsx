"use client"
import React, { useEffect, useState } from 'react'
import Protected from '../hooks/userProtected'
import Heading from '../utils/Heading';
import Header from '../components/Header';
import Profile from '../components/Profile/Profile';
import { useSelector } from 'react-redux';

const page = () => {
    const [open, setOpen] = useState(false);
    const [route, setRoute] = useState('login');
    const [activeItem, setActiveItem] = useState(0);
    const {user} = useSelector((state:any) => state.auth);

  return (
    <div>
      <Protected>
           <Heading title={`${user?.name}'s profile - CampusCore`} description="CampusCore is a platform for the students to learn and get help from teachers"
       keywords="Programming,MERN,Learning,Full-Stack"  />
       <Header open={open} setOpen={setOpen} activeItem={activeItem} route={route} setRoute={setRoute}/>
        <Profile user={user}/>
      </Protected>
    </div>
  )
}

export default page
