import re
import time
import datetime
import requests
from bs4 import BeautifulSoup
import pandas as pd


def get_data(category):
    try:
        # Replace query with local html file location
        file_path = f"{category}.html"

        # Read and parse the local html file
        with open(file_path, 'r', encoding='utf-8') as file:
            page_content = file.read()

        # Initialize BeautifulSoup with html content
        soup = BeautifulSoup(page_content, 'html.parser')
        # Array to hold data rows
        search_results = []

        # TODO Change script tags to traverse embedded tags until you get to li tags containing posting info we need
        # located at Body -> main ->div-class =“cl-content”  ->
        # main class = “cl-search cl-hide-filters cl-search-view-mode-gallery section-sss category-sss cl-narrow cl-search-sort-mode-relevance" div-class =“cl-search-results” ->
        # div-class ="results cl-results-page cl-search-view-mode-gallery narrow” ->
        # ol -> li
        script_tags = soup.find_all('script')
        # TODO for loop through li tags to pull data we need
        for result in script_tags:
            location_match = re.search(r'location:\s*({.*?})\s*,', result.text)
            if location_match:
                location_dict = location_match.group(1)
                region_match = re.search(r'"region":\s*"([^"]+)"', location_dict)
                city_match = re.search(r'"city":\s*"([^"]+)"', location_dict)
                if region_match:
                    region = region_match.group(1)
                if city_match:
                    city = city_match.group(1)
                location = city + ', ' + region
                query_url = f"https://sfbay.craigslist.org/search/sfc/sss?query={category}#search=1~gallery~0~0"
                search_results.append([query_url, location])
        time.sleep(1)
        columns = (['PostURL', 'Location'])
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
