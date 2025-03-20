import { User } from "lucide-react";

const DefaultUserIcon = ({ width, height, iconSize, onClick }) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 rounded-full cursor-pointer ${width} ${height}`}
            onClick={onClick}
        >
            <User width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultUserIcon;
