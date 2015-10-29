function openResultsWindow(jsonData) {
    var data = JSON.stringify(jsonData, undefined, 4);
    var win = window.open("", "Result JSON", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=500, height=1000, top=" + (screen.height - 400) + ", left=" + (screen.width - 840));
    win.document.head.innerHTML = "<style> \
                                       pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; } \
                                       .string { color: green; } \
                                       .number { color: darkorange; } \
                                       .boolean { color: blue; } \
                                       .null { color: magenta; } \
                                       .key { color: red; } \
                                   </style>"
    win.document.body.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(data);
}

function syntaxHighlight(json) {
    var json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}