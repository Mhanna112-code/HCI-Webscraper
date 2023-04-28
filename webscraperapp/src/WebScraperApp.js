import React, { useState } from 'react';
import queryString from 'query-string';
import './WebScraperApp.css';

const WebScraperApp = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [data, setData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState(['PostID', 'PostTitle', 'PostPrice', 'PostDate', 'PostLocation', 'PostURL']);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalURL, setModalURL] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // const fetchData = async () => {
    //     const apiUrl = 'http://localhost:5000/api/get_data';
    //     const query = queryString.stringify({ category: selectedOption });
    //     const response = await fetch(`${apiUrl}?${query}`);
    //     const result = await response.json();
    //     setData(result);
    // };

    const fetchData = async () => {
        const apiUrl = 'http://localhost:5000/api/get_data';
        console.log("searchTerm: ", searchTerm)
        const query = queryString.stringify({
            category: selectedOption,
            search: searchTerm, // add search term to the query object
        });
        const response = await fetch(`${apiUrl}?${query}`);
        const result = await response.json();
        setData(result);
    };
    

    const exportToCSV = (data, filename) => {
        const columnsToExport = selectedColumns.length ? selectedColumns : ['PostID', 'PostTitle', 'PostPrice', 'PostDate', 'PostLocation', 'PostURL'];
        const csvContent = [
            columnsToExport.join(','),
            ...data.map((item) =>
                columnsToExport.map((column) => item[column]).join(',')
            ),
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

    // const handleSubmit = (event) => {
    //     event.preventDefault();
    //     fetchData();
    // };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const handleExport = () => {
        const filename = `Craigslist_Results_${Date.now()}.csv`;
        const columnsToExport = selectedColumns.length ? selectedColumns : ['PostID', 'PostTitle', 'PostPrice', 'PostDate', 'PostLocation', 'PostURL'];
        const dataToExport = data.map(item => {
            const filteredItem = {};
            columnsToExport.forEach(column => {
                filteredItem[column] = item[column];
            });
            return filteredItem;
        });
        exportToCSV(dataToExport, filename);
    };

    // const renderTableHeader = () => {
    //     return (
    //         <tr>
    //             {selectedColumns.length > 0
    //                 ? selectedColumns.map((column, index) => <th key={index}>{column}</th>)
    //                 : <>
    //                     <th>PostURL</th>
    //                     <th>PostLocation</th>
    //                 </>
    //             }
    //         </tr>
    //     );
    // };

    const renderTableHeader = () => {
        return (
            <tr>
                {selectedColumns.length > 0
                    ? selectedColumns.map((column, index) => <th key={index}>{column}</th>)
                    : <></>
                }
            </tr>
        );
    };
    

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const openModal = (url) => {
        setModalURL(url);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const renderTableRows = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const visibleData = data.slice(startIndex, endIndex);

        return visibleData.map((item, index) => (
            <tr key={index}>
                {selectedColumns.length > 0
                    ? selectedColumns.map((column, index) => (
                        column === "PostURL" ? (
                            selectedColumns.length === 1 ? (
                                <td key={index}>{item[column]}</td>
                            ) : (
                                <td key={index}>
                                    <div className="tooltip" onClick={() => openModal(item[column])}>
                                        {truncateText(item[column], 40)}
                                        <span className="tooltip-text">{item[column]}</span>
                                    </div>
                                </td>
                            )
                        ) : (
                            <td key={index}>{item[column]}</td>
                        )
                    ))
                    : <></>
                }
            </tr>
        ));
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(data.length / itemsPerPage);

        return (
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        );
    };

    const handleReset = () => {
        setSearchTerm('');
        setSelectedOption('');
        setSelectedColumns([]);
        setData([]);
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
                    id="keyword-search"
                    type="text"
                    placeholder="Please enter a list of keywords separated by commas"
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
                    <option value="Art">Art</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Daycare">Daycare</option>
                </select>
                <button type="submit" className="common-btn submit-btn">Submit</button>
            </form>
            <div className="csv-columns-container">
                <h4>Select columns to include in the exported CSV:</h4>
                <label>
                    <input type="checkbox" name="columns" value="PostID" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostID")} />
                    Post ID
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostTitle" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostTitle")} />
                    Post Title
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostPrice" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostPrice")} />
                    Post Price
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostDate" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostDate")} />
                    Post Date
                </label>
                <label>
                    <input type="checkbox" name="columns" value="PostLocation" onChange={handleCheckboxChange} checked={selectedColumns.includes("PostLocation")} />
                    Post Location
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
                {data.length > 0 && (
                    <>
                        <table>
                            <thead>
                            {renderTableHeader()}
                            </thead>
                            <tbody>
                            {renderTableRows()}
                            </tbody>
                        </table>
                        {renderPagination()}
                    </>
                )}
            </div>
            {isModalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <p>{modalURL}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WebScraperApp;


