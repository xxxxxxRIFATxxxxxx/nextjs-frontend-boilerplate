import { User } from "lucide-react";

const DefaultUserIcon = ({ width, height, iconSize }) => {
    return (
        <div
            className={`flex items-center justify-center bg-gray-100 rounded-full ${width} ${height}`}
        >
            <User width={iconSize} height={iconSize} />
        </div>
    );
};

export default DefaultUserIcon;
