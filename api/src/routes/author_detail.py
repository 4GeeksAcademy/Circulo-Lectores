from flask import jsonify
import requests


def author_detail_route(app):
    @app.route("/author/<path:author_id>", methods=["GET"])
    def author_detail(author_id):
        response_body = {}
        url = f"https://openlibrary.org/authors/{author_id}.json"
        try:
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                return jsonify(data), 200
            else:
                response_body["error"] = (
                    f"Error retrieving OpenLibrary API data. Status code: {response.status_code}"
                )
                return jsonify(response_body), response.status_code

        except requests.exceptions.RequestException as e:
            response_body["error"] = f"Request failed: {str(e)}"
            return (jsonify(response_body),)
