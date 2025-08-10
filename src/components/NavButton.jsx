// components/NavButton.jsx
import React from 'react';

const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
            active
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </button>
);

export default NavButton;