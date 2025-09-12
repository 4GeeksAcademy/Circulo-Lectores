import requests
from flask import request, jsonify
from urllib.parse import quote


def books_search_routes(app):
    @app.route("/books/search", methods=["GET"])
    def search_books():
        query = request.args.get("q", "").strip()
        if not query:
            return jsonify({"error": "Missing search query (use ?q=title)"}), 400

        try:
            encoded_query = quote(query)
            url = f"https://openlibrary.org/search.json?title={encoded_query}"
            response = requests.get(url, timeout=10)

            if response.status_code != 200:
                return jsonify(
                    {"error": "Failed to get the information from OpenLibrary"}
                ), 500

            data = response.json()
            results = []

            for book in data.get("docs", []):
                author_names = book.get("author_name", [])
                author = author_names[0] if author_names else "Unknown"

                results.append(
                    {
                        "title": book.get("title", "Unknown Title"),
                        "author": author,
                        "first_publish_year": book.get("first_publish_year"),
                        "cover_id": book.get("cover_i"),
                        "openlibrary_id": book.get("key"),
                    }
                )

            return jsonify({"results": results})

        except Exception as e:
            return jsonify({"error": f"Unexpected error: {str(e)}"}), 500


# pruebas hechas con https://automatic-fortnight-5g54rgww9xgwh4j7r-5000.app.github.dev/books/search?q=harry+potter - SALIÓ OK
# prueba hecha con https://automatic-fortnight-5g54rgww9xgwh4j7r-5000.app.github.dev/books/search?q=lord%20of%20the%20rings - SALIÓ OK
