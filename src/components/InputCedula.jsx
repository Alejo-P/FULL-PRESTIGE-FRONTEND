import React, { useState} from 'react'

const InputCedula = ({
    handleSearch,
    handleChange,
    value
}) => {
    return (
        <div className="flex items-center justify-between bg-gray-300 p-4 rounded-lg mb-6">
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Cedula"
                className="bg-gray-200 border border-black py-2 px-4 w-full rounded-lg focus:outline-none"
            />
            <button 
                onClick={handleSearch}
                className="ml-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-800">
                Buscar
            </button>
        </div>
    )
}

export default InputCedula