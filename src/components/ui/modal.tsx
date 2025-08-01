"use client";

import { ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title: string;
};

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (

        <div
            className="fixed inset-0 bg-[#00000098] flex justify-center text-slate-100 items-center z-50 transition-opacity"
            onClick={onClose}>
           
            <div
                className="relative bg-black rounded-lg shadow-sm shadow-teal-500 border border-slate-100 w-full max-w-md p-8"
                onClick={(e) => e.stopPropagation()} > {/* Prevent click from closing the modal */}

                {/* Modal Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-200 hover:text-lg hover:text-slate-50 p-1 rounded-full cursor-pointer"
                        aria-label="Close modal"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                {/* Modal Content */}
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}