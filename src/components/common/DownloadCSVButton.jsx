"use client";
import { toast } from "react-toastify";

const DownloadCSVButton = ({
    data,
    filename = "data.csv",
    selectedColumns,
}) => {
    // function to flatten objects (handle nested objects/arrays)
    const flattenObject = (obj, prefix = "") => {
        let result = {};

        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            const newKey = prefix ? `${prefix}_${key}` : key; // convert nested keys

            if (typeof value === "object" && value !== null) {
                if (Array.isArray(value)) {
                    // convert arrays to string
                    result[newKey] = value
                        .map((item) =>
                            typeof item === "object"
                                ? JSON.stringify(item)
                                : item
                        )
                        .join(" | ");
                } else {
                    // recursively flatten objects
                    Object.assign(result, flattenObject(value, newKey));
                }
            } else {
                result[newKey] = value;
            }
        });

        return result;
    };

    // function to convert json array to csv format
    const convertToCSV = (data, selectedColumns) => {
        if (!data || data.length === 0) return "";

        // flatten all objects before extracting selected columns
        const flattenedData = data.map((item) => flattenObject(item));

        // filter headers based on selectedColumns
        const headers =
            selectedColumns.length > 0
                ? selectedColumns
                : Object.keys(flattenedData[0]); // default: all fields

        // convert each object into a csv row
        const rows = flattenedData.map((obj) =>
            headers.map((header) => `"${obj[header] || ""}"`).join(",")
        );

        return [headers.join(","), ...rows].join("\n");
    };

    // function to trigger csv download
    const downloadCSV = () => {
        if (!data || data.length === 0) {
            toast.error("No data available to download.");
            return;
        }

        const csvData = convertToCSV(data, selectedColumns);
        const blob = new Blob([csvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        // create a hidden <a> tag to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return <button onClick={downloadCSV}>Download csv</button>;
};

export default DownloadCSVButton;
