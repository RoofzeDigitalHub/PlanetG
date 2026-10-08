import http.server
import socketserver
import os
import urllib.parse
import mimetypes

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Ensure common mime types are registered
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/jpeg", ".jpeg")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("application/json", ".json")

class PlanetGHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and disable aggressive caching for dev testing
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path in ("/", "/index.html", "/planetG", "/planetG/"):
            self.path = "/homepage/index/index.html"
            if parsed.query:
                self.path += "?" + parsed.query
        elif path.startswith("/planetG/"):
            # Strip /planetG prefix so /planetG/assets/logo.png -> /assets/logo.png
            self.path = path[len("/planetG"):]
            if parsed.query:
                self.path += "?" + parsed.query

        return super().do_GET()

if __name__ == "__main__":
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PlanetGHandler) as httpd:
        print(f"Server started at http://localhost:{PORT}/")
        httpd.serve_forever()
