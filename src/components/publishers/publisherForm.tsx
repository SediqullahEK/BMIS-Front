"use client";

import { useState, useEffect, FormEvent } from 'react';

export type PublisherFormData = {
    id?: number;
    name: string;
};

export type PublisherFormProps = {
    initialData?: PublisherFormData;
    onSubmit: (data: PublisherFormData) => void;
    isLoading: boolean;
    onClose: () => void;
   
};

export default function PublisherForm({ initialData, onSubmit, isLoading, onClose }: PublisherFormProps) {
    const [name, setName] = useState<string>(initialData?.name || '');
   

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...(initialData || {}),
            name,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-200">
                    Name <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-teal-900 text-white rounded-md disabled:bg-blue-300 cursor-pointer"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>

            </div>
        </form>
    );
}
