/**
 *
 * @param {Function} callback The callback to run when translation is done
 * @param {{content: string; server: {url: string; key: Array<string>;}; path}} options
 */
const translate = async (callback, options) => {
  /**
   *
   * @param {object} object The object where search for the property
   * @param {Array<string>} propertyPath The path of the property to return
   * @returns {*} The content of the key given in **propertyPath**
   */
  const GetValueFromObject = (object, propertyPath) => {
    for (let i = 0; i < propertyPath.length; i++) {
      object = object[propertyPath[i]];
      if (i === propertyPath.length - 1) {
        return object;
      }
    }
  };
  function done(index, listSize) {
    const normal = "color: white;font-weight: normal;text-decoration:none;";
    const bold = "font-weight: bold;";
    const underline = "text-decoration: underline;";
    const italic = "font-style: italic;";
    console.log(
      "%c[Translator.js] %c" + index + "%c of %c" + listSize + "%c done.",
      "color:red;font-weight:bold;",
      italic,
      normal,
      underline,
      bold
    );
  }
  const execTranslation = (translation_file, path) => {
    if (
      translation_file.exact_domain &&
      !Object.keys(translation_file.domains).includes(location.hostname)
    ) {
      console.error(
        '%c[Translator.js]%c Unauthorized domain "%c' +
          location.hostname +
          '%c"',
        "color:red;font-weight:bold;",
        "color: white;font-weight: normal;",
        "font-weight: bold;",
        "color: white;font-weight: normal;text-decoration:none;"
      );
      return;
    }
    console.log(
      "%c[Translator.js]%c Translate starting",
      "color:red;font-weight:bold;",
      "color: white;font-weight: normal;"
    );
    const translations = translation_file["translations"][path];
    if (translations === undefined) return;
    document.querySelectorAll("[trjs]").forEach((el, i) => {
      let translation = translations[el.getAttribute("trjsid")];
      if (typeof translation === "object") {
        if (translation["type"] === "attribute") {
          el.setAttribute(translation["name"], translation["value"]);
          done(i + 1, document.querySelectorAll("[trjs]").length);
          return;
        } else if (
          translation["type"] === "warning" &&
          !translation["translate"]
        ) {
          return;
        }
      } else {
        // console.log(el);
        el.textContent = translation;
        done(i + 1, document.querySelectorAll("[trjs]").length);
      }
    });
    callback();
  };

  // Code
  if (options === undefined) {
    throw new Error("No content given");
  }
  const path = options.path === undefined ? location.pathname : options.path;
  if (options.content) {
    execTranslation(options.content, path);
  } else if (options.server.url) {
    fetch(options.server.url)
      .then((res) => res.json())
      .then((response) => {
        execTranslation(
          GetValueFromObject(
            response,
            typeof options.server.key === "undefined" ? [] : options.server.key
          ),
          path
        );
      });
  }
};

const GetTranslation = async (translationID, options) => {
  /**
   *
   * @param {object} object The object where search for the property
   * @param {Array<string>} propertyPath The path of the property to return
   * @returns {*} The content of the key given in **propertyPath**
   */
  const GetValueFromObject = (object, propertyPath) => {
    for (let i = 0; i < propertyPath.length; i++) {
      object = object[propertyPath[i]];
      if (i === propertyPath.length - 1) {
        return object;
      }
    }
  };

  // Code
  if (options === undefined) {
    throw new Error("No content given");
  }
  const path = options.path === undefined ? location.pathname : options.path;
  if (options.content) {
    const file = GetValueFromObject(
      options.content,
      typeof options.server.key === "undefined" ? [] : options.server.key
    );
    return typeof file["translations"][path][translationID] === "object"
      ? file["translations"][path][translationID][value]
      : file["translations"][path][translationID];
  } else if (options.server.url) {
    let response = await fetch(options.server.url);
    const res = await response.json();
    const reqfile = GetValueFromObject(
      res,
      typeof options.server.key === "undefined" ? [] : options.server.key
    );
    return typeof reqfile["translations"][path][translationID] === "object"
      ? reqfile["translations"][path][translationID][value]
      : reqfile["translations"][path][translationID];
  }
};
