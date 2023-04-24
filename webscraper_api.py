import os
import re
import time
import datetime
from bs4 import BeautifulSoup
import pandas as pd
from flask import Flask, Response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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


@app.route('/api/output_dummy_csv', methods=['GET'])
def output_dummy_csv():
    try:
        # Replace query with local html file location
        category = request.args.get('category')
        if not category:
            return {"error": "Missing category parameter"}, 400

        file_path = f"{category}.html"

        # Read and parse the local html file
        with open(file_path, 'r', encoding='utf-8') as file:
            page_content = file.read()

        # Initialize BeautifulSoup with html content
        soup = BeautifulSoup(page_content, 'html.parser')
        # Array to hold data rows
        search_results = []

        script_tags = soup.find_all('script')
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

        columns = (['PostURL', 'Location'])
        # Store data in dataframe
        df = pd.DataFrame(search_results, columns=columns)
        # Create a Results directory if it doesn't exist
        if not os.path.exists('Results'):
            os.makedirs('Results')

        # Save the file to the Results directory
        timestamp = datetime.datetime.now().strftime('%m_%d_%y_%H%M%S')
        output_path = os.path.join('Results', f'Craigslist_Results_{category}_{timestamp}.csv')
        df.to_csv(output_path, index=False)
        print('File Successfully Created!')
        print(jsonify(df.to_dict(orient='records')))
        return jsonify(df.to_dict(orient='records'))

    except Exception as e:
        print(e)
        return Response("Error: Could not create file.", status=500)


if __name__ == "__main__":
    app.run(debug=True)
    # get_data("photography")
