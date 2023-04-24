from flask import Flask, jsonify, request
import re
import time
import datetime
import requests
from bs4 import BeautifulSoup
import pandas as pd

app = Flask(__name__)


@app.route('/api/get_data', methods=['GET'])
def get_data():
    category = request.args.get('category', '')
    search_results = []

    try:
        query_url = f"https://sfbay.craigslist.org/search/sfc/sss?query={category}#search=1~gallery~0~0"
        response = requests.get(query_url)
        page_content = response.content

        soup = BeautifulSoup(page_content, 'html.parser')
        script_tags = soup.find_all('main')

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
                search_results.append([query_url, location])

        time.sleep(1)
        columns = (['PostURL', 'Location'])
        df = pd.DataFrame(search_results, columns=columns)

    except Exception as e:
        print(e)
        df = pd.DataFrame(columns=['PostURL', 'Location'])

    finally:
        return jsonify(df.to_dict(orient='records'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
