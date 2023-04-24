import React, { useState } from 'react';
import queryString from 'query-string';
import './WebScraperApp.css';

const WebScraperApp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [data, setData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);

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
        const csvContent = [
            selectedColumns.join(','),
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
        const columnsToExport = selectedColumns.length ? selectedColumns : ['PostURL', 'Location'];
        const dataToExport = data.map(item => {
            const filteredItem = {};
            columnsToExport.forEach(column => {
                filteredItem[column] = item[column];
            });
            return filteredItem;
        });
        exportToCSV(dataToExport, filename);
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedOption('');
        setSelectedColumns([]);
    };

    const handleCheckboxChange = (event) => {
        const selected = event.target.checked ? [...selectedColumns, event.target.value] : selectedColumns.filter(item => item !== event.target.value);
        setSelectedColumns(selected);
    }

    const handleExit = () => {
        if (window.confirm('Are you sure you want to exit the app?')) {
            console.log('Exiting app...');
            window.close();
        }
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
                    <option value="Cars">Cars</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                    <option value="option4">Option 4</option>
                </select>
                <button type="submit" className="common-btn submit-btn">Submit</button>
            </form>
            <div className="csv-columns-container">
                <h4>Select columns to include in the exported CSV:</h4>
                <label>
                    <input type="checkbox" name="columns" value="PostName" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostName")} />
                    Post Name
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostDate" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostDate")} />
                    Post Date
                </label>
                <label>
                    <input type="checkbox" name="columns" value="Location" onChange={handleCheckboxChange} checked={selectedColumns.includes("Location")} />
                    Location
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostURL" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostURL")} />
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
