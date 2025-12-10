import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateLesson = () => {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([
        { text: '', options: ['', '', ''], correctAnswer: '', imageUrl: '' }
    ]);

    // AI Generation State
    const [aiTopic, setAiTopic] = useState('');
    const [aiAgeGroup, setAiAgeGroup] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [uploadingImageIndex, setUploadingImageIndex] = useState(null);

    useEffect(() => {
        // Fetch subjects for dropdown
        const fetchSubjects = async () => {
            try {
                const res = await axios.get('https://backend-galaxy-9qdk.onrender.com/api/v1/admin/subjects');
                setSubjects(res.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };
        fetchSubjects();
    }, []);

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleImageUpload = async (index, file) => {
        setUploadingImageIndex(index);
        const formData = new FormData();
        formData.append('image', file);

        try {
            console.log("Uploading image...")
            const res = await axios.post('https://backend-galaxy-9qdk.onrender.com/api/v1/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Uploading success...")
            const newQuestions = [...questions];
            newQuestions[index].imageUrl = res.data.imageUrl;

            setQuestions(newQuestions);
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Image upload failed: ${errorMessage}`);
        } finally {
            setUploadingImageIndex(null);
        }
    };



    const addQuestion = () => {
        setQuestions([...questions, { text: '', options: ['', '', ''], correctAnswer: '', imageUrl: '' }]);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (json.title) setTitle(json.title);
                if (json.description) setDescription(json.description);
                if (json.questions && Array.isArray(json.questions)) {
                    // Map to ensure structure matches
                    const mappedQuestions = json.questions.map(q => ({
                        text: q.text || '',
                        options: q.options || ['', '', ''],
                        correctAnswer: q.correctAnswer || '',
                        imageUrl: q.imageUrl || '',
                        imagePrompt: q.imagePrompt || ''
                    }));
                    setQuestions(mappedQuestions);
                }
                alert('Lesson imported successfully!');
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    const generateWithAI = async () => {
        if (!aiTopic || !aiAgeGroup) {
            alert('Please enter Topic and Age Group for AI generation');
            return;
        }

        setIsGenerating(true);
        try {
            const res = await axios.post('https://backend-galaxy-9qdk.onrender.com/api/v1/ai/generate', {
                topic: aiTopic,
                ageGroup: aiAgeGroup,
            });

            const { title, description, questions: aiQuestions } = res.data;
            setTitle(title);
            setDescription(description);

            const formattedQuestions = aiQuestions.map(q => ({
                text: q.text,
                options: q.options,
                correctAnswer: q.correctAnswer,
                imageUrl: '',
                imagePrompt: q.imagePrompt
            }));

            setQuestions(formattedQuestions);
            alert('Content generated! Please review and upload images.');
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://backend-galaxy-9qdk.onrender.com/api/v1/admin/lessons', {
                subjectId: selectedSubject,
                title,
                description,
                questions,
            });
            alert('Lesson created successfully!');
            setTitle('');
            setDescription('');
            setQuestions([{ text: '', options: ['', '', ''], correctAnswer: '', imageUrl: '' }]);
        } catch (error) {
            console.error('Error creating lesson:', error);
            alert('Failed to create lesson');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Create New Lesson</h2>
                <div className="flex gap-2">
                    <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all shadow hover:shadow-md flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import JSON
                        <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            </div>

            {/* AI Generator Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-1 shadow-lg">
                <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">✨</span>
                        <h3 className="text-lg font-bold text-gray-800">AI Content Generator</h3>
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">Beta</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Topic (e.g., Solar System)"
                            value={aiTopic}
                            onChange={(e) => setAiTopic(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Age Group (e.g., 6-8)"
                            value={aiAgeGroup}
                            onChange={(e) => setAiAgeGroup(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                            type="button"
                            onClick={generateWithAI}
                            disabled={isGenerating}
                            className={`flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-all ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800 hover:shadow-lg'}`}
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : 'Auto-Fill with AI'}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Enter a topic and age group to automatically generate a title, description, and questions.
                    </p>
                </div>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            required
                        >
                            <option value="">Select a Subject</option>
                            {subjects.map(sub => (
                                <option key={sub._id} value={sub._id}>
                                    {sub.name} ({sub.availableForAges})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
                        required
                    />
                </div>

                <div className="border-t border-gray-100 pt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Questions</h3>
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            + Add Question
                        </button>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative group">
                                <div className="absolute top-4 right-4 text-gray-400 font-bold text-xl opacity-20 group-hover:opacity-100 transition-opacity">
                                    #{qIndex + 1}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Question Text</label>
                                        <input
                                            type="text"
                                            value={q.text}
                                            onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                            placeholder="Enter question..."
                                            required
                                        />
                                    </div>

                                    {q.imagePrompt && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 items-start">
                                            <span className="text-xl">💡</span>
                                            <div>
                                                <p className="text-xs font-bold text-blue-800 uppercase mb-0.5">AI Image Suggestion</p>
                                                <p className="text-sm text-blue-700">{q.imagePrompt}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Image</label>
                                            {uploadingImageIndex === qIndex ? (
                                                <div className="flex items-center gap-2 text-indigo-600 py-2">
                                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span className="text-sm font-medium">Uploading...</span>
                                                </div>
                                            ) : (
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleImageUpload(qIndex, e.target.files[0])}
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                                    disabled={uploadingImageIndex !== null}
                                                />
                                            )}
                                            {q.imageUrl && (
                                                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 w-24 h-24">
                                                    <img src={q.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Correct Answer</label>
                                            <input
                                                type="text"
                                                value={q.correctAnswer}
                                                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                                placeholder="Exact match of one option"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Options</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            {q.options.map((opt, oIndex) => (
                                                <input
                                                    key={oIndex}
                                                    type="text"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                                                    required
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:transform active:scale-[0.99]"
                    >
                        Create Lesson
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLesson;
