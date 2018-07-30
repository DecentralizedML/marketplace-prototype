// modified from https://stackoverflow.com/questions/20256760/javascript-console-log-to-html

function rewireLoggingToElement(elementLocator, elementOverflowLocator, autoScroll = true) {
  function fixLoggingFunc(name) {
    // store original function
    console['old' + name] = console[name];

    // overwrite original function
    console[name] = function(...arguments) {
      const output = produceOutput(name, arguments);
      const elementLog = elementLocator();

      // log to page
      if (autoScroll) {
        const eleContainerLog = elementOverflowLocator();
        const isScrolledToBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
        elementLog.innerHTML += output + "<br>";
        if (isScrolledToBottom) {
          eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
        }
      } else {
        elementLog.innerHTML += output + "<br>";
      }

      // and log to console
      console['old' + name].apply(undefined, arguments);
    };
  }

  function produceOutput(name, arguments) {
    return arguments.reduce((output, arg) => {
      return output +
      "<span class=\"log-" + (typeof arg) + " log-" + name + "\">" +
      (typeof arg === "object" && (JSON || {}).stringify ? JSON.stringify(arg) : arg) +
      "</span>&nbsp;";
    }, '');
  }

  // proxy original console functions
  fixLoggingFunc('log');
  fixLoggingFunc('debug');
  fixLoggingFunc('warn');
  fixLoggingFunc('error');
  fixLoggingFunc('info');

  // and log script errors to page (and console)
  window.addEventListener('error', (event) => {
    console.error(event.message);
  }, false);
}

rewireLoggingToElement(
  () => document.getElementById("log"),
  () => document.getElementById("log-container"),
);
