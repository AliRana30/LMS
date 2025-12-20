
import { styles } from '@/app/styles/style'
import { useTheme } from 'next-themes'
import React, { FC } from 'react'
import toast from 'react-hot-toast'
import { MdAddCircle } from 'react-icons/md'
import { AiOutlineDelete } from 'react-icons/ai'

type Props = {
  benefits: { title: string }[],
  setBenefits: (benefits: { title: string }[]) => void,
  prerequisites: { title: string }[],
  setPrerequisites: (prerequisites: { title: string }[]) => void
  active: number,
  setActive: (active: number) => void
}

const CourseData: FC<Props> = ({ benefits, setBenefits, prerequisites, setPrerequisites, active, setActive }) => {
  const { theme } = useTheme()

  const handleAddBenefit = () => {
    setBenefits([...benefits, { title: "" }])
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index].title = value;
    setBenefits(newBenefits);
  };

  const handleRemoveBenefit = (index: number) => {
    if (benefits.length > 1) {
      const newBenefits = benefits.filter((_, i) => i !== index);
      setBenefits(newBenefits);
    }
  };

  const handleAddPrerequisite = () => {
    setPrerequisites([...prerequisites, { title: "" }])
  }

  const handlePrerequisiteChange = (index: number, value: string) => {
    const newPrerequisites = [...prerequisites];
    newPrerequisites[index].title = value;
    setPrerequisites(newPrerequisites);
  };

  const handleRemovePrerequisite = (index: number) => {
    if (prerequisites.length > 1) {
      const newPrerequisites = prerequisites.filter((_, i) => i !== index);
      setPrerequisites(newPrerequisites);
    }
  };

  const prevButton = (e: any) => {
    e.preventDefault();
    setActive(active - 1);
  }

  const handleOptions = (e: any) => {
    e.preventDefault();
    if (benefits[benefits.length - 1].title === "" || prerequisites[prerequisites.length - 1].title === "") {
      toast.error("Please fill all the fields")
      return;
    }
    setActive(active + 1);
  }

  return (
    <div className={`space-y-8 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
      <div>
        <label className="block font-bold text-lg mb-4">What are the benefits of taking this course?</label>
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={benefit.title}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                placeholder={`Benefit ${index + 1}`}
                className={`${styles.input} flex-1`}
              />
              {benefits.length > 1 && (
                <button onClick={() => handleRemoveBenefit(index)} className="text-red-500 hover:text-red-700">
                  <AiOutlineDelete size={24} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleAddBenefit} className="mt-3 flex items-center gap-2 text-[#37a39a] hover:text-[#2d8b7f] font-semibold">
          <MdAddCircle size={24} />
          Add Benefit
        </button>
      </div>

      <div>
        <label className="block font-bold text-lg mb-4">What are the Prerequisites of taking this course?</label>
        <div className="space-y-3">
          {prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={prerequisite.title}
                onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                placeholder={`Prerequisite ${index + 1}`}
                className={`${styles.input} flex-1`}
              />
              {prerequisites.length > 1 && (
                <button onClick={() => handleRemovePrerequisite(index)} className="text-red-500 hover:text-red-700">
                  <AiOutlineDelete size={24} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={handleAddPrerequisite} className="mt-3 flex items-center gap-2 text-[#37a39a] hover:text-[#2d8b7f] font-semibold">
          <MdAddCircle size={24} />
          Add Prerequisite
        </button>
      </div>

      <div className='flex justify-between mt-8'>
        <button onClick={prevButton} className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold">
          ← Previous
        </button>
        <button onClick={handleOptions} className="bg-[#37a39a] hover:bg-[#2d8b7f] text-white px-8 py-3 rounded-lg transition-colors font-semibold">
          Next →
        </button>
      </div>
    </div>
  )
}

export default CourseData