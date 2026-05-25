/**
 * Backward-compatible entry — logic in api-config.js
 */
(function (global) {
    if (global.domain) return;

    var API_LIVE = "https://microsite-backend.workarya.com";
    var API_LOCAL = "https://localhost:7161";

    function resolveApiBase() {
        try {
            var params = new URLSearchParams(global.location.search);
            if (params.get("localapi") === "1") {
                global.localStorage.setItem("apiMode", "local");
                return API_LOCAL;
            }
            if (params.get("localapi") === "0") {
                global.localStorage.removeItem("apiMode");
                return API_LIVE;
            }
            if (global.localStorage.getItem("apiMode") === "local") {
                return API_LOCAL;
            }
        } catch (e) { /* ignore */ }
        return API_LIVE;
    }

    var base = resolveApiBase().replace(/\/$/, "");
    global.API_CONFIG = { live: API_LIVE, local: API_LOCAL, base: base, isLive: base === API_LIVE };
    global.domain = base;
    global.API_BASE = base;
    global.domin = base;
})(window);
