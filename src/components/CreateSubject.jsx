import React, { useState } from 'react';
import axios from 'axios';

const CreateSubject = () => {
    const [name, setName] = useState('');
    const [availableForAges, setAvailableForAges] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const agesArray = availableForAges.split(',').map(age => age.trim());
            await axios.post('https://backend-galaxy-9qdk.onrender.com/api/v1/admin/subjects', {
                name,
                availableForAges: agesArray,
            });
            alert('Subject created successfully!');
            setName('');
            setAvailableForAges('');
        } catch (error) {
            console.error('Error creating subject:', error);
            alert('Failed to create subject');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-800">Create New Subject</h2>
                    <p className="text-sm text-gray-500 mt-1">Define a new subject area for the curriculum.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. Mathematics"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available for Ages <span className="text-gray-400 font-normal">(comma separated)</span>
                        </label>
                        <input
                            type="text"
                            value={availableForAges}
                            onChange={(e) => setAvailableForAges(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="e.g. 3-5, 6-8"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md active:transform active:scale-[0.98]"
                        >
                            Create Subject
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSubject;
