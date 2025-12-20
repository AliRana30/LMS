import React, { FC } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { BsStarHalf } from 'react-icons/bs'

type Props = {
  rating: number
}

const Ratings: FC<Props> = ({ rating }) => {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(
        <AiFillStar
          key={i}
          size={20}
          color="#f6b100"
          className="inline-block"
        />
      )
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <BsStarHalf
          key={i}
          size={17}
          color="#f6b100"
          className="inline-block"
        />
      )
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={20}
          color="#f6b100"
          className="inline-block"
        />
      )
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>
}

export default Ratings