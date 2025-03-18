const Modal = ({ title, isOpen, onClose, width = "max-w-md", children }) => {
    if (!isOpen) return null;

    return (
        <div
            tabIndex="-1"
            aria-hidden="true"
            className="overflow-y-auto overflow-x-hidden fixed top-0 bottom-0 right-0 left-0 m-auto z-50 justify-center items-center w-full md:inset-0 max-h-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
            <div className="fixed inset-0 flex items-center justify-center">
                <div
                    className={`relative p-4 w-full ${width} bg-white rounded-lg shadow-sm`}
                >
                    {/* modal header */}
                    <div className="flex items-center justify-between p-4 rounded-t">
                        <h6 className="font-bold">{title}</h6>

                        <button
                            type="button"
                            className="end-2.5 text-gray-400 bg-transparent hover:bg-primary-700 hover:text-white cursor-pointer rounded-full text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            onClick={onClose}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    {/* modal body */}
                    <div className="p-4 max-h-[70vh] overflow-y-auto scrollbar-thin">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
