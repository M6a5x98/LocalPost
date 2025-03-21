/**
 * @license "DOMPurify 3.1.5 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.1.5/LICENSE"
 * Code copied & pasted from https://unpkg.com/dompurify@3.1.5/dist/purify.min.js
 */
!(function (e, t) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define(t)
    : ((e =
        "undefined" != typeof globalThis ? globalThis : e || self).DOMPurify =
        t());
})(this, function () {
  "use strict";
  const {
    entries: e,
    setPrototypeOf: t,
    isFrozen: n,
    getPrototypeOf: o,
    getOwnPropertyDescriptor: r,
  } = Object;
  let { freeze: i, seal: a, create: l } = Object,
    { apply: c, construct: s } = "undefined" != typeof Reflect && Reflect;
  i ||
    (i = function (e) {
      return e;
    }),
    a ||
      (a = function (e) {
        return e;
      }),
    c ||
      (c = function (e, t, n) {
        return e.apply(t, n);
      }),
    s ||
      (s = function (e, t) {
        return new e(...t);
      });
  const u = b(Array.prototype.forEach),
    m = b(Array.prototype.pop),
    p = b(Array.prototype.push),
    f = b(String.prototype.toLowerCase),
    d = b(String.prototype.toString),
    h = b(String.prototype.match),
    g = b(String.prototype.replace),
    T = b(String.prototype.indexOf),
    y = b(String.prototype.trim),
    E = b(Object.prototype.hasOwnProperty),
    _ = b(RegExp.prototype.test),
    A =
      ((N = TypeError),
      function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        return s(N, t);
      });
  var N;
  function b(e) {
    return function (t) {
      for (
        var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1;
        r < n;
        r++
      )
        o[r - 1] = arguments[r];
      return c(e, t, o);
    };
  }
  function S(e, o) {
    let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : f;
    t && t(e, null);
    let i = o.length;
    for (; i--; ) {
      let t = o[i];
      if ("string" == typeof t) {
        const e = r(t);
        e !== t && (n(o) || (o[i] = e), (t = e));
      }
      e[t] = !0;
    }
    return e;
  }
  function R(e) {
    for (let t = 0; t < e.length; t++) {
      E(e, t) || (e[t] = null);
    }
    return e;
  }
  function w(t) {
    const n = l(null);
    for (const [o, r] of e(t)) {
      E(t, o) &&
        (Array.isArray(r)
          ? (n[o] = R(r))
          : r && "object" == typeof r && r.constructor === Object
          ? (n[o] = w(r))
          : (n[o] = r));
    }
    return n;
  }
  function C(e, t) {
    for (; null !== e; ) {
      const n = r(e, t);
      if (n) {
        if (n.get) return b(n.get);
        if ("function" == typeof n.value) return b(n.value);
      }
      e = o(e);
    }
    return function () {
      return null;
    };
  }
  const L = i([
      "a",
      "abbr",
      "acronym",
      "address",
      "area",
      "article",
      "aside",
      "audio",
      "b",
      "bdi",
      "bdo",
      "big",
      "blink",
      "blockquote",
      "body",
      "br",
      "button",
      "canvas",
      "caption",
      "center",
      "cite",
      "code",
      "col",
      "colgroup",
      "content",
      "data",
      "datalist",
      "dd",
      "decorator",
      "del",
      "details",
      "dfn",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "element",
      "em",
      "fieldset",
      "figcaption",
      "figure",
      "font",
      "footer",
      "form",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hgroup",
      "hr",
      "html",
      "i",
      "img",
      "input",
      "ins",
      "kbd",
      "label",
      "legend",
      "li",
      "main",
      "map",
      "mark",
      "marquee",
      "menu",
      "menuitem",
      "meter",
      "nav",
      "nobr",
      "ol",
      "optgroup",
      "option",
      "output",
      "p",
      "picture",
      "pre",
      "progress",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "section",
      "select",
      "shadow",
      "small",
      "source",
      "spacer",
      "span",
      "strike",
      "strong",
      "style",
      "sub",
      "summary",
      "sup",
      "table",
      "tbody",
      "td",
      "template",
      "textarea",
      "tfoot",
      "th",
      "thead",
      "time",
      "tr",
      "track",
      "tt",
      "u",
      "ul",
      "var",
      "video",
      "wbr",
    ]),
    D = i([
      "svg",
      "a",
      "altglyph",
      "altglyphdef",
      "altglyphitem",
      "animatecolor",
      "animatemotion",
      "animatetransform",
      "circle",
      "clippath",
      "defs",
      "desc",
      "ellipse",
      "filter",
      "font",
      "g",
      "glyph",
      "glyphref",
      "hkern",
      "image",
      "line",
      "lineargradient",
      "marker",
      "mask",
      "metadata",
      "mpath",
      "path",
      "pattern",
      "polygon",
      "polyline",
      "radialgradient",
      "rect",
      "stop",
      "style",
      "switch",
      "symbol",
      "text",
      "textpath",
      "title",
      "tref",
      "tspan",
      "view",
      "vkern",
    ]),
    v = i([
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDistantLight",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
    ]),
    O = i([
      "animate",
      "color-profile",
      "cursor",
      "discard",
      "font-face",
      "font-face-format",
      "font-face-name",
      "font-face-src",
      "font-face-uri",
      "foreignobject",
      "hatch",
      "hatchpath",
      "mesh",
      "meshgradient",
      "meshpatch",
      "meshrow",
      "missing-glyph",
      "script",
      "set",
      "solidcolor",
      "unknown",
      "use",
    ]),
    x = i([
      "math",
      "menclose",
      "merror",
      "mfenced",
      "mfrac",
      "mglyph",
      "mi",
      "mlabeledtr",
      "mmultiscripts",
      "mn",
      "mo",
      "mover",
      "mpadded",
      "mphantom",
      "mroot",
      "mrow",
      "ms",
      "mspace",
      "msqrt",
      "mstyle",
      "msub",
      "msup",
      "msubsup",
      "mtable",
      "mtd",
      "mtext",
      "mtr",
      "munder",
      "munderover",
      "mprescripts",
    ]),
    k = i([
      "maction",
      "maligngroup",
      "malignmark",
      "mlongdiv",
      "mscarries",
      "mscarry",
      "msgroup",
      "mstack",
      "msline",
      "msrow",
      "semantics",
      "annotation",
      "annotation-xml",
      "mprescripts",
      "none",
    ]),
    M = i(["#text"]),
    I = i([
      "accept",
      "action",
      "align",
      "alt",
      "autocapitalize",
      "autocomplete",
      "autopictureinpicture",
      "autoplay",
      "background",
      "bgcolor",
      "border",
      "capture",
      "cellpadding",
      "cellspacing",
      "checked",
      "cite",
      "class",
      "clear",
      "color",
      "cols",
      "colspan",
      "controls",
      "controlslist",
      "coords",
      "crossorigin",
      "datetime",
      "decoding",
      "default",
      "dir",
      "disabled",
      "disablepictureinpicture",
      "disableremoteplayback",
      "download",
      "draggable",
      "enctype",
      "enterkeyhint",
      "face",
      "for",
      "headers",
      "height",
      "hidden",
      "high",
      "href",
      "hreflang",
      "id",
      "inputmode",
      "integrity",
      "ismap",
      "kind",
      "label",
      "lang",
      "list",
      "loading",
      "loop",
      "low",
      "max",
      "maxlength",
      "media",
      "method",
      "min",
      "minlength",
      "multiple",
      "muted",
      "name",
      "nonce",
      "noshade",
      "novalidate",
      "nowrap",
      "open",
      "optimum",
      "pattern",
      "placeholder",
      "playsinline",
      "popover",
      "popovertarget",
      "popovertargetaction",
      "poster",
      "preload",
      "pubdate",
      "radiogroup",
      "readonly",
      "rel",
      "required",
      "rev",
      "reversed",
      "role",
      "rows",
      "rowspan",
      "spellcheck",
      "scope",
      "selected",
      "shape",
      "size",
      "sizes",
      "span",
      "srclang",
      "start",
      "src",
      "srcset",
      "step",
      "style",
      "summary",
      "tabindex",
      "title",
      "translate",
      "type",
      "usemap",
      "valign",
      "value",
      "width",
      "wrap",
      "xmlns",
      "slot",
    ]),
    U = i([
      "accent-height",
      "accumulate",
      "additive",
      "alignment-baseline",
      "ascent",
      "attributename",
      "attributetype",
      "azimuth",
      "basefrequency",
      "baseline-shift",
      "begin",
      "bias",
      "by",
      "class",
      "clip",
      "clippathunits",
      "clip-path",
      "clip-rule",
      "color",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "cx",
      "cy",
      "d",
      "dx",
      "dy",
      "diffuseconstant",
      "direction",
      "display",
      "divisor",
      "dur",
      "edgemode",
      "elevation",
      "end",
      "fill",
      "fill-opacity",
      "fill-rule",
      "filter",
      "filterunits",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "fx",
      "fy",
      "g1",
      "g2",
      "glyph-name",
      "glyphref",
      "gradientunits",
      "gradienttransform",
      "height",
      "href",
      "id",
      "image-rendering",
      "in",
      "in2",
      "k",
      "k1",
      "k2",
      "k3",
      "k4",
      "kerning",
      "keypoints",
      "keysplines",
      "keytimes",
      "lang",
      "lengthadjust",
      "letter-spacing",
      "kernelmatrix",
      "kernelunitlength",
      "lighting-color",
      "local",
      "marker-end",
      "marker-mid",
      "marker-start",
      "markerheight",
      "markerunits",
      "markerwidth",
      "maskcontentunits",
      "maskunits",
      "max",
      "mask",
      "media",
      "method",
      "mode",
      "min",
      "name",
      "numoctaves",
      "offset",
      "operator",
      "opacity",
      "order",
      "orient",
      "orientation",
      "origin",
      "overflow",
      "paint-order",
      "path",
      "pathlength",
      "patterncontentunits",
      "patterntransform",
      "patternunits",
      "points",
      "preservealpha",
      "preserveaspectratio",
      "primitiveunits",
      "r",
      "rx",
      "ry",
      "radius",
      "refx",
      "refy",
      "repeatcount",
      "repeatdur",
      "restart",
      "result",
      "rotate",
      "scale",
      "seed",
      "shape-rendering",
      "specularconstant",
      "specularexponent",
      "spreadmethod",
      "startoffset",
      "stddeviation",
      "stitchtiles",
      "stop-color",
      "stop-opacity",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke",
      "stroke-width",
      "style",
      "surfacescale",
      "systemlanguage",
      "tabindex",
      "targetx",
      "targety",
      "transform",
      "transform-origin",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "textlength",
      "type",
      "u1",
      "u2",
      "unicode",
      "values",
      "viewbox",
      "visibility",
      "version",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "width",
      "word-spacing",
      "wrap",
      "writing-mode",
      "xchannelselector",
      "ychannelselector",
      "x",
      "x1",
      "x2",
      "xmlns",
      "y",
      "y1",
      "y2",
      "z",
      "zoomandpan",
    ]),
    P = i([
      "accent",
      "accentunder",
      "align",
      "bevelled",
      "close",
      "columnsalign",
      "columnlines",
      "columnspan",
      "denomalign",
      "depth",
      "dir",
      "display",
      "displaystyle",
      "encoding",
      "fence",
      "frame",
      "height",
      "href",
      "id",
      "largeop",
      "length",
      "linethickness",
      "lspace",
      "lquote",
      "mathbackground",
      "mathcolor",
      "mathsize",
      "mathvariant",
      "maxsize",
      "minsize",
      "movablelimits",
      "notation",
      "numalign",
      "open",
      "rowalign",
      "rowlines",
      "rowspacing",
      "rowspan",
      "rspace",
      "rquote",
      "scriptlevel",
      "scriptminsize",
      "scriptsizemultiplier",
      "selection",
      "separator",
      "separators",
      "stretchy",
      "subscriptshift",
      "supscriptshift",
      "symmetric",
      "voffset",
      "width",
      "xmlns",
    ]),
    F = i(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
    H = a(/\{\{[\w\W]*|[\w\W]*\}\}/gm),
    z = a(/<%[\w\W]*|[\w\W]*%>/gm),
    B = a(/\${[\w\W]*}/gm),
    W = a(/^data-[\-\w.\u00B7-\uFFFF]/),
    G = a(/^aria-[\-\w]+$/),
    Y = a(
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    ),
    j = a(/^(?:\w+script|data):/i),
    X = a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
    q = a(/^html$/i),
    $ = a(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var K = Object.freeze({
    __proto__: null,
    MUSTACHE_EXPR: H,
    ERB_EXPR: z,
    TMPLIT_EXPR: B,
    DATA_ATTR: W,
    ARIA_ATTR: G,
    IS_ALLOWED_URI: Y,
    IS_SCRIPT_OR_DATA: j,
    ATTR_WHITESPACE: X,
    DOCTYPE_NAME: q,
    CUSTOM_ELEMENT: $,
  });
  const V = 1,
    Z = 3,
    J = 7,
    Q = 8,
    ee = 9,
    te = function () {
      return "undefined" == typeof window ? null : window;
    },
    ne = function (e, t) {
      if ("object" != typeof e || "function" != typeof e.createPolicy)
        return null;
      let n = null;
      const o = "data-tt-policy-suffix";
      t && t.hasAttribute(o) && (n = t.getAttribute(o));
      const r = "dompurify" + (n ? "#" + n : "");
      try {
        return e.createPolicy(r, {
          createHTML: (e) => e,
          createScriptURL: (e) => e,
        });
      } catch (e) {
        return (
          console.warn("TrustedTypes policy " + r + " could not be created."),
          null
        );
      }
    };
  var oe = (function t() {
    let n =
      arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : te();
    const o = (e) => t(e);
    if (
      ((o.version = "3.1.5"),
      (o.removed = []),
      !n || !n.document || n.document.nodeType !== ee)
    )
      return (o.isSupported = !1), o;
    let { document: r } = n;
    const a = r,
      c = a.currentScript,
      {
        DocumentFragment: s,
        HTMLTemplateElement: N,
        Node: b,
        Element: R,
        NodeFilter: H,
        NamedNodeMap: z = n.NamedNodeMap || n.MozNamedAttrMap,
        HTMLFormElement: B,
        DOMParser: W,
        trustedTypes: G,
      } = n,
      j = R.prototype,
      X = C(j, "cloneNode"),
      $ = C(j, "nextSibling"),
      oe = C(j, "childNodes"),
      re = C(j, "parentNode");
    if ("function" == typeof N) {
      const e = r.createElement("template");
      e.content && e.content.ownerDocument && (r = e.content.ownerDocument);
    }
    let ie,
      ae = "";
    const {
        implementation: le,
        createNodeIterator: ce,
        createDocumentFragment: se,
        getElementsByTagName: ue,
      } = r,
      { importNode: me } = a;
    let pe = {};
    o.isSupported =
      "function" == typeof e &&
      "function" == typeof re &&
      le &&
      void 0 !== le.createHTMLDocument;
    const {
      MUSTACHE_EXPR: fe,
      ERB_EXPR: de,
      TMPLIT_EXPR: he,
      DATA_ATTR: ge,
      ARIA_ATTR: Te,
      IS_SCRIPT_OR_DATA: ye,
      ATTR_WHITESPACE: Ee,
      CUSTOM_ELEMENT: _e,
    } = K;
    let { IS_ALLOWED_URI: Ae } = K,
      Ne = null;
    const be = S({}, [...L, ...D, ...v, ...x, ...M]);
    let Se = null;
    const Re = S({}, [...I, ...U, ...P, ...F]);
    let we = Object.seal(
        l(null, {
          tagNameCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null,
          },
          attributeNameCheck: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: null,
          },
          allowCustomizedBuiltInElements: {
            writable: !0,
            configurable: !1,
            enumerable: !0,
            value: !1,
          },
        })
      ),
      Ce = null,
      Le = null,
      De = !0,
      ve = !0,
      Oe = !1,
      xe = !0,
      ke = !1,
      Me = !0,
      Ie = !1,
      Ue = !1,
      Pe = !1,
      Fe = !1,
      He = !1,
      ze = !1,
      Be = !0,
      We = !1;
    const Ge = "user-content-";
    let Ye = !0,
      je = !1,
      Xe = {},
      qe = null;
    const $e = S({}, [
      "annotation-xml",
      "audio",
      "colgroup",
      "desc",
      "foreignobject",
      "head",
      "iframe",
      "math",
      "mi",
      "mn",
      "mo",
      "ms",
      "mtext",
      "noembed",
      "noframes",
      "noscript",
      "plaintext",
      "script",
      "style",
      "svg",
      "template",
      "thead",
      "title",
      "video",
      "xmp",
    ]);
    let Ke = null;
    const Ve = S({}, ["audio", "video", "img", "source", "image", "track"]);
    let Ze = null;
    const Je = S({}, [
        "alt",
        "class",
        "for",
        "id",
        "label",
        "name",
        "pattern",
        "placeholder",
        "role",
        "summary",
        "title",
        "value",
        "style",
        "xmlns",
      ]),
      Qe = "http://www.w3.org/1998/Math/MathML",
      et = "http://www.w3.org/2000/svg",
      tt = "http://www.w3.org/1999/xhtml";
    let nt = tt,
      ot = !1,
      rt = null;
    const it = S({}, [Qe, et, tt], d);
    let at = null;
    const lt = ["application/xhtml+xml", "text/html"],
      ct = "text/html";
    let st = null,
      ut = null;
    const mt = r.createElement("form"),
      pt = function (e) {
        return e instanceof RegExp || e instanceof Function;
      },
      ft = function () {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (!ut || ut !== e) {
          if (
            ((e && "object" == typeof e) || (e = {}),
            (e = w(e)),
            (at =
              -1 === lt.indexOf(e.PARSER_MEDIA_TYPE)
                ? ct
                : e.PARSER_MEDIA_TYPE),
            (st = "application/xhtml+xml" === at ? d : f),
            (Ne = E(e, "ALLOWED_TAGS") ? S({}, e.ALLOWED_TAGS, st) : be),
            (Se = E(e, "ALLOWED_ATTR") ? S({}, e.ALLOWED_ATTR, st) : Re),
            (rt = E(e, "ALLOWED_NAMESPACES")
              ? S({}, e.ALLOWED_NAMESPACES, d)
              : it),
            (Ze = E(e, "ADD_URI_SAFE_ATTR")
              ? S(w(Je), e.ADD_URI_SAFE_ATTR, st)
              : Je),
            (Ke = E(e, "ADD_DATA_URI_TAGS")
              ? S(w(Ve), e.ADD_DATA_URI_TAGS, st)
              : Ve),
            (qe = E(e, "FORBID_CONTENTS") ? S({}, e.FORBID_CONTENTS, st) : $e),
            (Ce = E(e, "FORBID_TAGS") ? S({}, e.FORBID_TAGS, st) : {}),
            (Le = E(e, "FORBID_ATTR") ? S({}, e.FORBID_ATTR, st) : {}),
            (Xe = !!E(e, "USE_PROFILES") && e.USE_PROFILES),
            (De = !1 !== e.ALLOW_ARIA_ATTR),
            (ve = !1 !== e.ALLOW_DATA_ATTR),
            (Oe = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
            (xe = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR),
            (ke = e.SAFE_FOR_TEMPLATES || !1),
            (Me = !1 !== e.SAFE_FOR_XML),
            (Ie = e.WHOLE_DOCUMENT || !1),
            (Fe = e.RETURN_DOM || !1),
            (He = e.RETURN_DOM_FRAGMENT || !1),
            (ze = e.RETURN_TRUSTED_TYPE || !1),
            (Pe = e.FORCE_BODY || !1),
            (Be = !1 !== e.SANITIZE_DOM),
            (We = e.SANITIZE_NAMED_PROPS || !1),
            (Ye = !1 !== e.KEEP_CONTENT),
            (je = e.IN_PLACE || !1),
            (Ae = e.ALLOWED_URI_REGEXP || Y),
            (nt = e.NAMESPACE || tt),
            (we = e.CUSTOM_ELEMENT_HANDLING || {}),
            e.CUSTOM_ELEMENT_HANDLING &&
              pt(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck) &&
              (we.tagNameCheck = e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              pt(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) &&
              (we.attributeNameCheck =
                e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),
            e.CUSTOM_ELEMENT_HANDLING &&
              "boolean" ==
                typeof e.CUSTOM_ELEMENT_HANDLING
                  .allowCustomizedBuiltInElements &&
              (we.allowCustomizedBuiltInElements =
                e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),
            ke && (ve = !1),
            He && (Fe = !0),
            Xe &&
              ((Ne = S({}, M)),
              (Se = []),
              !0 === Xe.html && (S(Ne, L), S(Se, I)),
              !0 === Xe.svg && (S(Ne, D), S(Se, U), S(Se, F)),
              !0 === Xe.svgFilters && (S(Ne, v), S(Se, U), S(Se, F)),
              !0 === Xe.mathMl && (S(Ne, x), S(Se, P), S(Se, F))),
            e.ADD_TAGS && (Ne === be && (Ne = w(Ne)), S(Ne, e.ADD_TAGS, st)),
            e.ADD_ATTR && (Se === Re && (Se = w(Se)), S(Se, e.ADD_ATTR, st)),
            e.ADD_URI_SAFE_ATTR && S(Ze, e.ADD_URI_SAFE_ATTR, st),
            e.FORBID_CONTENTS &&
              (qe === $e && (qe = w(qe)), S(qe, e.FORBID_CONTENTS, st)),
            Ye && (Ne["#text"] = !0),
            Ie && S(Ne, ["html", "head", "body"]),
            Ne.table && (S(Ne, ["tbody"]), delete Ce.tbody),
            e.TRUSTED_TYPES_POLICY)
          ) {
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createHTML)
              throw A(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.'
              );
            if ("function" != typeof e.TRUSTED_TYPES_POLICY.createScriptURL)
              throw A(
                'TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.'
              );
            (ie = e.TRUSTED_TYPES_POLICY), (ae = ie.createHTML(""));
          } else
            void 0 === ie && (ie = ne(G, c)),
              null !== ie && "string" == typeof ae && (ae = ie.createHTML(""));
          i && i(e), (ut = e);
        }
      },
      dt = S({}, ["mi", "mo", "mn", "ms", "mtext"]),
      ht = S({}, ["foreignobject", "annotation-xml"]),
      gt = S({}, ["title", "style", "font", "a", "script"]),
      Tt = S({}, [...D, ...v, ...O]),
      yt = S({}, [...x, ...k]),
      Et = function (e) {
        let t = re(e);
        (t && t.tagName) || (t = { namespaceURI: nt, tagName: "template" });
        const n = f(e.tagName),
          o = f(t.tagName);
        return (
          !!rt[e.namespaceURI] &&
          (e.namespaceURI === et
            ? t.namespaceURI === tt
              ? "svg" === n
              : t.namespaceURI === Qe
              ? "svg" === n && ("annotation-xml" === o || dt[o])
              : Boolean(Tt[n])
            : e.namespaceURI === Qe
            ? t.namespaceURI === tt
              ? "math" === n
              : t.namespaceURI === et
              ? "math" === n && ht[o]
              : Boolean(yt[n])
            : e.namespaceURI === tt
            ? !(t.namespaceURI === et && !ht[o]) &&
              !(t.namespaceURI === Qe && !dt[o]) &&
              !yt[n] &&
              (gt[n] || !Tt[n])
            : !("application/xhtml+xml" !== at || !rt[e.namespaceURI]))
        );
      },
      _t = function (e) {
        p(o.removed, { element: e });
        try {
          e.parentNode.removeChild(e);
        } catch (t) {
          e.remove();
        }
      },
      At = function (e, t) {
        try {
          p(o.removed, { attribute: t.getAttributeNode(e), from: t });
        } catch (e) {
          p(o.removed, { attribute: null, from: t });
        }
        if ((t.removeAttribute(e), "is" === e && !Se[e]))
          if (Fe || He)
            try {
              _t(t);
            } catch (e) {}
          else
            try {
              t.setAttribute(e, "");
            } catch (e) {}
      },
      Nt = function (e) {
        let t = null,
          n = null;
        if (Pe) e = "<remove></remove>" + e;
        else {
          const t = h(e, /^[\r\n\t ]+/);
          n = t && t[0];
        }
        "application/xhtml+xml" === at &&
          nt === tt &&
          (e =
            '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' +
            e +
            "</body></html>");
        const o = ie ? ie.createHTML(e) : e;
        if (nt === tt)
          try {
            t = new W().parseFromString(o, at);
          } catch (e) {}
        if (!t || !t.documentElement) {
          t = le.createDocument(nt, "template", null);
          try {
            t.documentElement.innerHTML = ot ? ae : o;
          } catch (e) {}
        }
        const i = t.body || t.documentElement;
        return (
          e &&
            n &&
            i.insertBefore(r.createTextNode(n), i.childNodes[0] || null),
          nt === tt
            ? ue.call(t, Ie ? "html" : "body")[0]
            : Ie
            ? t.documentElement
            : i
        );
      },
      bt = function (e) {
        return ce.call(
          e.ownerDocument || e,
          e,
          H.SHOW_ELEMENT |
            H.SHOW_COMMENT |
            H.SHOW_TEXT |
            H.SHOW_PROCESSING_INSTRUCTION |
            H.SHOW_CDATA_SECTION,
          null
        );
      },
      St = function (e) {
        return (
          e instanceof B &&
          ("string" != typeof e.nodeName ||
            "string" != typeof e.textContent ||
            "function" != typeof e.removeChild ||
            !(e.attributes instanceof z) ||
            "function" != typeof e.removeAttribute ||
            "function" != typeof e.setAttribute ||
            "string" != typeof e.namespaceURI ||
            "function" != typeof e.insertBefore ||
            "function" != typeof e.hasChildNodes)
        );
      },
      Rt = function (e) {
        return "function" == typeof b && e instanceof b;
      },
      wt = function (e, t, n) {
        pe[e] &&
          u(pe[e], (e) => {
            e.call(o, t, n, ut);
          });
      },
      Ct = function (e) {
        let t = null;
        if ((wt("beforeSanitizeElements", e, null), St(e))) return _t(e), !0;
        const n = st(e.nodeName);
        if (
          (wt("uponSanitizeElement", e, { tagName: n, allowedTags: Ne }),
          e.hasChildNodes() &&
            !Rt(e.firstElementChild) &&
            _(/<[/\w]/g, e.innerHTML) &&
            _(/<[/\w]/g, e.textContent))
        )
          return _t(e), !0;
        if (e.nodeType === J) return _t(e), !0;
        if (Me && e.nodeType === Q && _(/<[/\w]/g, e.data)) return _t(e), !0;
        if (!Ne[n] || Ce[n]) {
          if (!Ce[n] && Dt(n)) {
            if (we.tagNameCheck instanceof RegExp && _(we.tagNameCheck, n))
              return !1;
            if (we.tagNameCheck instanceof Function && we.tagNameCheck(n))
              return !1;
          }
          if (Ye && !qe[n]) {
            const t = re(e) || e.parentNode,
              n = oe(e) || e.childNodes;
            if (n && t) {
              for (let o = n.length - 1; o >= 0; --o) {
                const r = X(n[o], !0);
                (r.__removalCount = (e.__removalCount || 0) + 1),
                  t.insertBefore(r, $(e));
              }
            }
          }
          return _t(e), !0;
        }
        return e instanceof R && !Et(e)
          ? (_t(e), !0)
          : ("noscript" !== n && "noembed" !== n && "noframes" !== n) ||
            !_(/<\/no(script|embed|frames)/i, e.innerHTML)
          ? (ke &&
              e.nodeType === Z &&
              ((t = e.textContent),
              u([fe, de, he], (e) => {
                t = g(t, e, " ");
              }),
              e.textContent !== t &&
                (p(o.removed, { element: e.cloneNode() }),
                (e.textContent = t))),
            wt("afterSanitizeElements", e, null),
            !1)
          : (_t(e), !0);
      },
      Lt = function (e, t, n) {
        if (Be && ("id" === t || "name" === t) && (n in r || n in mt))
          return !1;
        if (ve && !Le[t] && _(ge, t));
        else if (De && _(Te, t));
        else if (!Se[t] || Le[t]) {
          if (
            !(
              (Dt(e) &&
                ((we.tagNameCheck instanceof RegExp && _(we.tagNameCheck, e)) ||
                  (we.tagNameCheck instanceof Function &&
                    we.tagNameCheck(e))) &&
                ((we.attributeNameCheck instanceof RegExp &&
                  _(we.attributeNameCheck, t)) ||
                  (we.attributeNameCheck instanceof Function &&
                    we.attributeNameCheck(t)))) ||
              ("is" === t &&
                we.allowCustomizedBuiltInElements &&
                ((we.tagNameCheck instanceof RegExp && _(we.tagNameCheck, n)) ||
                  (we.tagNameCheck instanceof Function && we.tagNameCheck(n))))
            )
          )
            return !1;
        } else if (Ze[t]);
        else if (_(Ae, g(n, Ee, "")));
        else if (
          ("src" !== t && "xlink:href" !== t && "href" !== t) ||
          "script" === e ||
          0 !== T(n, "data:") ||
          !Ke[e]
        ) {
          if (Oe && !_(ye, g(n, Ee, "")));
          else if (n) return !1;
        } else;
        return !0;
      },
      Dt = function (e) {
        return "annotation-xml" !== e && h(e, _e);
      },
      vt = function (e) {
        wt("beforeSanitizeAttributes", e, null);
        const { attributes: t } = e;
        if (!t) return;
        const n = {
          attrName: "",
          attrValue: "",
          keepAttr: !0,
          allowedAttributes: Se,
        };
        let r = t.length;
        for (; r--; ) {
          const i = t[r],
            { name: a, namespaceURI: l, value: c } = i,
            s = st(a);
          let p = "value" === a ? c : y(c);
          if (
            ((n.attrName = s),
            (n.attrValue = p),
            (n.keepAttr = !0),
            (n.forceKeepAttr = void 0),
            wt("uponSanitizeAttribute", e, n),
            (p = n.attrValue),
            n.forceKeepAttr)
          )
            continue;
          if ((At(a, e), !n.keepAttr)) continue;
          if (!xe && _(/\/>/i, p)) {
            At(a, e);
            continue;
          }
          if (Me && _(/((--!?|])>)|<\/(style|title)/i, p)) {
            At(a, e);
            continue;
          }
          ke &&
            u([fe, de, he], (e) => {
              p = g(p, e, " ");
            });
          const f = st(e.nodeName);
          if (Lt(f, s, p)) {
            if (
              (!We || ("id" !== s && "name" !== s) || (At(a, e), (p = Ge + p)),
              ie &&
                "object" == typeof G &&
                "function" == typeof G.getAttributeType)
            )
              if (l);
              else
                switch (G.getAttributeType(f, s)) {
                  case "TrustedHTML":
                    p = ie.createHTML(p);
                    break;
                  case "TrustedScriptURL":
                    p = ie.createScriptURL(p);
                }
            try {
              l ? e.setAttributeNS(l, a, p) : e.setAttribute(a, p),
                St(e) ? _t(e) : m(o.removed);
            } catch (e) {}
          }
        }
        wt("afterSanitizeAttributes", e, null);
      },
      Ot = function e(t) {
        let n = null;
        const o = bt(t);
        for (wt("beforeSanitizeShadowDOM", t, null); (n = o.nextNode()); )
          wt("uponSanitizeShadowNode", n, null),
            Ct(n) || (n.content instanceof s && e(n.content), vt(n));
        wt("afterSanitizeShadowDOM", t, null);
      };
    return (
      (o.sanitize = function (e) {
        let t =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = null,
          r = null,
          i = null,
          l = null;
        if (
          ((ot = !e), ot && (e = "\x3c!--\x3e"), "string" != typeof e && !Rt(e))
        ) {
          if ("function" != typeof e.toString)
            throw A("toString is not a function");
          if ("string" != typeof (e = e.toString()))
            throw A("dirty is not a string, aborting");
        }
        if (!o.isSupported) return e;
        if (
          (Ue || ft(t), (o.removed = []), "string" == typeof e && (je = !1), je)
        ) {
          if (e.nodeName) {
            const t = st(e.nodeName);
            if (!Ne[t] || Ce[t])
              throw A(
                "root node is forbidden and cannot be sanitized in-place"
              );
          }
        } else if (e instanceof b)
          (n = Nt("\x3c!----\x3e")),
            (r = n.ownerDocument.importNode(e, !0)),
            (r.nodeType === V && "BODY" === r.nodeName) || "HTML" === r.nodeName
              ? (n = r)
              : n.appendChild(r);
        else {
          if (!Fe && !ke && !Ie && -1 === e.indexOf("<"))
            return ie && ze ? ie.createHTML(e) : e;
          if (((n = Nt(e)), !n)) return Fe ? null : ze ? ae : "";
        }
        n && Pe && _t(n.firstChild);
        const c = bt(je ? e : n);
        for (; (i = c.nextNode()); )
          Ct(i) || (i.content instanceof s && Ot(i.content), vt(i));
        if (je) return e;
        if (Fe) {
          if (He)
            for (l = se.call(n.ownerDocument); n.firstChild; )
              l.appendChild(n.firstChild);
          else l = n;
          return (
            (Se.shadowroot || Se.shadowrootmode) && (l = me.call(a, l, !0)), l
          );
        }
        let m = Ie ? n.outerHTML : n.innerHTML;
        return (
          Ie &&
            Ne["!doctype"] &&
            n.ownerDocument &&
            n.ownerDocument.doctype &&
            n.ownerDocument.doctype.name &&
            _(q, n.ownerDocument.doctype.name) &&
            (m = "<!DOCTYPE " + n.ownerDocument.doctype.name + ">\n" + m),
          ke &&
            u([fe, de, he], (e) => {
              m = g(m, e, " ");
            }),
          ie && ze ? ie.createHTML(m) : m
        );
      }),
      (o.setConfig = function () {
        let e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        ft(e), (Ue = !0);
      }),
      (o.clearConfig = function () {
        (ut = null), (Ue = !1);
      }),
      (o.isValidAttribute = function (e, t, n) {
        ut || ft({});
        const o = st(e),
          r = st(t);
        return Lt(o, r, n);
      }),
      (o.addHook = function (e, t) {
        "function" == typeof t && ((pe[e] = pe[e] || []), p(pe[e], t));
      }),
      (o.removeHook = function (e) {
        if (pe[e]) return m(pe[e]);
      }),
      (o.removeHooks = function (e) {
        pe[e] && (pe[e] = []);
      }),
      (o.removeAllHooks = function () {
        pe = {};
      }),
      o
    );
  })();
  return oe;
});
