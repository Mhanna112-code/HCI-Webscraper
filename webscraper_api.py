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


@app.route('/api/get_data', methods=['GET'])
def get_data():
    try:
        # Replace query with local html file location
        category = request.args.get('category')
        if not category:
            return {"error": "Missing category parameter"}, 400

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
        post_url = f"https://sfbay.craigslist.org/search/sfc/sss?query={category}#search=1~gallery~0~0"
        # TODO-EMMANUEL: for loop through li tags to pull data we need
        for li in li_tags:
            post_id = li.get('data-pid')
            post_title = li.get('title')

            # Get the Posting Name, Date, Price and Location of each posting
            try:
                post_price = li.find('span', {'class': 'priceinfo'}).text
            except (AttributeError, TypeError):
                post_price = 'N/A'

            try:
                meta_info = li.find('div', {'class': 'meta'}).text.split('·')
                post_date = meta_info[0].strip()
                location = meta_info[-1].strip()
            except (AttributeError, TypeError, IndexError):
                post_date = 'N/A'
                location = 'N/A'

            search_results.append([post_id, post_title, post_price, post_date, location, post_url])
        # Columns for Excel Sheet
        columns = (['PostID', 'PostTitle', 'PostPrice', 'PostDate', 'PostLocation', 'PostURL'])
        # Store data in dataframe
        df = pd.DataFrame(search_results, columns=columns)
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


if __name__ == "__main__":
    app.run(debug=True)
    # get_data("photography")

