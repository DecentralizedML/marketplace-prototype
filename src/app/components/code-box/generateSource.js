// https://stackoverflow.com/a/36607971 to explain escaping the closing script tag

const generateSource = (code, iframeHeight) => (`
  <html>
    <head>
      <script src="/console.js"></script>
      <style>
        #log-container {
          overflow: auto;
          height: ${iframeHeight - 16}px;
        }

        #log {
          font-family: monospace;
        }

        .log-warn {
          color: orange;
        }

        .log-error {
          color: magenta;
        }

        .log-info {
          color: cyan;
        }

        .log-log {
          color: silver;
        }

        .log-warn,
        .log-error {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div id="log-container">
        <div id="log"></div>
      </div>
      <script>
        ${code}
      </script>
    </body>
  </html>
`);

export default generateSource;
