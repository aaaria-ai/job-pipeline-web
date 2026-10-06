export const EXTERNAL_OPPORTUNITY_CONTRACT = "job-pipeline-external-opportunities/v1";

export const REVIEW_STATUSES = ["pending", "accepted", "ignored"];
export const DEADLINE_STATUSES = ["known", "asap", "rolling", "unknown", "expired"];

// These are resource coordinates, not authentication material. The adapter never
// logs them together with CLI output and never stores a token or cookie.
export const FEISHU_SOURCE_DEFINITIONS = [
  {
    source_id: "feishu-base2-autumn",
    source_name: "Base2 · 秋招信息表21",
    kind: "bitable",
    base_token: "EB8GbZcjFaIWnUsVgB0c4az6nIg",
    table_id: "tbl7GzMDC7SJskid",
    table_name: "秋招信息表21",
    role: "primary",
    source_url: "https://kcnblh5gjgx2.feishu.cn/base/EB8GbZcjFaIWnUsVgB0c4az6nIg?from=from_copylink",
    fields: { company: "公司", role: "职位", batch: "批次", location: "地点", deadline: "投递截止", apply_url: "投递官网链接", announcement_url: "招聘公告链接", updated_at: "更新日期", direction: "标签", industry: "行业", url_backup: "备用链接", referral_code: "内推码", status: "投递状态", hot: "重点推荐", days_left: "距截止天数", entry_type: "入口类型" },
  },
  {
    source_id: "feishu-base2-early",
    source_name: "Base2 · 秋招提前批18",
    kind: "bitable",
    base_token: "EB8GbZcjFaIWnUsVgB0c4az6nIg",
    table_id: "tbl7mylJlhkXhhK0",
    table_name: "秋招提前批18",
    role: "early",
    source_url: "https://kcnblh5gjgx2.feishu.cn/base/EB8GbZcjFaIWnUsVgB0c4az6nIg?from=from_copylink",
    fields: { company: "公司", role: "职位", batch: "批次", location: "地点", deadline: "投递截止", apply_url: "投递官网链接", announcement_url: "招聘公告链接", updated_at: "更新日期", direction: "标签", industry: "行业", url_backup: "备用链接", referral_code: "内推码", status: "投递状态", hot: "重点推荐", days_left: "距截止天数", entry_type: "入口类型" },
  },
  {
    source_id: "feishu-base2-intern",
    source_name: "Base2 · 实习信息表21",
    kind: "bitable",
    base_token: "EB8GbZcjFaIWnUsVgB0c4az6nIg",
    table_id: "tbl7qfj1f62QCiri",
    table_name: "实习信息表21",
    role: "intern",
    source_url: "https://kcnblh5gjgx2.feishu.cn/base/EB8GbZcjFaIWnUsVgB0c4az6nIg?from=from_copylink",
    fields: { company: "公司", role: "职位", batch: "批次", location: "地点", deadline: "投递截止", apply_url: "投递官网链接", announcement_url: "招聘公告链接", updated_at: "更新日期", direction: "标签", industry: "行业", url_backup: "备用链接", referral_code: "内推码", status: "投递状态", hot: "重点推荐", days_left: "距截止天数", entry_type: "入口类型" },
  },
  {
    source_id: "feishu-base1-main",
    source_name: "Base1 · 27校招汇总表",
    kind: "bitable",
    base_token: "FBysbrfNWa22l7s6a2scDsfEnTf",
    table_id: "tblPA2KMUBFbcATH",
    table_name: "27校招汇总表",
    role: "supplement",
    source_url: "https://wcn5yiabqbxh.feishu.cn/base/FBysbrfNWa22l7s6a2scDsfEnTf?from=from_copylink",
    fields: { company: "公司名称", role: "校招岗位", job_type: "招聘类型", graduation_year: "招聘对象", location: "工作地点", degree: "学历", company_nature: "企业性质", industry: "公司行业", apply_url: "投递链接", announcement_url: "网申公告", deadline: "网申截止", updated_at: "网申更新", notes: "备注", direction: "招聘类型" },
  },
  {
    source_id: "feishu-wiki-referral-base",
    source_name: "Wiki · 远哥个人内推及excel下载",
    kind: "wiki-bitable",
    base_token: "IH8ObhOTMaqWGNslZArcMGsInNX",
    table_id: "tblzpVqcTKlokUA6",
    table_name: "27秋招含提前批",
    role: "referral",
    source_url: "https://my.feishu.cn/wiki/TfJkwz7yIil5qvktSKOcBJj8nFd?from=from_copylink",
    sensitive_fields: ["对接人", "内推码（区分大小码）"],
    fields: { company: "企业名称", role: "招聘岗位", job_type: "内推类型", graduation_year: "毕业时间要求", location: "工作地点", industry: "所在行业", apply_url: "内推链接/官网", notes: "投递注意事项", jd: "公司介绍", calendar: "笔试安排&校招日历", contact: "对接人", referral_code: "内推码（区分大小码）" },
  },
];

