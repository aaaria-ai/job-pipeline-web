const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const attr = value => esc(value);

export const EXTERNAL_OPPORTUNITY_PAGE_SIZE = 50;

export function buildExternalSourceIndex(sources = []) {
  const byOpportunity = new Map();
  const bySourceId = new Map();
  for (const source of sources || []) {
    if (source.opportunity_id) {
      const links = byOpportunity.get(source.opportunity_id) || [];
      links.push(source);
      byOpportunity.set(source.opportunity_id, links);
    }
    if (source.source_id) {
      const links = bySourceId.get(source.source_id) || [];
      links.push(source);
      bySourceId.set(source.source_id, links);
    }
  }
  return { byOpportunity, bySourceId };
}

export function sourceLinksForOpportunity(item, sourceIndex) {
  const direct = sourceIndex?.byOpportunity?.get(item.id) || [];
  if (direct.length || !(item.source_ids || []).length) return direct;
  const links = [];
  const seen = new Set();
  for (const sourceId of item.source_ids || []) {
    for (const source of sourceIndex.bySourceId.get(sourceId) || []) {
      const key = `${source.source_id || ""}:${source.record_id || ""}`;
      if (!seen.has(key)) { seen.add(key); links.push(source); }
    }
  }
  return links;
}

const SHANGHAI_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit" });

export function getShanghaiDateKey(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const date = value instanceof Date ? value : new Date(text);
  if (Number.isNaN(date.valueOf())) return "";
  const parts = Object.fromEntries(SHANGHAI_DATE_FORMATTER.formatToParts(date).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function dateKeyNumber(key) {
  if (!key) return null;
  const [year, month, day] = key.split("-").map(Number);
  return Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day) ? Date.UTC(year, month - 1, day) / 86400000 : null;
}

function deadlineDistance(item, now = new Date()) {
  const deadlineNumber = dateKeyNumber(getShanghaiDateKey(item.deadline));
  const todayNumber = dateKeyNumber(getShanghaiDateKey(now));
  return deadlineNumber == null || todayNumber == null ? null : deadlineNumber - todayNumber;
}

export function getDeadlineBucket(item, now = new Date()) {
  const distance = deadlineDistance(item, now);
  if (distance == null) return "no_date";
  if (distance < 0) return "expired";
  if (distance === 0) return "today";
  return "future";
}

export function sortExternalOpportunities(items = [], now = new Date()) {
  return [...items].sort((a, b) => {
    const distanceA = deadlineDistance(a, now);
    const distanceB = deadlineDistance(b, now);
    const bucketA = distanceA === 0 ? 0 : distanceA != null && distanceA > 0 ? 1 : distanceA == null ? 2 : 3;
    const bucketB = distanceB === 0 ? 0 : distanceB != null && distanceB > 0 ? 1 : distanceB == null ? 2 : 3;
    if (bucketA !== bucketB) return bucketA - bucketB;
    if (distanceA != null && distanceB != null && distanceA !== distanceB) return distanceA - distanceB;
    return String(a.company).localeCompare(String(b.company), "zh-CN") || String(a.role).localeCompare(String(b.role), "zh-CN");
  });
}

function isUrgentOpportunity(item, now = new Date()) {
  const distance = deadlineDistance(item, now);
  return distance != null && distance >= 0 && distance <= 7;
}

function matchesDateFilter(item, filter, now = new Date()) {
  const distance = deadlineDistance(item, now);
  if (filter === "today") return distance === 0;
  if (filter === "next3") return distance != null && distance >= 1 && distance <= 3;
  if (filter === "next7") return distance != null && distance >= 1 && distance <= 7;
  if (filter === "urgent") return distance != null && distance >= 0 && distance <= 7;
  if (filter === "expired") return distance != null && distance < 0;
  if (filter === "no_date") return distance == null;
  return null;
}

function matchesExternalFilter(item, filter, now = new Date()) {
  if (filter === "all") return true;
  if (filter === "pending") return item.review_status === "pending";
  if (filter === "high") return item.match_status === "unique" && item.review_status === "pending";
  if (["today", "next3", "next7", "urgent", "expired", "no_date"].includes(filter)) return matchesDateFilter(item, filter, now);
  if (filter === "suspected") return item.match_status === "suspected_duplicate";
  return item.review_status === filter;
}

export function filterExternalOpportunities(opportunities = [], { filter = "all", q = "", showInterns = false, now = new Date() } = {}) {
  const query = String(q || "").toLowerCase();
  const filtered = (opportunities || []).filter(item => (showInterns || item.job_type !== "intern")
    && (!query || `${item.company} ${item.role} ${item.direction} ${item.location} ${item.jd}`.toLowerCase().includes(query))
    && matchesExternalFilter(item, filter, now));
  return sortExternalOpportunities(filtered, now);
}

export function formatExternalDeadline(item) {
  if (item.deadline_status === "asap") return "尽快投递";
  if (item.deadline_status === "rolling") return "长期 / 招满即止";
  if (item.deadline_status === "expired") return `${item.deadline_raw || item.deadline} · 已过期`;
  return item.deadline ? new Date(item.deadline).toLocaleDateString("zh-CN") : "未知";
}

export function paginateExternalOpportunities(items = [], page = 1, pageSize = EXTERNAL_OPPORTUNITY_PAGE_SIZE) {
  const size = Math.max(1, Number(pageSize) || EXTERNAL_OPPORTUNITY_PAGE_SIZE);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), pageCount);
  const start = (currentPage - 1) * size;
  return { items: items.slice(start, start + size), total, page: currentPage, pageCount, start, end: Math.min(start + size, total) };
}

export function setupExternalOpportunities({ getData, fetch, reload, showError, showStatus }) {
  const root = document.querySelector("#externalOpportunityWorkspace");
  if (!root) return;
  const showInternsKey = "job-pipeline-show-external-internships";
  const ui = { filter: "all", q: "", page: 1, showInterns: localStorage.getItem(showInternsKey) === "true", selectedId: null, importSummary: null };
  let sourceIndex = buildExternalSourceIndex();
  let indexedSources = null;
  let searchTimer = null;
  let searchComposing = false;
  root.innerHTML = `<input id="externalOpportunityFile" type="file" accept="application/json,.json" hidden><dialog id="externalOpportunityDialog" class="editor-dialog external-opportunity-dialog"><form id="externalOpportunityForm" method="dialog"><header><div><span class="eyebrow">HUMAN GATE</span><h2>确认进入待投递</h2></div><button type="button" class="dialog-close" data-external-close aria-label="关闭">×</button></header><p class="dialog-hint">外部岗位不会自动进入正式 Pipeline。请确认具体岗位和投递信息后再接受。</p><input id="externalOpportunityId" type="hidden"><label>公司<input id="externalCompany" required></label><label>具体岗位<input id="externalRole" required></label><div class="dialog-grid"><label>截止时间<input id="externalDeadline"></label><label>投递链接<input id="externalApplyUrl" type="url"></label></div><label>JD / 备注<textarea id="externalJd" rows="7"></textarea><footer><span></span><button type="button" data-external-close>取消</button><button class="primary" type="submit">确认并进入待投递</button></footer></form></dialog>`;
  root.insertAdjacentHTML("beforeend", `<div id="externalOpportunityContent"></div>`);
  const content = root.querySelector("#externalOpportunityContent");
  const dialog = root.querySelector("#externalOpportunityDialog");
  root.addEventListener("click", event => {
    const filter = event.target.closest("[data-external-filter]");
    if (filter) { ui.filter = filter.dataset.externalFilter; ui.page = 1; render(); return; }
    const pageButton = event.target.closest("[data-external-page]");
    if (pageButton && !pageButton.disabled) {
      const data = getData();
      const filtered = viewItems(data);
      const page = paginateExternalOpportunities(filtered, ui.page);
      const action = pageButton.dataset.externalPage;
      ui.page = action === "first" ? 1 : action === "prev" ? page.page - 1 : action === "next" ? page.page + 1 : page.pageCount;
      render();
      return;
    }
    const mergeButton = event.target.closest("[data-external-merge-button]");
    if (mergeButton) {
      const item = getData().opportunities.find(candidate => candidate.id === mergeButton.dataset.externalId);
      if (!item) return;
      const target = root.querySelector(`[data-external-merge-select="${CSS.escape(item.id)}"]`)?.value;
      if (target) merge(item, target);
      return;
    }
    const action = event.target.closest("[data-external-action]");
    if (!action) return;
    const item = getData().opportunities.find(candidate => candidate.id === action.dataset.externalId);
    if (!item) return;
    if (action.dataset.externalAction === "accept") openAccept(item);
    if (action.dataset.externalAction === "ignore") mutate(item, "ignore");
    if (action.dataset.externalAction === "suspect") mutate(item, "suspect");
    if (action.dataset.externalAction === "merge") merge(item, action.dataset.mergeTarget);
  });
  root.querySelector("#externalOpportunityFile").onchange = importBundle;
  root.querySelector("#externalOpportunityForm").onsubmit = submitAccept;
  root.querySelectorAll("[data-external-close]").forEach(button => button.onclick = () => dialog.close());

  function ensureSourceIndex(data) {
    if (indexedSources === data.sources) return;
    sourceIndex = buildExternalSourceIndex(data.sources || []);
    indexedSources = data.sources;
  }

  function viewItems(data = getData()) {
    return filterExternalOpportunities(data.opportunities || [], ui);
  }

  function filterCount(filter, data = getData()) {
    const items = data.opportunities || [];
    if (filter === "all") return items.filter(item => ui.showInterns || item.job_type !== "intern").length;
    return items.filter(item => (ui.showInterns || item.job_type !== "intern") && matchesExternalFilter(item, filter)).length;
  }

  function render() {
    const data = getData();
    ensureSourceIndex(data);
    const filteredItems = viewItems(data);
    const page = paginateExternalOpportunities(filteredItems, ui.page);
    ui.page = page.page;
    const items = page.items;
    const filters = [["all", "全部"], ["today", "今天截止"], ["urgent", "临期"], ["next3", "未来 3 天"], ["next7", "未来 7 天"], ["expired", "已过期"], ["no_date", "无明确日期"], ["pending", "待确认"], ["high", "高匹配"], ["suspected", "疑似重复"], ["ignored", "已忽略"], ["accepted", "已接受"]];
    const suspectedItems = data.opportunities.filter(item => item.match_status === "suspected_duplicate");
    const cards = items.map(item => {
      const urgent = isUrgentOpportunity(item);
      const sourceLinks = sourceLinksForOpportunity(item, sourceIndex);
      const sourceNames = sourceLinks.map(source => source.source_name).filter(Boolean);
      const missingSources = sourceLinks.filter(source => source.status === "source_missing").map(source => source.source_name).filter(Boolean);
      const sourceText = sourceNames.length ? sourceNames.join("、") : `${item.source_count || 1} 个来源`;
      const sourceStatus = missingSources.length ? `<em class="external-source-missing">来源已消失 · ${esc(missingSources.join("、"))}</em>` : "";
      const actions = item.review_status === "pending" ? `<button data-external-action="accept" data-external-id="${attr(item.id)}" class="primary">确认进入待投递</button><button data-external-action="ignore" data-external-id="${attr(item.id)}">忽略</button>` : "";
      const suspectAction = item.match_status !== "suspected_duplicate" && item.review_status === "pending" ? `<button data-external-action="suspect" data-external-id="${attr(item.id)}">标记疑似重复</button>` : "";
      const mergeTargets = item.match_status === "suspected_duplicate" ? suspectedItems.filter(other => other.id !== item.id).map(other => `<option value="${attr(other.id)}">${esc(other.company)} · ${esc(other.role)}</option>`).join("") : "";
      const mergeAction = mergeTargets ? `<select data-external-merge-select="${attr(item.id)}"><option value="">合并到…</option>${mergeTargets}</select><button data-external-merge-button data-external-id="${attr(item.id)}">合并来源</button>` : "";
      return `<article class="external-opportunity-card ${urgent ? "is-urgent" : ""}"><header><div><span class="eyebrow">${esc(item.job_type === "intern" ? "实习" : item.batch || "外部机会")}</span><h3>${esc(item.company || "未知公司")}</h3><p>${esc(item.role || item.role_raw || "未知岗位")}</p></div><span class="badge">${esc(item.review_status || "pending")}</span></header><div class="external-opportunity-fields"><span><small>地点</small><b>${esc(item.location || "未知")}</b></span><span><small>截止</small><b class="${urgent ? "deadline-urgent" : ""}">${esc(formatExternalDeadline(item))}</b></span><span><small>来源</small><b>${esc(sourceText)}</b>${sourceStatus}</span><span><small>更新时间</small><b>${esc(item.source_updated_at || "未知")}</b></span></div><p class="external-reason">${esc(item.match_reason || "待标准化")}</p><details><summary>查看 JD / 链接</summary><p>${esc(item.jd || item.requirements || "暂无 JD")}</p><div class="external-links">${item.official_url ? `<a href="${attr(item.official_url)}" target="_blank" rel="noreferrer">投递链接</a>` : ""}${item.announcement_url ? `<a href="${attr(item.announcement_url)}" target="_blank" rel="noreferrer">公告链接</a>` : ""}</div></details><footer>${actions}${suspectAction}${mergeAction}</footer></article>`;
    }).join("");
    const first = page.total ? page.start + 1 : 0;
    const summary = `共 ${data.opportunities.length} 条机会 · 当前筛选 ${page.total} 条 · 显示 ${first}-${page.end}`;
    const importSummary = ui.importSummary ? `最近导入：新增 ${ui.importSummary.added || 0} · 变更 ${ui.importSummary.changed || 0} · 疑似重复 ${ui.importSummary.suspected || 0}` : "";
    const pagination = `<div class="external-opportunity-pagination" aria-label="外部岗位分页"><span>${esc(summary)}</span><span>${page.page} / ${page.pageCount} 页</span><button data-external-page="first" ${page.page <= 1 ? "disabled" : ""}>首页</button><button data-external-page="prev" ${page.page <= 1 ? "disabled" : ""}>上一页</button><button data-external-page="next" ${page.page >= page.pageCount ? "disabled" : ""}>下一页</button><button data-external-page="last" ${page.page >= page.pageCount ? "disabled" : ""}>末页</button></div>`;
    content.innerHTML = `<div class="external-opportunities-head"><div><span class="eyebrow">READ-ONLY FEED</span><h2>外部岗位机会</h2><p>飞书只读同步 → 外部机会池 → 标准化 / 去重 → 待确认。接受后才进入待投递。</p></div><div class="external-opportunities-actions"><label class="sensitive-toggle"><input id="showExternalInterns" type="checkbox" ${ui.showInterns ? "checked" : ""}>显示实习</label><button id="importExternalBundle" class="primary" type="button">导入飞书同步包</button></div></div><div class="external-sync-note">同步命令：<code>node scripts/sync-feishu.mjs --output feishu-sync.json</code>　·　本页只读取本地 JSON，不接触 Token。${importSummary ? `　·　${esc(importSummary)}` : ""}</div><div class="external-opportunity-filters">${filters.map(([key, label]) => `<button data-external-filter="${key}" class="${ui.filter === key ? "active" : ""}">${label}<span>${filterCount(key, data)}</span></button>`).join("")}<label class="search-field"><span aria-hidden="true">⌕</span><input id="externalOpportunitySearch" type="search" placeholder="搜索公司、岗位、地点或 JD" value="${attr(ui.q)}"></label></div>${pagination}<div class="external-opportunity-grid">${cards || `<div class="empty"><strong>当前筛选没有外部机会</strong><p>请先运行本地只读同步脚本并导入 JSON。</p></div>`}</div>${pagination}`;
    root.querySelector("#showExternalInterns").onchange = event => { ui.showInterns = event.target.checked; ui.page = 1; localStorage.setItem(showInternsKey, String(ui.showInterns)); render(); };
    root.querySelector("#importExternalBundle").onclick = () => root.querySelector("#externalOpportunityFile").click();
    const search = root.querySelector("#externalOpportunitySearch");
    const scheduleSearch = () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(render, 250);
    };
    search.oncompositionstart = () => { searchComposing = true; clearTimeout(searchTimer); };
    search.oncompositionend = event => { searchComposing = false; ui.q = event.target.value; ui.page = 1; scheduleSearch(); };
    search.oninput = event => {
      ui.q = event.target.value; ui.page = 1;
      if (!searchComposing) scheduleSearch();
    };
  }

  function openAccept(item) {
    ui.selectedId = item.id;
    root.querySelector("#externalOpportunityId").value = item.id;
    root.querySelector("#externalCompany").value = item.company || item.company_raw || "";
    root.querySelector("#externalRole").value = item.role || item.role_raw || "";
    root.querySelector("#externalDeadline").value = item.deadline || item.deadline_raw || "";
    root.querySelector("#externalApplyUrl").value = item.official_url || item.apply_url_raw || "";
    root.querySelector("#externalJd").value = item.jd || item.requirements || "";
    dialog.showModal();
  }

  async function submitAccept(event) {
    event.preventDefault();
    const id = root.querySelector("#externalOpportunityId").value;
    try {
      const response = await fetch(`/api/external-opportunities/${encodeURIComponent(id)}/accept`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ company: root.querySelector("#externalCompany").value, role: root.querySelector("#externalRole").value, deadline: root.querySelector("#externalDeadline").value, apply_url: root.querySelector("#externalApplyUrl").value, jd: root.querySelector("#externalJd").value }) });
      if (!response.ok) throw new Error((await response.json()).error || "接受失败");
      dialog.close(); await reload(); showStatus("已人工确认，岗位进入正式 Pipeline 的“待投递”阶段。");
    } catch (error) { showError(error); }
  }

  async function mutate(item, action) {
    try { const response = await fetch(`/api/external-opportunities/${encodeURIComponent(item.id)}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }); if (!response.ok) throw new Error((await response.json()).error || "操作失败"); await reload(); } catch (error) { showError(error); }
  }

  async function merge(item, targetId) {
    if (!targetId) return;
    try { const response = await fetch(`/api/external-opportunities/${encodeURIComponent(item.id)}/merge`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ target_id: targetId }) }); if (!response.ok) throw new Error((await response.json()).error || "合并失败"); await reload(); } catch (error) { showError(error); }
  }

  async function importBundle(event) {
    const file = event.target.files[0]; event.target.value = "";
    if (!file) return;
    try {
      const bundle = JSON.parse(await file.text());
      // browserApiFetch accepts the parsed object directly, avoiding a second
      // 100 MB JSON string while the local IndexedDB import is prepared.
      const response = await fetch("/api/external-opportunities/import", { method: "POST", headers: { "Content-Type": "application/json" }, body: bundle });
      if (!response.ok) throw new Error((await response.json()).error || "同步包导入失败");
      const stats = await response.json(); ui.importSummary = stats; ui.page = 1; await reload(); showStatus(`飞书同步包已导入：新增 ${stats.added || 0} 条，变更 ${stats.changed || 0} 条，疑似重复 ${stats.suspected || 0} 条。`);
    } catch (error) { showError(error); }
  }

  render();
  return { render };
}
