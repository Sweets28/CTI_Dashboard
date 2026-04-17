import React from "react";


const Pagination = ({page, totalPages, onPrev, onNext}) => {
    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
            <button 
                onClick={onPrev}
                disabled={page === 1}
                className="font-mono text-xs px-4 py-2 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30"
                >
                ← PREV        
            </button>
            <span className="font-mono text-xs text-gray-500">
                PAGE {page} OF {totalPages}
            </span>
            <button
                onClick={onNext}
                disabled={page === totalPages}
                className="font-mono text-xs px-4 py-2 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30"
                >
                NEXT →
            </button>
        </div>
    )
}


export default Pagination