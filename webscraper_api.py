import re
import time
import datetime
from bs4 import BeautifulSoup
import pandas as pd


def get_data(category):
    try:
        # Local html file location
        file_path = f"{category}.html"

        # Read and parse the local html file
        with open(file_path, 'r', encoding='utf-8') as file:
            page_content = file.read()

        # Initialize BeautifulSoup with html content
        soup = BeautifulSoup(page_content, 'html.parser')
        # Array to hold data rows
        search_results = []

        li_tags = soup.find_all('li', attrs={'class': 'cl-search-result cl-search-view-mode-gallery'})

        # TODO-EMMANUEL: for loop through li tags to pull data we need
        for li in li_tags:
            # Get the Posting Name, Date, Price and Location of each posting
            pass
        # Columns for Excel Sheet
        columns = (['PostID, PostTitle', 'PostDate', 'PostLocation'])
        # Store data in dataframe
        df = pd.DataFrame(search_results, columns=columns)
        timestamp = datetime.datetime.now().strftime('%m_%d_%y %H%M%S')
        # Output Dataframe to CSV
        df.to_csv(f'Craigslist Results ({timestamp}).csv', index=False)
        print('File Successfully Created!')

    except Exception as e:
        print(e)

if __name__ == "__main__":
    get_data("cars")
