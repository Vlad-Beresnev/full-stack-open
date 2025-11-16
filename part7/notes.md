# React Router
- Router help to devide the app into different views.

### BrowserRouter is a Router that uses the HTML5 history API (pushState, replaceState and the popState event) to keep your UI in sync with the URL.
- with HTML5 history API, change of the url, content of the page is only manipulated using Javascript.
---
1.  `<Link to="/notes">notes</Link>` create a link which when clicked changes the url to /notes.
2. `<Route path="/notes" element={<Note />} />` defines the component to render based on the url.

