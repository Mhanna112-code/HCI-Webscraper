This is a React web app that allows users to fetch data from a backend API and export the data to a CSV file. The main component is called WebScraperApp. Here's an overview of its functionality:

The component maintains state for the search term, selected category, fetched data, and selected columns to include in the exported CSV file.

The user can input a search term and choose a category from a dropdown menu, then submit the form to fetch the data from the API. The fetchData function is called, which sends a request to the backend API and updates the state with the fetched data.

The user can select columns to include in the exported CSV file. The handleCheckboxChange function updates the state with the selected columns.

The user can click the "Export" button to export the fetched data to a CSV file. The handleExport function creates a CSV file with the selected columns and the fetched data, and initiates a download of the file.

The user can click the "Reset" button to reset the search term, selected category, and selected columns.

The user can click the "Quit" button to exit the app. The handleExit function prompts the user to confirm if they want to exit the app and then closes the window.

The fetched data is displayed in a list format in the "data-container" div.