// Lower numbers win when several source records are merged into one external
// opportunity. Keep this explicit: a source role is part of the integration
// contract, not an accidental consequence of import order.
export const FEISHU_SOURCE_ROLE_PRIORITY = {
  primary: 0,
  early: 1,
  supplement: 2,
  referral: 3,
  intern: 4,
};

export const EXCLUDED_FEISHU_TABLES = new Set(["tbl2uH06N3RqYb5r"]);

// These fields are owned by the Feishu source. They are replaced on every
// successful observation, including an explicit empty value. Review decisions,
// duplicate annotations and Pipeline links are deliberately excluded.
export const FEISHU_SOURCE_FIELDS = [
  "company_raw", "company", "company_normalized", "role_raw", "role", "role_items", "role_normalized",
  "direction", "job_type", "batch", "location", "graduation_year", "degree", "company_nature", "industry",
  "deadline_raw", "deadline", "deadline_status", "official_url", "announcement_url", "apply_url_raw", "url_kind",
  "jd", "requirements", "source_updated_at", "sensitive_source_metadata",
];

const asText = value => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(asText).filter(Boolean).join("、");
  if (typeof value === "object") return value.text || value.name || value.value || JSON.stringify(value);
  return String(value).trim();
};

const compact = value => asText(value).replace(/[\u00a0\s]+/g, " ").trim();

export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

export function hashSnapshot(value) {
  const text = stableStringify(value);
  let first = 2166136261, second = 16777619;
  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);
    first ^= code; first = Math.imul(first, 16777619);
    second ^= code + index; second = Math.imul(second, 2246822519);
  }
  return `fnv:${(first >>> 0).toString(16).padStart(8, "0")}${(second >>> 0).toString(16).padStart(8, "0")}`;
}

export function normalizeCompany(value) {
  let text = compact(value).replace(/[（(](?:20\d{2}|\d{2})届?[)）]/g, "");
  text = text.replace(/[【\[](?:校招|招聘|秋招|提前批|实习)[】\]]/g, "").trim();
  const aliases = [["字节", "字节跳动"], ["字节跳动科技", "字节跳动"], ["阿里", "阿里巴巴"], ["阿里集团", "阿里巴巴"], ["腾讯科技", "腾讯"], ["拼多多有限公司", "拼多多"]];
  for (const [from, to] of aliases) if (text === from) text = to;
  return text.toLowerCase().replace(/[\s··_-]+/g, "");
}

export function extractGraduationYear(...values) {
  const text = values.map(compact).join(" ");
  const match = text.match(/(?:20)?(2[4-9]|3\d)[届年级]?|20(2\d)/i);
  if (!match) return "";
  const year = match[2] ? Number(`20${match[2]}`) : Number(match[1].length === 2 ? `20${match[1]}` : match[1]);
  return year >= 2020 && year <= 2040 ? year : "";
}

export function parseCampaign(...values) {
  const text = values.map(compact).filter(Boolean).join(" ");
  const graduationYear = extractGraduationYear(text);
  const batch = text.match(/(?:提前批|正式批|秋招|春招|实习|日常实习|暑期实习|寒假实习|校招)/)?.[0] || "";
  return { batch: compact(values[0]) || batch, graduation_year: graduationYear };
}

