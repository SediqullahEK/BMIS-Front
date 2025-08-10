"use client";

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, FormEvent } from 'react';
import Select, { SingleValue } from 'react-select';

// Adjusted to match API shape: { id: number; name: string }
interface RawGenre {
    id: number;
    name: string;
}

interface GenreOption {
    value: number;
    label: string;
}
interface RawPublisher {
    id: number;
    name: string;
}

interface PublisherOption {
    value: number;
    label: string;
}

export type BookFormData = {
    id?: number;
    title: string;
    author: string;
    genreId: number;
    genreName: string;
    publisherId: number;
    publisherName: string;
};

export type BookFormProps = {
    initialData?: BookFormData;
    onSubmit: (data: BookFormData) => void;
    isLoading: boolean;
    onClose: () => void;
   
};

export default function BookForm({ initialData, onSubmit, isLoading, onClose }: BookFormProps) {
    const [title, setTitle] = useState<string>(initialData?.title || '');
    const [author, setAuthor] = useState<string>(initialData?.author || '');

    const [selectedGenre, setSelectedGenre] = useState<GenreOption | null>(null);

    // Do the same for the publisher
    const [selectedPublisher, setSelectedPublisher] = useState<PublisherOption | null>(null);
    const [genreOptions, setGenreOptions] = useState<GenreOption[]>([]);

    const [publisherOptions, setPublisherOptions] = useState<PublisherOption[]>([]);
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/genres/all');
                if (!response.ok) throw new Error('Failed to fetch genres');
                const data: RawGenre[] = await response.json();
                // Map to react-select options
                const options = data.map((g) => ({ value: g.id, label: g.name }));
                setGenreOptions(options);
                
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };
        fetchGenres();
    }, [genreOptions]);

    useEffect(() => {
        const fetchPublishers = async () => {
            try {
                const response = await fetch('http://localhost:8082/api/publishers/all');
                if (!response.ok) throw new Error('Failed to fetch publishers');
                const data: RawPublisher[] = await response.json();

                const options = data.map((p) => ({ value: p.id, label: p.name }));
                setPublisherOptions(options);
            } catch (error) {
                console.error('Error fetching publishers:', error);
            }
        };
        fetchPublishers();
    }, [publisherOptions]);

    useEffect(() => {
        
        if (initialData && genreOptions.length > 0) {
            const genreToSelect = genreOptions.find(
                (option) => option.value === initialData.genreId
            );
            if (genreToSelect) {
                setSelectedGenre(genreToSelect);
            }
        }

        if (initialData && publisherOptions.length > 0) {
            const publisherToSelect = publisherOptions.find(
                (option) => option.value === initialData.publisherId
            );
            if (publisherToSelect) {
                setSelectedPublisher(publisherToSelect);
            }
        }

    }, [initialData, genreOptions, publisherOptions]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!selectedGenre) return;
        onSubmit({
            ...(initialData || {}),
            title,
            author,
            genreId: selectedGenre.value,
            genreName: selectedGenre.label,
            publisherId: selectedPublisher ? selectedPublisher.value : 0,
            publisherName: selectedPublisher ? selectedPublisher.label : '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-200">
                    Title <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                />
            </div>

            <div>
                <label htmlFor="author" className="block text-sm font-medium text-slate-200">
                    Author <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    className="w-full mt-1 p-2 border rounded-md"
                />
            </div>

            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-slate-200">
                    Genre <span className="text-red-600">*</span>
                </label>
                <Select<GenreOption, false>
                    inputId="genre"
                    options={genreOptions}
                    value={selectedGenre}
                    onChange={(opt: SingleValue<GenreOption>) => setSelectedGenre(opt)}
                    placeholder="Select a genre..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            cursor: 'pointer',
                            backgroundColor: '#000',
                            borderColor: '#ffffff',
                            borderRadius: '0.375rem',
                            padding: '0.125rem',
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: '#E5E7EB',
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: '#9CA3AF',
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? '#065F46' : '#000',
                            color: state.isSelected ? '#FFF' : '#E5E7EB',
                        }),
                    }}
                />
            </div>
            <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-slate-200">
                    Publisher <span className="text-red-600">*</span>
                </label>
                <Select<PublisherOption, false>
                    inputId="publisher"
                    options={publisherOptions}
                    value={selectedPublisher}
                    onChange={(opt: SingleValue<PublisherOption>) => setSelectedPublisher(opt)}
                    placeholder="Select a publisher..."
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                        control: (provided) => ({
                            ...provided,
                            cursor: 'pointer',
                            backgroundColor: '#000',
                            borderColor: '#ffffff',
                            borderRadius: '0.375rem',
                            padding: '0.125rem',
                        }),
                        singleValue: (provided) => ({
                            ...provided,
                            color: '#E5E7EB',
                        }),
                        placeholder: (provided) => ({
                            ...provided,
                            color: '#9CA3AF',
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isFocused ? '#065F46' : '#000',
                            color: state.isSelected ? '#FFF' : '#E5E7EB',
                        }),
                    }}
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
