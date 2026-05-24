(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$3(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$3(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$1() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$1;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$1;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N$2 = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N$2 = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N$2 && null !== N$2.next;
  Hh = 0;
  O = N$2 = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N$2) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N$2.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N$2 = a;
  else {
    if (null === a) throw Error(p(310));
    N$2 = a;
    a = { memoizedState: N$2.memoizedState, baseState: N$2.baseState, baseQueue: N$2.baseQueue, queue: N$2.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N$2, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N$2) {
    var g = N$2.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N$2.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N$2 ? b.memoizedState = a : ui(b, N$2.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X, e = Xj;
      X = null;
      Yj(a, b, c);
      X = d;
      Xj = e;
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X.removeChild(c.stateNode));
      break;
    case 18:
      null !== X && (Xj ? (a = X, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X, c.stateNode));
      break;
    case 4:
      d = X;
      e = Xj;
      X = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X) throw Error(p(160));
      Zj(f2, g, e);
      X = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N$2 = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const STORAGE_KEY = "polymath-os-v2";
const STORAGE_V1 = "polymath-os-state-v1";
const DOMAINS = ["AI/ML", "Writing", "Business", "Design", "Physics", "Health", "Learning", "Life"];
const TYPE_OPTS = ["All", "idea", "task", "question", "insight", "note"];
const PRIORITY_OPTS = ["All", "high", "medium", "low"];
const XP_PER_LEVEL = 150;
const DOMAIN_COLOR = {
  "AI/ML": "#00d9b1",
  "Writing": "#a78bfa",
  "Business": "#fbbf24",
  "Design": "#f472b6",
  "Physics": "#60a5fa",
  "Health": "#4ade80",
  "Learning": "#fb923c",
  "Life": "#e879f9"
};
const TYPE_ICON = { idea: "◈", task: "◻", question: "?", insight: "◆", note: "·" };
const TIER_XP = { common: 25, rare: 75, epic: 150 };
const ENERGY_LEVELS = [
  { level: 1, emoji: "☠", label: "Dead", color: "#6b7280", glow: "rgba(107,114,128,.2)" },
  { level: 2, emoji: "😪", label: "Low", color: "#ef4444", glow: "rgba(239,68,68,.2)" },
  { level: 3, emoji: "😐", label: "Okay", color: "#fbbf24", glow: "rgba(251,191,36,.2)" },
  { level: 4, emoji: "😊", label: "Good", color: "#4ade80", glow: "rgba(74,222,128,.2)" },
  { level: 5, emoji: "⚡", label: "Peak", color: "#00d9b1", glow: "rgba(0,217,177,.25)" }
];
const FOCUS_PRESETS = [15, 20, 25, 30, 45, 60];
const IDENTITY_MODES = [
  {
    id: "builder",
    label: "Builder Mode",
    icon: "⚒",
    color: "#00d9b1",
    glow: "rgba(0,217,177,0.35)",
    bg: "rgba(0,217,177,0.06)",
    border: "rgba(0,217,177,0.22)",
    desc: "Building something real",
    xpMult: 1.2
  },
  {
    id: "research",
    label: "Deep Research",
    icon: "◉",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.35)",
    bg: "rgba(96,165,250,0.06)",
    border: "rgba(96,165,250,0.22)",
    desc: "Down the rabbit hole",
    xpMult: 1.3
  },
  {
    id: "creative",
    label: "Creative Flow",
    icon: "◈",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.35)",
    bg: "rgba(192,132,252,0.06)",
    border: "rgba(192,132,252,0.22)",
    desc: "Let the ideas come",
    xpMult: 1.25
  },
  {
    id: "locked",
    label: "Locked In",
    icon: "◆",
    color: "#f87171",
    glow: "rgba(248,113,113,0.35)",
    bg: "rgba(248,113,113,0.06)",
    border: "rgba(248,113,113,0.22)",
    desc: "No distractions. Zero.",
    xpMult: 1.5
  },
  {
    id: "night",
    label: "Night Grind",
    icon: "★",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.35)",
    bg: "rgba(139,92,246,0.06)",
    border: "rgba(139,92,246,0.22)",
    desc: "While the world sleeps",
    xpMult: 1.4
  },
  {
    id: "sprint",
    label: "Exec Sprint",
    icon: "⚡",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.35)",
    bg: "rgba(251,191,36,0.06)",
    border: "rgba(251,191,36,0.22)",
    desc: "Ship it. Now.",
    xpMult: 1.35
  }
];
const DEFAULT_HABITS = [
  { id: "h-read", name: "Read 20 min", dates: [], xp: 20 },
  { id: "h-exercise", name: "Exercise", dates: [], xp: 25 },
  { id: "h-focus", name: "No distractions", dates: [], xp: 15 }
];
const QUEST_POOL = [
  { id: "q_cap3", title: "Brain Dump", desc: "Capture 3 thoughts", goal: 3, type: "capture", xpReward: 50 },
  { id: "q_cap5", title: "Flood Gates", desc: "Capture 5 thoughts", goal: 5, type: "capture", xpReward: 80 },
  { id: "q_cap10", title: "Torrent", desc: "Capture 10 thoughts", goal: 10, type: "capture", xpReward: 150 },
  { id: "q_sess1", title: "Deep Work", desc: "Complete a focus session", goal: 1, type: "session", xpReward: 60 },
  { id: "q_sess2", title: "Flow State", desc: "Complete 2 focus sessions", goal: 2, type: "session", xpReward: 110 },
  { id: "q_dom2", title: "Multi-Domain", desc: "Capture in 2 different domains", goal: 2, type: "domains", xpReward: 45 },
  { id: "q_dom3", title: "Polymath Mode", desc: "Capture in 3 different domains", goal: 3, type: "domains", xpReward: 90 },
  { id: "q_task2", title: "Task Crusher", desc: "Complete 2 tasks", goal: 2, type: "tasks", xpReward: 70 },
  { id: "q_intent", title: "North Star", desc: "Set today's intention", goal: 1, type: "intention", xpReward: 25 },
  { id: "q_insight", title: "Insight Hunter", desc: "Capture an insight", goal: 1, type: "insight", xpReward: 40 }
];
const ACHIEVEMENTS = [
  { id: "first_thought", icon: "◈", title: "First Thought", desc: "Capture your first thought", check: (s) => s.thoughts.length >= 1 },
  { id: "idea_machine", icon: "⚡", title: "Idea Machine", desc: "Capture 50 thoughts", check: (s) => s.thoughts.length >= 50 },
  { id: "polymathic", icon: "∞", title: "Polymathic", desc: "Capture in all 8 domains", check: (s) => new Set(s.thoughts.filter((t2) => DOMAINS.includes(t2.domain)).map((t2) => t2.domain)).size >= 8 },
  { id: "deep_worker", icon: "◉", title: "Deep Worker", desc: "Complete 5 focus sessions", check: (s) => s.sessions.length >= 5 },
  { id: "finisher", icon: "✓", title: "Finisher", desc: "Complete 10 tasks", check: (s) => s.thoughts.filter((t2) => t2.done).length >= 10 },
  { id: "on_fire", icon: "★", title: "On Fire", desc: "Maintain a 7-day streak", check: (s) => s.streak.count >= 7 },
  { id: "scholar", icon: "◆", title: "Scholar", desc: "Reach Level 5 in any domain", check: (s) => DOMAINS.some((d) => {
    var _a;
    return Math.floor((((_a = s.xp) == null ? void 0 : _a[d]) || 0) / XP_PER_LEVEL) + 1 >= 5;
  }) },
  { id: "renaissance", icon: "✦", title: "Renaissance", desc: "Level 3+ in 3 different domains", check: (s) => DOMAINS.filter((d) => {
    var _a;
    return Math.floor((((_a = s.xp) == null ? void 0 : _a[d]) || 0) / XP_PER_LEVEL) + 1 >= 3;
  }).length >= 3 },
  { id: "prolific", icon: "◈", title: "Prolific", desc: "Capture 100 thoughts", check: (s) => s.thoughts.length >= 100 },
  { id: "insight_surge", icon: "◆", title: "Insight Surge", desc: "Capture 10 insights", check: (s) => s.thoughts.filter((t2) => t2.type === "insight").length >= 10 },
  { id: "true_polymath", icon: "✦", title: "True Polymath", desc: "Level 5+ in 5 different domains", check: (s) => DOMAINS.filter((d) => {
    var _a;
    return Math.floor((((_a = s.xp) == null ? void 0 : _a[d]) || 0) / XP_PER_LEVEL) + 1 >= 5;
  }).length >= 5 },
  { id: "unstoppable", icon: "⚡", title: "Unstoppable", desc: "Maintain a 30-day streak", check: (s) => s.streak.count >= 30 }
];
const CHAR_STATS = [
  { key: "INT", label: "Intellect", domains: ["AI/ML", "Physics"], color: "#60a5fa" },
  { key: "WIS", label: "Wisdom", domains: ["Learning", "Life"], color: "#a78bfa" },
  { key: "CRE", label: "Creativity", domains: ["Writing", "Design"], color: "#f472b6" },
  { key: "STR", label: "Drive", domains: ["Business", "Health"], color: "#fbbf24" }
];
function xpToLevel(xp) {
  return Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
}
function xpInLevel(xp) {
  return (xp || 0) % XP_PER_LEVEL;
}
function polymathScore(xp) {
  const breadth = DOMAINS.filter((d) => ((xp == null ? void 0 : xp[d]) || 0) > 0).length;
  const raw = DOMAINS.reduce((s, d) => s + Math.sqrt((xp == null ? void 0 : xp[d]) || 0), 0);
  const mult = breadth >= 6 ? 1.6 : breadth >= 4 ? 1.3 : breadth >= 2 ? 1.1 : 1;
  return Math.round(raw * mult * 8);
}
function todayStr() {
  return (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
}
function seededPick(pool, n2, seed) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.abs(Math.floor(Math.sin(seed + i * 73) * 1e4)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n2);
}
function makeDailyQuests(dateStr) {
  const seed = dateStr.split("-").reduce((a, v2, i) => a + parseInt(v2) * (i + 1) * 37, 0);
  return seededPick(QUEST_POOL, 3, seed).map((q2) => ({ ...q2, progress: 0, completed: false }));
}
function refreshQuests(quests) {
  const today = todayStr();
  if (quests.date === today) return quests;
  return { date: today, list: makeDailyQuests(today) };
}
function updateStreak(streak) {
  const today = todayStr();
  if (streak.lastDate === today) return streak;
  const yday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  return streak.lastDate === yday ? { count: streak.count + 1, lastDate: today } : { count: 1, lastDate: today };
}
function advanceQuests(list, type, val = 1) {
  return list.map((q2) => {
    if (q2.completed || q2.type !== type) return q2;
    const np = type === "domains" ? val : Math.min(q2.goal, q2.progress + val);
    return { ...q2, progress: np, completed: np >= q2.goal };
  });
}
function questBonusXP(newList, oldList) {
  let b = 0;
  newList.forEach((q2, i) => {
    var _a;
    if (q2.completed && !((_a = oldList[i]) == null ? void 0 : _a.completed)) b += q2.xpReward;
  });
  return b;
}
function findNewAchs(state, prevIds) {
  return ACHIEVEMENTS.filter((a) => !prevIds.includes(a.id) && a.check(state));
}
function getHabitStreak(dates) {
  if (!(dates == null ? void 0 : dates.length)) return 0;
  const s = new Set(dates);
  const today = todayStr();
  const yest = new Date(Date.now() - 864e5).toISOString().split("T")[0];
  let cur = s.has(today) ? today : s.has(yest) ? yest : null;
  if (!cur) return 0;
  let count = 0;
  while (s.has(cur)) {
    count++;
    cur = new Date((/* @__PURE__ */ new Date(cur + "T12:00:00Z")).getTime() - 864e5).toISOString().split("T")[0];
  }
  return count;
}
function fmt(s) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}
function pickChaosTask(taskBoard, thoughts, energyLevel) {
  const boardTasks = (taskBoard || []).filter((t2) => !t2.done);
  const thoughtTasks = (thoughts || []).filter((t2) => t2.type === "task" && !t2.done);
  const all = [...boardTasks, ...thoughtTasks];
  if (all.length === 0) return null;
  const tierScore = { common: 1, rare: 2, epic: 3 };
  const priScore = { low: 1, medium: 2, high: 3 };
  if (energyLevel <= 2) {
    return all.sort(
      (a, b) => (tierScore[a.tier] || 1) - (tierScore[b.tier] || 1) || (priScore[a.priority] || 1) - (priScore[b.priority] || 1)
    )[0];
  } else if (energyLevel >= 4) {
    return all.sort(
      (a, b) => (tierScore[b.tier] || 1) - (tierScore[a.tier] || 1) || (priScore[b.priority] || 1) - (priScore[a.priority] || 1)
    )[0];
  } else {
    const medium = all.filter((t2) => t2.priority === "medium" || t2.tier === "rare");
    return medium.length > 0 ? medium[0] : all[0];
  }
}
function normType(v2) {
  const t2 = String(v2 || "note").toLowerCase();
  return t2 === "ask" ? "question" : TYPE_OPTS.slice(1).includes(t2) ? t2 : "note";
}
function localClassify(text) {
  const lc2 = text.toLowerCase();
  const domain = DOMAINS.find((d) => lc2.includes(d.toLowerCase().split("/")[0])) || (/(model|agent|prompt|llm|ai\b|ml\b|neural|gpt|claude|openai)/.test(lc2) ? "AI/ML" : /(write|essay|story|blog|draft|poem|novel)/.test(lc2) ? "Writing" : /(startup|revenue|customer|market|sales|business|saas)/.test(lc2) ? "Business" : /(layout|ui|ux|brand|visual|figma|design)/.test(lc2) ? "Design" : /(physics|quantum|energy|field|math|calculus)/.test(lc2) ? "Physics" : /(gym|sleep|diet|run|health|workout|exercise)/.test(lc2) ? "Health" : /(learn|course|book|study|tutorial|read)/.test(lc2) ? "Learning" : "Life");
  const type = /\?$|how |why |what if|should i/.test(lc2) ? "question" : /\b(todo|task|need to|must|ship|finish|call|email|build|do)\b/.test(lc2) ? "task" : /\b(realized|insight|pattern|connection|principle|noticed)\b/.test(lc2) ? "insight" : /\b(idea|could|maybe|concept|imagine|what if)\b/.test(lc2) ? "idea" : "note";
  const priority = /\b(urgent|today|asap|deadline|important|critical)\b/.test(lc2) ? "high" : /\b(soon|next|should|this week)\b/.test(lc2) ? "medium" : "low";
  const words = text.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  return {
    domain,
    type,
    priority,
    insight: words.slice(0, 8).join(" ") || "Captured thought",
    tags: [...new Set(words.filter((w2) => w2.length > 5).slice(0, 2).map((w2) => w2.toLowerCase()))]
  };
}
async function classifyWithClaude(text, apiKey) {
  var _a, _b, _c;
  if (!apiKey) return localClassify(text);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 220,
      messages: [{
        role: "user",
        content: `Classify this thought for POLYMATH OS. Return ONLY JSON with keys: domain, type, insight, priority, tags.
domain: one of ${DOMAINS.join(", ")}. type: idea|task|question|insight|note. insight: ≤8 words. priority: high|medium|low. tags: 1-2 strings.

Thought: ${text}`
      }]
    })
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const raw = ((_b = (_a = data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) || "{}";
  const p2 = JSON.parse(((_c = raw.match(/\{[\s\S]*\}/)) == null ? void 0 : _c[0]) || raw);
  const fb2 = localClassify(text);
  return {
    domain: DOMAINS.includes(p2.domain) ? p2.domain : fb2.domain,
    type: normType(p2.type),
    insight: String(p2.insight || fb2.insight).slice(0, 80),
    priority: PRIORITY_OPTS.slice(1).includes(String(p2.priority).toLowerCase()) ? String(p2.priority).toLowerCase() : "medium",
    tags: Array.isArray(p2.tags) ? p2.tags.slice(0, 2).map(String) : []
  };
}
const SEED = {
  thoughts: [],
  projects: [
    { id: crypto.randomUUID(), name: "Build POLYMATH OS", progress: 20 },
    { id: crypto.randomUUID(), name: "Define active research threads", progress: 10 }
  ],
  intention: "",
  intentionHistory: [],
  sessions: [],
  apiKey: "",
  pomodoro: { focusMinutes: 25, breakMinutes: 5 },
  domainList: DOMAINS,
  todos: [],
  xp: Object.fromEntries(DOMAINS.map((d) => [d, 0])),
  streak: { count: 0, lastDate: null },
  achievements: [],
  quests: { date: null, list: [] },
  taskBoard: [],
  habits: DEFAULT_HABITS,
  energyLog: [],
  questlines: [],
  bosses: [],
  identityModes: IDENTITY_MODES
};
function loadState() {
  var _a, _b, _c, _d;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        ...SEED,
        ...s,
        xp: { ...SEED.xp, ...s.xp },
        taskBoard: s.taskBoard || [],
        habits: s.habits || DEFAULT_HABITS,
        energyLog: s.energyLog || [],
        questlines: s.questlines || [],
        bosses: s.bosses || [],
        identityModes: ((_a = s.identityModes) == null ? void 0 : _a.length) ? s.identityModes : IDENTITY_MODES,
        domainList: ((_b = s.domainList) == null ? void 0 : _b.length) ? s.domainList : DOMAINS,
        todos: s.todos || []
      };
    }
    const old = JSON.parse(localStorage.getItem(STORAGE_V1) || "null");
    if (!old) return SEED;
    const base = { ...SEED, ...old };
    const xp = Object.fromEntries(DOMAINS.map((d) => [d, 0]));
    (_c = old.thoughts) == null ? void 0 : _c.forEach((t2) => {
      if (DOMAINS.includes(t2.domain)) xp[t2.domain] += t2.done ? 35 : 10;
    });
    (_d = old.sessions) == null ? void 0 : _d.forEach((s) => {
      if (DOMAINS.includes(s.domain)) xp[s.domain] += 15;
    });
    base.xp = xp;
    return base;
  } catch {
    return SEED;
  }
}
function useGameState() {
  const [state, setState] = reactExports.useState(loadState);
  const [toasts, setToasts] = reactExports.useState([]);
  const [floats, setFloats] = reactExports.useState([]);
  const pendingAchs = reactExports.useRef([]);
  reactExports.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);
  reactExports.useEffect(() => {
    setState((p2) => {
      const fq = refreshQuests(p2.quests);
      return fq === p2.quests ? p2 : { ...p2, quests: fq };
    });
  }, []);
  reactExports.useEffect(() => {
    if (pendingAchs.current.length === 0) return;
    const next = pendingAchs.current.map((a) => ({ ...a, tid: crypto.randomUUID() }));
    pendingAchs.current = [];
    setToasts((p2) => [...p2, ...next].slice(-3));
  }, [state.achievements]);
  reactExports.useEffect(() => {
    if (toasts.length === 0) return;
    const id2 = setTimeout(() => setToasts((p2) => p2.slice(1)), 4500);
    return () => clearTimeout(id2);
  }, [toasts]);
  reactExports.useEffect(() => {
    if (floats.length === 0) return;
    const id2 = setTimeout(() => setFloats((p2) => p2.slice(1)), 1600);
    return () => clearTimeout(id2);
  }, [floats]);
  function spawnFloat(amt, e) {
    if (!(e == null ? void 0 : e.currentTarget)) return;
    const r2 = e.currentTarget.getBoundingClientRect();
    setFloats((p2) => [...p2, { id: crypto.randomUUID(), amt, x: r2.left + r2.width / 2 - 20, y: r2.top - 10 }].slice(-8));
  }
  function spawnBurst(amt, e, count = 1) {
    if (!(e == null ? void 0 : e.currentTarget)) return;
    const r2 = e.currentTarget.getBoundingClientRect();
    const cx = r2.left + r2.width / 2, cy = r2.top;
    const items = Array.from({ length: count }, (_, i) => ({
      id: crypto.randomUUID(),
      amt: i === 0 ? amt : Math.ceil(amt * 0.4),
      x: cx + (Math.random() - 0.5) * 80 - 20,
      y: cy + (Math.random() - 0.5) * 30 - 10
    }));
    setFloats((p2) => [...p2, ...items].slice(-10));
  }
  function applyGame(p2, domain, questType, xpAmt) {
    const prevAchs = p2.achievements;
    const fq = refreshQuests(p2.quests);
    const newStreak = updateStreak(p2.streak);
    const ql2 = advanceQuests(fq.list, questType);
    const bonus = questBonusXP(ql2, fq.list);
    const newXp = {
      ...p2.xp,
      [domain]: (p2.xp[domain] || 0) + xpAmt,
      ...bonus > 0 ? { Life: (p2.xp["Life"] || 0) + bonus } : {}
    };
    const ns = { ...p2, xp: newXp, streak: newStreak, quests: { ...fq, list: ql2 } };
    const newA = findNewAchs(ns, prevAchs);
    if (newA.length > 0) pendingAchs.current.push(...newA);
    return { ...ns, achievements: [...prevAchs, ...newA.map((a) => a.id)] };
  }
  const domains = reactExports.useMemo(() => {
    const list = state.domainList || DOMAINS;
    const c = {};
    state.thoughts.forEach((t2) => {
      c[t2.domain] = (c[t2.domain] || 0) + 1;
    });
    return list.map((name) => ({ name, count: c[name] || 0 }));
  }, [state.thoughts, state.domainList]);
  async function submitThought(text, apiKey) {
    if (!text.trim()) return;
    const id2 = crypto.randomUUID(), now = (/* @__PURE__ */ new Date()).toISOString();
    const pending = { id: id2, text, domain: "Sorting", type: "note", insight: "Classifying…", priority: "medium", tags: [], status: "pending", done: false, createdAt: now };
    setState((p2) => {
      const fq = refreshQuests(p2.quests);
      const ns = updateStreak(p2.streak);
      const ql2 = advanceQuests(fq.list, "capture");
      return { ...p2, thoughts: [pending, ...p2.thoughts], streak: ns, quests: { ...fq, list: ql2 } };
    });
    try {
      const result = await classifyWithClaude(text, apiKey);
      setState((p2) => {
        const today = todayStr();
        const newT = p2.thoughts.map((t2) => t2.id === id2 ? { ...t2, ...result, status: "ready" } : t2);
        const uDoms = new Set(newT.filter((t2) => {
          var _a;
          return ((_a = t2.createdAt) == null ? void 0 : _a.startsWith(today)) && DOMAINS.includes(t2.domain);
        }).map((t2) => t2.domain)).size;
        const prevAchs = p2.achievements;
        let ql2 = advanceQuests(p2.quests.list, "domains", uDoms);
        if (result.type === "insight") ql2 = advanceQuests(ql2, "insight");
        const bonus = questBonusXP(ql2, p2.quests.list);
        const d = result.domain;
        const newXp = { ...p2.xp, [d]: (p2.xp[d] || 0) + 10, ...bonus > 0 ? { Life: (p2.xp["Life"] || 0) + bonus } : {} };
        const ns = { ...p2, thoughts: newT, xp: newXp, quests: { ...p2.quests, list: ql2 } };
        const newA = findNewAchs(ns, prevAchs);
        if (newA.length > 0) pendingAchs.current.push(...newA);
        return { ...ns, achievements: [...prevAchs, ...newA.map((a) => a.id)] };
      });
    } catch {
      const fb2 = localClassify(text);
      setState((p2) => ({
        ...p2,
        thoughts: p2.thoughts.map((t2) => t2.id === id2 ? { ...t2, ...fb2, status: "local", tags: [...fb2.tags, "offline"].slice(0, 2) } : t2),
        xp: { ...p2.xp, [fb2.domain]: (p2.xp[fb2.domain] || 0) + 10 }
      }));
    }
  }
  function updateThought(id2, patch, e) {
    setState((p2) => {
      const t2 = p2.thoughts.find((x2) => x2.id === id2);
      const newT = p2.thoughts.map((x2) => x2.id === id2 ? { ...x2, ...patch } : x2);
      if (patch.done !== true || !t2 || t2.done || t2.type !== "task") return { ...p2, thoughts: newT };
      const dom = DOMAINS.includes(t2.domain) ? t2.domain : "Life";
      return applyGame({ ...p2, thoughts: newT }, dom, "tasks", 25);
    });
    if (patch.done === true && e) spawnFloat(25, e);
  }
  const deleteThought = (id2) => setState((p2) => ({ ...p2, thoughts: p2.thoughts.filter((t2) => t2.id !== id2) }));
  function finishSession(mode, actDomain, focusMinutes, identityMode) {
    if (mode === "focus") {
      const since = new Date(Date.now() - focusMinutes * 6e4).toISOString();
      const cap = state.thoughts.filter((t2) => t2.createdAt >= since).length;
      const mult = (identityMode == null ? void 0 : identityMode.xpMult) || 1;
      const xpEarned = Math.round(15 * mult);
      setState((p2) => {
        const newSess = [{
          id: crypto.randomUUID(),
          mode: "focus",
          domain: actDomain,
          minutes: focusMinutes,
          captured: cap,
          at: (/* @__PURE__ */ new Date()).toISOString(),
          identityMode: identityMode == null ? void 0 : identityMode.id,
          xpEarned
        }, ...p2.sessions].slice(0, 50);
        return applyGame({ ...p2, sessions: newSess }, actDomain, "session", xpEarned);
      });
    }
  }
  function saveIntention(v2) {
    setState((p2) => {
      const base = {
        ...p2,
        intention: v2,
        intentionHistory: v2.trim() ? [{ id: crypto.randomUUID(), text: v2.trim(), at: (/* @__PURE__ */ new Date()).toISOString() }, ...p2.intentionHistory].slice(0, 30) : p2.intentionHistory
      };
      if (!v2.trim()) return base;
      return applyGame(base, "Life", "intention", 5);
    });
  }
  function addTask(title, tier, domain) {
    setState((p2) => ({
      ...p2,
      taskBoard: [{ id: crypto.randomUUID(), title, tier, domain, done: false, createdAt: (/* @__PURE__ */ new Date()).toISOString() }, ...p2.taskBoard || []]
    }));
  }
  function completeTask(id2, e) {
    const task = (state.taskBoard || []).find((t2) => t2.id === id2);
    if (!task || task.done) return;
    setState((p2) => {
      const t2 = p2.taskBoard.find((x2) => x2.id === id2);
      if (!t2 || t2.done) return p2;
      const xp = TIER_XP[t2.tier] || 25;
      const newBoard = p2.taskBoard.map((x2) => x2.id === id2 ? { ...x2, done: true, completedAt: (/* @__PURE__ */ new Date()).toISOString() } : x2);
      return applyGame({ ...p2, taskBoard: newBoard }, t2.domain || "Life", "tasks", xp);
    });
    if (e) {
      const xp = TIER_XP[task.tier] || 25;
      const count = task.tier === "epic" ? 4 : task.tier === "rare" ? 2 : 1;
      spawnBurst(xp, e, count);
    }
  }
  const deleteTask = (id2) => setState((p2) => ({ ...p2, taskBoard: (p2.taskBoard || []).filter((t2) => t2.id !== id2) }));
  function toggleHabit(id2, e) {
    const today = todayStr();
    setState((p2) => {
      const h2 = p2.habits.find((x2) => x2.id === id2);
      if (!h2) return p2;
      const doneToday = h2.dates.includes(today);
      const newDates = doneToday ? h2.dates.filter((d) => d !== today) : [...h2.dates, today];
      const newHabits = p2.habits.map((x2) => x2.id === id2 ? { ...x2, dates: newDates } : x2);
      if (doneToday) return { ...p2, habits: newHabits };
      return applyGame({ ...p2, habits: newHabits }, "Life", "habit", h2.xp || 15);
    });
    const h = state.habits.find((x2) => x2.id === id2);
    if (h && !h.dates.includes(today) && e) spawnFloat(h.xp || 15, e);
  }
  const addHabit = (name) => setState((p2) => ({ ...p2, habits: [...p2.habits || [], { id: crypto.randomUUID(), name, dates: [], xp: 15 }] }));
  function setEnergy(level) {
    const today = todayStr();
    setState((p2) => ({ ...p2, energyLog: [{ date: today, level }, ...(p2.energyLog || []).filter((e) => e.date !== today)].slice(0, 90) }));
  }
  function setPomodoro(focusMinutes) {
    setState((p2) => ({ ...p2, pomodoro: { ...p2.pomodoro, focusMinutes } }));
  }
  const setApiKey = (key) => setState((p2) => ({ ...p2, apiKey: key }));
  function addProject(name) {
    setState((p2) => ({ ...p2, projects: [...p2.projects, { id: crypto.randomUUID(), name, progress: 0 }] }));
  }
  function updateProjectProgress(id2, progress) {
    setState((p2) => ({ ...p2, projects: p2.projects.map((x2) => x2.id === id2 ? { ...x2, progress } : x2) }));
  }
  function setIntentionText(v2) {
    setState((p2) => ({ ...p2, intention: v2 }));
  }
  function addQuestline({ goal, domain, quests }) {
    setState((p2) => ({
      ...p2,
      questlines: [
        {
          id: crypto.randomUUID(),
          goal,
          domain,
          quests,
          completed: false,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        },
        ...p2.questlines || []
      ]
    }));
  }
  function completeQuestlineQuest(questlineId, questId, e) {
    var _a, _b;
    setState((p2) => {
      const ql3 = (p2.questlines || []).find((x2) => x2.id === questlineId);
      if (!ql3) return p2;
      const quest2 = ql3.quests.find((q2) => q2.id === questId);
      if (!quest2 || quest2.done) return p2;
      const newQuests = ql3.quests.map((q2) => q2.id === questId ? { ...q2, done: true } : q2);
      const allDone = newQuests.every((q2) => q2.done);
      const newQuestlines = p2.questlines.map(
        (x2) => x2.id === questlineId ? { ...x2, quests: newQuests, completed: allDone, completedAt: allDone ? (/* @__PURE__ */ new Date()).toISOString() : x2.completedAt } : x2
      );
      return applyGame({ ...p2, questlines: newQuestlines }, ql3.domain || "Life", "tasks", quest2.xpReward);
    });
    const ql2 = (_a = state.questlines) == null ? void 0 : _a.find((x2) => x2.id === questlineId);
    const quest = (_b = ql2 == null ? void 0 : ql2.quests) == null ? void 0 : _b.find((q2) => q2.id === questId);
    if (quest && !quest.done && e) spawnFloat(quest.xpReward, e);
  }
  function deleteQuestline(id2) {
    setState((p2) => ({ ...p2, questlines: (p2.questlines || []).filter((x2) => x2.id !== id2) }));
  }
  function addBoss({ name, domain, phases }) {
    setState((p2) => ({
      ...p2,
      bosses: [
        { id: crypto.randomUUID(), name, domain, phases, defeated: false, createdAt: (/* @__PURE__ */ new Date()).toISOString() },
        ...p2.bosses || []
      ]
    }));
  }
  function completeBossPhase(bossId, phaseId, e) {
    var _a, _b;
    setState((p2) => {
      const boss2 = (p2.bosses || []).find((b) => b.id === bossId);
      if (!boss2) return p2;
      const phase2 = boss2.phases.find((ph2) => ph2.id === phaseId);
      if (!phase2 || phase2.done) return p2;
      const newPhases = boss2.phases.map((ph2) => ph2.id === phaseId ? { ...ph2, done: true } : ph2);
      const allDone = newPhases.every((ph2) => ph2.done);
      const newBosses = p2.bosses.map(
        (b) => b.id === bossId ? { ...b, phases: newPhases, defeated: allDone, defeatedAt: allDone ? (/* @__PURE__ */ new Date()).toISOString() : b.defeatedAt } : b
      );
      const bonusXp = allDone ? 200 : 0;
      return applyGame({ ...p2, bosses: newBosses }, boss2.domain || "Life", "tasks", phase2.xpReward + bonusXp);
    });
    const boss = (_a = state.bosses) == null ? void 0 : _a.find((b) => b.id === bossId);
    const phase = (_b = boss == null ? void 0 : boss.phases) == null ? void 0 : _b.find((ph2) => ph2.id === phaseId);
    if (phase && !phase.done && e) spawnBurst(phase.xpReward, e, 3);
  }
  const deleteBoss = (id2) => setState((p2) => ({ ...p2, bosses: (p2.bosses || []).filter((b) => b.id !== id2) }));
  const TODO_XP = { 1: 30, 2: 20, 3: 15, 4: 10 };
  function addTodo({ text, priority = 2, estimate = null }) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    setState((p2) => ({
      ...p2,
      todos: [
        { id: crypto.randomUUID(), text, priority, estimate, done: false, doneAt: null, createdAt: (/* @__PURE__ */ new Date()).toISOString(), date: today, subtasks: [] },
        ...p2.todos || []
      ]
    }));
  }
  function toggleTodo(id2) {
    setState((p2) => {
      const todo = (p2.todos || []).find((t2) => t2.id === id2);
      if (!todo) return p2;
      const nowDone = !todo.done;
      const newTodos = p2.todos.map((t2) => t2.id === id2 ? { ...t2, done: nowDone, doneAt: nowDone ? (/* @__PURE__ */ new Date()).toISOString() : null } : t2);
      if (!nowDone) return { ...p2, todos: newTodos };
      return applyGame({ ...p2, todos: newTodos }, "Life", "tasks", TODO_XP[todo.priority] || 15);
    });
  }
  const deleteTodo = (id2) => setState((p2) => ({ ...p2, todos: (p2.todos || []).filter((t2) => t2.id !== id2) }));
  function addSubtask(todoId, text) {
    setState((p2) => ({
      ...p2,
      todos: (p2.todos || []).map((t2) => t2.id === todoId ? { ...t2, subtasks: [...t2.subtasks || [], { id: crypto.randomUUID(), text, done: false }] } : t2)
    }));
  }
  function toggleSubtask(todoId, subId) {
    setState((p2) => ({
      ...p2,
      todos: (p2.todos || []).map((t2) => t2.id !== todoId ? t2 : {
        ...t2,
        subtasks: (t2.subtasks || []).map((s) => s.id === subId ? { ...s, done: !s.done } : s)
      })
    }));
  }
  function deleteSubtask(todoId, subId) {
    setState((p2) => ({
      ...p2,
      todos: (p2.todos || []).map((t2) => t2.id !== todoId ? t2 : {
        ...t2,
        subtasks: (t2.subtasks || []).filter((s) => s.id !== subId)
      })
    }));
  }
  function addDomain(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((p2) => {
      const list = p2.domainList || DOMAINS;
      if (list.includes(trimmed)) return p2;
      return { ...p2, domainList: [...list, trimmed], xp: { ...p2.xp, [trimmed]: 0 } };
    });
  }
  function deleteDomain(name) {
    setState((p2) => {
      const list = p2.domainList || DOMAINS;
      if (list.length <= 1) return p2;
      return { ...p2, domainList: list.filter((d) => d !== name) };
    });
  }
  function addIdentityMode(mode) {
    setState((p2) => ({ ...p2, identityModes: [...p2.identityModes || IDENTITY_MODES, mode] }));
  }
  function deleteIdentityMode(id2) {
    setState((p2) => {
      const next = (p2.identityModes || IDENTITY_MODES).filter((m2) => m2.id !== id2);
      return { ...p2, identityModes: next.length ? next : p2.identityModes };
    });
  }
  function saveForge({ text, insight, domain, tags, type, priority }) {
    setState((p2) => {
      const thought = {
        id: crypto.randomUUID(),
        text,
        insight,
        domain,
        tags,
        type,
        priority,
        status: "ready",
        done: false,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        forged: true
      };
      return applyGame(
        { ...p2, thoughts: [thought, ...p2.thoughts] },
        domain || "Life",
        "insight",
        40
      );
    });
    spawnBurst(40, null, 3);
  }
  return {
    state,
    domains,
    toasts,
    setToasts,
    floats,
    submitThought,
    updateThought,
    deleteThought,
    finishSession,
    saveIntention,
    setIntentionText,
    addTask,
    completeTask,
    deleteTask,
    toggleHabit,
    addHabit,
    setEnergy,
    setPomodoro,
    setApiKey,
    addProject,
    updateProjectProgress,
    spawnFloat,
    addQuestline,
    completeQuestlineQuest,
    deleteQuestline,
    addBoss,
    completeBossPhase,
    deleteBoss,
    saveForge,
    addIdentityMode,
    deleteIdentityMode,
    addDomain,
    deleteDomain,
    addTodo,
    toggleTodo,
    deleteTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask
  };
}
function useTimer(defaultMinutes, onFinish) {
  const [mode, setMode] = reactExports.useState("focus");
  const [running, setRunning] = reactExports.useState(false);
  const [remaining, setRemaining] = reactExports.useState(defaultMinutes * 60);
  const [focusMinutes, setFocusMinutes] = reactExports.useState(defaultMinutes);
  const [identityMode, setIdentityMode] = reactExports.useState(IDENTITY_MODES[0]);
  const [pausedThisSession, setPausedThisSession] = reactExports.useState(false);
  const [lootPending, setLootPending] = reactExports.useState(false);
  const modeRef = reactExports.useRef(mode);
  modeRef.current = mode;
  const totalSec = (mode === "focus" ? focusMinutes : 5) * 60;
  reactExports.useEffect(() => {
    if (!running) return;
    const id2 = setInterval(() => {
      setRemaining((prev) => {
        if (prev > 1) return prev - 1;
        const currentMode = modeRef.current;
        onFinish(currentMode, focusMinutes, identityMode);
        if (currentMode === "focus") {
          setLootPending((p2) => p2 || true);
        }
        const next = currentMode === "focus" ? "break" : "focus";
        setMode(next);
        setRunning(false);
        setPausedThisSession(false);
        return (next === "focus" ? focusMinutes : 5) * 60;
      });
    }, 1e3);
    return () => clearInterval(id2);
  }, [running, focusMinutes, identityMode, onFinish]);
  function adjustFocus(delta) {
    const next = Math.max(5, Math.min(90, focusMinutes + delta));
    setFocusMinutes(next);
    if (!running) setRemaining(next * 60);
  }
  function selectPreset(mins) {
    setFocusMinutes(mins);
    if (!running) setRemaining(mins * 60);
  }
  function toggleRunning() {
    setRunning((r2) => {
      if (r2) setPausedThisSession(true);
      return !r2;
    });
  }
  function reset() {
    setRunning(false);
    setRemaining(focusMinutes * 60);
    setMode("focus");
    setPausedThisSession(false);
  }
  function forceFinish() {
    const currentMode = modeRef.current;
    onFinish(currentMode, focusMinutes, identityMode);
    const next = currentMode === "focus" ? "break" : "focus";
    setMode(next);
    setRunning(false);
    setPausedThisSession(false);
    setRemaining((next === "focus" ? focusMinutes : 5) * 60);
  }
  function clearLoot() {
    setLootPending(false);
  }
  function startChaosSession(minutes) {
    const mins = minutes || focusMinutes;
    setFocusMinutes(mins);
    setRemaining(mins * 60);
    setMode("focus");
    setRunning(true);
    setPausedThisSession(false);
  }
  return {
    mode,
    running,
    remaining,
    totalSec,
    focusMinutes,
    identityMode,
    pausedThisSession,
    lootPending,
    clearLoot,
    setIdentityMode,
    toggleRunning,
    reset,
    forceFinish,
    adjustFocus,
    selectPreset,
    startChaosSession
  };
}
function dayScore(thoughts, taskBoard, sessions, day) {
  const captures = thoughts.filter((t2) => {
    var _a;
    return (_a = t2.createdAt) == null ? void 0 : _a.startsWith(day);
  }).length;
  const completed = (taskBoard || []).filter((t2) => {
    var _a;
    return (_a = t2.completedAt) == null ? void 0 : _a.startsWith(day);
  }).length;
  const focused = (sessions || []).filter((s) => {
    var _a;
    return (_a = s.at) == null ? void 0 : _a.startsWith(day);
  }).length;
  return Math.min(1, captures * 0.08 + completed * 0.22 + focused * 0.32);
}
function calcMomentumScore(thoughts, taskBoard, sessions) {
  let score = 0, total = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.now() - i * 864e5).toISOString().split("T")[0];
    const w2 = 1 - i * 0.09;
    total += w2;
    score += dayScore(thoughts, taskBoard, sessions, day) * w2;
  }
  return Math.round(score / total * 100);
}
function getMomentumTrend(thoughts, taskBoard, sessions) {
  let recent = 0, prior = 0;
  for (let i = 0; i < 3; i++) {
    recent += dayScore(
      thoughts,
      taskBoard,
      sessions,
      new Date(Date.now() - i * 864e5).toISOString().split("T")[0]
    );
  }
  for (let i = 3; i < 6; i++) {
    prior += dayScore(
      thoughts,
      taskBoard,
      sessions,
      new Date(Date.now() - i * 864e5).toISOString().split("T")[0]
    );
  }
  if (recent > prior + 0.25) return "rising";
  if (recent < prior - 0.25) return "falling";
  return "stable";
}
function getMomentumMeta(score, trend, comeback) {
  const colors = {
    high: { color: "#4ade80", glow: "rgba(74,222,128,0.25)", c1: "#4ade80", c2: "#22d3ee" },
    mid: { color: "#fbbf24", glow: "rgba(251,191,36,0.25)", c1: "#fbbf24", c2: "#fb923c" },
    low: { color: "#f87171", glow: "rgba(248,113,113,0.2)", c1: "#f87171", c2: "#f43f5e" }
  };
  const band = score >= 60 ? "high" : score >= 30 ? "mid" : "low";
  const trendIcon = { rising: "↑", stable: "→", falling: "↓" }[trend];
  const trendColor = { rising: "#4ade80", stable: "var(--muted)", falling: "#f87171" }[trend];
  const sub = trend === "rising" ? "↑ Gaining momentum" : trend === "falling" ? "↓ Keep going — don't stop" : `${score}% over 7 days`;
  return { ...colors[band], trendIcon, trendColor, sub };
}
const TAGLINES = [
  "A personal OS for the polymathic mind.",
  "Capture raw thought. Structure emerges.",
  "Level up your actual life.",
  "Your mind, gamified.",
  "Built for the beautifully scattered."
];
const FEATS = [
  { icon: "◈", title: "Instant Capture", desc: "Dump raw thought. AI classifies domain, type, and priority — in seconds.", color: "#00d9b1" },
  { icon: "⚡", title: "Domain XP System", desc: "Level up across 8 knowledge domains. Your intellectual growth — visible and real.", color: "#fbbf24" },
  { icon: "◆", title: "Focus Identity Modes", desc: "Builder, Researcher, Night Grind. Each session has a vibe and an XP multiplier.", color: "#a78bfa" }
];
function LandingPage({ onEnter }) {
  const canvasRef = reactExports.useRef(null);
  const [phase, setPhase] = reactExports.useState(0);
  const [tagline, setTagline] = reactExports.useState("");
  const [exiting, setExiting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const colors = Object.values(DOMAIN_COLOR);
    const N2 = 70;
    const pts = Array.from({ length: N2 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      c: colors[i % colors.length]
    }));
    const mouse = { x: null, y: null };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < N2; i++) for (let j = i + 1; j < N2; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = pts[i].c;
          ctx.globalAlpha = (1 - d / 160) * 0.13;
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      pts.forEach((p2) => {
        if (mouse.x !== null) {
          const dx = p2.x - mouse.x, dy = p2.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 120 && d > 0) {
            const f2 = (120 - d) / 120 * 0.6;
            p2.vx += dx / d * f2;
            p2.vy += dy / d * f2;
          }
        }
        const spd = Math.hypot(p2.vx, p2.vy);
        if (spd > 1.8) {
          p2.vx *= 1.8 / spd;
          p2.vy *= 1.8 / spd;
        }
        p2.x += p2.vx;
        p2.y += p2.vy;
        if (p2.x < 0 || p2.x > canvas.width) p2.vx *= -1;
        if (p2.y < 0 || p2.y > canvas.height) p2.vy *= -1;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, p2.r, 0, Math.PI * 2);
        ctx.fillStyle = p2.c;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p2.c;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 950);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
  reactExports.useEffect(() => {
    let idx = 0, text = "", typing = true, tid;
    function tick() {
      const target = TAGLINES[idx];
      if (typing) {
        if (text.length < target.length) {
          text += target[text.length];
          setTagline(text);
          tid = setTimeout(tick, 44);
        } else {
          tid = setTimeout(() => {
            typing = false;
            tick();
          }, 2500);
        }
      } else {
        if (text.length > 0) {
          text = text.slice(0, -1);
          setTagline(text);
          tid = setTimeout(tick, 18);
        } else {
          idx = (idx + 1) % TAGLINES.length;
          typing = true;
          tid = setTimeout(tick, 280);
        }
      }
    }
    tid = setTimeout(tick, 900);
    return () => clearTimeout(tid);
  }, []);
  function enter() {
    setExiting(true);
    setTimeout(onEnter, 700);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `landing${exiting ? " exiting" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-bg" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "neural-canvas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "landing-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fu${phase >= 1 ? " show" : ""}`, style: { transitionDelay: "0ms" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-logo", children: "Polymath OS" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-logo-sub", children: "capture first · level up · embrace the chaos" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `landing-tagline fu${phase >= 1 ? " show" : ""}`, style: { transitionDelay: "140ms" }, children: [
        tagline,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cursor", children: "|" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-features", children: FEATS.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `feat-card${phase >= 2 ? " show" : ""}`, style: { transitionDelay: `${i * 110}ms` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feat-icon", style: { color: f2.color }, children: f2.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feat-title", children: f2.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feat-desc", children: f2.desc })
      ] }, f2.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `landing-cta fu${phase >= 3 ? " show" : ""}`, style: { transitionDelay: "0ms" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "enter-btn", onClick: enter, children: [
          "Enter the OS",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "enter-arrow", children: "→" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "landing-note", children: "No account needed · All data stays in your browser" })
      ] })
    ] })
  ] });
}
function TopBar({ state, onChaos }) {
  const totalXp = DOMAINS.reduce((s, d) => {
    var _a;
    return s + (((_a = state.xp) == null ? void 0 : _a[d]) || 0);
  }, 0);
  const maxLevel = Math.max(...DOMAINS.map((d) => {
    var _a;
    return xpToLevel(((_a = state.xp) == null ? void 0 : _a[d]) || 0);
  }));
  const score = polymathScore(state.xp);
  const momentum = calcMomentumScore(state.thoughts, state.taskBoard, state.sessions);
  const trend = getMomentumTrend(state.thoughts, state.taskBoard, state.sessions);
  const momMeta = getMomentumMeta(momentum, trend);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "topbar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brand", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-logo", children: "Polymath OS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-sub", children: "capture first · level up · embrace the chaos" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-pill", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-label", children: "XP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-value", children: totalXp.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-pill", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-label", children: "LEVEL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-value", children: maxLevel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-pill", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-label", children: "SCORE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-value", children: score.toLocaleString() })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-pill momentum-pill", style: { "--mom-color": momMeta.color }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-pill-label", children: "MOMENTUM" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-pill-value momentum-val", children: [
          momentum,
          "%",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "momentum-trend", style: { color: momMeta.trendColor }, children: momMeta.trendIcon })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "chaos-trigger", onClick: onChaos, children: "⚡ Overwhelmed" })
  ] });
}
const NAV = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "focus", icon: "◉", label: "Focus" },
  { id: "thoughts", icon: "☁", label: "Thoughts" },
  { id: "quests", icon: "⚔", label: "Quests" },
  { id: "character", icon: "◆", label: "Profile" }
];
const OVERLAYS = [
  { id: "forge", icon: "✦", label: "Forge" },
  { id: "brainmap", icon: "◎", label: "Map" }
];
function Sidebar({ activeView, onNav, onForge, onBrainMap, onTodo, todoOpen, focusLocked, todoPendingCount }) {
  function handleOverlay(id2) {
    if (id2 === "forge") onForge();
    if (id2 === "brainmap") onBrainMap();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: `sidebar${focusLocked ? " focus-locked" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-nav", children: NAV.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `sidebar-item${activeView === item.id ? " active" : ""}`,
        onClick: () => onNav(item.id),
        title: item.label,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-icon", children: item.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-label", children: item.label })
        ]
      },
      item.id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-divider" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `sidebar-item todo-sidebar-btn${todoOpen ? " active" : ""}`,
        onClick: onTodo,
        title: "Daily To-Do",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sidebar-icon", style: { position: "relative" }, children: [
            "☑",
            todoPendingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "todo-badge", children: todoPendingCount > 9 ? "9+" : todoPendingCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-label", children: "To-Do" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-divider" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sidebar-overlays", children: OVERLAYS.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "sidebar-item overlay",
        onClick: () => handleOverlay(item.id),
        title: item.label,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-icon", children: item.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sidebar-label", children: item.label })
        ]
      },
      item.id
    )) })
  ] });
}
async function callAI(prompt, apiKey, maxTokens = 400) {
  const r2 = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!r2.ok) throw new Error("API error " + r2.status);
  const d = await r2.json();
  return d.content[0].text;
}
function parseJsonArray(text) {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try {
    return JSON.parse(match[0]);
  } catch {
    return [];
  }
}
async function expandTask(taskText, apiKey) {
  const text = await callAI(
    `Break this task into 3-5 short, concrete, actionable subtasks. Return ONLY a JSON array of strings. Keep each under 65 chars. No markdown.
Task: "${taskText}"
Example: ["Research competitors", "Write outline", "Set up repo"]`,
    apiKey,
    300
  );
  return parseJsonArray(text).filter((s) => typeof s === "string").slice(0, 5);
}
async function suggestTodos(thoughts, intention, apiKey) {
  const thoughtList = thoughts.filter((t2) => !t2.done).slice(0, 15).map((t2) => `[${t2.type}/${t2.domain}] ${t2.text}`).join("\n");
  const text = await callAI(
    `You're helping an ADHD creator prioritize today. Based on their captured thoughts and intention, suggest 3-5 specific actionable todos. Be concrete and short (under 70 chars each).

Today's intention: "${intention || "none set"}"

Recent thoughts:
${thoughtList || "none yet"}

Return ONLY a JSON array: [{"text": "...", "priority": 2}]
Priority scale: 1=critical/urgent, 2=important, 3=normal
Example: [{"text": "Finish landing page copy", "priority": 2}]`,
    apiKey,
    450
  );
  return parseJsonArray(text).filter((s) => s && typeof s.text === "string").slice(0, 5);
}
const P_COLORS = { 1: "#f87171", 2: "#fbbf24", 3: "#00d9b1", 4: "#6b7280" };
const P_LABELS = { 1: "Critical", 2: "Important", 3: "Normal", 4: "Someday" };
function PriorityDot({ p: p2, active, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: `p-dot${active ? " active" : ""}`,
      style: { "--pc": P_COLORS[p2] },
      onClick,
      title: `P${p2} – ${P_LABELS[p2]}`,
      children: [
        "P",
        p2
      ]
    }
  );
}
function SubtaskRow({ sub, onToggle, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `subtask-row${sub.done ? " done" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sub-check", onClick: onToggle, children: sub.done ? "✓" : "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sub-text", children: sub.text }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "sub-del icon ghost", onClick: onDelete, children: "×" })
  ] });
}
function TodoItem({ todo, onToggle, onDelete, onAddSubtask, onToggleSub, onDeleteSub, apiKey }) {
  var _a, _b;
  const [expanded, setExpanded] = reactExports.useState(false);
  const [aiLoading, setAiLoading] = reactExports.useState(false);
  const [completing, setCompleting] = reactExports.useState(false);
  const checkRef = reactExports.useRef(null);
  const color = P_COLORS[todo.priority] || P_COLORS[3];
  async function handleExpand() {
    if (!apiKey) return;
    setAiLoading(true);
    try {
      const subs = await expandTask(todo.text, apiKey);
      subs.forEach((text) => onAddSubtask(todo.id, text));
      setExpanded(true);
    } finally {
      setAiLoading(false);
    }
  }
  function handleCheck() {
    if (todo.done) {
      onToggle(todo.id);
      return;
    }
    setCompleting(true);
    setTimeout(() => {
      onToggle(todo.id);
      setCompleting(false);
    }, 520);
  }
  const isOverdue = !todo.done && todo.date < (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `todo-item${todo.done ? " done" : ""}${completing ? " completing" : ""}${isOverdue ? " overdue" : ""}`,
      style: { "--pc": color },
      "data-p": todo.priority,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-main", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              ref: checkRef,
              className: `todo-check${todo.done ? " checked" : ""}${completing ? " completing" : ""}`,
              onClick: handleCheck,
              children: (todo.done || completing) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "check-mark", children: "✓" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "todo-text", children: todo.text }),
            todo.estimate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "todo-est", children: [
              "~",
              todo.estimate,
              "m"
            ] }),
            isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "todo-overdue-badge", children: "overdue" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-actions", children: [
            !todo.done && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: `todo-ai-btn${aiLoading ? " loading" : ""}`,
                onClick: handleExpand,
                title: apiKey ? "AI: break into subtasks" : "Add API key in Profile to use AI",
                disabled: !apiKey || aiLoading,
                children: aiLoading ? "⟳" : "✦"
              }
            ),
            ((_a = todo.subtasks) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "todo-expand-btn icon ghost",
                onClick: () => setExpanded((e) => !e),
                title: "Toggle subtasks",
                children: expanded ? "▾" : "▸"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon danger", onClick: () => onDelete(todo.id), children: "×" })
          ] })
        ] }),
        ((_b = todo.subtasks) == null ? void 0 : _b.length) > 0 && expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "subtask-list", children: todo.subtasks.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          SubtaskRow,
          {
            sub,
            onToggle: () => onToggleSub(todo.id, sub.id),
            onDelete: () => onDeleteSub(todo.id, sub.id)
          },
          sub.id
        )) })
      ]
    }
  );
}
function TodoPanel({ state, addTodo, toggleTodo, deleteTodo, addSubtask, toggleSubtask, deleteSubtask, onClose }) {
  const [input, setInput] = reactExports.useState("");
  const [priority, setPriority] = reactExports.useState(2);
  const [estimate, setEstimate] = reactExports.useState("");
  const [suggesting, setSuggesting] = reactExports.useState(false);
  const [suggestErr, setSuggestErr] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const allActive = (state.todos || []).filter((t2) => !t2.done);
  const todayAll = (state.todos || []).filter((t2) => t2.date === today);
  const todayDone = todayAll.filter((t2) => t2.done);
  const todayActive = allActive.filter((t2) => t2.date === today);
  const overdueActive = allActive.filter((t2) => t2.date < today);
  const sortedToday = [...todayActive].sort((a, b) => a.priority - b.priority);
  const sortedOverdue = [...overdueActive].sort((a, b) => a.priority - b.priority);
  const total = sortedToday.length + todayDone.length;
  const doneCount = todayDone.length;
  const ringFrac = total > 0 ? doneCount / total : 0;
  const R2 = 22;
  const circ = 2 * Math.PI * R2;
  function handleAdd(e) {
    var _a;
    e == null ? void 0 : e.preventDefault();
    if (!input.trim()) return;
    addTodo({ text: input.trim(), priority, estimate: estimate ? parseInt(estimate) : null });
    setInput("");
    setEstimate("");
    (_a = inputRef.current) == null ? void 0 : _a.focus();
  }
  async function handleSuggest() {
    if (!state.apiKey) {
      setSuggestErr("Set API key in Profile view first.");
      setTimeout(() => setSuggestErr(""), 3e3);
      return;
    }
    setSuggesting(true);
    setSuggestErr("");
    try {
      const suggestions = await suggestTodos(state.thoughts || [], state.intention, state.apiKey);
      if (!suggestions.length) {
        setSuggestErr("No suggestions — capture more thoughts first.");
        setTimeout(() => setSuggestErr(""), 3500);
        return;
      }
      suggestions.forEach((s) => addTodo({ text: s.text, priority: s.priority || 2 }));
    } catch {
      setSuggestErr("AI error — check API key.");
      setTimeout(() => setSuggestErr(""), 3e3);
    } finally {
      setSuggesting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-panel", role: "dialog", "aria-label": "Daily To-Do", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-header-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-ring-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "56", height: "56", viewBox: "0 0 56 56", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "28", cy: "28", r: R2, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: "3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "28",
                cy: "28",
                r: R2,
                fill: "none",
                stroke: ringFrac === 1 ? "#4ade80" : "var(--accent)",
                strokeWidth: "3",
                strokeDasharray: circ,
                strokeDashoffset: circ * (1 - ringFrac),
                strokeLinecap: "round",
                transform: "rotate(-90 28 28)",
                style: { transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease" }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "todo-ring-count", children: [
            doneCount,
            "/",
            total
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "todo-title", children: "TODAY" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "todo-date", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon ghost", onClick: onClose, style: { fontSize: 18 }, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "todo-add-form", onSubmit: handleAdd, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-add-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: inputRef,
            className: "todo-add-input",
            value: input,
            onChange: (e) => setInput(e.target.value),
            placeholder: "Add a task…",
            autoFocus: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", className: "todo-add-btn", disabled: !input.trim(), children: "+" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-add-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "priority-picker", children: [1, 2, 3, 4].map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx(PriorityDot, { p: p2, active: priority === p2, onClick: () => setPriority(p2) }, p2)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "todo-est-input",
            type: "number",
            min: "1",
            max: "480",
            value: estimate,
            onChange: (e) => setEstimate(e.target.value),
            placeholder: "min",
            title: "Estimated minutes"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `ai-suggest-btn${suggesting ? " loading" : ""}`,
        onClick: handleSuggest,
        disabled: suggesting,
        children: suggesting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ai-spin", children: "⟳" }),
          " Analyzing thoughts…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "✦" }),
          " AI: Suggest from thoughts"
        ] })
      }
    ),
    suggestErr && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "todo-err", children: suggestErr }),
    sortedOverdue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-section overdue-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-section-label overdue-label", children: [
        "⚠ Overdue (",
        sortedOverdue.length,
        ")"
      ] }),
      sortedOverdue.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TodoItem,
        {
          todo: t2,
          onToggle: toggleTodo,
          onDelete: deleteTodo,
          onAddSubtask: addSubtask,
          onToggleSub: toggleSubtask,
          onDeleteSub: deleteSubtask,
          apiKey: state.apiKey
        },
        t2.id
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "todo-section", children: sortedToday.length === 0 && doneCount === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "todo-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Nothing yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Add a task or let AI suggest." })
    ] }) : sortedToday.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TodoItem,
      {
        todo: t2,
        onToggle: toggleTodo,
        onDelete: deleteTodo,
        onAddSubtask: addSubtask,
        onToggleSub: toggleSubtask,
        onDeleteSub: deleteSubtask,
        apiKey: state.apiKey
      },
      t2.id
    )) }),
    todayDone.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "todo-done-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "todo-section-label done-label", children: [
        "✓ Done (",
        todayDone.length,
        ")"
      ] }),
      todayDone.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TodoItem,
        {
          todo: t2,
          onToggle: toggleTodo,
          onDelete: deleteTodo,
          onAddSubtask: addSubtask,
          onToggleSub: toggleSubtask,
          onDeleteSub: deleteSubtask,
          apiKey: state.apiKey
        },
        t2.id
      ))
    ] })
  ] });
}
const BREATHE_MESSAGES = ["breathe in", "hold", "breathe out", "hold"];
const CALM_MESSAGES = [
  "Let's slow down.",
  "One thing at a time.",
  "You've got this.",
  "Focus is a choice."
];
function ChaosMode({ state, onStartSession, onExit }) {
  const [phase, setPhase] = reactExports.useState("breathe");
  const [breathStep, setBreathStep] = reactExports.useState(0);
  const [breathCount, setBreathCount] = reactExports.useState(0);
  const [calmIdx, setCalmIdx] = reactExports.useState(0);
  const [exiting, setExiting] = reactExports.useState(false);
  const today = todayStr();
  const energyEntry = (state.energyLog || []).find((e) => e.date === today);
  const energyLevel = (energyEntry == null ? void 0 : energyEntry.level) ?? 3;
  const energyInfo = ENERGY_LEVELS[energyLevel - 1];
  const chaosTask = reactExports.useMemo(
    () => pickChaosTask(state.taskBoard, state.thoughts, energyLevel),
    [state.taskBoard, state.thoughts, energyLevel]
  );
  reactExports.useEffect(() => {
    const id2 = setInterval(() => {
      setBreathStep((s) => {
        const next = (s + 1) % 4;
        if (next === 0) setBreathCount((c) => c + 1);
        return next;
      });
    }, 4e3);
    return () => clearInterval(id2);
  }, []);
  reactExports.useEffect(() => {
    if (breathCount >= 4 && phase === "breathe") setPhase("task");
  }, [breathCount, phase]);
  reactExports.useEffect(() => {
    if (phase !== "task") return;
    const id2 = setInterval(() => setCalmIdx((i) => (i + 1) % CALM_MESSAGES.length), 3e3);
    return () => clearInterval(id2);
  }, [phase]);
  function handleExit() {
    setExiting(true);
    setTimeout(onExit, 300);
  }
  function handleStart() {
    onStartSession(chaosTask);
    handleExit();
  }
  function skipToTask() {
    setPhase("task");
  }
  const taskColor = chaosTask ? DOMAIN_COLOR[chaosTask.domain || chaosTask.priority] || "#00d9b1" : "#00d9b1";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `chaos-overlay${exiting ? " exiting" : ""}`, onClick: (e) => e.stopPropagation(), children: phase === "breathe" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 24 }, children: "CHAOS MODE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chaos-title", children: CALM_MESSAGES[calmIdx % CALM_MESSAGES.length] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-sub", style: { marginTop: 12 }, children: [
        energyInfo.emoji,
        " Energy: ",
        energyInfo.label,
        " · Follow the breath"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breathe-circle", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "breathe-instruction", children: BREATHE_MESSAGES[breathStep] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 8 }, children: Array.from({ length: 4 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `chaos-dot${breathCount > i ? " active" : ""}` }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted-2)" }, children: [
        Math.max(0, 4 - breathCount),
        " breath",
        4 - breathCount !== 1 ? "s" : "",
        " to go"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "chaos-skip", onClick: skipToTask, children: "I'm ready →" })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }, children: "YOUR ONE THING" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chaos-title", style: { fontSize: 22 }, children: "Focus on just this." })
    ] }),
    chaosTask ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-task-card", style: { "--accent": taskColor }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-task-label", children: [
        energyLevel <= 2 ? "⚡ Easy Win" : energyLevel >= 4 ? "🔥 High Impact" : "◈ Just Right",
        chaosTask.domain && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: 10, color: taskColor }, children: chaosTask.domain })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chaos-task-text", children: chaosTask.title || chaosTask.text || "Unnamed task" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-task-meta", children: [
        chaosTask.tier && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tier-badge ${chaosTask.tier}`, children: chaosTask.tier }),
        chaosTask.priority && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pill ${chaosTask.priority}`, children: chaosTask.priority }),
        chaosTask.tier && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill", style: { color: "var(--accent)", borderColor: "rgba(0,217,177,0.2)" }, children: [
          "+",
          TIER_XP[chaosTask.tier] || 25,
          " XP on complete"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: handleStart, style: { fontSize: 14 }, children: "▶ Start Focus Session" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleExit, style: { fontSize: 12 }, children: "Skip" })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-task-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chaos-task-label", children: "NO TASKS FOUND" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chaos-no-tasks", children: [
        "Your task board is empty.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Take a breath — then capture one concrete action."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chaos-actions", style: { gridTemplateColumns: "1fr" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: handleExit, children: "Exit & Capture Something" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: handleExit,
        style: { background: "transparent", border: "none", color: "var(--muted)", fontSize: 12, cursor: "pointer" },
        children: "← Exit Chaos Mode"
      }
    )
  ] }) });
}
function buildGraph(state) {
  const nodes = DOMAINS.map((d) => {
    var _a, _b, _c;
    return {
      id: `d:${d}`,
      type: "domain",
      label: d,
      color: DOMAIN_COLOR[d] || "#00d9b1",
      xp: ((_a = state.xp) == null ? void 0 : _a[d]) || 0,
      level: xpToLevel(((_b = state.xp) == null ? void 0 : _b[d]) || 0),
      count: state.thoughts.filter((t2) => t2.domain === d).length,
      size: 22 + Math.min((((_c = state.xp) == null ? void 0 : _c[d]) || 0) / 28, 26),
      vx: 0,
      vy: 0,
      fx: 0,
      fy: 0,
      x: 0,
      y: 0
    };
  });
  const byDay = {};
  state.thoughts.forEach((t2) => {
    var _a;
    const day = (_a = t2.createdAt) == null ? void 0 : _a.split("T")[0];
    if (!day || !DOMAINS.includes(t2.domain)) return;
    if (!byDay[day]) byDay[day] = /* @__PURE__ */ new Set();
    byDay[day].add(t2.domain);
  });
  const coCount = {};
  Object.values(byDay).forEach((doms) => {
    const arr = [...doms];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join("|||");
        coCount[key] = (coCount[key] || 0) + 1;
      }
    }
  });
  const domTags = {};
  state.thoughts.forEach((t2) => {
    if (!DOMAINS.includes(t2.domain)) return;
    if (!domTags[t2.domain]) domTags[t2.domain] = /* @__PURE__ */ new Set();
    (t2.tags || []).forEach((tag) => domTags[t2.domain].add(tag));
  });
  const edges = [];
  Object.entries(coCount).forEach(([key, count]) => {
    const [a, b] = key.split("|||");
    const tagsA = domTags[a] || /* @__PURE__ */ new Set();
    const tagsB = domTags[b] || /* @__PURE__ */ new Set();
    const shared = [...tagsA].filter((t2) => tagsB.has(t2)).length;
    const strength = Math.min((count + shared * 2) / 12, 1);
    if (strength > 0) edges.push({ source: `d:${a}`, target: `d:${b}`, strength, count, shared });
  });
  return { nodes, edges };
}
function simulateStep(nodes, edges, w2, h) {
  const REPULSION = 6500;
  const K2 = 0.045;
  const REST_LEN = 190;
  const DAMP = 0.86;
  const GRAVITY = 6e-4;
  const cx = w2 / 2, cy = h / 2;
  nodes.forEach((n2) => {
    n2.fx = 0;
    n2.fy = 0;
  });
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.max(Math.hypot(dx, dy), 1);
      const f2 = REPULSION / (d * d);
      const fx = dx / d * f2, fy = dy / d * f2;
      a.fx += fx;
      a.fy += fy;
      b.fx -= fx;
      b.fy -= fy;
    }
  }
  edges.forEach((e) => {
    const a = nodes.find((n2) => n2.id === e.source);
    const b = nodes.find((n2) => n2.id === e.target);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.max(Math.hypot(dx, dy), 1);
    const len = REST_LEN - e.strength * 60;
    const f2 = (d - len) * K2;
    const fx = dx / d * f2, fy = dy / d * f2;
    a.fx += fx;
    a.fy += fy;
    b.fx -= fx;
    b.fy -= fy;
  });
  nodes.forEach((n2) => {
    n2.fx += (cx - n2.x) * GRAVITY;
    n2.fy += (cy - n2.y) * GRAVITY;
  });
  nodes.forEach((n2) => {
    n2.vx = (n2.vx + n2.fx) * DAMP;
    n2.vy = (n2.vy + n2.fy) * DAMP;
    n2.x = Math.max(n2.size + 24, Math.min(w2 - n2.size - 24, n2.x + n2.vx));
    n2.y = Math.max(n2.size + 24, Math.min(h - n2.size - 24, n2.y + n2.vy));
  });
}
function drawFrame(ctx, nodes, edges, w2, h, hoveredId, selectedId, t2) {
  ctx.clearRect(0, 0, w2, h);
  nodes.forEach((n2) => {
    if (n2.count === 0 && n2.xp === 0) return;
    const g = ctx.createRadialGradient(n2.x, n2.y, 0, n2.x, n2.y, n2.size * 3.5);
    g.addColorStop(0, `${n2.color}18`);
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n2.x, n2.y, n2.size * 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  edges.forEach((e) => {
    const a = nodes.find((n2) => n2.id === e.source);
    const b = nodes.find((n2) => n2.id === e.target);
    if (!a || !b) return;
    const isLit = selectedId && (selectedId === a.id || selectedId === b.id);
    const isDim = selectedId && !isLit;
    const isHov = !selectedId && (hoveredId === a.id || hoveredId === b.id);
    const alpha = isDim ? 0.04 : isLit ? 0.75 : isHov ? 0.55 : 0.2 + e.strength * 0.3;
    const width = isDim ? 0.5 : isLit ? 2.5 : 1 + e.strength * 1.5;
    const pulse = isLit ? 0.85 + 0.15 * Math.sin(t2 * 3e-3) : 1;
    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, `${a.color}${Math.round(alpha * pulse * 255).toString(16).padStart(2, "0")}`);
    grad.addColorStop(1, `${b.color}${Math.round(alpha * pulse * 255).toString(16).padStart(2, "0")}`);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = width;
    ctx.stroke();
    if (isHov && e.count > 0) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(232,232,240,0.5)";
      ctx.textAlign = "center";
      ctx.fillText(`${e.count}d`, mx, my);
    }
  });
  nodes.forEach((n2) => {
    const isHov = n2.id === hoveredId;
    const isSel = n2.id === selectedId;
    const isDim = selectedId && !isSel;
    const hasData = n2.count > 0 || n2.xp > 0;
    const baseAlpha = hasData ? 1 : 0.35;
    const alpha = isDim ? 0.2 : baseAlpha;
    const glowSz = isHov ? 36 : isSel ? 30 : hasData ? 16 : 6;
    const pulse = isHov || isSel ? 0.8 + 0.2 * Math.sin(t2 * 4e-3) : 1;
    if (isHov || isSel) {
      ctx.beginPath();
      ctx.arc(n2.x, n2.y, n2.size + 8 + 4 * Math.sin(t2 * 4e-3), 0, Math.PI * 2);
      ctx.strokeStyle = `${n2.color}40`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.shadowBlur = glowSz * pulse;
    ctx.shadowColor = n2.color;
    ctx.beginPath();
    ctx.arc(n2.x, n2.y, n2.size * pulse, 0, Math.PI * 2);
    const fillAlpha = isDim ? 0.15 : isHov || isSel ? 0.92 : hasData ? 0.72 : 0.25;
    ctx.fillStyle = `${n2.color}${Math.round(fillAlpha * 255).toString(16).padStart(2, "0")}`;
    ctx.fill();
    ctx.strokeStyle = `${n2.color}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
    ctx.lineWidth = isSel ? 2.5 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (n2.level > 1 && !isDim) {
      ctx.font = `bold ${n2.size > 28 ? 11 : 9}px "JetBrains Mono", monospace`;
      ctx.fillStyle = isDim ? "rgba(0,0,0,0.3)" : "#06060f";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${n2.level}`, n2.x, n2.y);
    }
    if (!isDim || isHov) {
      ctx.font = `${isSel || isHov ? "600 " : ""}12px "Space Grotesk", sans-serif`;
      ctx.fillStyle = isDim ? "rgba(232,232,240,0.2)" : isSel || isHov ? "#e8e8f0" : "rgba(232,232,240,0.65)";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(n2.label, n2.x, n2.y + n2.size + 7);
    }
  });
}
function BrainMap({ state, onClose }) {
  const canvasRef = reactExports.useRef(null);
  const nodesRef = reactExports.useRef([]);
  const edgesRef = reactExports.useRef([]);
  const hoveredRef = reactExports.useRef(null);
  const selectedRef = reactExports.useRef(null);
  const rafRef = reactExports.useRef(null);
  const [hoveredNode, setHoveredNode] = reactExports.useState(null);
  const [selectedNode, setSelectedNode] = reactExports.useState(null);
  const [ready, setReady] = reactExports.useState(false);
  const { nodes: initNodes, edges: initEdges } = reactExports.useMemo(() => buildGraph(state), [state]);
  reactExports.useEffect(() => {
    const w2 = window.innerWidth, h = window.innerHeight;
    const cx = w2 / 2, cy = h / 2;
    const R2 = Math.min(w2, h) * 0.3;
    nodesRef.current = initNodes.map((n2, i) => ({
      ...n2,
      x: cx + R2 * Math.cos(i / initNodes.length * Math.PI * 2),
      y: cy + R2 * Math.sin(i / initNodes.length * Math.PI * 2)
    }));
    edgesRef.current = initEdges;
    setReady(true);
  }, [initNodes.length]);
  reactExports.useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);
    let t2 = 0;
    function frame() {
      const { width: w2, height: h } = canvas;
      simulateStep(nodesRef.current, edgesRef.current, w2, h);
      drawFrame(ctx, nodesRef.current, edgesRef.current, w2, h, hoveredRef.current, selectedRef.current, t2);
      t2 += 16;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    function getNodeAt(x2, y2) {
      return nodesRef.current.find((n2) => Math.hypot(n2.x - x2, n2.y - y2) < n2.size + 10);
    }
    function onMove(e) {
      const node = getNodeAt(e.clientX, e.clientY);
      hoveredRef.current = (node == null ? void 0 : node.id) || null;
      setHoveredNode(node || null);
      canvas.style.cursor = node ? "pointer" : "default";
    }
    function onClick(e) {
      const node = getNodeAt(e.clientX, e.clientY);
      if (node) {
        const next = selectedRef.current === node.id ? null : node.id;
        selectedRef.current = next;
        setSelectedNode(next ? node : null);
      } else {
        selectedRef.current = null;
        setSelectedNode(null);
      }
    }
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [ready]);
  const connectedEdges = selectedNode ? edgesRef.current.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id) : [];
  const hasAnyData = initEdges.length > 0 || initNodes.some((n2) => n2.xp > 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-overlay", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "brain-map-canvas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: 18, marginRight: 10 }, children: "◈" }),
        "Brain Map",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brain-map-sub", children: "your mind, visualized" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "brain-map-close", onClick: onClose, children: "× Close" })
    ] }),
    hoveredNode && !selectedNode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-tooltip", style: { "--node-color": hoveredNode.color }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bmt-domain", children: hoveredNode.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmt-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Level" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: hoveredNode.color }, children: hoveredNode.level })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmt-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "XP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: hoveredNode.color }, children: hoveredNode.xp })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmt-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Captures" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: hoveredNode.count })
      ] }),
      connectedEdges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmt-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Connections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: connectedEdges.length })
      ] })
    ] }),
    selectedNode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-node-panel", style: { "--node-color": selectedNode.color }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bmnp-name", style: { color: selectedNode.color }, children: selectedNode.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-level", children: [
          "Lv.",
          selectedNode.level
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-val", children: selectedNode.xp }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-lbl", children: "XP" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-val", children: selectedNode.count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-lbl", children: "captures" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-val", children: connectedEdges.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-lbl", children: "links" })
        ] })
      ] }),
      connectedEdges.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-connections", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bmnp-connections-label", children: "Connected to" }),
        connectedEdges.map((e) => {
          const otherId = e.source === selectedNode.id ? e.target : e.source;
          const other = nodesRef.current.find((n2) => n2.id === otherId);
          if (!other) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bmnp-conn-item", style: { "--other-color": other.color }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bmnp-conn-dot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: other.color }, children: other.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bmnp-conn-days", children: [
              e.count,
              "d"
            ] })
          ] }, otherId);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "ghost",
          style: { fontSize: 11, color: "var(--muted)", marginTop: 10, width: "100%" },
          onClick: () => {
            selectedRef.current = null;
            setSelectedNode(null);
          },
          children: "Deselect"
        }
      )
    ] }),
    !hasAnyData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-empty", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 32, marginBottom: 12 }, children: "◈" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 16, fontWeight: 600, marginBottom: 8 }, children: "Your Brain Map is blank" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 13, color: "var(--muted)", lineHeight: 1.65, maxWidth: 300 }, children: "Capture thoughts across different domains to reveal the connections between your interests." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brain-map-legend", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bml-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bml-dot", style: { width: 10, height: 10 } }),
        "Node size = XP level"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bml-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bml-line" }),
        "Edge thickness = connection strength"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bml-item", style: { color: "var(--muted-2)" }, children: "Click node to inspect · Click again to deselect" })
    ] })
  ] });
}
async function synthesizeWithClaude(thoughts, apiKey) {
  var _a, _b;
  const excerpts = thoughts.map(
    (t2, i) => `[${i + 1}] Domain: ${t2.domain} | Type: ${t2.type}
"${t2.text}"
Insight: ${t2.insight || "none"}`
  ).join("\n\n");
  const prompt = `You are a synthesis engine for POLYMATH OS — an ADHD-focused second brain.

The user has selected ${thoughts.length} thoughts from different domains to forge into a connection:

${excerpts}

Find the unexpected connection, pattern, or emergent idea that links these thoughts. This should feel like an "aha" moment — something the user couldn't see individually but becomes clear when combined.

Return ONLY valid JSON:
{
  "synthesis": "One sharp, punchy sentence (max 200 chars) that names the connection",
  "insight": "2-3 sentences expanding on why this connection matters and what to do with it",
  "domain": "The domain this synthesis belongs to most",
  "tags": ["tag1", "tag2", "tag3"]
}

No markdown, no explanation. Just JSON.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  const text = ((_b = (_a = data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) || "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON");
  return JSON.parse(match[0]);
}
function localSynthesize(thoughts) {
  const domains = [...new Set(thoughts.map((t2) => t2.domain))];
  return {
    synthesis: `Cross-domain connection: ${domains.join(" × ")}`,
    insight: `These thoughts from ${domains.join(", ")} share an underlying pattern. Review them together and look for the common constraint, mechanism, or opportunity that cuts across all ${thoughts.length} ideas.`,
    domain: domains[0] || "Life",
    tags: ["synthesis", "cross-domain"]
  };
}
function Forge({ thoughts, apiKey, onClose, onSaveForge }) {
  var _a;
  const [selected, setSelected] = reactExports.useState([]);
  const [result, setResult] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const recent = reactExports.useMemo(() => {
    const q2 = search.toLowerCase();
    return thoughts.filter((t2) => !t2.done).filter((t2) => !q2 || t2.text.toLowerCase().includes(q2) || t2.domain.toLowerCase().includes(q2)).slice(0, 30);
  }, [thoughts, search]);
  function toggleSelect(id2) {
    setSelected(
      (prev) => prev.includes(id2) ? prev.filter((x2) => x2 !== id2) : prev.length < 5 ? [...prev, id2] : prev
    );
  }
  async function handleForge() {
    const items = thoughts.filter((t2) => selected.includes(t2.id));
    if (items.length < 2) return;
    setLoading(true);
    setResult(null);
    try {
      const r2 = apiKey ? await synthesizeWithClaude(items, apiKey) : localSynthesize(items);
      setResult(r2);
    } catch {
      setResult(localSynthesize(items));
    } finally {
      setLoading(false);
    }
  }
  function handleSave() {
    if (!result) return;
    onSaveForge({
      text: result.synthesis,
      insight: result.insight,
      domain: result.domain,
      tags: result.tags || [],
      type: "insight",
      priority: "high"
    });
    onClose();
  }
  const selectedItems = thoughts.filter((t2) => selected.includes(t2.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-overlay", onClick: (e) => e.target === e.currentTarget && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "forge-title", children: "◈ The Forge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "forge-sub", children: "Select 2–5 thoughts from different domains. Claude will find the connection." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon ghost", onClick: onClose, style: { fontSize: 18 }, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-search-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "Filter thoughts…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "forge-sel-count", children: [
            selected.length,
            "/5 selected"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-thought-list", children: [
          recent.map((t2) => {
            const color = DOMAIN_COLOR[t2.domain] || "var(--accent)";
            const isSel = selected.includes(t2.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `forge-thought-item${isSel ? " selected" : ""}`,
                style: { "--ft-color": color },
                onClick: () => toggleSelect(t2.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-thought-check", children: isSel ? "◆" : "○" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-thought-content", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-thought-text", children: t2.text }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-thought-meta", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color }, children: t2.domain }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        TYPE_ICON[t2.type] || "·",
                        " ",
                        t2.type
                      ] })
                    ] })
                  ] })
                ]
              },
              t2.id
            );
          }),
          recent.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", style: { padding: 20 }, children: "No thoughts match." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-input-preview", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-preview-label", children: "Selected for forging" }),
          selected.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-preview-empty", children: "Pick thoughts from the left →" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-chips", children: selectedItems.map((t2) => {
            const color = DOMAIN_COLOR[t2.domain] || "var(--accent)";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-chip", style: { "--fc": color }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forge-chip-dom", children: t2.domain }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "forge-chip-text", children: [
                t2.text.slice(0, 40),
                t2.text.length > 40 ? "…" : ""
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "forge-chip-remove", onClick: () => toggleSelect(t2.id), children: "✕" })
            ] }, t2.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "primary forge-btn",
            onClick: handleForge,
            disabled: selected.length < 2 || loading,
            children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "forge-loading", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forge-flame", children: "◈" }),
              " Forging…"
            ] }) : `◈ Forge ${selected.length >= 2 ? selected.length + " thoughts" : "(select 2+)"}`
          }
        ),
        result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-result", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-result-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forge-result-icon", children: "✦" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forge-result-label", children: "Synthesis" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "forge-result-domain", style: { color: DOMAIN_COLOR[result.domain] || "var(--accent)" }, children: result.domain })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-result-synthesis", children: result.synthesis }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-result-insight", children: result.insight }),
          ((_a = result.tags) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-result-tags", children: result.tags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill", children: [
            "#",
            tag
          ] }, tag)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", style: { marginTop: 14, width: "100%" }, onClick: handleSave, children: "✦ Save as Insight" })
        ] }),
        !result && !loading && selected.length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "forge-hint", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-hint-icon", children: "◈" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "forge-hint-text", children: "Select 2+ thoughts from different domains to reveal hidden connections." })
        ] })
      ] })
    ] })
  ] }) });
}
const CACHE_KEY = "polymath-brief-";
function getHour() {
  return (/* @__PURE__ */ new Date()).getHours();
}
function greeting() {
  const h = getHour();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function buildContext(state) {
  var _a, _b, _c, _d;
  const today = todayStr();
  const cutoff3 = Date.now() - 3 * 864e5;
  const openTasks = (state.taskBoard || []).filter((t2) => !t2.done);
  const epicTasks = openTasks.filter((t2) => t2.tier === "epic");
  const coldThreads = (state.thoughts || []).filter(
    (t2) => !t2.done && new Date(t2.createdAt).getTime() < cutoff3 && (t2.type === "task" || t2.type === "question")
  ).slice(0, 3);
  const todayEnergy = (state.energyLog || []).find((e) => e.date === today);
  const energy = todayEnergy ? ENERGY_LEVELS.find((e) => e.level === todayEnergy.level) : null;
  const recentDomains = [...new Set(
    (state.thoughts || []).filter((t2) => {
      var _a2;
      return (_a2 = t2.createdAt) == null ? void 0 : _a2.startsWith(today);
    }).map((t2) => t2.domain)
  )];
  const allDomains = ["AI/ML", "Writing", "Business", "Design", "Physics", "Health", "Learning", "Life"];
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 864e5);
    return d.toISOString().split("T")[0];
  });
  const domainActivity = allDomains.map((d) => ({
    domain: d,
    count: (state.thoughts || []).filter((t2) => t2.domain === d && last7.some((day) => {
      var _a2;
      return (_a2 = t2.createdAt) == null ? void 0 : _a2.startsWith(day);
    })).length
  }));
  const neglected = domainActivity.filter((d) => {
    var _a2;
    return d.count === 0 && (((_a2 = state.xp) == null ? void 0 : _a2[d.domain]) || 0) > 0;
  }).map((d) => d.domain);
  const topDomain = domainActivity.sort((a, b) => b.count - a.count)[0];
  const doneQuests = (((_a = state.quests) == null ? void 0 : _a.list) || []).filter((q2) => q2.completed).length;
  const totalQuests = ((_c = (_b = state.quests) == null ? void 0 : _b.list) == null ? void 0 : _c.length) || 0;
  const activeBoss = (state.bosses || []).find((b) => !b.defeated);
  const activeQuestline = (state.questlines || []).find((q2) => !q2.completed);
  return {
    openTasks,
    epicTasks,
    coldThreads,
    energy,
    recentDomains,
    neglected,
    topDomain,
    doneQuests,
    totalQuests,
    activeBoss,
    activeQuestline,
    streak: state.streak,
    totalThoughts: ((_d = state.thoughts) == null ? void 0 : _d.length) || 0
  };
}
async function generateBriefWithClaude(ctx, apiKey) {
  var _a, _b, _c;
  const cached = localStorage.getItem(CACHE_KEY + todayStr());
  if (cached) return JSON.parse(cached);
  const prompt = `You are POLYMATH OS — an ADHD-focused life operating system. Write a concise morning brief for the user.

Context:
- Open tasks: ${ctx.openTasks.length} (${ctx.epicTasks.length} epic)
- Cold threads (untouched 3+ days): ${ctx.coldThreads.map((t2) => `"${t2.text.slice(0, 60)}"`).join(", ") || "none"}
- Today's energy: ${ctx.energy ? `${ctx.energy.emoji} ${ctx.energy.label}` : "not set yet"}
- Active boss battle: ${ctx.activeBoss ? `"${ctx.activeBoss.name}"` : "none"}
- Active questline: ${ctx.activeQuestline ? `"${ctx.activeQuestline.goal}"` : "none"}
- Neglected domains (no activity this week): ${ctx.neglected.join(", ") || "none"}
- Streak: ${((_a = ctx.streak) == null ? void 0 : _a.count) || 0} days

Return ONLY valid JSON:
{
  "focus": "One sentence: the single most important thing to work on today (be specific, not generic)",
  "nudge": "One short ADHD-friendly nudge — direct, slightly provocative, max 120 chars",
  "domain": "The domain to prioritize today based on context"
}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  const text = ((_c = (_b = data.content) == null ? void 0 : _b[0]) == null ? void 0 : _c.text) || "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON");
  const result = JSON.parse(match[0]);
  localStorage.setItem(CACHE_KEY + todayStr(), JSON.stringify(result));
  return result;
}
function localBrief(ctx) {
  var _a, _b, _c;
  const cached = localStorage.getItem(CACHE_KEY + todayStr());
  if (cached) return JSON.parse(cached);
  let focus = "Start by capturing one raw thought — anything on your mind right now.";
  let nudge = "The hardest part is starting. You already opened the app. That's step one.";
  let domain = "Life";
  if (ctx.epicTasks.length > 0) {
    focus = `You have ${ctx.epicTasks.length} epic task${ctx.epicTasks.length > 1 ? "s" : ""} open — at least one deserves your best hours today.`;
    domain = ctx.epicTasks[0].domain || "Life";
  } else if (ctx.coldThreads.length > 0) {
    focus = `"${ctx.coldThreads[0].text.slice(0, 80)}" has been untouched for 3+ days. Today it gets attention.`;
    domain = ctx.coldThreads[0].domain || "Life";
  } else if (ctx.activeBoss) {
    focus = `Your boss battle "${ctx.activeBoss.name}" is waiting. Hit the next phase.`;
    domain = ctx.activeBoss.domain || "Life";
  } else if (ctx.activeQuestline) {
    focus = `Next up on "${ctx.activeQuestline.goal}": ${((_a = ctx.activeQuestline.quests.find((q2) => !q2.done)) == null ? void 0 : _a.title) || "continue the questline"}.`;
    domain = ctx.activeQuestline.domain || "Life";
  }
  if (ctx.neglected.length > 0) {
    nudge = `${ctx.neglected[0]} hasn't seen any action this week. Don't let it go cold.`;
  } else if (((_b = ctx.streak) == null ? void 0 : _b.count) >= 3) {
    nudge = `${ctx.streak.count}-day streak active. Don't be the one who breaks it.`;
  } else if (((_c = ctx.energy) == null ? void 0 : _c.level) >= 4) {
    nudge = `${ctx.energy.emoji} Peak energy. Stop reading this and go do the hard thing.`;
  }
  const result = { focus, nudge, domain };
  localStorage.setItem(CACHE_KEY + todayStr(), JSON.stringify(result));
  return result;
}
function MorningBrief({ state, onDismiss, onSetIntention }) {
  var _a;
  const [brief, setBrief] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [intention, setIntention] = reactExports.useState("");
  const [exiting, setExiting] = reactExports.useState(false);
  const ctx = buildContext(state);
  reactExports.useEffect(() => {
    async function load() {
      try {
        const result = state.apiKey ? await generateBriefWithClaude(ctx, state.apiKey) : localBrief(ctx);
        setBrief(result);
      } catch {
        setBrief(localBrief(ctx));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  function dismiss() {
    setExiting(true);
    setTimeout(onDismiss, 500);
  }
  function handleStart() {
    if (intention.trim()) onSetIntention(intention.trim());
    dismiss();
  }
  const domainColor = brief ? DOMAIN_COLOR[brief.domain] || "var(--accent)" : "var(--accent)";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `brief-overlay${exiting ? " exiting" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-topbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-date", children: (/* @__PURE__ */ new Date()).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost brief-skip", onClick: dismiss, children: "Skip →" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-greeting", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brief-hello", children: [
        greeting(),
        ","
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-name", children: "Polymath." })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-loading", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brief-spinner" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Preparing your brief…" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-focus-card", style: { "--bc": domainColor }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brief-focus-label", children: "Today's Focus" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brief-focus-text", children: brief == null ? void 0 : brief.focus }),
        (brief == null ? void 0 : brief.domain) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-focus-domain", style: { color: domainColor }, children: brief.domain })
      ] }),
      (brief == null ? void 0 : brief.nudge) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-nudge", children: [
        '"',
        brief.nudge,
        '"'
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-val", children: ctx.openTasks.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-lbl", children: "open tasks" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-val", children: ctx.coldThreads.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-lbl", children: "cold threads" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-val", children: ((_a = ctx.streak) == null ? void 0 : _a.count) || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-lbl", children: "day streak" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brief-stat-val", children: [
            ctx.doneQuests,
            "/",
            ctx.totalQuests
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-stat-lbl", children: "quests done" })
        ] })
      ] }),
      ctx.coldThreads.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-cold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brief-section-label", children: "Cold threads — need your attention" }),
        ctx.coldThreads.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-cold-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-cold-dot", style: { background: DOMAIN_COLOR[t2.domain] || "var(--muted)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "brief-cold-text", children: [
            t2.text.slice(0, 70),
            t2.text.length > 70 ? "…" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "brief-cold-age", style: { color: DOMAIN_COLOR[t2.domain] }, children: t2.domain })
        ] }, t2.id))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-intention", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brief-section-label", children: "Set today's intention" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "brief-intention-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: intention,
              onChange: (e) => setIntention(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleStart(),
              placeholder: state.intention || "One sentence for today…",
              autoFocus: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: handleStart, children: intention.trim() ? "Set & Start →" : "Start Day →" })
        ] })
      ] })
    ] })
  ] }) });
}
const INTERVAL_MS = 20 * 60 * 1e3;
const DISPLAY_MS = 12 * 1e3;
function pickOldInsight(thoughts) {
  const cutoff = Date.now() - 7 * 864e5;
  const pool = thoughts.filter(
    (t2) => !t2.done && new Date(t2.createdAt).getTime() < cutoff && (t2.type === "insight" || t2.insight && t2.insight.length > 10)
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
function SerendipityEngine({ thoughts }) {
  const [card, setCard] = reactExports.useState(null);
  const [visible, setVisible] = reactExports.useState(false);
  const timerRef = reactExports.useRef(null);
  const hideRef = reactExports.useRef(null);
  function fire() {
    const t2 = pickOldInsight(thoughts);
    if (!t2) return;
    setCard(t2);
    setVisible(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setVisible(false), DISPLAY_MS);
  }
  reactExports.useEffect(() => {
    timerRef.current = setInterval(fire, INTERVAL_MS);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(hideRef.current);
    };
  }, [thoughts]);
  if (!card || !visible) return null;
  const color = DOMAIN_COLOR[card.domain] || "var(--accent)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "serendipity-card", style: { "--sc": color }, onClick: () => setVisible(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "serendipity-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "serendipity-label", children: "✦ Resurfaced" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "serendipity-domain", style: { color }, children: card.domain }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "serendipity-close", onClick: () => setVisible(false), children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "serendipity-text", children: card.text }),
    card.insight && card.insight !== "Classifying…" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "serendipity-insight", children: card.insight }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "serendipity-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        TYPE_ICON[card.type] || "·",
        " ",
        card.type
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(card.createdAt).toLocaleDateString([], { month: "short", day: "numeric" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "serendipity-progress" })
  ] });
}
function ToastStack({ toasts, dismiss }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-stack", children: toasts.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ach-toast", onClick: () => dismiss(t2.tid), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toast-icon", children: t2.icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-eyebrow", children: "Achievement Unlocked" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-title", children: t2.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-desc", children: t2.desc })
    ] })
  ] }, t2.tid)) });
}
function XpFloats({ floats }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: floats.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xp-float", style: { top: f2.y, left: f2.x }, children: [
    "+",
    f2.amt,
    " XP"
  ] }, f2.id)) });
}
function triggerCaptureParticles(fromEl) {
  const toEl = document.querySelector(".stat-pill");
  if (!fromEl || !toEl) return;
  const fromRect = fromEl.getBoundingClientRect();
  const toRect = toEl.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9998"
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const COUNT = 22;
  const DURATION = 900;
  const x0 = fromRect.left + fromRect.width * 0.5;
  const y0 = fromRect.top + fromRect.height * 0.5;
  const x1 = toRect.left + toRect.width * 0.5;
  const y1 = toRect.top + toRect.height * 0.5;
  const particles = Array.from({ length: COUNT }, (_, i) => {
    const spreadX = (Math.random() - 0.5) * fromRect.width * 0.8;
    const spreadY = (Math.random() - 0.5) * fromRect.height * 0.5;
    const cx = (x0 + x1) * 0.5 + (Math.random() - 0.5) * 140;
    const cy = Math.min(y0, y1) - 60 - Math.random() * 100;
    return {
      sx: x0 + spreadX,
      sy: y0 + spreadY,
      cx,
      cy,
      ex: x1,
      ey: y1,
      delay: Math.random() * 0.25,
      speed: 0.9 + Math.random() * 0.3,
      size: 2 + Math.random() * 2.5,
      hue: 160 + Math.random() * 40
    };
  });
  let start = null;
  function draw(ts) {
    if (!start) start = ts;
    const raw = (ts - start) / DURATION;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDone = true;
    for (const p2 of particles) {
      const t2 = Math.min(1, Math.max(0, (raw - p2.delay) * p2.speed));
      if (t2 < 1) allDone = false;
      if (t2 <= 0) continue;
      const bx = (1 - t2) * (1 - t2) * p2.sx + 2 * (1 - t2) * t2 * p2.cx + t2 * t2 * p2.ex;
      const by = (1 - t2) * (1 - t2) * p2.sy + 2 * (1 - t2) * t2 * p2.cy + t2 * t2 * p2.ey;
      const alpha = t2 < 0.8 ? 1 : 1 - (t2 - 0.8) / 0.2;
      const size = p2.size * (1 - t2 * 0.5);
      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.shadowColor = `hsl(${p2.hue}, 100%, 65%)`;
      ctx.shadowBlur = 10;
      ctx.fillStyle = `hsl(${p2.hue}, 100%, 72%)`;
      ctx.beginPath();
      ctx.arc(bx, by, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    if (allDone) {
      toEl.classList.add("xp-pulse");
      setTimeout(() => toEl.classList.remove("xp-pulse"), 700);
      canvas.remove();
      return;
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
const ROUTING_DELAY = 380;
function CapturePanel({ onSubmit, captureRef, apiKey }) {
  const [draft, setDraft] = reactExports.useState("");
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const [routingState, setRoutingState] = reactExports.useState("idle");
  const [routingResult, setRoutingResult] = reactExports.useState(null);
  const debounceRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!isFocused) {
      setRoutingState("idle");
      return;
    }
    if (draft.length < 4) {
      setRoutingState("focus");
      setRoutingResult(null);
      return;
    }
    setRoutingState("analyzing");
    debounceRef.current = setTimeout(() => {
      setRoutingResult(localClassify(draft));
      setRoutingState("routed");
    }, ROUTING_DELAY);
    return () => clearTimeout(debounceRef.current);
  }, [draft, isFocused]);
  const handle = reactExports.useCallback(() => {
    if (!draft.trim()) return;
    if (captureRef == null ? void 0 : captureRef.current) triggerCaptureParticles(captureRef.current);
    onSubmit(draft.trim(), apiKey);
    setDraft("");
    setRoutingState("idle");
    setRoutingResult(null);
  }, [draft, apiKey, onSubmit, captureRef]);
  const pri = routingResult == null ? void 0 : routingResult.priority;
  const priColor = pri === "high" ? "#f87171" : pri === "medium" ? "#fbbf24" : "var(--muted)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel capture-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Capture" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kbd", children: "Ctrl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--muted)", fontSize: 11 }, children: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "kbd", children: "↵" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        ref: captureRef,
        className: "capture-textarea",
        value: draft,
        onChange: (e) => setDraft(e.target.value),
        onFocus: () => setIsFocused(true),
        onBlur: () => {
          setIsFocused(false);
        },
        onKeyDown: (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handle();
          }
        },
        placeholder: "Dump the raw thought. No categories, no cleanup."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `routing-terminal${routingState === "idle" ? " routing-hidden" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-prompt", children: "›" }),
      routingState === "focus" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "routing-text routing-dim", children: [
        "AWAITING INPUT",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-cursor" })
      ] }),
      routingState === "analyzing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "routing-text", children: [
        "PARSING CONTEXT",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-cursor" })
      ] }),
      routingState === "routed" && routingResult && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "routing-text routing-done", children: [
        "ROUTING",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-arrow", children: "→" }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "routing-domain", children: [
          "[",
          routingResult.domain,
          "]"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-sep", children: " · " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-type", children: routingResult.type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-sep", children: " · " }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: priColor }, children: routingResult.priority }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "routing-cursor" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "capture-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "char-count", children: [
        draft.length,
        " chars"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: handle, children: "Capture →" })
    ] })
  ] });
}
function StreakHeatmap({ thoughts }) {
  const DAYS = 30;
  const today = /* @__PURE__ */ new Date();
  const dayCounts = {};
  thoughts.forEach((t2) => {
    var _a;
    const d = (_a = t2.createdAt) == null ? void 0 : _a.split("T")[0];
    if (d) dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const cells = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today.getTime() - (DAYS - 1 - i) * 864e5);
    const ds = d.toISOString().split("T")[0];
    return { date: ds, count: dayCounts[ds] || 0 };
  });
  function cellBg(count) {
    if (count === 0) return "rgba(255,255,255,0.04)";
    if (count <= 2) return "rgba(0,217,177,0.22)";
    if (count <= 5) return "rgba(0,217,177,0.45)";
    if (count <= 9) return "rgba(0,217,177,0.65)";
    return "rgba(0,217,177,0.88)";
  }
  const activeDays = Object.keys(dayCounts).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "heatmap-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "heatmap-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Activity — Last 30 Days" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }, children: [
        activeDays,
        " active · ",
        thoughts.length,
        " total captures"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "heatmap-grid", children: cells.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "heatmap-cell",
        style: { background: cellBg(c.count) },
        title: `${c.date}: ${c.count} capture${c.count !== 1 ? "s" : ""}`
      },
      c.date
    )) })
  ] });
}
function getAgeDays(createdAt) {
  if (!createdAt) return 0;
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 864e5);
}
function ThoughtCard({ thought, updateThought, deleteThought, index = 0, isExiting = false }) {
  const [editing, setEditing] = reactExports.useState(false);
  const [text, setText] = reactExports.useState(thought.text);
  const color = DOMAIN_COLOR[thought.domain] || "var(--accent)";
  const ageDays = thought.done ? 0 : getAgeDays(thought.createdAt);
  const ageFactor = thought.done ? 0 : Math.min(1, ageDays / 14);
  const ageClass = ageDays >= 7 ? " aged-critical" : ageDays >= 3 ? " aged-warn" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: `thought${thought.done ? " done" : ""}${ageClass}${isExiting ? " is-exiting" : ""}`,
      style: {
        "--dc": color,
        "--age-factor": ageFactor.toFixed(3),
        "--snap-delay": `${Math.min(index, 8) * 38}ms`
      },
      "data-priority": thought.priority,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thought-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "type-icon", style: { color, opacity: 0.8 }, children: TYPE_ICON[thought.type] || "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill dom", style: { "--dc": color }, children: thought.domain }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill typ", children: thought.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pill ${thought.priority}`, children: thought.priority }),
            thought.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill pending", children: "classifying…" }),
            ageDays >= 7 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill aged-pill critical", children: [
              ageDays,
              "d old"
            ] }),
            ageDays >= 3 && ageDays < 7 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill aged-pill warn", children: [
              ageDays,
              "d old"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thought-actions", children: [
            thought.type === "task" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "icon",
                title: thought.done ? "Restore" : "Mark done",
                style: { color: thought.done ? "var(--muted)" : "var(--accent)" },
                onClick: (e) => updateThought(thought.id, { done: !thought.done, completedAt: !thought.done ? (/* @__PURE__ */ new Date()).toISOString() : null }, !thought.done ? e : null),
                children: thought.done ? "↶" : "✓"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon ghost", title: "Edit", onClick: () => setEditing(!editing), children: "✎" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon danger", title: "Delete", onClick: () => deleteThought(thought.id), children: "×" })
          ] })
        ] }),
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "edit-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: text, onChange: (e) => setText(e.target.value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: () => {
            updateThought(thought.id, { text });
            setEditing(false);
          }, children: "Save" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "thought-text", children: thought.text }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "meta", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill", style: { opacity: 0.65, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: thought.insight }),
          (thought.tags || []).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill", children: [
            "#",
            tag
          ] }, tag)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill", style: { marginLeft: "auto", fontSize: 9, opacity: 0.55 }, children: new Date(thought.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })
        ] })
      ]
    }
  );
}
const RINGS = [
  { tiltX: 0, tiltZ: 0, speedMul: 1 },
  { tiltX: Math.PI / 2, tiltZ: 0, speedMul: 0.7 },
  { tiltX: Math.PI / 4, tiltZ: Math.PI / 4, speedMul: 1.3 }
];
const N$1 = 64;
function rotX$1(x2, y2, z2, a) {
  return [x2, y2 * Math.cos(a) - z2 * Math.sin(a), y2 * Math.sin(a) + z2 * Math.cos(a)];
}
function rotY$1(x2, y2, z2, a) {
  return [x2 * Math.cos(a) + z2 * Math.sin(a), y2, -x2 * Math.sin(a) + z2 * Math.cos(a)];
}
function rotZ(x2, y2, z2, a) {
  return [x2 * Math.cos(a) - y2 * Math.sin(a), x2 * Math.sin(a) + y2 * Math.cos(a), z2];
}
function ringPoints(tiltX, tiltZ, yAngle, R2) {
  const pts = [];
  for (let i = 0; i <= N$1; i++) {
    const a = i / N$1 * Math.PI * 2;
    let [x2, y2, z2] = [R2 * Math.cos(a), R2 * Math.sin(a), 0];
    [x2, y2, z2] = rotX$1(x2, y2, z2, tiltX);
    [x2, y2, z2] = rotZ(x2, y2, z2, tiltZ);
    [x2, y2, z2] = rotY$1(x2, y2, z2, yAngle);
    const fov = 500;
    const scale = fov / (fov + z2 + 200);
    pts.push({ sx: x2 * scale, sy: y2 * scale, z: z2, scale });
  }
  return pts;
}
function MomentumOrb({ momentum = 0 }) {
  const canvasRef = reactExports.useRef(null);
  const mouseRef = reactExports.useRef({ x: 0.5, y: 0.5 });
  const angleRef = reactExports.useRef(0);
  const rafRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const h = (e) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      };
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W2 = canvas.width, H2 = canvas.height;
    const cx = W2 / 2, cy = H2 / 2;
    const norm = Math.max(0, Math.min(100, momentum)) / 100;
    const baseSpeed = 3e-3 + norm * 0.014;
    const r2 = norm >= 0.6 ? 74 : norm >= 0.3 ? 251 : 248;
    const g = norm >= 0.6 ? 222 : norm >= 0.3 ? 191 : 113;
    const b = norm >= 0.6 ? 128 : norm >= 0.3 ? 36 : 113;
    const glowIntensity = 6 + norm * 22;
    const lineAlpha = 0.18 + norm * 0.45;
    const R2 = 90 + norm * 25;
    function frame() {
      ctx.clearRect(0, 0, W2, H2);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const parallaxX = (mx - 0.5) * 0.5;
      const parallaxY = (my - 0.5) * 0.4;
      angleRef.current += baseSpeed;
      RINGS.forEach(({ tiltX, tiltZ, speedMul }) => {
        const pts = ringPoints(
          tiltX + parallaxY,
          tiltZ + parallaxX,
          angleRef.current * speedMul,
          R2
        );
        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        pts.forEach((p2, i) => {
          if (i === 0) ctx.moveTo(p2.sx, p2.sy);
          else ctx.lineTo(p2.sx, p2.sy);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(${r2},${g},${b},${lineAlpha})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = `rgb(${r2},${g},${b})`;
        ctx.shadowBlur = glowIntensity;
        ctx.stroke();
        pts.forEach((p2, i) => {
          if (i % 8 !== 0) return;
          ctx.beginPath();
          ctx.arc(p2.sx, p2.sy, 1.5 * p2.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r2},${g},${b},${lineAlpha * 1.6})`;
          ctx.shadowBlur = glowIntensity * 1.5;
          ctx.fill();
        });
        ctx.restore();
      });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [momentum]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "momentum-orb",
      width: 340,
      height: 340
    }
  );
}
function HomeView({ game, captureRef, onViewAll, momentum = 0 }) {
  const [intentionLocal, setIntentionLocal] = reactExports.useState(game.state.intention || "");
  reactExports.useEffect(() => {
    setIntentionLocal(game.state.intention || "");
  }, [game.state.intention]);
  const recent = [...game.state.thoughts || []].filter((t2) => !t2.done).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "home-orb-wrap", "aria-hidden": "true", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MomentumOrb, { momentum }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-hero-label", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "CAPTURE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "view-hint", children: [
          "Press ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { className: "kbd", children: "/" }),
          " from anywhere"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "capture-hero-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        CapturePanel,
        {
          captureRef,
          onSubmit: game.submitThought,
          apiKey: game.state.apiKey
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "intention-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "intention-label", children: "TODAY'S INTENTION" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "intention-input",
          value: intentionLocal,
          onChange: (e) => {
            setIntentionLocal(e.target.value);
            game.setIntentionText(e.target.value);
          },
          onBlur: (e) => game.saveIntention(e.target.value),
          placeholder: "One sentence that defines today…"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StreakHeatmap, { thoughts: game.state.thoughts }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-recent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "home-recent-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "RECENT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost view-all-btn", onClick: onViewAll, children: "View all →" })
      ] }),
      recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "home-empty", children: "Nothing captured yet — start dumping raw thoughts above." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stream", children: recent.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThoughtCard,
        {
          thought: t2,
          updateThought: game.updateThought,
          deleteThought: game.deleteThought
        },
        t2.id
      )) })
    ] })
  ] });
}
const N = 52;
const FOV = 360;
function fibSphere(n2, r2) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n2 }, (_, i) => {
    const y2 = 1 - i / (n2 - 1) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y2 * y2));
    const t2 = golden * i;
    return [rad * Math.cos(t2) * r2, y2 * r2, rad * Math.sin(t2) * r2];
  });
}
function makeScatter(n2, r2) {
  return Array.from({ length: n2 }, () => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const dr = (0.4 + Math.random() * 0.8) * r2 * 2;
    return [dr * Math.sin(phi) * Math.cos(theta), dr * Math.cos(phi), dr * Math.sin(phi) * Math.sin(theta)];
  });
}
function lerp(a, b, t2) {
  return a + (b - a) * t2;
}
function easeOut(t2) {
  return 1 - Math.pow(1 - t2, 2.8);
}
function rotY([x2, y2, z2], a) {
  return [x2 * Math.cos(a) + z2 * Math.sin(a), y2, -x2 * Math.sin(a) + z2 * Math.cos(a)];
}
function rotX([x2, y2, z2], a) {
  return [x2, y2 * Math.cos(a) - z2 * Math.sin(a), y2 * Math.sin(a) + z2 * Math.cos(a)];
}
function proj([x2, y2, z2], cx, cy) {
  const s = FOV / (FOV + z2 + 100);
  return [cx + x2 * s, cy + y2 * s, s];
}
function hexAlpha(color, alpha) {
  return color + Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, "0");
}
function AntiTimer({ remaining, totalSeconds, modeColor, running, mode }) {
  const canvasRef = reactExports.useRef(null);
  const angleRef = reactExports.useRef(0);
  const rafRef = reactExports.useRef(null);
  const mouseRef = reactExports.useRef({ x: 0.5, y: 0.5 });
  const remRef = reactExports.useRef(remaining);
  const totRef = reactExports.useRef(totalSeconds);
  const colRef = reactExports.useRef(modeColor);
  const runRef = reactExports.useRef(running);
  const modeRef2 = reactExports.useRef(mode);
  reactExports.useEffect(() => {
    remRef.current = remaining;
  }, [remaining]);
  reactExports.useEffect(() => {
    totRef.current = totalSeconds;
  }, [totalSeconds]);
  reactExports.useEffect(() => {
    colRef.current = modeColor;
  }, [modeColor]);
  reactExports.useEffect(() => {
    runRef.current = running;
  }, [running]);
  reactExports.useEffect(() => {
    modeRef2.current = mode;
  }, [mode]);
  const R2 = 74;
  const targets = reactExports.useMemo(() => fibSphere(N, R2), []);
  const scatters = reactExports.useMemo(() => makeScatter(N, R2), []);
  const connections = reactExports.useMemo(() => {
    const out = [];
    const THRESH = R2 * 0.85;
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++) {
        const [dx, dy, dz] = [targets[i][0] - targets[j][0], targets[i][1] - targets[j][1], targets[i][2] - targets[j][2]];
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < THRESH) out.push([i, j]);
      }
    return out;
  }, [targets]);
  reactExports.useEffect(() => {
    const h = (e) => {
      mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W2 = canvas.width, H2 = canvas.height, cx = W2 / 2, cy = H2 / 2;
    function frame() {
      const rem = remRef.current;
      const tot = totRef.current;
      const col = colRef.current;
      const run = runRef.current;
      const md2 = modeRef2.current;
      ctx.clearRect(0, 0, W2, H2);
      const rawProg = md2 === "focus" ? Math.max(0, Math.min(1, (tot - rem) / (tot || 1))) : 0;
      const ep = easeOut(rawProg);
      const speed = run ? 3e-3 + rawProg * 7e-3 : 15e-4;
      angleRef.current += speed;
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const tx = (my - 0.5) * 0.28, ty = (mx - 0.5) * 0.22;
      const pts = targets.map((t2, i) => {
        const s = scatters[i];
        let p2 = [lerp(s[0], t2[0], ep), lerp(s[1], t2[1], ep), lerp(s[2], t2[2], ep)];
        p2 = rotX(p2, tx);
        p2 = rotY(p2, angleRef.current + ty);
        return p2;
      });
      const baseAlpha = 0.25 + ep * 0.55;
      const glow = 3 + ep * 16;
      ctx.lineWidth = 0.65;
      ctx.shadowColor = col;
      ctx.shadowBlur = glow * 0.6;
      for (const [i, j] of connections) {
        const lineAlpha = ep * 0.45;
        if (lineAlpha < 0.015) continue;
        const [ax, ay] = proj(pts[i], cx, cy);
        const [bx, by] = proj(pts[j], cx, cy);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = hexAlpha(col, lineAlpha);
        ctx.stroke();
      }
      ctx.shadowBlur = glow;
      for (let i = 0; i < N; i++) {
        const [px, py, pz] = pts[i];
        const [sx, sy, sc2] = proj([px, py, pz], cx, cy);
        const size = Math.max(0.8, (1.6 + ep * 1.6) * sc2);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(col, baseAlpha);
        ctx.fill();
      }
      if (ep > 0.65) {
        const cAlpha = (ep - 0.65) / 0.35 * 0.35;
        const cR = 22 * ((ep - 0.65) / 0.35);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR);
        grad.addColorStop(0, hexAlpha(col, cAlpha));
        grad.addColorStop(1, hexAlpha(col, 0));
        ctx.fillStyle = grad;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, cR, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "anti-timer-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, width: 240, height: 240, className: "anti-timer-canvas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "anti-timer-overlay", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timer-digits", style: { "--mode-color": modeColor }, children: fmt(remaining) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timer-mode-lbl", children: mode })
    ] })
  ] });
}
const QUOTES = [
  "That session just paid compound interest on your future self.",
  "No pause. No mercy. Full send.",
  "You did the work while they planned to do the work.",
  "The distraction didn't win today. You did.",
  "Every uninterrupted session is proof your brain can be trusted.",
  "Something real was built here. The output proves it.",
  "Locked in. Completely. That's what it looks like.",
  "Your future self just got marginally less chaotic.",
  "25 minutes of actual work beats 3 hours of pretending.",
  "You absolute machine.",
  // roasts
  "Finally. Your idea backlog is still embarrassing, but this helped.",
  "One session completed. Your open tab count remains a crime against RAM.",
  "You focused without pausing. File the incident report.",
  "Technically a win. The bar was on the floor, but you cleared it.",
  "Bold of you to assume one session fixes everything. Start another.",
  "You resisted the urge to switch tabs. Barely, probably. Still counts.",
  "Congratulations on doing the thing you said you'd do. Groundbreaking.",
  "Your brain cooperated this time. Don't get cocky.",
  "The minimum viable focus session. Fortunately, the minimum compounds.",
  "The universe noticed. It's already plotting your next distraction."
];
function randomLoot(sessionMinutes, xpMult) {
  const base = Math.round(sessionMinutes * 1.5);
  const bonus = Math.round(base * (xpMult || 1) * (0.6 + Math.random() * 0.8));
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const tier = sessionMinutes >= 45 ? "EPIC" : sessionMinutes >= 25 ? "RARE" : "UNCOMMON";
  return { bonus, quote, tier };
}
function LootDrop({ sessionMinutes, xpMult, modeLabel, modeColor, onClose, onAwardBonus }) {
  const [loot] = reactExports.useState(() => randomLoot(sessionMinutes, xpMult));
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (onAwardBonus) onAwardBonus(loot.bonus);
    const t2 = setTimeout(() => handleClose(), 7e3);
    return () => clearTimeout(t2);
  }, []);
  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }
  const tierColor = loot.tier === "EPIC" ? "#f59e0b" : loot.tier === "RARE" ? "#818cf8" : "#6ee7b7";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `loot-backdrop${visible ? " visible" : ""}`, onClick: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `loot-card${visible ? " visible" : ""}`,
      style: { "--loot-color": modeColor, "--tier-color": tierColor },
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loot-tier", children: [
          loot.tier,
          " DROP"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loot-mode", style: { color: modeColor }, children: [
          modeLabel || "Focus Session",
          " Complete"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loot-xp", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loot-xp-plus", children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loot-xp-val", children: loot.bonus }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loot-xp-label", children: "BONUS XP" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loot-quote", children: [
          '"',
          loot.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "loot-close", onClick: handleClose, children: "Claim & Continue →" })
      ]
    }
  ) });
}
function hexToRgba(hex, a) {
  const r2 = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r2},${g},${b},${a})`;
}
function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m2 = Math.floor(diff / 6e4);
  if (m2 < 1) return "just now";
  if (m2 < 60) return `${m2}m ago`;
  const h = Math.floor(m2 / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "yesterday" : `${d}d ago`;
}
function IdentityModeSelector({ modes, selected, onSelect, disabled, editMode, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "identity-modes", children: modes.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mode-card-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `mode-card${(selected == null ? void 0 : selected.id) === m2.id ? " active" : ""}`,
        style: { "--mode-color": m2.color, "--mode-glow": m2.glow },
        onClick: () => !disabled && !editMode && onSelect(m2),
        disabled: disabled && !editMode,
        title: `${m2.label} · ${m2.xpMult}× XP`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mode-card-icon", children: m2.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mode-card-name", children: m2.label.split(" ")[0] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mode-card-mult", children: [
            m2.xpMult,
            "×"
          ] })
        ]
      }
    ),
    editMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "mode-delete-btn",
        onClick: () => onDelete(m2.id),
        disabled: modes.length <= 1,
        title: "Remove mode",
        children: "×"
      }
    )
  ] }, m2.id)) });
}
function FocusTimer({ actDomain, setActDomain, domains, timer, sessions, identityModes, addIdentityMode, deleteIdentityMode, addDomain, deleteDomain }) {
  const {
    mode,
    running,
    remaining,
    totalSec,
    focusMinutes,
    identityMode,
    lootPending,
    clearLoot,
    setIdentityMode,
    toggleRunning,
    reset,
    forceFinish,
    adjustFocus,
    selectPreset
  } = timer;
  const [editMode, setEditMode] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({ icon: "", name: "", xpMult: "1.2", color: "#00d9b1", desc: "" });
  const [formErr, setFormErr] = reactExports.useState("");
  const [newDomain, setNewDomain] = reactExports.useState("");
  const [domainErr, setDomainErr] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (identityModes.length > 0 && !identityModes.find((m2) => m2.id === (identityMode == null ? void 0 : identityMode.id))) {
      setIdentityMode(identityModes[0]);
    }
  }, [identityModes]);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const todaySess = sessions.filter((s) => {
    var _a;
    return (_a = s.at) == null ? void 0 : _a.startsWith(today);
  });
  const totalMin = todaySess.reduce((s, x2) => s + (x2.minutes || 0), 0);
  const xpEarned = todaySess.reduce((s, x2) => s + (x2.xpEarned || 15), 0);
  const modeColor = (identityMode == null ? void 0 : identityMode.color) || "#00d9b1";
  const modeId = (identityMode == null ? void 0 : identityMode.id) || "builder";
  const sectionStyle = {
    "--mode-color": modeColor,
    "--mode-glow": (identityMode == null ? void 0 : identityMode.glow) || "rgba(0,217,177,0.35)",
    "--mode-bg": (identityMode == null ? void 0 : identityMode.bg) || "rgba(0,217,177,0.06)",
    "--mode-border": (identityMode == null ? void 0 : identityMode.border) || "rgba(0,217,177,0.22)"
  };
  function handleAddMode() {
    if (!form.name.trim()) {
      setFormErr("Name required");
      return;
    }
    if (!form.icon.trim()) {
      setFormErr("Icon required");
      return;
    }
    const mult = parseFloat(form.xpMult);
    if (isNaN(mult) || mult < 0.5 || mult > 5) {
      setFormErr("XP mult 0.5–5");
      return;
    }
    addIdentityMode({
      id: crypto.randomUUID(),
      label: form.name.trim(),
      icon: form.icon.trim(),
      color: form.color,
      glow: hexToRgba(form.color, 0.35),
      bg: hexToRgba(form.color, 0.06),
      border: hexToRgba(form.color, 0.22),
      desc: form.desc.trim() || "Custom mode",
      xpMult: mult,
      custom: true
    });
    setForm({ icon: "", name: "", xpMult: "1.2", color: "#00d9b1", desc: "" });
    setFormErr("");
  }
  function handleAddDomain() {
    const trimmed = newDomain.trim();
    if (!trimmed) {
      setDomainErr("Name required");
      return;
    }
    if (domains.find((d) => d.name.toLowerCase() === trimmed.toLowerCase())) {
      setDomainErr("Already exists");
      return;
    }
    addDomain(trimmed);
    setNewDomain("");
    setDomainErr("");
  }
  const envClass = (identityMode == null ? void 0 : identityMode.custom) ? "env-custom" : `env-${modeId}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `focus-env-layer ${envClass}${running ? " env-active" : ""}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: `panel timer-section${running ? " mode-active" : ""}`,
        style: sectionStyle,
        "data-mode": modeId,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Focus Timer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `icon ghost mode-edit-toggle${editMode ? " active" : ""}`,
                  onClick: () => {
                    setEditMode((e) => !e);
                    setFormErr("");
                  },
                  title: editMode ? "Done" : "Customize modes",
                  disabled: running,
                  children: editMode ? "✓" : "⊕"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: actDomain, onChange: (e) => setActDomain(e.target.value), style: { width: 108, fontSize: 11 }, children: domains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: d.name }, d.name)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            IdentityModeSelector,
            {
              modes: identityModes,
              selected: identityMode,
              onSelect: setIdentityMode,
              disabled: running,
              editMode,
              onDelete: deleteIdentityMode
            }
          ),
          editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "add-mode-form", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amf-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "amf-icon",
                  value: form.icon,
                  onChange: (e) => setForm((f2) => ({ ...f2, icon: e.target.value })),
                  placeholder: "⚡",
                  maxLength: 2
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "amf-name",
                  value: form.name,
                  onChange: (e) => setForm((f2) => ({ ...f2, name: e.target.value })),
                  placeholder: "Mode name",
                  maxLength: 16
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "number",
                  className: "amf-mult",
                  value: form.xpMult,
                  onChange: (e) => setForm((f2) => ({ ...f2, xpMult: e.target.value })),
                  min: "0.5",
                  max: "5",
                  step: "0.1",
                  title: "XP multiplier"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amf-mult-label", children: "×XP" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  className: "amf-color",
                  value: form.color,
                  onChange: (e) => setForm((f2) => ({ ...f2, color: e.target.value })),
                  title: "Mode color"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amf-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "amf-desc",
                  value: form.desc,
                  onChange: (e) => setForm((f2) => ({ ...f2, desc: e.target.value })),
                  placeholder: "Short description (optional)",
                  maxLength: 32
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary amf-save", onClick: handleAddMode, children: "Add Mode" })
            ] }),
            formErr && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amf-err", children: formErr }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amf-divider" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amf-section", children: "Domains" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amf-domain-list", children: domains.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amf-domain-chip", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "amf-domain-del",
                  onClick: () => {
                    var _a;
                    if (d.name === actDomain) setActDomain(((_a = domains.find((x2) => x2.name !== d.name)) == null ? void 0 : _a.name) || d.name);
                    deleteDomain(d.name);
                  },
                  disabled: domains.length <= 1,
                  title: "Remove domain",
                  children: "×"
                }
              )
            ] }, d.name)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amf-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "amf-name",
                  value: newDomain,
                  onChange: (e) => setNewDomain(e.target.value),
                  onKeyDown: (e) => e.key === "Enter" && handleAddDomain(),
                  placeholder: "New domain name",
                  maxLength: 20
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary amf-save", onClick: handleAddDomain, children: "Add" })
            ] }),
            domainErr && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amf-err", children: domainErr })
          ] }),
          identityMode && !editMode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mode-banner", style: { "--mode-color": modeColor, "--mode-bg": identityMode.bg, "--mode-border": identityMode.border }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mode-banner-icon", children: identityMode.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mode-banner-text", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mode-banner-name", children: identityMode.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mode-banner-desc", children: identityMode.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mode-banner-mult", children: [
              identityMode.xpMult,
              "× XP"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "timer-presets", children: FOCUS_PRESETS.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: `t-preset${focusMinutes === m2 ? " active" : ""}`,
              disabled: running,
              onClick: () => selectPreset(m2),
              children: [
                m2,
                "m"
              ]
            },
            m2
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            AntiTimer,
            {
              remaining,
              totalSeconds: totalSec,
              modeColor,
              running,
              mode
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timer-adjust", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "adj-btn ghost", disabled: running || focusMinutes <= 5, onClick: () => adjustFocus(-5), children: "−" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "timer-adj-lbl", children: [
              focusMinutes,
              " min"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "adj-btn ghost", disabled: running || focusMinutes >= 90, onClick: () => adjustFocus(5), children: "+" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "timer-controls", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "primary",
                style: { background: `linear-gradient(135deg, ${modeColor}, ${modeColor}cc)`, borderColor: modeColor, boxShadow: `0 0 24px ${(identityMode == null ? void 0 : identityMode.glow) || "rgba(0,217,177,0.35)"}` },
                onClick: toggleRunning,
                children: running ? "⏸ Pause" : "▶ Start"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: forceFinish, children: "Finish" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon ghost", title: "Reset", onClick: reset, children: "↺" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "focus-log", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fl-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fl-val", children: todaySess.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fl-lbl", children: "sessions" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fl-div" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fl-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fl-val", children: totalMin }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fl-lbl", children: "min today" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fl-div" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fl-item", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fl-val", style: { color: modeColor }, children: [
                "+",
                xpEarned
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fl-lbl", children: "XP today" })
            ] })
          ] }),
          sessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "session-log-header", children: "Session Log" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "session-log", children: sessions.slice(0, 25).map((s) => {
              const mData = identityModes.find((m2) => m2.id === s.identityMode);
              const mCol = (mData == null ? void 0 : mData.color) || "#6b7280";
              const mIcon = (mData == null ? void 0 : mData.icon) || "◉";
              const mLabel = mData ? mData.label.split(" ")[0] : s.identityMode || "—";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "session-item", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "si-mode", style: { color: mCol }, children: mIcon }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "si-label", style: { color: mCol }, children: mLabel }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "si-domain", children: s.domain }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "si-dur", children: [
                  s.minutes,
                  "m"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "si-xp", style: { color: mCol }, children: [
                  "+",
                  s.xpEarned || 15,
                  " XP"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "si-time", children: relTime(s.at) })
              ] }, s.id);
            }) })
          ] })
        ]
      }
    ),
    lootPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LootDrop,
      {
        sessionMinutes: focusMinutes,
        xpMult: (identityMode == null ? void 0 : identityMode.xpMult) || 1,
        modeLabel: identityMode == null ? void 0 : identityMode.label,
        modeColor,
        onClose: clearLoot
      }
    )
  ] });
}
function FocusView({ actDomain, setActDomain, domains, timer, sessions, identityModes, addIdentityMode, deleteIdentityMode, addDomain, deleteDomain }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "focus-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "FOCUS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-hint", children: "Select a mode, set your time, lock in" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FocusTimer,
      {
        actDomain,
        setActDomain,
        domains,
        timer,
        sessions,
        identityModes,
        addIdentityMode,
        deleteIdentityMode,
        addDomain,
        deleteDomain
      }
    )
  ] });
}
const TIMER_SECS = 8;
function TriageComplete({ stats, onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "triage-backdrop", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-complete", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "triage-complete-icon", children: "⚡" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "triage-complete-title", children: "Backlog Cleared" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "triage-complete-sub", children: "You actually did it." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-complete-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tcs-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-val", children: stats.kept }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-lbl", children: "kept" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tcs-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-val tcs-archived", children: stats.archived }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-lbl", children: "archived" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tcs-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-val tcs-focused", children: stats.focused }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tcs-lbl", children: "focused" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: onClose, children: "Back to Stream" })
  ] }) });
}
function TriageMode({ thoughts, updateThought, onClose, onStartFocus }) {
  const [index, setIndex] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("idle");
  const [timeLeft, setTimeLeft] = reactExports.useState(TIMER_SECS);
  const [stats, setStats] = reactExports.useState({ kept: 0, archived: 0, focused: 0 });
  const timerRef = reactExports.useRef(null);
  const phaseRef = reactExports.useRef("idle");
  phaseRef.current = phase;
  const queue = thoughts;
  const thought = queue[index];
  const color = thought ? DOMAIN_COLOR[thought.domain] || "var(--accent)" : "var(--accent)";
  const radius = 44;
  const circ = 2 * Math.PI * radius;
  const advance = reactExports.useCallback((direction, extraAction) => {
    if (phaseRef.current !== "idle") return;
    clearInterval(timerRef.current);
    setPhase("exit-" + direction);
    extraAction == null ? void 0 : extraAction();
    setTimeout(() => {
      setIndex((i) => i + 1);
      setPhase("idle");
      setTimeLeft(TIMER_SECS);
    }, 360);
  }, []);
  const handleKeep = reactExports.useCallback(() => {
    advance("right", () => setStats((s) => ({ ...s, kept: s.kept + 1 })));
  }, [advance]);
  const handleArchive = reactExports.useCallback(() => {
    if (!thought) return;
    advance("left", () => {
      updateThought(thought.id, { done: true, completedAt: (/* @__PURE__ */ new Date()).toISOString() });
      setStats((s) => ({ ...s, archived: s.archived + 1 }));
    });
  }, [advance, thought, updateThought]);
  const handleFocus = reactExports.useCallback(() => {
    if (!thought) return;
    advance("up", () => {
      updateThought(thought.id, { priority: "high" });
      setStats((s) => ({ ...s, focused: s.focused + 1 }));
      setTimeout(() => {
        onClose();
        onStartFocus();
      }, 420);
    });
  }, [advance, thought, updateThought, onClose, onStartFocus]);
  reactExports.useEffect(() => {
    if (!thought) return;
    setTimeLeft(TIMER_SECS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t2) => {
        if (t2 <= 1) {
          clearInterval(timerRef.current);
          handleKeep();
          return TIMER_SECS;
        }
        return t2 - 1;
      });
    }, 1e3);
    return () => clearInterval(timerRef.current);
  }, [index]);
  reactExports.useEffect(() => {
    const h = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
      if (e.key === "ArrowRight" || e.key === "d") handleKeep();
      if (e.key === "ArrowLeft" || e.key === "a") handleArchive();
      if (e.key === "ArrowUp" || e.key === "w") handleFocus();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleKeep, handleArchive, handleFocus, onClose]);
  if (!thought || index >= queue.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TriageComplete, { stats, onClose });
  }
  const timerFrac = timeLeft / TIMER_SECS;
  const urgentColor = timeLeft <= 3 ? "#f87171" : color;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-backdrop", onClick: (e) => e.target === e.currentTarget && onClose(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "triage-title", children: "HYPER-TRIAGE" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "triage-count", style: { color }, children: [
        index + 1,
        " / ",
        queue.length
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon ghost", style: { fontSize: 16 }, onClick: onClose, children: "✕" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "triage-progress-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "triage-progress-fill",
        style: { width: `${index / queue.length * 100}%`, background: color }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-timer-ring", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "100", height: "100", viewBox: "0 0 100 100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "50", r: radius, fill: "none", stroke: "rgba(255,255,255,0.06)", strokeWidth: "3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "50",
            cy: "50",
            r: radius,
            fill: "none",
            stroke: urgentColor,
            strokeWidth: "3",
            strokeDasharray: circ,
            strokeDashoffset: circ * (1 - timerFrac),
            strokeLinecap: "round",
            transform: "rotate(-90 50 50)",
            style: { transition: "stroke-dashoffset 1s linear, stroke 0.4s ease" }
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "triage-timer-num", style: { color: urgentColor }, children: timeLeft })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `triage-card${phase !== "idle" ? ` triage-${phase}` : " triage-enter"}`,
        style: { "--tc": color },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tc-domain", style: { color }, children: thought.domain }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "tc-text", children: thought.text }),
          thought.insight && thought.insight !== "Classifying…" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "tc-insight", children: thought.insight }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tc-pills", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pill typ", children: thought.type }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `pill ${thought.priority}`, children: thought.priority }),
            (thought.tags || []).slice(0, 3).map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pill", children: [
              "#",
              tag
            ] }, tag))
          ] })
        ]
      },
      thought.id
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "triage-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "triage-btn triage-btn-left", onClick: handleArchive, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-key", children: "←" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-label", children: "Archive" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "triage-btn triage-btn-up", onClick: handleFocus, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-key", children: "↑" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-label", children: "Focus" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "triage-btn triage-btn-right", onClick: handleKeep, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-key", children: "→" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tba-label", children: "Keep" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "triage-hint", children: "arrow keys · auto-keeps on timeout" })
  ] });
}
function ThoughtsView({
  visible,
  done,
  domainList,
  search,
  setSearch,
  domF,
  setDomF,
  typeF,
  setTypeF,
  priF,
  setPriF,
  showDone,
  setShowDone,
  updateThought,
  deleteThought,
  onStartFocus
}) {
  const [filterVersion, setFilterVersion] = reactExports.useState(0);
  const [exiting, setExiting] = reactExports.useState([]);
  const [triageOpen, setTriageOpen] = reactExports.useState(false);
  const prevVisibleRef = reactExports.useRef(visible);
  const exitTimerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const prev = prevVisibleRef.current;
    prevVisibleRef.current = visible;
    const leaving = prev.filter((t2) => !visible.some((x2) => x2.id === t2.id));
    if (!leaving.length) return;
    clearTimeout(exitTimerRef.current);
    setExiting(leaving);
    exitTimerRef.current = setTimeout(() => setExiting([]), 400);
    return () => clearTimeout(exitTimerRef.current);
  }, [visible]);
  function handleDomF(v2) {
    setDomF(v2);
    setFilterVersion((fv) => fv + 1);
  }
  function handleTypeF(v2) {
    setTypeF(v2);
    setFilterVersion((fv) => fv + 1);
  }
  function handlePriF(v2) {
    setPriF(v2);
    setFilterVersion((fv) => fv + 1);
  }
  const activeThoughtsForTriage = visible.filter((t2) => !t2.done);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thoughts-view", children: [
    triageOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      TriageMode,
      {
        thoughts: activeThoughtsForTriage,
        updateThought,
        onClose: () => setTriageOpen(false),
        onStartFocus
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "THOUGHTS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "thoughts-count view-hint", children: [
        visible.length,
        " thought",
        visible.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "thoughts-filters", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "search-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "thoughts-search",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search thoughts, tags, insights…"
          }
        ),
        activeThoughtsForTriage.length >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "triage-trigger",
            onClick: () => setTriageOpen(true),
            title: "Hyper-Triage: clear your backlog fast",
            children: "⚡ Triage"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filters", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `chip${domF === "All" ? " active" : ""}`,
              onClick: () => handleDomF("All"),
              children: "All"
            }
          ),
          (domainList || []).map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `chip${domF === d ? " active" : ""}`,
              onClick: () => handleDomF(d),
              children: d
            },
            d
          ))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-selects", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: typeF, onChange: (e) => handleTypeF(e.target.value), children: TYPE_OPTS.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: t2 }, t2)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: priF, onChange: (e) => handlePriF(e.target.value), children: PRIORITY_OPTS.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: p2 }, p2)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stream", children: [
      exiting.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThoughtCard,
        {
          thought: t2,
          updateThought,
          deleteThought,
          isExiting: true
        },
        t2.id + "-exit"
      )),
      visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty", children: [
        "Nothing matches this view.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Capture something raw or loosen the filters."
      ] }) : visible.map((t2, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThoughtCard,
        {
          thought: t2,
          index: i,
          updateThought,
          deleteThought
        },
        t2.id + "-" + filterVersion
      ))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "archive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "ghost",
          style: { fontSize: 12, color: "var(--muted)", width: "100%", textAlign: "left" },
          onClick: () => setShowDone(!showDone),
          children: [
            showDone ? "▾" : "▸",
            " Archived (",
            done.length,
            ")"
          ]
        }
      ),
      showDone && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stream", style: { marginTop: 8 }, children: done.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThoughtCard,
        {
          thought: t2,
          updateThought,
          deleteThought
        },
        t2.id
      )) })
    ] })
  ] });
}
function QuestsPanel({ quests }) {
  const done = quests.list.filter((q2) => q2.completed).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Daily Quests" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "quest-date", children: [
          done,
          "/",
          quests.list.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: todayStr() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quest-list", children: [
      quests.list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", style: { padding: "16px 12px" }, children: "Loading quests…" }),
      quests.list.map((q2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `quest-card${q2.completed ? " done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quest-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "quest-title", children: q2.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "quest-xp", children: [
            "+",
            q2.xpReward,
            " XP"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quest-desc", children: q2.desc }),
        q2.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quest-done-txt", children: "✓ Complete!" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quest-prog-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "quest-prog-fill", style: { width: `${Math.min(100, q2.progress / q2.goal * 100)}%` } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quest-prog-label", children: [
            q2.progress,
            " / ",
            q2.goal
          ] })
        ] })
      ] }, q2.id))
    ] })
  ] });
}
const DEFAULT_PHASES = [
  { name: "Research & Prep", xpReward: 50 },
  { name: "First Real Attack", xpReward: 80 },
  { name: "Deep Work Assault", xpReward: 120 },
  { name: "Break Through", xpReward: 150 },
  { name: "Final Strike", xpReward: 200 }
];
function BossBattles({ bosses, onAdd, onCompletePhase, onDelete }) {
  const [showForm, setShowForm] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [domain, setDomain] = reactExports.useState("Learning");
  const [phaseCount, setPhaseCount] = reactExports.useState(3);
  const [defeated, setDefeated] = reactExports.useState(null);
  const activeBosses = bosses.filter((b) => !b.defeated);
  const defeatedBosses = bosses.filter((b) => b.defeated);
  function handleAdd() {
    if (!name.trim()) return;
    const phases = DEFAULT_PHASES.slice(0, phaseCount).map((p2, i) => ({
      id: crypto.randomUUID(),
      name: p2.name,
      xpReward: p2.xpReward,
      done: false,
      index: i
    }));
    onAdd({ name: name.trim(), domain, phases });
    setName("");
    setShowForm(false);
  }
  function handlePhase(bossId, phaseId, e) {
    const boss = bosses.find((b) => b.id === bossId);
    if (!boss) return;
    const isLastPhase = boss.phases.filter((p2) => !p2.done).length === 1;
    onCompletePhase(bossId, phaseId, e);
    if (isLastPhase) {
      setDefeated(bossId);
      setTimeout(() => setDefeated(null), 3200);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Boss Battles" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "ghost",
          style: { fontSize: 11, padding: "4px 10px" },
          onClick: () => setShowForm(!showForm),
          children: showForm ? "✕" : "+ New Boss"
        }
      )
    ] }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-form", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: name,
          onChange: (e) => setName(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleAdd(),
          placeholder: "Name your nemesis… (e.g. Launch MVP)",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-form-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: domain, onChange: (e) => setDomain(e.target.value), children: DOMAINS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: d }, d)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: phaseCount, onChange: (e) => setPhaseCount(Number(e.target.value)), children: [3, 4, 5].map((n2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: n2, children: [
          n2,
          " phases"
        ] }, n2)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", onClick: handleAdd, disabled: !name.trim(), children: "Summon" })
      ] })
    ] }),
    bosses.length === 0 && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", style: { padding: "20px 0 8px" }, children: "No bosses yet. Summon an intimidating goal and fight it phase by phase." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-list", children: [
      activeBosses.map((boss) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        BossCard,
        {
          boss,
          isDefeating: defeated === boss.id,
          onPhase: handlePhase,
          onDelete
        },
        boss.id
      )),
      defeatedBosses.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }, children: [
        "⚔ ",
        defeatedBosses.length,
        " defeated"
      ] }) })
    ] })
  ] });
}
function BossCard({ boss, isDefeating, onPhase, onDelete }) {
  const [expanded, setExpanded] = reactExports.useState(true);
  const color = DOMAIN_COLOR[boss.domain] || "#00d9b1";
  const total = boss.phases.length;
  const done = boss.phases.filter((p2) => p2.done).length;
  const hp = Math.round((total - done) / total * 100);
  const hpColor = hp > 60 ? "#f87171" : hp > 30 ? "#fbbf24" : "#4ade80";
  const nextPhase = boss.phases.find((p2) => !p2.done);
  const totalXp = boss.phases.reduce((s, p2) => s + p2.xpReward, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `boss-card${boss.defeated ? " boss-defeated" : ""}${isDefeating ? " boss-defeating" : ""}`, style: { "--boss-color": color, "--hp-color": hpColor }, children: [
    isDefeating && /* @__PURE__ */ jsxRuntimeExports.jsx(DefeatedOverlay, { bossName: boss.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-header", onClick: () => setExpanded(!expanded), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "boss-skull", children: "⚔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "boss-name", children: boss.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "boss-domain-tag", style: { color }, children: boss.domain })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-header-right", children: [
        !boss.defeated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-hp-mini", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "boss-hp-num", style: { color: hpColor }, children: [
            hp,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-hp-label", children: "HP" })
        ] }),
        boss.defeated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-defeated-badge", children: "DEFEATED" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-chevron", children: expanded ? "▾" : "▸" })
      ] })
    ] }),
    !boss.defeated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-hp-bar-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "boss-hp-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "boss-hp-fill",
          style: { width: `${hp}%`, background: hpColor, boxShadow: `0 0 12px ${hpColor}88` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "boss-hp-phases", children: [
        done,
        "/",
        total,
        " phases"
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-phases", children: [
      boss.phases.map((phase, i) => {
        const isActive = !boss.defeated && phase.id === (nextPhase == null ? void 0 : nextPhase.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `boss-phase${phase.done ? " done" : ""}${isActive ? " active" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "boss-phase-check",
              disabled: !isActive,
              onClick: (e) => isActive && onPhase(boss.id, phase.id, e),
              style: { "--pc": color },
              children: phase.done ? "✓" : isActive ? "○" : "–"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-phase-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "boss-phase-num", children: [
              "Phase ",
              i + 1
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-phase-name", children: phase.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "boss-phase-xp", children: [
            "+",
            phase.xpReward
          ] })
        ] }, phase.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "6px 12px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }, children: [
          "◆ ",
          totalXp,
          " XP total"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost", style: { fontSize: 11, color: "var(--muted)", padding: "3px 8px" }, onClick: () => onDelete(boss.id), children: "✕" })
      ] })
    ] })
  ] });
}
function DefeatedOverlay({ bossName }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      r: Math.random() * 4 + 1,
      color: ["#fbbf24", "#f87171", "#00d9b1", "#a78bfa", "#fb923c"][Math.floor(Math.random() * 5)],
      life: 1
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p2) => {
        p2.x += p2.vx;
        p2.y += p2.vy;
        p2.vy += 0.18;
        p2.life -= 0.018;
        ctx.globalAlpha = Math.max(0, p2.life);
        ctx.fillStyle = p2.color;
        ctx.beginPath();
        ctx.arc(p2.x, p2.y, p2.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (particles.some((p2) => p2.life > 0)) raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-defeat-overlay", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "boss-defeat-canvas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "boss-defeat-text", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-defeat-icon", children: "⚔" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-defeat-label", children: "DEFEATED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boss-defeat-name", children: bossName })
    ] })
  ] });
}
const DOMAIN_KEYWORDS = {
  "AI/ML": ["machine learning", "ai", "neural", "model", "data", "python", "llm", "deep learning", "gpt", "transformer"],
  "Writing": ["write", "writing", "blog", "essay", "story", "book", "content", "article", "journal", "prose"],
  "Business": ["business", "startup", "revenue", "market", "product", "launch", "sales", "growth", "strategy", "monetize"],
  "Design": ["design", "ui", "ux", "visual", "figma", "brand", "logo", "interface", "aesthetic", "color"],
  "Physics": ["physics", "math", "quantum", "calculus", "science", "research", "formula", "theory", "mechanics"],
  "Health": ["health", "fitness", "workout", "diet", "sleep", "nutrition", "exercise", "run", "gym", "meditation"],
  "Learning": ["learn", "study", "course", "read", "book", "skill", "practice", "understand", "master", "knowledge"],
  "Life": ["life", "habit", "routine", "goal", "mindset", "productivity", "focus", "balance", "purpose", "values"]
};
function inferDomain(goal) {
  const lower = goal.toLowerCase();
  let best = "Learning", bestScore = 0;
  for (const [domain, kw] of Object.entries(DOMAIN_KEYWORDS)) {
    const score = kw.filter((k2) => lower.includes(k2)).length;
    if (score > bestScore) {
      best = domain;
      bestScore = score;
    }
  }
  return best;
}
const QUEST_TEMPLATES = [
  { phase: "Foundation", titleFn: (g) => `Research: ${g.slice(0, 30)}`, descFn: (g) => `Gather foundational knowledge and resources for "${g}".`, xp: 50 },
  { phase: "Plan", titleFn: (g) => "Build Your Roadmap", descFn: (g) => `Break down "${g}" into concrete milestones and write them out.`, xp: 60 },
  { phase: "First Step", titleFn: (g) => "Take the First Real Action", descFn: (g) => `Complete one tangible action toward "${g}" — no planning, doing.`, xp: 80 },
  { phase: "Deep Work", titleFn: (g) => "First Deep Work Session", descFn: (g) => `Spend 90+ min in focused work on "${g}".`, xp: 100 },
  { phase: "Checkpoint", titleFn: (g) => "Reflect & Adjust", descFn: (g) => `Review progress on "${g}". What's working? What needs changing?`, xp: 70 },
  { phase: "Level Up", titleFn: (g) => "Share or Ship Something", descFn: (g) => `Produce a visible output for "${g}" — post, demo, or artifact.`, xp: 150 }
];
function localGenerateQuestline(goal) {
  const domain = inferDomain(goal);
  return {
    domain,
    quests: QUEST_TEMPLATES.map((t2, i) => ({
      id: crypto.randomUUID(),
      phase: t2.phase,
      title: t2.titleFn(goal),
      desc: t2.descFn(goal),
      xpReward: t2.xp,
      done: false,
      index: i
    }))
  };
}
async function generateQuestlineWithClaude(goal, apiKey) {
  var _a, _b;
  const domain = inferDomain(goal);
  const prompt = `You are a game quest designer for POLYMATH OS — an ADHD-focused life gamification app.

The user's goal: "${goal}"
Inferred domain: ${domain}

Generate a structured questline of 5 quests that guides the user step-by-step from complete beginner to visible achievement of this goal. Each quest should be concrete, actionable, and dopamine-friendly (small wins building to big wins).

Return ONLY valid JSON with this exact structure:
{
  "domain": "${domain}",
  "quests": [
    {
      "phase": "Phase name (e.g. Foundation, Deep Dive, First Build, etc.)",
      "title": "Short quest title (max 40 chars)",
      "desc": "One concrete sentence — what exactly to do",
      "xpReward": 50
    }
  ]
}

XP rewards should range 40–150 based on difficulty/effort. No markdown, no explanation, just the JSON.`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error("Claude API error");
  const data = await res.json();
  const text = ((_b = (_a = data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) || "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON in response");
  const parsed = JSON.parse(jsonMatch[0]);
  const dom = DOMAINS.includes(parsed.domain) ? parsed.domain : domain;
  return {
    domain: dom,
    quests: (parsed.quests || []).map((q2, i) => ({
      id: crypto.randomUUID(),
      phase: q2.phase || `Phase ${i + 1}`,
      title: q2.title || "Quest",
      desc: q2.desc || "",
      xpReward: Math.min(200, Math.max(20, q2.xpReward || 60)),
      done: false,
      index: i
    }))
  };
}
function QuestGenerator({ questlines, apiKey, onGenerate, onCompleteQuest, onDeleteQuestline }) {
  const [goal, setGoal] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(null);
  async function handleGenerate() {
    if (!goal.trim() || loading) return;
    setLoading(true);
    try {
      let result;
      if (apiKey) {
        result = await generateQuestlineWithClaude(goal.trim(), apiKey);
      } else {
        result = localGenerateQuestline(goal.trim());
      }
      onGenerate({ goal: goal.trim(), ...result });
      setGoal("");
    } catch {
      const fallback = localGenerateQuestline(goal.trim());
      onGenerate({ goal: goal.trim(), ...fallback });
      setGoal("");
    } finally {
      setLoading(false);
    }
  }
  const activeLines = questlines.filter((ql2) => !ql2.completed);
  const doneLines = questlines.filter((ql2) => ql2.completed);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Quest Generator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", style: { background: "rgba(139,92,246,0.18)", color: "#a78bfa", borderColor: "rgba(139,92,246,0.3)" }, children: "AI" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "qgen-input-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: goal,
          onChange: (e) => setGoal(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleGenerate(),
          placeholder: "Enter a goal… (e.g. learn machine learning)",
          disabled: loading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "primary",
          onClick: handleGenerate,
          disabled: !goal.trim() || loading,
          style: { minWidth: 110, fontSize: 12 },
          children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "qgen-loading", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "qgen-dot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "qgen-dot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "qgen-dot" })
          ] }) : apiKey ? "✦ Generate" : "⚒ Build"
        }
      )
    ] }),
    !apiKey && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: 11, color: "var(--muted)", marginTop: 6 }, children: "No API key — using local quest templates." }),
    questlines.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty", style: { padding: "20px 0 8px" }, children: "Set a goal above — AI will craft a questline to get you there." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "questline-list", children: [
      activeLines.map((ql2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuestlineCard,
        {
          ql: ql2,
          expanded: expanded === ql2.id,
          onToggle: () => setExpanded(expanded === ql2.id ? null : ql2.id),
          onCompleteQuest,
          onDelete: onDeleteQuestline
        },
        ql2.id
      )),
      doneLines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "questline-done-section", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontSize: 11, color: "var(--muted)", fontFamily: "var(--mono)" }, children: [
        "✓ ",
        doneLines.length,
        " completed questline",
        doneLines.length > 1 ? "s" : ""
      ] }) })
    ] })
  ] });
}
function QuestlineCard({ ql: ql2, expanded, onToggle, onCompleteQuest, onDelete }) {
  const color = DOMAIN_COLOR[ql2.domain] || "#00d9b1";
  const total = ql2.quests.length;
  const done = ql2.quests.filter((q2) => q2.done).length;
  const pct = total > 0 ? done / total * 100 : 0;
  const nextQ = ql2.quests.find((q2) => !q2.done);
  const totalXp = ql2.quests.reduce((s, q2) => s + q2.xpReward, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `questline-card${ql2.completed ? " ql-done" : ""}`, style: { "--ql-color": color }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "questline-header", onClick: onToggle, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "questline-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-domain-dot", style: { background: color, boxShadow: `0 0 8px ${color}55` } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-goal", children: ql2.goal }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ql-meta", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-domain", children: ql2.domain }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ql-xp-total", children: [
              "◆ ",
              totalXp,
              " XP total"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "questline-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ql-progress-label", children: [
          done,
          "/",
          total
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-chevron", children: expanded ? "▾" : "▸" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-prog-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-prog-fill", style: { width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` } }) }),
    !expanded && nextQ && !ql2.completed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ql-next-hint", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-next-phase", children: nextQ.phase }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ql-next-title", children: [
        "→ ",
        nextQ.title
      ] })
    ] }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ql-quests", children: [
      ql2.quests.map((q2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ql-quest-item${q2.done ? " done" : ""}${i === ql2.quests.findIndex((x2) => !x2.done) ? " active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ql-quest-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ql-quest-check", onClick: (e) => !q2.done && onCompleteQuest(ql2.id, q2.id, e), children: q2.done ? "✓" : "○" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-quest-phase", children: q2.phase }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-quest-title", children: q2.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-quest-desc", children: q2.desc })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ql-quest-xp", children: [
          "+",
          q2.xpReward
        ] })
      ] }, q2.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ql-card-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "ghost", style: { fontSize: 11, color: "var(--muted)", padding: "4px 8px" }, onClick: () => onDelete(ql2.id), children: "✕ Remove" }) })
    ] })
  ] });
}
function TaskBoardPanel({ tasks, onAdd, onComplete, onDelete }) {
  const [adding, setAdding] = reactExports.useState(false);
  const [title, setTitle] = reactExports.useState("");
  const [tier, setTier] = reactExports.useState("common");
  const [domain, setDomain] = reactExports.useState("Life");
  const active = tasks.filter((t2) => !t2.done);
  const doneToday = tasks.filter((t2) => {
    var _a;
    return t2.done && ((_a = t2.completedAt) == null ? void 0 : _a.startsWith(todayStr()));
  }).length;
  function handleAdd() {
    if (!title.trim()) return;
    onAdd(title.trim(), tier, domain);
    setTitle("");
    setAdding(false);
    setTier("common");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Quest Board" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
        doneToday > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge", style: { color: "var(--accent)", borderColor: "rgba(0,217,177,0.3)" }, children: [
          doneToday,
          " done"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "icon ghost",
            style: { color: "var(--accent)", fontSize: 18 },
            onClick: () => setAdding(!adding),
            title: "Add quest",
            children: adding ? "×" : "+"
          }
        )
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-add-form", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: title,
          onChange: (e) => setTitle(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleAdd(),
          placeholder: "Quest title…",
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tier-chips", children: ["common", "rare", "epic"].map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: `tier-chip ${t2}${tier === t2 ? " active" : ""}`, onClick: () => setTier(t2), children: [
        t2,
        " +",
        TIER_XP[t2],
        "xp"
      ] }, t2)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: domain, onChange: (e) => setDomain(e.target.value), style: { fontSize: 12 }, children: DOMAINS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: d }, d)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "primary", style: { whiteSpace: "nowrap", padding: "9px 16px" }, onClick: handleAdd, children: "Add →" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "taskboard-list", children: [
      active.length === 0 && !adding && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty", style: { padding: "14px 12px" }, children: [
        "No active quests.",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        "Hit + to add one."
      ] }),
      active.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `task-card ${t2.tier}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-card-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tier-badge ${t2.tier}`, children: t2.tier }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "task-title", children: t2.title })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `tier-xp ${t2.tier}`, style: { fontFamily: "var(--mono)", fontSize: 10, marginRight: 2 }, children: [
              "+",
              TIER_XP[t2.tier]
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "icon",
                style: { color: "var(--accent)" },
                title: "Complete",
                onClick: (e) => onComplete(t2.id, e),
                children: "✓"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon danger", title: "Delete", onClick: () => onDelete(t2.id), children: "×" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "task-meta", children: t2.domain })
      ] }, t2.id)),
      tasks.filter((t2) => t2.done).slice(0, 3).map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `task-card ${t2.tier} done`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-card-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "task-left", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tier-badge ${t2.tier}`, children: t2.tier }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "task-title", children: t2.title })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "icon danger", title: "Remove", onClick: () => onDelete(t2.id), children: "×" })
      ] }) }, t2.id))
    ] })
  ] });
}
function QuestsView({ game }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quests-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-header", style: { gridColumn: "1 / -1" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "QUESTS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-hint", children: "Daily missions, boss battles, and generated questlines" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quests-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(QuestsPanel, { quests: game.state.quests }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TaskBoardPanel,
        {
          tasks: game.state.taskBoard || [],
          onAdd: game.addTask,
          onComplete: game.completeTask,
          onDelete: game.deleteTask
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "quests-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        BossBattles,
        {
          bosses: game.state.bosses || [],
          onAdd: game.addBoss,
          onCompletePhase: game.completeBossPhase,
          onDelete: game.deleteBoss
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        QuestGenerator,
        {
          questlines: game.state.questlines || [],
          apiKey: game.state.apiKey,
          onGenerate: game.addQuestline,
          onCompleteQuest: game.completeQuestlineQuest,
          onDeleteQuestline: game.deleteQuestline
        }
      )
    ] })
  ] });
}
function DomainsPanel({ domains, xp, domF, setDomF, totalCount }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Domains" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: totalCount })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "domain-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `domain-tile${domF === "All" ? " active" : ""}`,
          style: { "--dc": "rgba(255,255,255,0.45)" },
          onClick: () => setDomF("All"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "domain-tile-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "All" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "domain-count", children: [
              totalCount,
              " captured"
            ] })
          ]
        }
      ),
      domains.map((d) => {
        const lv = xpToLevel((xp == null ? void 0 : xp[d.name]) || 0);
        const prog = xpInLevel((xp == null ? void 0 : xp[d.name]) || 0);
        const col = DOMAIN_COLOR[d.name] || "var(--accent)";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `domain-tile${domF === d.name ? " active" : ""}`,
            style: { "--dc": col },
            onClick: () => setDomF(d.name),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "domain-tile-top", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: d.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "level-badge", style: { "--dc": col }, children: [
                  "Lv.",
                  lv
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "domain-count", children: [
                d.count,
                " captured"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xp-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xp-fill", style: { width: `${prog / XP_PER_LEVEL * 100}%`, "--dc": col } }) })
            ]
          },
          d.name
        );
      })
    ] })
  ] });
}
function CharacterSheet({ xp }) {
  const score = polymathScore(xp);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Character Sheet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: "RPG" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-stats", children: CHAR_STATS.map((stat) => {
      const lvls = stat.domains.map((d) => xpToLevel((xp == null ? void 0 : xp[d]) || 0));
      const avgLv = Math.round((lvls[0] + lvls[1]) / 2);
      const pct = Math.min(100, avgLv / 10 * 100);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "char-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-key", style: { "--c": stat.color }, children: stat.key }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-label", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-domains", children: stat.domains.join(" · ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-bar-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "char-bar-fill",
              style: { width: `${pct}%`, background: stat.color, boxShadow: `0 0 8px ${stat.color}` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "char-level", style: { color: stat.color }, children: avgLv })
      ] }, stat.key);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ps-line", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Polymath Score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: score.toLocaleString() })
    ] })
  ] });
}
function AchievementsPanel({ unlockedIds }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Achievements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge", children: [
        unlockedIds.length,
        "/",
        ACHIEVEMENTS.length
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ach-grid", children: ACHIEVEMENTS.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `ach-badge${unlockedIds.includes(a.id) ? " unlocked" : " locked"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ach-icon", children: a.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ach-title", children: a.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ach-tip", children: a.desc })
    ] }, a.id)) })
  ] });
}
function EnergyCheckin({ energyLog, onSet }) {
  const today = todayStr();
  const todayE = energyLog.find((e) => e.date === today);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "energy-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "energy-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "energy-label", children: "Energy today" }),
      todayE && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "energy-status", children: [
        ENERGY_LEVELS[todayE.level - 1].emoji,
        " ",
        ENERGY_LEVELS[todayE.level - 1].label
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "energy-btns", children: ENERGY_LEVELS.map((l2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `energy-btn${(todayE == null ? void 0 : todayE.level) === l2.level ? " active" : ""}`,
        style: { "--ec": l2.color, "--ec-g": l2.glow },
        onClick: () => onSet(l2.level),
        title: l2.label,
        children: l2.emoji
      },
      l2.level
    )) })
  ] });
}
function HabitStack({ habits, onToggle, onAdd, energyLog, onSetEnergy }) {
  const [newH, setNewH] = reactExports.useState("");
  const today = todayStr();
  const doneCount = habits.filter((h) => h.dates.includes(today)).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Habit Stack" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "badge",
          style: doneCount === habits.length && habits.length > 0 ? { color: "var(--accent)", borderColor: "rgba(0,217,177,0.3)" } : {},
          children: [
            doneCount,
            "/",
            habits.length
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "habit-list", children: habits.map((h) => {
      const done = h.dates.includes(today);
      const streak = getHabitStreak(h.dates);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `habit-item${done ? " done" : ""}`, onClick: (e) => onToggle(h.id, e), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "habit-check", children: done ? "✓" : "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "habit-name", children: h.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "habit-streak", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "habit-streak-num", style: { color: streak > 0 ? "var(--accent)" : "var(--muted)" }, children: streak }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "habit-streak-lbl", children: [
            "day",
            streak !== 1 ? "s" : ""
          ] })
        ] })
      ] }, h.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mini-form", style: { marginTop: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          value: newH,
          onChange: (e) => setNewH(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter" && newH.trim()) {
              onAdd(newH.trim());
              setNewH("");
            }
          },
          placeholder: "Add habit…"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        if (newH.trim()) {
          onAdd(newH.trim());
          setNewH("");
        }
      }, children: "Add" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EnergyCheckin, { energyLog, onSet: onSetEnergy })
  ] });
}
function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 864e5);
    return d.toISOString().split("T")[0];
  });
}
function domainScore(domain, thoughts, taskBoard, sessions, days) {
  const captures = thoughts.filter((t2) => t2.domain === domain && days.some((d) => {
    var _a;
    return (_a = t2.createdAt) == null ? void 0 : _a.startsWith(d);
  })).length;
  const tasks = (taskBoard || []).filter((t2) => t2.domain === domain && days.some((d) => {
    var _a;
    return (_a = t2.completedAt) == null ? void 0 : _a.startsWith(d);
  })).length;
  const focused = (sessions || []).filter((s) => s.domain === domain && days.some((d) => {
    var _a;
    return (_a = s.at) == null ? void 0 : _a.startsWith(d);
  })).length;
  return captures * 0.4 + tasks * 0.6 + focused * 0.7;
}
function DomainRadar({ thoughts, taskBoard, sessions }) {
  const days = reactExports.useMemo(last7Days, []);
  const scores = reactExports.useMemo(() => {
    const raw = DOMAINS.map((d) => domainScore(d, thoughts, taskBoard, sessions, days));
    const max = Math.max(...raw, 1);
    return raw.map((s) => s / max);
  }, [thoughts, taskBoard, sessions, days]);
  const hasActivity = scores.some((s) => s > 0);
  const CX = 120, CY = 120, R2 = 88;
  const N2 = DOMAINS.length;
  function angle(i) {
    return i / N2 * 2 * Math.PI - Math.PI / 2;
  }
  function gridPoint(i, frac) {
    return [CX + R2 * frac * Math.cos(angle(i)), CY + R2 * frac * Math.sin(angle(i))];
  }
  function dataPoint(i) {
    const s = Math.max(0.04, scores[i]);
    return [CX + R2 * s * Math.cos(angle(i)), CY + R2 * s * Math.sin(angle(i))];
  }
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map(
    (frac) => DOMAINS.map((_, i) => gridPoint(i, frac).join(",")).join(" ")
  );
  const dataPolygon = DOMAINS.map((_, i) => dataPoint(i).join(",")).join(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel radar-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Domain Radar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge", children: "7-day" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "radar-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: 240, height: 240, viewBox: "0 0 240 240", children: [
        gridPolygons.map((pts, gi2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polygon",
          {
            points: pts,
            fill: "none",
            stroke: "rgba(255,255,255,0.06)",
            strokeWidth: gi2 === 3 ? 1.5 : 1
          },
          gi2
        )),
        DOMAINS.map((_, i) => {
          const [x2, y2] = gridPoint(i, 1);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: CX, y1: CY, x2, y2, stroke: "rgba(255,255,255,0.07)", strokeWidth: 1 }, i);
        }),
        hasActivity && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polygon",
            {
              points: dataPolygon,
              fill: "rgba(0,217,177,0.1)",
              stroke: "rgba(0,217,177,0.5)",
              strokeWidth: 1.5,
              strokeLinejoin: "round"
            }
          ),
          DOMAINS.map((_, i) => {
            const [x2, y2] = dataPoint(i);
            const color = DOMAIN_COLOR[DOMAINS[i]];
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: x2,
                cy: y2,
                r: 3.5,
                fill: color,
                style: { filter: `drop-shadow(0 0 4px ${color})` }
              },
              i
            );
          })
        ] }),
        DOMAINS.map((d, i) => {
          const ang = angle(i);
          const lx = CX + (R2 + 22) * Math.cos(ang);
          const ly = CY + (R2 + 22) * Math.sin(ang);
          const anchor = Math.abs(Math.cos(ang)) < 0.1 ? "middle" : Math.cos(ang) > 0 ? "start" : "end";
          const color = DOMAIN_COLOR[d];
          const active = scores[i] > 0.05;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "text",
            {
              x: lx,
              y: ly + 4,
              textAnchor: anchor,
              fontSize: 9,
              fontFamily: "JetBrains Mono, monospace",
              fontWeight: active ? "700" : "400",
              fill: active ? color : "rgba(232,232,240,0.25)",
              style: { filter: active ? `drop-shadow(0 0 6px ${color}88)` : "none" },
              children: d.replace("/", "/\n")
            },
            d
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: CX, cy: CY, r: 2, fill: "rgba(255,255,255,0.2)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "radar-legend", children: [
        DOMAINS.map((d, i) => {
          const pct = Math.round(scores[i] * 100);
          const color = DOMAIN_COLOR[d];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "radar-legend-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "radar-legend-dot", style: { background: color, boxShadow: pct > 0 ? `0 0 6px ${color}88` : "none" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "radar-legend-name", style: { color: pct > 0 ? "var(--ink-2)" : "var(--muted)" }, children: d }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "radar-legend-bar-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "radar-legend-bar-fill", style: { width: `${pct}%`, background: color } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "radar-legend-pct", style: { color: pct > 0 ? color : "var(--muted)" }, children: [
              pct,
              "%"
            ] })
          ] }, d);
        }),
        !hasActivity && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty", style: { fontSize: 11, padding: "8px 0" }, children: [
          "No activity this week yet.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Start capturing to see your balance."
        ] })
      ] })
    ] })
  ] });
}
function CharacterView({ game }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "character-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-header", style: { gridColumn: "1 / -1" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-title", children: "CHARACTER" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "view-hint", children: "Your stats, domains, habits, and achievements" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "character-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterSheet, { xp: game.state.xp }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DomainsPanel,
        {
          domains: game.domains,
          xp: game.state.xp,
          domF: "All",
          setDomF: () => {
          },
          totalCount: (game.state.thoughts || []).length
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AchievementsPanel, { unlockedIds: game.state.achievements })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "character-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HabitStack,
        {
          habits: game.state.habits || [],
          onToggle: game.toggleHabit,
          onAdd: game.addHabit,
          energyLog: game.state.energyLog || [],
          onSetEnergy: game.setEnergy
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DomainRadar,
        {
          thoughts: game.state.thoughts || [],
          taskBoard: game.state.taskBoard || [],
          sessions: game.state.sessions || []
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ApiKeyPanel, { game })
    ] })
  ] });
}
function ApiKeyPanel({ game }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "panel-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Claude API" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "api-status", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `dot ${game.state.apiKey ? "on" : "off"}` }),
        game.state.apiKey ? "connected" : "local"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "api-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "password",
          value: game.state.apiKey,
          onChange: (e) => game.setApiKey(e.target.value),
          placeholder: "sk-ant-…"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => game.setApiKey(""), children: "Clear" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "notice", children: "Without a key, local heuristic classification runs instead. Stored only in your browser's localStorage." })
  ] });
}
function MainApp() {
  const game = useGameState();
  const captureRef = reactExports.useRef(null);
  const [activeView, setActiveView] = reactExports.useState("home");
  const [search, setSearch] = reactExports.useState("");
  const [domF, setDomF] = reactExports.useState("All");
  const [typeF, setTypeF] = reactExports.useState("All");
  const [priF, setPriF] = reactExports.useState("All");
  const [showDone, setShowDone] = reactExports.useState(false);
  const [actDomain, setActDomain] = reactExports.useState("AI/ML");
  const [chaosOpen, setChaosOpen] = reactExports.useState(false);
  const [brainMapOpen, setBrainMapOpen] = reactExports.useState(false);
  const [forgeOpen, setForgeOpen] = reactExports.useState(false);
  const [todoOpen, setTodoOpen] = reactExports.useState(false);
  const [briefOpen, setBriefOpen] = reactExports.useState(() => {
    const seen = localStorage.getItem("polymath-brief-seen");
    return seen !== (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  });
  const handleSessionFinish = reactExports.useCallback((mode, focusMinutes, identityMode) => {
    game.finishSession(mode, actDomain, focusMinutes, identityMode);
  }, [game.finishSession, actDomain]);
  const timer = useTimer(25, handleSessionFinish);
  reactExports.useEffect(() => {
    const h = (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setActiveView("home");
        setTimeout(() => {
          var _a;
          return (_a = captureRef.current) == null ? void 0 : _a.focus();
        }, 50);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const visible = reactExports.useMemo(() => {
    const q2 = search.trim().toLowerCase();
    return (game.state.thoughts || []).filter((t2) => !t2.done).filter((t2) => domF === "All" || t2.domain === domF).filter((t2) => typeF === "All" || t2.type === typeF).filter((t2) => priF === "All" || t2.priority === priF).filter((t2) => !q2 || [t2.text, t2.domain, t2.type, t2.insight, ...t2.tags || []].join(" ").toLowerCase().includes(q2)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [game.state.thoughts, search, domF, typeF, priF]);
  const done = (game.state.thoughts || []).filter((t2) => t2.done).sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));
  function dismissBrief() {
    localStorage.setItem("polymath-brief-seen", (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setBriefOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "app-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, { state: game.state, onChaos: () => setChaosOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `shell-body${chaosOpen ? " chaos-blur" : ""}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Sidebar,
        {
          activeView,
          onNav: (v2) => {
            if (!timer.running) setActiveView(v2);
          },
          onForge: () => setForgeOpen(true),
          onBrainMap: () => setBrainMapOpen(true),
          onTodo: () => setTodoOpen((o) => !o),
          todoOpen,
          focusLocked: timer.running && activeView === "focus",
          todoPendingCount: (game.state.todos || []).filter((t2) => !t2.done && t2.date === (/* @__PURE__ */ new Date()).toISOString().split("T")[0]).length
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "main-content", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "view-anim", children: [
        activeView === "home" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          HomeView,
          {
            game,
            captureRef,
            onViewAll: () => setActiveView("thoughts"),
            momentum: calcMomentumScore(game.state.thoughts, game.state.taskBoard, game.state.sessions)
          }
        ),
        activeView === "focus" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusView,
          {
            actDomain,
            setActDomain,
            domains: game.domains,
            timer,
            sessions: game.state.sessions,
            identityModes: game.state.identityModes,
            addIdentityMode: game.addIdentityMode,
            deleteIdentityMode: game.deleteIdentityMode,
            addDomain: game.addDomain,
            deleteDomain: game.deleteDomain
          }
        ),
        activeView === "thoughts" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          ThoughtsView,
          {
            visible,
            done,
            domainList: game.state.domainList,
            search,
            setSearch,
            domF,
            setDomF,
            typeF,
            setTypeF,
            priF,
            setPriF,
            showDone,
            setShowDone,
            updateThought: game.updateThought,
            deleteThought: game.deleteThought,
            onStartFocus: () => setActiveView("focus")
          }
        ),
        activeView === "quests" && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestsView, { game }),
        activeView === "character" && /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterView, { game })
      ] }, activeView) })
    ] }),
    todoOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "todo-backdrop", onClick: () => setTodoOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TodoPanel,
        {
          state: game.state,
          addTodo: game.addTodo,
          toggleTodo: game.toggleTodo,
          deleteTodo: game.deleteTodo,
          addSubtask: game.addSubtask,
          toggleSubtask: game.toggleSubtask,
          deleteSubtask: game.deleteSubtask,
          onClose: () => setTodoOpen(false)
        }
      )
    ] }),
    forgeOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Forge,
      {
        thoughts: game.state.thoughts,
        apiKey: game.state.apiKey,
        onClose: () => setForgeOpen(false),
        onSaveForge: game.saveForge
      }
    ),
    brainMapOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(BrainMap, { state: game.state, onClose: () => setBrainMapOpen(false) }),
    chaosOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChaosMode,
      {
        state: game.state,
        onStartSession: () => {
          timer.startChaosSession();
          setChaosOpen(false);
          setActiveView("focus");
        },
        onExit: () => setChaosOpen(false)
      }
    ),
    briefOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MorningBrief,
      {
        state: game.state,
        onDismiss: dismissBrief,
        onSetIntention: (v2) => {
          game.saveIntention(v2);
          dismissBrief();
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SerendipityEngine, { thoughts: game.state.thoughts || [] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastStack, { toasts: game.toasts, dismiss: (id2) => game.setToasts((p2) => p2.filter((t2) => t2.tid !== id2)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XpFloats, { floats: game.floats })
  ] });
}
function App() {
  const [landingUp, setLandingUp] = reactExports.useState(() => !localStorage.getItem("polymath-entered"));
  function handleEnter() {
    localStorage.setItem("polymath-entered", "1");
    setTimeout(() => setLandingUp(false), 750);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MainApp, {}),
    landingUp && /* @__PURE__ */ jsxRuntimeExports.jsx(LandingPage, { onEnter: handleEnter })
  ] });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
