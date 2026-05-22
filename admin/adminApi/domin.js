/**
 * Admin API base — uses shared api-config when available.
 */
(function () {
    var LIVE = "http://microsite_backend.workarya.com";
    var LOCAL = "https://localhost:7161";

    function resolve() {
        try {
            var params = new URLSearchParams(window.location.search);
            if (params.get("localapi") === "1") {
                localStorage.setItem("apiMode", "local");
                return LOCAL;
            }
            if (params.get("localapi") === "0") {
                localStorage.removeItem("apiMode");
                return LIVE;
            }
            if (localStorage.getItem("apiMode") === "local") return LOCAL;
        } catch (e) { /* ignore */ }
        return LIVE;
    }

    var base = (window.domain || window.API_BASE || resolve()).replace(/\/$/, "");
    window.domin = base;
    window.domain = base;
    window.API_BASE = base;
})();
