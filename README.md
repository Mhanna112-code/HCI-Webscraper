# HCI-Webscraper

## Overview
This is a React web app that allows users to fetch data from a backend API and export the data to a CSV file. The main component is called WebScraperApp, and it offers the following functionality:

- Users can input a search term and choose a category from a dropdown menu before submitting the form to fetch data from the API. The `fetchData` function sends a request to the backend API, updates the state with the fetched data, and displays the data on the webpage.
- Users can select columns to include in the exported CSV file. The `handleCheckboxChange` function updates the state with the selected columns.
- Users can click the "Export" button to export the fetched data to a CSV file. The `handleExport` function creates a CSV file with the selected columns and the fetched data, then initiates a download of the file.
- Users can click the "Reset" button to reset the search term, selected category, and selected columns.
- Users can click the "Quit" button to exit the app. The `handleExit` function prompts the user to confirm if they want to exit the app and then closes the window.
- The fetched data is displayed in a list format within the "data-container" div.

## Getting Started

### Prerequisites

- Git
- Python
- Node.js v19.4.0 and npm v9.6.5

### Installation and Running

1. Clone the repository:

    `git clone https://github.com/Mhanna112-code/HCI-Webscraper.git`

2. Install backend dependencies:

    cd into HCI-Webscraper/backend

    `pip install -r requirements.txt`


3. Run the backend:

    `python webscraper_api.py`

4. Install frontend dependencies:

    cd ../webscraperapp

    `npm install`

5. Run the frontend:

    `npm start`

6. Access the app via [http://localhost:3000](http://localhost:3000) on your web browser.
