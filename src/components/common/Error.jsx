const Error = ({ errorMessage }) => {
    return (
        <div className="p-4 bg-red-500 text-center" role="alert">
            <span className="text-white">
                {errorMessage.split("\n").map((msg, index) => (
                    <span key={index}>
                        Error: {msg}
                        <br />
                    </span>
                ))}
            </span>
        </div>
    );
};

export default Error;
