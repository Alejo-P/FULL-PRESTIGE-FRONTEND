import React from 'react'
import assets from '../assets/images'

const DownloadsButtons = ({
    handleDownloadExcel,
    handleDownloadPDF
}) => {
    return (
        <div className="flex space-x-4 justify-center mt-20">
            <button
                onClick={handleDownloadPDF}
                className="bg-red-400 text-black font-bold px-3 py-2 rounded flex items-center space-x-5"
            >
                <img src={assets.pdf} alt="pdf" className="h-6" />
                Descargar PDF
            </button>

            <button
                onClick={handleDownloadExcel}
                className="bg-green-300 text-black font-bold px-3 py-2 rounded flex item-center space-x-5"
            >
                <img src={assets.excel} alt="excel" className="h-6" />
                Descargar Excel
            </button>
        </div>
    )
}

export default DownloadsButtons