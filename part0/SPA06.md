%% The sequence diagram in SVG format
%% https://www.mermaidchart.com/raw/bec5816a-7c08-4a99-ba1b-b812d71f0bf6?theme=light&version=v0.1&format=svg


sequenceDiagram
    participant browser
    participant server

    Note right of server: The server responds with status code 201. The browser sends no further HTTP requests

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: {content: "The Last Step", date: "2024-02-08T15:50:57.106Z"}
    deactivate server