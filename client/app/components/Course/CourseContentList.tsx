import React, { FC, useState } from 'react'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { MdOndemandVideo } from 'react-icons/md'
import { useTheme } from 'next-themes'

type Props = {
    data: any
    activeVideo?: number
    setActiveVideo?: any
    isDemo?: boolean
}

const CourseContentList: FC<Props> = ({ data, activeVideo, setActiveVideo, isDemo }) => {
    const { theme } = useTheme()
    const [visibleSection, setVisibleSection] = useState<Set<string>>(
        new Set<string>()
    )

    // find unique video Sections 
    const videoSections: string[] = [...new Set<string>(data?.map((video: any) => video.videoSection))]

    let totalCount = 0

    const toggleSection = (section: string) => {
        const newVisibleSection = new Set(visibleSection)
        if (newVisibleSection.has(section)) {
            newVisibleSection.delete(section)
        } else {
            newVisibleSection.add(section)
        }
        setVisibleSection(newVisibleSection)
    }

    // Helper function to format video duration
    const formatDuration = (seconds: number): string => {
        if (seconds < 60) {
            return `${seconds} Second${seconds !== 1 ? 's' : ''}`
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            if (remainingSeconds === 0) {
                return `${minutes} Minute${minutes !== 1 ? 's' : ''}`
            }
            return `${minutes} Min ${remainingSeconds} Sec`
        } else {
            const hours = Math.floor(seconds / 3600)
            const minutes = Math.floor((seconds % 3600) / 60)
            if (minutes === 0) {
                return `${hours} Hour${hours !== 1 ? 's' : ''}`
            }
            return `${hours} Hour${hours !== 1 ? 's' : ''} ${minutes} Min`
        }
    }

    // Helper function for short duration display
    const formatShortDuration = (seconds: number): string => {
        if (seconds < 60) {
            return `${seconds}s`
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            if (remainingSeconds === 0) {
                return `${minutes}m`
            }
            return `${minutes}m ${remainingSeconds}s`
        } else {
            const hours = Math.floor(seconds / 3600)
            const minutes = Math.floor((seconds % 3600) / 60)
            if (minutes === 0) {
                return `${hours}h`
            }
            return `${hours}h ${minutes}m`
        }
    }

    return (
        <div className="w-full font-poppins mt-16">
            {videoSections.map((section: string, sectionIndex: number) => {
                const isSectionVisible = visibleSection.has(section)

                // filter videos by section
                const videosInSection: any[] = data?.filter((video: any) => video.videoSection === section)

                // number of videos in current section
                const sectionVideoCount = videosInSection.length
                const sectionVideoLength = videosInSection.reduce((accumulator: any, video: any) => accumulator + video.videoLength, 0)

                const sectionStartIndex: number = totalCount
                totalCount += sectionVideoCount

                return (
                    <div
                        className={`${isDemo && 'border-b border-gray-300 dark:border-gray-700'} py-4`}
                        key={section}
                    >
                        {/* Render Video Section Header */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className={`text-lg md:text-xl font-semibold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                {section}
                            </h2>
                            <button
                                onClick={() => toggleSection(section)}
                                className={`p-2 rounded-full transition-all duration-300 ${
                                    theme === 'dark'
                                        ? 'hover:bg-gray-700 text-gray-300'
                                        : 'hover:bg-gray-100 text-gray-600'
                                }`}
                            >
                                {isSectionVisible ? (
                                    <BsChevronUp size={20} />
                                ) : (
                                    <BsChevronDown size={20} />
                                )}
                            </button>
                        </div>

                        <h5 className={`text-sm mb-3 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            {sectionVideoCount} Lesson{sectionVideoCount !== 1 ? 's' : ''} • {formatDuration(sectionVideoLength)}
                        </h5>

                        {isSectionVisible && (
                            <div className="space-y-2 mt-4">
                                {videosInSection.map((video: any, videoIndex: number) => {
                                    const videoLength = video.videoLength
                                    const videoNumber = videoIndex + 1 + sectionStartIndex

                                    return (
                                        <div
                                            key={video._id}
                                            className={`flex items-start justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
                                                activeVideo === videoNumber - 1
                                                    ? 'bg-[#37a39a] bg-opacity-20'
                                                    : theme === 'dark'
                                                    ? 'hover:bg-gray-800'
                                                    : 'hover:bg-gray-50'
                                            }`}
                                            onClick={() => setActiveVideo && setActiveVideo(videoNumber - 1)}
                                        >
                                            <div className="flex items-start gap-3 flex-1">
                                                <MdOndemandVideo
                                                    className={`flex-shrink-0 mt-1 ${
                                                        activeVideo === videoNumber - 1
                                                            ? 'text-[#37a39a]'
                                                            : theme === 'dark'
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                    }`}
                                                    size={20}
                                                />
                                                <div className="flex-1">
                                                    <h4 className={`text-sm md:text-base font-medium ${
                                                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                        {videoNumber}. {video.title}
                                                    </h4>
                                                </div>
                                            </div>
                                            <span className={`text-xs flex-shrink-0 ml-2 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {formatShortDuration(videoLength)}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default CourseContentList