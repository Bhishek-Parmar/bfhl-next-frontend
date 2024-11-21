"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
    const [jsonInput, setJsonInput] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState('');
    const [selectedOptions, setSelectedOptions] = useState({
        alphabets: true,
        numbers: true,
        highestLowercase: true,
    });
    const [loading, setLoading] = useState(false);  // Add loading state

    const handleInputChange = (e) => {
        setJsonInput(e.target.value);
    };

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;
        setSelectedOptions((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const validateJson = (jsonString) => {
        try {
            const parsedData = JSON.parse(jsonString);
            return parsedData;
        } catch (err) {
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const parsedData = validateJson(jsonInput);
        if (!parsedData) {
            setError("Invalid JSON format.");
            return;
        }
        setError('');
        setLoading(true);  // Set loading to true when submitting

        try {
            const response = await axios.post(
                "https://bfhl-backend-0827cs211059.vercel.app/bfhl",
                parsedData
            );
            setResponseData(response.data);
        } catch (err) {
            setError("An error occurred while contacting the backend.");
        } finally {
            setLoading(false);  // Set loading to false once the request is complete
        }
    };

    const renderResponse = () => {
        if (!responseData) return null;

        const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
        let displayedData = [];

        if (selectedOptions.numbers) {
            displayedData.push(<div key="numbers">Numbers: {numbers.join(", ")}</div>);
        }
        if (selectedOptions.alphabets) {
            displayedData.push(<div key="alphabets">Alphabets: {alphabets.join(", ")}</div>);
        }
        if (selectedOptions.highestLowercase) {
            displayedData.push(
                <div key="highestLowercase">Highest Lowercase Alphabet: {highest_lowercase_alphabet.join(", ")}</div>
            );
        }

        return displayedData.length > 0 ? displayedData : <div>No data to display based on selected options.</div>;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-center mb-6">Submit JSON Data</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={jsonInput}
                    onChange={handleInputChange}
                    placeholder='Enter JSON data (e.g., {"data": ["A","C","z"]})'
                    rows="6"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <br />
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Submit
                </button>
            </form>

            {error && <div className="mt-4 text-red-500">{error}</div>}

            {loading ? (
                <div className="mt-4 text-center text-blue-500">Loading...</div> // Loading message
            ) : (
                responseData && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Select Data to Display</h2>
                        <div className="space-y-2">
                            <label className="block">
                                <input
                                    type="checkbox"
                                    name="alphabets"
                                    checked={selectedOptions.alphabets}
                                    onChange={handleOptionChange}
                                    className="mr-2"
                                />
                                Alphabets
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    name="numbers"
                                    checked={selectedOptions.numbers}
                                    onChange={handleOptionChange}
                                    className="mr-2"
                                />
                                Numbers
                            </label>
                            <label className="block">
                                <input
                                    type="checkbox"
                                    name="highestLowercase"
                                    checked={selectedOptions.highestLowercase}
                                    onChange={handleOptionChange}
                                    className="mr-2"
                                />
                                Highest Lowercase Alphabet
                            </label>
                        </div>

                        <div className="mt-4">{renderResponse()}</div>

                        <h3 className="text-xl font-semibold mt-8">Raw JSON Response</h3>
                        <pre className="bg-gray-100 text-black p-4 rounded-lg">{JSON.stringify(responseData, null, 2)}</pre>
                    </div>
                )
            )}
        </div>
    );
}
