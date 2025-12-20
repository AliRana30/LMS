
import { styles } from '@/app/styles/style'
import { useTheme } from 'next-themes'
import React, { FC, useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  active: number
  setActive: (active: number) => void
  courseInfo: any
  setCourseInfo: (courseInfo: any) => void
}

const CourseInformation: FC<Props> = ({ active, setActive, courseInfo, setCourseInfo }) => {
  const [dragging, setDragging] = useState(false);
  const { theme } = useTheme()

  const handleSubmit = (courseInfo: any) => {
    if (!courseInfo.name || !courseInfo.description || !courseInfo.price || !courseInfo.estimatedPrice || !courseInfo.tags || !courseInfo.level || !courseInfo.demoUrl || !courseInfo.thumbnail) {
      toast.error("Please fill all the fields");
      return;
    }
    setActive(active + 1);
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setCourseInfo({ ...courseInfo, thumbnail: reader.result });
        }
      }
      reader.readAsDataURL(file);
    }
  }

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setDragging(true);
  }

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    setDragging(false);
  }

  const handleDrop = (e: any) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCourseInfo({ ...courseInfo, thumbnail: reader.result });
      }
      reader.readAsDataURL(file);
    }
  }

  return (
    <div className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
      <div className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-semibold mb-2">Course Name</label>
          <input type="text" value={courseInfo.name} onChange={(e: any) => setCourseInfo({ ...courseInfo, name: e.target.value })}
            id='name' placeholder='Enter The Course Name' className={`${styles.input} w-full`} />
        </div>

        <div>
          <label htmlFor="description" className="block font-semibold mb-2">Course Description</label>
          <textarea rows={10} value={courseInfo.description} onChange={(e: any) => setCourseInfo({ ...courseInfo, description: e.target.value })}
            id='description' placeholder='Enter The Course Description' className={`${styles.input} w-full`} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor="price" className="block font-semibold mb-2">Course Price</label>
            <input type="number" value={courseInfo.price} onChange={(e: any) => setCourseInfo({ ...courseInfo, price: e.target.value })}
              id='price' placeholder='50' className={`${styles.input} w-full`} />
          </div>
          <div>
            <label htmlFor="estimatedPrice" className="block font-semibold mb-2">Estimated Price</label>
            <input type="number" value={courseInfo.estimatedPrice} onChange={(e: any) => setCourseInfo({ ...courseInfo, estimatedPrice: e.target.value })}
              id='estimatedPrice' placeholder='79' className={`${styles.input} w-full`} />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block font-semibold mb-2">Course Tags (Comma Separated)</label>
          <input type="text" value={courseInfo.tags} onChange={(e: any) => setCourseInfo({ ...courseInfo, tags: e.target.value })}
            id='tags' placeholder='MERN,NEXT,ML,AI' className={`${styles.input} w-full`} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label htmlFor="level" className="block font-semibold mb-2">Course Level</label>
            <input type="text" value={courseInfo.level} onChange={(e: any) => setCourseInfo({ ...courseInfo, level: e.target.value })}
              id='level' placeholder='Beginner/Intermediate/Advanced' className={`${styles.input} w-full`} />
          </div>
          <div>
            <label htmlFor="demoUrl" className="block font-semibold mb-2">Demo URL</label>
            <input type="text" value={courseInfo.demoUrl} onChange={(e: any) => setCourseInfo({ ...courseInfo, demoUrl: e.target.value })}
              id='demoUrl' placeholder='ee74Fd' className={`${styles.input} w-full`} />
          </div>
        </div>

        <div className='w-full'>
          <label className="block font-semibold mb-2">Course Thumbnail</label>
          <input type="file" className="hidden" id="file" accept='image/*' onChange={handleFileChange} />
          <label htmlFor="file" className={`${dragging ? 'border-blue-500' : theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} border-2 border-dashed rounded-md p-4 block text-center cursor-pointer transition-colors`}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
            {courseInfo.thumbnail ? (
              <img src={courseInfo.thumbnail} alt="Thumbnail" className="mx-auto max-h-48 object-contain" />
            ) : (
              <div>
                <p className="mb-2">Drag and drop course thumbnail here, or click to select file</p>
                <span className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block">Browse File</span>
              </div>
            )}
          </label>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={() => handleSubmit(courseInfo)} className="bg-[#37a39a] hover:bg-[#2d8b7f] text-white px-8 py-3 rounded-lg transition-colors font-semibold">
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseInformation