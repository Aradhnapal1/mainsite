/**
 * Client-side search + pagination for admin list pages.
 */
function normalizeApiList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function initListPagination(options) {
  const tableBody = document.getElementById(options.tableBodyId);
  if (!tableBody) return null;

  const box = tableBody.closest(".wg-box");
  const pageSizeSelect = box?.querySelector(".wg-filter .show select");
  const searchForm = box?.querySelector(".form-search");
  const searchInput = searchForm?.querySelector("input");
  const paginationEl = box?.querySelector(".wg-pagination");
  const footerBar = box?.querySelector(".divider")?.nextElementSibling;
  const showingTextEl = footerBar?.querySelector(".text-tiny");

  let allItems = [];
  let filteredItems = [];
  let currentPage = 1;
  let pageSize = 10;

  if (searchInput) searchInput.removeAttribute("required");

  function getSearchableText(item) {
    if (typeof options.searchText === "function") return options.searchText(item).toLowerCase();
    const fields = options.searchFields || [];
    return fields
      .map((f) => {
        const val = item[f];
        if (Array.isArray(val)) return val.join(" ");
        return val ?? "";
      })
      .join(" ")
      .toLowerCase();
  }

  function buildPageList(totalPages) {
    if (totalPages <= 1) return [1];
    const pages = new Set([1, totalPages, currentPage]);
    if (currentPage > 1) pages.add(currentPage - 1);
    if (currentPage < totalPages) pages.add(currentPage + 1);
    if (currentPage > 2) pages.add(currentPage - 2);
    if (currentPage < totalPages - 1) pages.add(currentPage + 2);

    const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    const result = [];
    sorted.forEach((page, idx) => {
      if (idx > 0 && page - sorted[idx - 1] > 1) result.push("...");
      result.push(page);
    });
    return result;
  }

  function renderPagination() {
    if (!paginationEl) return;
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize) || 1);
    if (currentPage > totalPages) currentPage = totalPages;

    let html = `<li><a href="#" data-page="prev"><i class="icon-chevron-left"></i></a></li>`;
    buildPageList(totalPages).forEach((page) => {
      if (page === "...") {
        html += `<li class="disabled"><span>...</span></li>`;
      } else {
        html += `<li class="${page === currentPage ? "active" : ""}"><a href="#" data-page="${page}">${page}</a></li>`;
      }
    });
    html += `<li><a href="#" data-page="next"><i class="icon-chevron-right"></i></a></li>`;
    paginationEl.innerHTML = html;
  }

  function renderPage() {
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize) || 1);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * pageSize;
    const pageItems = filteredItems.slice(start, start + pageSize);
    tableBody.innerHTML = "";

    if (!pageItems.length) {
      tableBody.innerHTML = `<li class="body-text text-center">${options.emptyText || "No records found."}</li>`;
    } else {
      pageItems.forEach((item, i) => {
        tableBody.insertAdjacentHTML("beforeend", options.renderRow(item, start + i));
      });
    }

    renderPagination();

    if (showingTextEl) {
      if (!filteredItems.length) {
        showingTextEl.textContent = "Showing 0 entries";
      } else {
        const from = start + 1;
        const to = Math.min(start + pageSize, filteredItems.length);
        showingTextEl.textContent = `Showing ${from} to ${to} of ${filteredItems.length} entries`;
      }
    }
  }

  function applyFilter() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    filteredItems = term
      ? allItems.filter((item) => getSearchableText(item).includes(term))
      : [...allItems];
    currentPage = 1;
    renderPage();
  }

  if (pageSizeSelect) {
    pageSize = parseInt(pageSizeSelect.value, 10) || 10;
    pageSizeSelect.addEventListener("change", () => {
      pageSize = parseInt(pageSizeSelect.value, 10) || 10;
      currentPage = 1;
      renderPage();
    });
  }

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      applyFilter();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", applyFilter);
  }

  if (paginationEl) {
    paginationEl.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-page]");
      if (!link) return;
      e.preventDefault();
      const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize) || 1);
      const target = link.getAttribute("data-page");
      if (target === "prev") currentPage = Math.max(1, currentPage - 1);
      else if (target === "next") currentPage = Math.min(totalPages, currentPage + 1);
      else currentPage = parseInt(target, 10);
      renderPage();
    });
  }

  async function refresh() {
    try {
      allItems = normalizeApiList(await options.getData());
      applyFilter();
    } catch (err) {
      console.error("List pagination load error:", err);
      allItems = [];
      applyFilter();
      if (tableBody) {
        tableBody.innerHTML = `<li class="body-text text-danger text-center">Failed to load data.</li>`;
      }
    }
  }

  refresh();
  return refresh;
}

function resolveAdminAssetUrl(path) {
  if (!path) return "";
  const cleanPath = String(path).trim().replace(/\\/g, "/");
  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath) || cleanPath.startsWith("data:")) return cleanPath;
  const base = (window.domin || "").replace(/\/$/, "");
  if (cleanPath.startsWith("/")) return `${base}${cleanPath}`;
  return `${base}/${cleanPath}`;
}

function parseGalleryList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
    } catch {
      return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function renderGalleryPreviews(containerId, galleryValue) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll(".preview-item.existing-gallery").forEach((el) => el.remove());
  parseGalleryList(galleryValue).forEach((url) => {
    const imgUrl = resolveAdminAssetUrl(url);
    container.insertAdjacentHTML(
      "afterbegin",
      `<div class="item preview-item existing-gallery"><img src="${imgUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>`
    );
  });
}
