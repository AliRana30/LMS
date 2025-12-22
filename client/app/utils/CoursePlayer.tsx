import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'

type Props = {
    videoUrl : string,
    title : string,
   
}

const CoursePlayer : FC<Props> = ({videoUrl, title}) => {
    const [videoData , setVideoData] = useState({
        otp : "",
        playbackInfo : ""
    })

    useEffect(()=>{
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getVdoCipherOTP`, {videoId : videoUrl})
        .then((res)=>{
            setVideoData(res.data)
        })  
    },[videoUrl])

  return (
    <div className='pt-4 relative'>
        {videoData.otp && videoData.playbackInfo && (
            <iframe 
              src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=u9hLEOxkgpOzBfzl`}   
                style={{border: 'none'}}
                width="100%"
                className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[450px]"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={title}
            ></iframe>
        )}
    </div>
  )
}

export default CoursePlayer