export function parseRoleItems(value) {
  const text = compact(value);
  if (!text) return [];
  return [...new Set(text.split(/[、,，;；/|]+/).map(item => item.replace(/^\s*[-·•]\s*/, "").trim()).filter(Boolean))];
}

export function normalizeRole(value) {
  return compact(value).toLowerCase().replace(/[（(][^()（）]*[)）]/g, "").replace(/招聘|岗位|职位/g, "").replace(/[\s··_\-/]+/g, "");
}

function dateOnly(value) {
  const match = compact(value).match(/(20\d{2})[./年-](\d{1,2})[./月-](\d{1,2})/);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 15, 59, 59));
  return Number.isNaN(date.valueOf()) ? null : date;
}

export function parseDeadline(value, now = new Date()) {
  const raw = compact(value);
  if (!raw) return { raw: "", value: "", status: "unknown" };
  if (/尽快|尽早|越早|asap/i.test(raw)) return { raw, value: "", status: "asap" };
  if (/长期|持续|rolling|招满|常年|不限/i.test(raw)) return { raw, value: "", status: "rolling" };
  const date = dateOnly(raw) || new Date(raw);
  if (Number.isNaN(date.valueOf())) return { raw, value: "", status: "unknown" };
  const valueIso = date.toISOString();
  return { raw, value: valueIso, status: date < now ? "expired" : "known" };
}

