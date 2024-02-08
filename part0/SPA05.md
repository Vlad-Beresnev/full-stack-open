%% The sequence diagram in SVG format
%% https://www.mermaidchart.com/raw/a6adc614-5919-47bb-8766-2ff62e0a4b0c?theme=light&version=v0.1&format=svg


sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: "Salam", date: "2024-02-08T08:26:00.868Z"},…]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes