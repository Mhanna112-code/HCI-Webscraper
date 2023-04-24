import React, { useState } from 'react';
import queryString from 'query-string';
import './WebScraperApp.css';

const WebScraperApp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [data, setData] = useState([]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const fetchData = async () => {
        const apiUrl = 'http://localhost:5000/api/get_data';
        const query = queryString.stringify({ category: selectedOption });
        const response = await fetch(`${apiUrl}?${query}`);
        const result = await response.json();
        setData(result);
    };

    const exportToCSV = (data, filename) => {
        const headers = ['PostURL', 'Location'];
        const csvContent = [
            headers.join(','),
            ...data.map((item) => `${item.PostURL},${item.Location}`),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const handleExport = () => {
        const filename = `Craigslist_Results_${Date.now()}.csv`;
        exportToCSV(data, filename);
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedOption('');
    };

    const handleExit = () => {
        console.log('Exiting app...');
    };

    return (
        <div className="web-scraper-app">
            <form onSubmit={handleSubmit}>
                <input
                    className="common-input"
                    type="text"
                    placeholder="Enter a keyword..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <select
                    className="common-input"
                    id="category-select"
                    value={selectedOption}
                    onChange={handleOptionChange}
                >
                    <option value="">Choose a category</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                </select>
                <button type="submit" className="common-btn submit-btn">Submit</button>
            </form>
            <div className="csv-columns-container">
                <h4>Select columns to include in the exported CSV:</h4>
                <label>
                    <input type="checkbox" name="columns" value="PostName" />
                    Post Name
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostDate" />
                    Post Date
                </label>
                <label>
                    <input type="checkbox" name="columns" value="Location" />
                    Location
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostURL" />
                    Post URL
                </label>
            </div>
            <div className="button-container">
                <button onClick={handleExport} className="common-btn">Export</button>
                <button onClick={handleReset} className="common-btn">Reset</button>
                <button onClick={handleExit} className="common-btn">Quit</button>
            </div>
            <div className="data-container">
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>
                            Post URL: {item.PostURL}, Location: {item.Location}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebScraperApp;