export function classifyUrl(value) {
  const text = compact(value);
  if (!text) return "unknown";
  if (/^mailto:/i.test(text) || /邮箱|email/i.test(text)) return "email";
  if (/mp\.weixin|微信公众号|微信文章/i.test(text)) return "wechat_article";
  if (/内推|referral|talent/i.test(text)) return "referral";
  if (/t\.cn|dwz|短链/i.test(text)) return "short_link";
  if (/公告|announcement/i.test(text)) return "announcement";
  if (/https?:\/\//i.test(text)) return "official_apply";
  return "unknown";
}

function fieldValue(raw, field) {
  if (!field) return "";
  if (Array.isArray(raw.fields)) {
    const index = raw.fields.indexOf(field);
    if (index >= 0) return raw.values?.[index] ?? raw.data?.[index] ?? "";
  }
  return raw.values?.[field] ?? raw.fields?.[field] ?? raw.data?.[field] ?? "";
}

export function rowToNamedValues(raw) {
  if (raw.named_values) return raw.named_values;
  const names = Array.isArray(raw.fields) ? raw.fields : Object.keys(raw.values || raw.data || {});
  const values = Array.isArray(raw.values) ? raw.values : (Array.isArray(raw.data) ? raw.data : []);
  return Object.fromEntries(names.map((name, index) => [name, values[index] ?? ""]));
}

export function mapFeishuRecord(raw, source, now = new Date()) {
  const named = rowToNamedValues(raw);
  const get = key => named[source.fields[key]] ?? "";
  const companyRaw = compact(get("company"));
  const roleRaw = compact(get("role"));
  const campaign = parseCampaign(get("batch"), get("job_type"), get("graduation_year"));
  const deadline = parseDeadline(get("deadline"), now);
  const applyUrl = compact(get("apply_url"));
  const announcementUrl = compact(get("announcement_url"));
  const direction = compact(get("direction"));
  const jobType = source.role === "intern" || /实习|intern/i.test(`${get("job_type")} ${get("batch")}`) ? "intern" : "full_time";
  const graduationYear = extractGraduationYear(get("graduation_year"), get("batch"), get("job_type"));
  const normalized = {
    company_raw: companyRaw, company: companyRaw, company_normalized: normalizeCompany(companyRaw),
    role_raw: roleRaw, role: roleRaw, role_items: parseRoleItems(roleRaw), role_normalized: normalizeRole(roleRaw),
    direction, job_type: jobType, batch: campaign.batch || (source.role === "intern" ? "实习" : ""), location: compact(get("location")), graduation_year: graduationYear,
    degree: compact(get("degree")), company_nature: compact(get("company_nature")), industry: compact(get("industry")),
    deadline_raw: deadline.raw, deadline: deadline.value, deadline_status: deadline.status,
    official_url: applyUrl, announcement_url: announcementUrl, apply_url_raw: applyUrl || compact(get("url_backup")), url_kind: classifyUrl(applyUrl || announcementUrl || get("url_backup")),
    jd: compact(get("jd")) || compact(get("notes")), requirements: compact(get("notes")), source_updated_at: compact(get("updated_at")),
    source_role: source.role || "supplement",
    match_status: "unmatched", match_reason: "来自飞书只读同步，待本地人工确认", review_status: "pending",
  };
  if (source.role === "referral") normalized.sensitive_source_metadata = { contact: compact(get("contact")), referral_code: compact(get("referral_code")) };
  const rawSnapshot = { record_id: raw.record_id || "", revision: raw.revision ?? raw.rev ?? "", fields: raw.fields || [], values: raw.values || raw.data || [] };
  return { ...normalized, source_record_id: raw.record_id || "", raw_hash: hashSnapshot(rawSnapshot), raw_snapshot: rawSnapshot };
}

export function canonicalOpportunityKey(item) {
  const url = compact(item.official_url || item.apply_url_raw).toLowerCase().replace(/[?#].*$/, "");
  return [item.company_normalized || normalizeCompany(item.company), item.role_normalized || normalizeRole(item.role), compact(item.location).toLowerCase(), compact(item.batch).toLowerCase(), url].join("|");
}

export function weakOpportunityKey(item) {
  return [item.company_normalized || normalizeCompany(item.company), item.role_normalized || normalizeRole(item.role), compact(item.location).toLowerCase(), compact(item.batch).toLowerCase()].join("|");
}

export function mergeOpportunity(existing, incoming) {
  const next = structuredClone(existing);
  applySourceFields(next, incoming);
  return next;
}

export function sourceIdentity(source, record) {
  return `${source.source_id}:${record.source_record_id || record.record_id}`;
}

function sourceFieldsFrom(item) {
  return Object.fromEntries(FEISHU_SOURCE_FIELDS.map(key => {
    const value = item[key] === undefined ? (key === "role_items" ? [] : "") : item[key];
    return [key, structuredClone(value)];
  }));
}

function sourceRoleFor(sourceId, item = {}) {
  const configured = FEISHU_SOURCE_DEFINITIONS.find(source => source.source_id === sourceId);
  return configured?.role || item.source_role || "supplement";
}

function sourcePriorityFor(sourceId, item = {}) {
  return FEISHU_SOURCE_ROLE_PRIORITY[sourceRoleFor(sourceId, item)] ?? 99;
}

function hasSourceValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.values(value).some(hasSourceValue);
  return value != null && String(value).trim() !== "";
}

function ensureSourceFieldSnapshots(target, sourceId) {
  if (target.source_field_values && typeof target.source_field_values === "object" && Object.keys(target.source_field_values).length) return;
  const sourceIds = [...new Set(target.source_ids || [sourceId])];
  const owner = sourceIds.slice().sort((a, b) => sourcePriorityFor(a) - sourcePriorityFor(b))[0] || sourceId;
  target.source_field_values = { [owner]: sourceFieldsFrom(target) };
}

function recomputeSourceFields(target) {
  const snapshots = target.source_field_values || {};
  const sourceIds = Object.keys(snapshots).sort((a, b) => sourcePriorityFor(a) - sourcePriorityFor(b) || a.localeCompare(b));
  for (const key of FEISHU_SOURCE_FIELDS) {
    const selectedSource = sourceIds.find(sourceId => hasSourceValue(snapshots[sourceId]?.[key])) || sourceIds[0];
    if (selectedSource && Object.prototype.hasOwnProperty.call(snapshots[selectedSource], key)) target[key] = structuredClone(snapshots[selectedSource][key]);
  }
}

function applySourceFields(target, incoming) {
  const sourceId = incoming.source_id || "__legacy__";
  ensureSourceFieldSnapshots(target, sourceId);
  // Replace the complete snapshot for this source. This makes an explicit
  // empty value authoritative for that source while keeping other sources'
  // values available for priority-based recomputation.
  target.source_field_values[sourceId] = sourceFieldsFrom(incoming);
  recomputeSourceFields(target);
  target.raw_hash = incoming.raw_hash || "";
  target.raw_snapshot = incoming.raw_snapshot || null;
  target.source_record_id = incoming.source_record_id;
  target.last_seen_at = incoming.last_seen_at;
}

export function validateSyncBundle(bundle) {
  if (!bundle || typeof bundle !== "object" || Array.isArray(bundle)) throw new Error("同步包必须是 JSON 对象。");
  if (bundle.kind !== "feishu-external-opportunities/v1") throw new Error("同步包 kind 无效。");
  if (!Array.isArray(bundle.sources)) throw new Error("同步包 sources 必须是数组。");
  const sourceIds = new Set();
  const recordIds = new Set();
  const records = [];
  const syncSources = [];
  bundle.sources.forEach((source, sourceIndex) => {
    if (!source || typeof source !== "object" || Array.isArray(source) || typeof source.source_id !== "string" || !source.source_id.trim()) throw new Error(`同步包第 ${sourceIndex + 1} 个 source 缺少有效 source_id。`);
    if (sourceIds.has(source.source_id)) throw new Error(`同步包包含重复 source_id：${source.source_id}。`);
    sourceIds.add(source.source_id);
    if (!Array.isArray(source.records)) throw new Error(`source ${source.source_id} 的 records 必须是数组。`);
    const syncStatus = source.sync_status || "success";
    if (!["success", "failed"].includes(syncStatus)) throw new Error(`source ${source.source_id} 的 sync_status 无效。`);
    const configured = FEISHU_SOURCE_DEFINITIONS.find(item => item.source_id === source.source_id);
    syncSources.push({ source_id: source.source_id, source_name: source.source_name || "", source_role: configured?.role || source.role || "supplement", sync_status: syncStatus, records_count: source.records.length, last_synced_at: bundle.generated_at || "" });
    source.records.forEach((record, recordIndex) => {
      if (!record || typeof record !== "object" || Array.isArray(record) || typeof record.record_id !== "string" || !record.record_id.trim()) throw new Error(`source ${source.source_id} 第 ${recordIndex + 1} 条记录缺少稳定 record_id。`);
      const sourceRecordKey = `${source.source_id}:${record.record_id}`;
      if (recordIds.has(sourceRecordKey)) throw new Error(`同步包包含重复来源记录：${sourceRecordKey}。`);
      recordIds.add(sourceRecordKey);
      if (!record.opportunity || typeof record.opportunity !== "object" || Array.isArray(record.opportunity)) throw new Error(`source ${source.source_id} 第 ${recordIndex + 1} 条记录的 opportunity 结构无效。`);
      const opportunity = record.opportunity;
      records.push({
        ...opportunity,
        source_id: source.source_id,
        source_name: source.source_name || opportunity.source_name || "",
        source_role: configured?.role || source.role || opportunity.source_role || "supplement",
        source_kind: source.kind || opportunity.source_kind || "",
        base_token: source.base_token || opportunity.base_token || "",
        table_id: source.table_id || opportunity.table_id || "",
        table_name: source.table_name || opportunity.table_name || "",
        source_url: source.source_url || opportunity.source_url || "",
        source_record_id: record.record_id,
        revision: record.revision ?? opportunity.revision ?? null,
        raw_hash: record.raw_hash || opportunity.raw_hash || "",
        raw_snapshot: record.raw_snapshot || opportunity.raw_snapshot || null,
      });
    });
  });
  return { records, syncSources };
}

export function mergeSyncedRecords(state, records, now = new Date(), syncSources = null) {
  const next = structuredClone(state);
  next.externalOpportunities ||= [];
  next.opportunitySources ||= [];
  next.feishuSyncState ||= { sources: {} };
  next.feishuSyncState.sources ||= {};
  const bySourceRecord = new Map(next.opportunitySources.map(item => [`${item.source_id}:${item.record_id}`, item]));
  const byCanonical = new Map(next.externalOpportunities.map(item => [canonicalOpportunityKey(item), item]));
  const byWeak = new Map(next.externalOpportunities.map(item => [weakOpportunityKey(item), item]));
  const seenSourceRecords = new Set();
  let added = 0, changed = 0, suspected = 0;
  for (const item of records) {
    if (!item?.source_id || !item.source_record_id) throw new Error("同步记录缺少 source_id 或 source_record_id。");
    const incoming = { ...item, first_seen_at: item.first_seen_at || now.toISOString(), last_seen_at: now.toISOString() };
    const sourceId = incoming.source_id;
    const sourceRecordId = incoming.source_record_id;
    const sourceKey = `${sourceId}:${sourceRecordId}`;
    seenSourceRecords.add(sourceKey);
    const sourceLink = { source_id: sourceId, source_name: incoming.source_name, source_role: sourceRoleFor(sourceId, incoming), kind: incoming.source_kind, base_token: incoming.base_token, table_id: incoming.table_id, table_name: incoming.table_name, record_id: sourceRecordId, source_url: incoming.source_url, source_updated_at: incoming.source_updated_at || "", raw_snapshot_hash: incoming.raw_hash || "", last_seen_at: now.toISOString(), status: "active" };
    const oldSource = next.opportunitySources.find(item => item.source_id === sourceId && item.record_id === sourceRecordId) || bySourceRecord.get(sourceKey);
    const sourceRecordDuplicate = next.opportunitySources.filter(candidate => candidate.source_id === sourceId && candidate.record_id === sourceRecordId && candidate !== oldSource);
    if (sourceRecordDuplicate.length) next.opportunitySources = next.opportunitySources.filter(candidate => !sourceRecordDuplicate.includes(candidate));
    if (oldSource) Object.assign(oldSource, sourceLink); else { next.opportunitySources.push(sourceLink); bySourceRecord.set(sourceKey, sourceLink); }
    const canonical = canonicalOpportunityKey(incoming);
    const weak = weakOpportunityKey(incoming);
    // The source record identity is authoritative. A changed URL, deadline or
    // role must update this opportunity rather than creating a new canonical row.
    let target = oldSource?.opportunity_id ? next.externalOpportunities.find(candidate => candidate.id === oldSource.opportunity_id) : null;
    if (!target) target = byCanonical.get(canonical);
    const weakExisting = !target && weak ? byWeak.get(weak) : null;
    if (weakExisting) {
      const existingUrl = compact(weakExisting.official_url || weakExisting.apply_url_raw).toLowerCase();
      const incomingUrl = compact(incoming.official_url || incoming.apply_url_raw).toLowerCase();
      if (existingUrl && incomingUrl && existingUrl !== incomingUrl) {
        if (["unique", "unmatched", ""].includes(weakExisting.match_status)) {
          weakExisting.match_status = "suspected_duplicate";
          weakExisting.match_reason = "公司、岗位、地点、批次相同但来源链接不同，需人工确认";
        }
        suspected += 1;
      } else target = weakExisting;
    }
    if (!target) {
      target = { id: `ext_${hashSnapshot(`${sourceKey}|${incoming.raw_hash}`)}`, ...sourceFieldsFrom(incoming), source_field_values: { [sourceId]: sourceFieldsFrom(incoming) }, source_record_id: sourceRecordId, raw_hash: incoming.raw_hash || "", raw_snapshot: incoming.raw_snapshot || null, source_ids: [sourceId], source_count: 1, first_seen_at: now.toISOString(), last_seen_at: now.toISOString(), match_status: "unique", match_reason: "来自飞书只读同步，待本地人工确认", review_status: "pending", pipeline_position_id: null };
      next.externalOpportunities.push(target); added += 1;
    } else {
      const previousHash = target.raw_hash;
      applySourceFields(target, incoming);
      target.source_ids = [...new Set([...(target.source_ids || []), sourceId])];
      target.source_count = target.source_ids.length;
      if (previousHash !== incoming.raw_hash) changed += 1;
    }
    sourceLink.opportunity_id = target.id;
    target.source_ids = [...new Set([...(target.source_ids || []), sourceId])];
    target.source_count = target.source_ids.length;
    byCanonical.set(canonicalOpportunityKey(target), target);
    byWeak.set(weakOpportunityKey(target), target);
    const sync = next.feishuSyncState.sources[sourceId] || { source_id: sourceId, records: {} };
    sync.records ||= {};
    sync.records[sourceRecordId] = { raw_hash: incoming.raw_hash, revision: incoming.revision || incoming.rev || null, last_seen_at: now.toISOString() };
    sync.last_synced_at = now.toISOString(); sync.last_record_count = Object.keys(sync.records).length;
    next.feishuSyncState.sources[sourceId] = sync;
  }
  const runs = syncSources || [...new Set(records.map(item => item.source_id))].map(source_id => ({ source_id, sync_status: "success", records_count: records.filter(item => item.source_id === source_id).length }));
  for (const run of runs) {
    if (!run?.source_id || run.sync_status === "failed") continue;
    const sourceRecords = new Set(records.filter(item => item.source_id === run.source_id).map(item => item.source_record_id));
    for (const source of next.opportunitySources.filter(item => item.source_id === run.source_id)) source.status = sourceRecords.has(source.record_id) ? "active" : "source_missing";
    const sync = next.feishuSyncState.sources[run.source_id] || { source_id: run.source_id, records: {} };
    sync.last_synced_at = now.toISOString();
    sync.last_record_count = Number(run.records_count) || 0;
    sync.sync_status = "success";
    next.feishuSyncState.sources[run.source_id] = sync;
  }
  next.counters ||= {}; next.counters.externalOpportunity = Math.max(Number(next.counters.externalOpportunity) || 0, next.externalOpportunities.length); next.counters.opportunitySource = Math.max(Number(next.counters.opportunitySource) || 0, next.opportunitySources.length);
  return { state: next, stats: { added, changed, suspected, source_count: records.length } };
}

export function acceptExternalOpportunity(state, id, input, now = new Date()) {
  const next = structuredClone(state);
  const item = next.externalOpportunities.find(candidate => candidate.id === id);
  if (!item) throw new Error("外部机会不存在。");
  if (item.review_status === "ignored") throw new Error("已忽略的外部机会不能进入正式 Pipeline。");
  if (item.review_status === "accepted" && item.pipeline_position_id) return { state: next, opportunity: item, position: next.positions.find(position => position.id === item.pipeline_position_id) };
  const company = compact(input.company || item.company);
  const role = compact(input.role || item.role);
  if (!company || !role) throw new Error("确认进入 Pipeline 前必须填写公司和具体岗位。");
  const nowIso = now.toISOString();
  const positionId = ++next.counters.position;
  const position = { id: positionId, company, role_name: role, jd: input.jd ?? item.jd ?? "", official_url: input.apply_url ?? item.official_url ?? "", deadline: input.deadline ?? item.deadline ?? "", category: input.direction ?? item.direction ?? "", application_rule: input.batch ?? item.batch ?? "", job_natures: [], formal_validity: "不确定", recommendation: "补信息", stage: "待投递", final_result: "未定", stage_notes: [item.match_reason, `外部机会来源 ${item.source_count || 1} 个`].filter(Boolean), assessment_start: "", assessment_content: "", resume_version: "", next_action: "", next_action_due: "", discovery_run_id: null, discovery_rank: null, custom_values: {}, local_revision: 1, created_at: nowIso, updated_at: nowIso, deleted_at: null };
  next.positions.push(position);
  next.counters.event = (Number(next.counters.event) || 0) + 1;
  next.events.push({ id: next.counters.event, position_id: positionId, event_type: "created", note: "人工确认外部机会后进入待投递", actor: "owner", created_at: nowIso });
  item.company = company; item.role = role; item.review_status = "accepted"; item.pipeline_position_id = positionId; item.last_seen_at = nowIso;
  return { state: next, opportunity: item, position };
}
