import React, { FC, useState } from 'react';
import { Trash2, PlusCircle, Edit2, Link, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

type Props = {
    active: number;
    setActive: (active: number) => void;
    courseContentData: any;
    setCourseContentData: (courseContentData: any) => void;
    handleSubmit: any;
};

const CourseContent: FC<Props> = ({
    active,
    setActive,
    courseContentData,
    setCourseContentData,
    handleSubmit: handleCourseSubmit
}) => {
    const { theme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(
        Array(courseContentData.length).fill(false)
    );
    const [activeSection, setActiveSection] = useState(1);

    const toggleCollapse = (index: number) => {
        const newIsCollapsed = [...isCollapsed];
        newIsCollapsed[index] = !newIsCollapsed[index];
        setIsCollapsed(newIsCollapsed);
    };

    const handleRemoveLink = (videoIndex: number, linkIndex: number) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[videoIndex].links.splice(linkIndex, 1);
        setCourseContentData(newCourseContentData);
    };

    const handleSectionChange = (index: number, value: string) => {
        const newCourseContentData = [...courseContentData];
        newCourseContentData[index].videoSection = value;
        setCourseContentData(newCourseContentData);
    };

    const newContentHandler = (index: number) => {
        if (
            courseContentData[index].title === '' ||
            courseContentData[index].videoUrl === '' ||
            courseContentData[index].description === ''
        ) {
            toast.error('Please fill all the fields before adding new content');
            return;
        }

        let newVideoSection = '';

        if (courseContentData.length > 0) {
            const lastVideoSection =
                courseContentData[courseContentData.length - 1].videoSection;

            if (lastVideoSection !== '') {
                newVideoSection = lastVideoSection;
            } else {
                newVideoSection = 'Untitled Section';
            }
        }

        const newCourseContentData = {
            videoUrl: '',
            title: '',
            description: '',
            videoSection: newVideoSection,
            links: [
                {
                    title: '',
                    url: ''
                }
            ]
        };
        setCourseContentData([...courseContentData, newCourseContentData]);
        setIsCollapsed([...isCollapsed, false]);
    };

    const addNewSection = () => {
        const lastItem = courseContentData[courseContentData.length - 1];
        if (
            lastItem.title === '' ||
            lastItem.description === '' ||
            lastItem.videoUrl === '' ||
            lastItem.links[0].title === '' ||
            lastItem.links[0].url === ''
        ) {
            toast.error('Please fill all fields in the current section before adding a new section');
            return;
        }
        setActiveSection(activeSection + 1);
        const newCourseContentData = {
            videoUrl: '',
            title: '',
            description: '',
            videoSection: 'Untitled Section',
            links: [
                {
                    title: '',
                    url: ''
                }
            ]
        };
        setCourseContentData([...courseContentData, newCourseContentData]);
        setIsCollapsed([...isCollapsed, false]);
    };

    const handleOptions = (e: any) => {
        const lastItem = courseContentData[courseContentData.length - 1];
        if (
            lastItem.title === '' ||
            lastItem.description === '' ||
            lastItem.videoUrl === '' ||
            lastItem.links[0].title === '' ||
            lastItem.links[0].url === ''
        ) {
            toast.error('Please fill all fields before proceeding');
            return;
        } else {
            setActive(active + 1);
            handleCourseSubmit(e);
        }
    };

    const handlePrev = (e: any) => {
        e.preventDefault();
        setActive(active - 1);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="space-y-6">
                {courseContentData.map((item: any, index: number) => {
                    const showSectionInput =
                        index === 0 ||
                        item.videoSection !== courseContentData[index - 1].videoSection;

                    return (
                        <div
                            className={`${showSectionInput ? 'mt-10' : ''} transition-all duration-300`}
                            key={index}
                        >
                            {showSectionInput && (
                                <div className={`mb-6 p-4 rounded-xl border-l-4 ${
                                    theme === 'dark'
                                        ? 'bg-slate-800/30 border-blue-500'
                                        : 'bg-blue-50 border-blue-500'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={item.videoSection}
                                            onChange={(e) =>
                                                handleSectionChange(index, e.target.value)
                                            }
                                            className={`flex-1 px-4 py-2 border-0 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'bg-slate-700 text-white placeholder-slate-400'
                                                    : 'bg-white text-slate-900 placeholder-slate-500'
                                            }`}
                                            placeholder="Section Name"
                                        />
                                        <Edit2 className={`cursor-pointer transition-colors ${
                                            theme === 'dark'
                                                ? 'text-slate-400 hover:text-blue-400'
                                                : 'text-slate-500 hover:text-blue-600'
                                        }`} size={20} />
                                    </div>
                                </div>
                            )}

                            <div className={`rounded-xl border shadow-lg overflow-hidden transition-all duration-300 ${
                                theme === 'dark'
                                    ? 'bg-slate-800/50 border-slate-700'
                                    : 'bg-white border-slate-200'
                            }`}>
                                {/* Content Header */}
                                <div className={`flex justify-between items-center p-4 border-b ${
                                    theme === 'dark'
                                        ? 'bg-slate-900/30 border-slate-700'
                                        : 'bg-gray-50 border-slate-200'
                                }`}>
                                    <div className="flex-1">
                                        {isCollapsed[index] && item.title ? (
                                            <p className={`font-semibold ${
                                                theme === 'dark' ? 'text-white' : 'text-slate-900'
                                            }`}>
                                                {index + 1}. {item.title}
                                            </p>
                                        ) : (
                                            <p className={`font-medium ${
                                                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                            }`}>
                                                Lecture {index + 1}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Trash2
                                            className={`transition-all duration-200 ${
                                                index > 0
                                                    ? 'cursor-pointer text-red-500 hover:text-red-600 hover:scale-110'
                                                    : 'cursor-not-allowed text-gray-400'
                                            }`}
                                            size={20}
                                            onClick={() => {
                                                if (index > 0) {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData.splice(index, 1);
                                                    setCourseContentData(newCourseContentData);
                                                    const newIsCollapsed = [...isCollapsed];
                                                    newIsCollapsed.splice(index, 1);
                                                    setIsCollapsed(newIsCollapsed);
                                                }
                                            }}
                                        />
                                        <ChevronDown
                                            className={`cursor-pointer transition-all duration-300 ${
                                                theme === 'dark'
                                                    ? 'text-slate-300 hover:text-white'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                            size={24}
                                            style={{
                                                transform: isCollapsed[index]
                                                    ? 'rotate(180deg)'
                                                    : 'rotate(0deg)'
                                            }}
                                            onClick={() => toggleCollapse(index)}
                                        />
                                    </div>
                                </div>

                                {/* Content Body */}
                                {!isCollapsed[index] && (
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${
                                                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                                Video Title
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                                                }`}
                                                placeholder="Enter video title..."
                                                value={item.title}
                                                onChange={(e) => {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData[index].title = e.target.value;
                                                    setCourseContentData(newCourseContentData);
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${
                                                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                                Video URL
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                                                }`}
                                                placeholder="Enter video URL..."
                                                value={item.videoUrl}
                                                onChange={(e) => {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData[index].videoUrl = e.target.value;
                                                    setCourseContentData(newCourseContentData);
                                                }}
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-semibold mb-2 ${
                                                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                                Video Description
                                            </label>
                                            <textarea
                                                rows={6}
                                                className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                                                    theme === 'dark'
                                                        ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                                                }`}
                                                placeholder="Enter video description..."
                                                value={item.description}
                                                onChange={(e) => {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData[index].description =
                                                        e.target.value;
                                                    setCourseContentData(newCourseContentData);
                                                }}
                                            />
                                        </div>

                                        {/* Links Section */}
                                        <div className={`p-4 rounded-lg border ${
                                            theme === 'dark'
                                                ? 'bg-slate-700/30 border-slate-600'
                                                : 'bg-slate-50 border-slate-200'
                                        }`}>
                                            <h4 className={`text-sm font-semibold mb-4 ${
                                                theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                                            }`}>
                                                Resource Links
                                            </h4>
                                            
                                            {item?.links.map((link: any, linkIndex: number) => (
                                                <div className="mb-4 last:mb-0" key={linkIndex}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className={`text-xs font-semibold ${
                                                            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                                                        }`}>
                                                            Link {linkIndex + 1}
                                                        </label>
                                                        <Trash2
                                                            className={`transition-all duration-200 ${
                                                                linkIndex === 0
                                                                    ? 'cursor-not-allowed text-gray-400'
                                                                    : 'cursor-pointer text-red-500 hover:text-red-600 hover:scale-110'
                                                            }`}
                                                            size={16}
                                                            onClick={() => {
                                                                if (linkIndex !== 0) {
                                                                    handleRemoveLink(index, linkIndex);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Link title..."
                                                        value={link.title}
                                                        onChange={(e) => {
                                                            const newCourseContentData = [
                                                                ...courseContentData
                                                            ];
                                                            newCourseContentData[index].links[
                                                                linkIndex
                                                            ].title = e.target.value;
                                                            setCourseContentData(newCourseContentData);
                                                        }}
                                                        className={`w-full px-3 py-2 border rounded-lg mb-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                                            theme === 'dark'
                                                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                                                        }`}
                                                    />
                                                    <input
                                                        type="url"
                                                        placeholder="Link URL..."
                                                        value={link.url}
                                                        onChange={(e) => {
                                                            const newCourseContentData = [
                                                                ...courseContentData
                                                            ];
                                                            newCourseContentData[index].links[
                                                                linkIndex
                                                            ].url = e.target.value;
                                                            setCourseContentData(newCourseContentData);
                                                        }}
                                                        className={`w-full px-3 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                                            theme === 'dark'
                                                                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                                                                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                                                        }`}
                                                    />
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform cursor-pointer text-sm font-medium mt-3"
                                                onClick={() => {
                                                    const newCourseContentData = [...courseContentData];
                                                    newCourseContentData[index].links.push({
                                                        title: '',
                                                        url: ''
                                                    });
                                                    setCourseContentData(newCourseContentData);
                                                }}
                                            >
                                                <Link size={16} />
                                                Add Link
                                            </button>
                                        </div>

                                        {index === courseContentData.length - 1 && (
                                            <button
                                                type="button"
                                                className="w-full flex items-center justify-center gap-2 bg-[#37a39a] text-white px-6 py-3 rounded-lg transition-all duration-300 transform cursor-pointer font-semibold shadow-lg"
                                                onClick={() => newContentHandler(index)}
                                            >
                                                <PlusCircle size={20} />
                                                Add New Content
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Add New Section Button */}
                <button
                    onClick={addNewSection}
                    className={`w-full flex items-center justify-center gap-2 text-lg font-semibold cursor-pointer transition-all duration-300 py-4 px-6 rounded-xl border-2 border-dashed ${
                        theme === 'dark'
                            ? 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
                            : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                    }`}
                >
                    <PlusCircle size={24} />
                    Add New Section
                </button>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform cursor-pointer ${
                            theme === 'dark'
                                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                    >
                        ← Previous
                    </button>
                    <button
                        type="button"
                        onClick={handleOptions}
                        className="flex-1 px-8 py-3 bg-[#37a39a] cursor-pointer text-white rounded-xl font-bold transition-all duration-300 transform  shadow-lg"
                    >
                        Next →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseContent;