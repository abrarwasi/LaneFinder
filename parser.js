/* Pure, local text parser for freight quote emails. No email text leaves the browser. */
(function (root) {
  "use strict";

  const PROVINCE = '(?:ON|QC|PQ|AB|BC|MB|NB|NL|NS|NT|NU|PE|PEI|SK|YT)';
  const CITY_PROVINCE = new RegExp(`^[A-Za-zÀ-ÿ0-9.'’() /-]+,?\\s+${PROVINCE}(?:\\b|$)`, 'i');

  function compact(value) {
    return String(value || '').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  }

  function normalizeLocation(value) {
    return compact(value)
      .replace(/^[>:–—-]+\s*/, '')
      .replace(/\s*(?:\||→|>)\s*$/, '')
      .replace(/\s+Canada$/i, ', Canada')
      .replace(/\s+,/g, ',');
  }

  function getAfterLabel(lines, label) {
    const pattern = new RegExp(`^${label}\\s*:?\\s*(.*)$`, 'i');
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(pattern);
      if (!match) continue;
      if (match[1] && match[1].trim()) return compact(match[1]);
      for (let j = i + 1; j <= Math.min(i + 3, lines.length - 1); j++) {
        const candidate = compact(lines[j]);
        if (!candidate || /^(?:>|→|:|–|-|\/)$/i.test(candidate)) continue;
        return candidate;
      }
    }
    return '';
  }

  function getRouteLocation(lines, label) {
    const token = new RegExp(`^${label}\\s*:?\\s*(.*)$`, 'i');
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(token);
      if (!m) continue;
      const candidates = [m[1], ...lines.slice(i + 1, i + 5)];
      for (const item of candidates) {
        const candidate = normalizeLocation(item);
        if (CITY_PROVINCE.test(candidate) || /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(candidate)) return candidate;
        if (/^\d+\s+\S+.*\b(?:ON|QC|AB|BC|MB|NB|NL|NS|NT|NU|PE|SK|YT)\b/i.test(candidate)) return candidate;
        if (/^(ORIGIN|DESTINATION|COMMENTS|ROUTE DETAILS)$/i.test(candidate)) break;
      }
    }
    return '';
  }

  function subjectRoute(subject) {
    const s = compact(subject);
    const r = new RegExp(`^(.+?\\b${PROVINCE})\\s+to\\s+(.+?\\b${PROVINCE})(?:\\b|,|\\s+\\||$)`, 'i');
    const m = s.match(r);
    return m ? { origin: normalizeLocation(m[1]), destination: normalizeLocation(m[2]) } : null;
  }

  function getComments(lines) {
    const i = lines.findIndex(line => /^COMMENTS\s*:?(?:\s|$)/i.test(line));
    if (i < 0) return '';
    const start = lines[i].replace(/^COMMENTS\s*:?[ ]*/i, '');
    const comments = [start];
    for (const line of lines.slice(i + 1)) {
      if (/^(?:Requested by|Sent by|Contact|Customer|Privacy Policy|Terms of Service|New Quote Request|Unsubscribe|Copyright|©)/i.test(line) || /@[a-z0-9.-]+\.[a-z]{2,}/i.test(line)) break;
      comments.push(line);
      if (comments.join('\n').length > 900) break;
    }
    return comments.join('\n').trim().slice(0, 500);
  }

  function parseQuote(subject, body) {
    const title = compact(subject);
    const cleanBody = String(body || '').replace(/\u00a0/g, ' ').replace(/\r\n/g, '\n');
    const lines = cleanBody.split(/\n+/).map(compact).filter(Boolean);
    const fromTitle = subjectRoute(title);
    const origin = getRouteLocation(lines, 'ORIGIN') || (fromTitle && fromTitle.origin) || '';
    const destination = getRouteLocation(lines, 'DESTINATION') || (fromTitle && fromTitle.destination) || '';
    const reference = (title.match(/\breference\s*#?\s*([A-Z0-9-]+)/i) || cleanBody.match(/\breference\s*#?\s*([A-Z0-9-]+)/i) || [])[1] || '';
    return {
      subject: title,
      reference,
      origin,
      destination,
      loadType: getAfterLabel(lines, 'Load Type'),
      trailerType: getAfterLabel(lines, 'Trailer Type'),
      pickupDate: getAfterLabel(lines, 'Pickup Date'),
      deliveryDate: getAfterLabel(lines, 'Delivery Date'),
      comments: getComments(lines),
      valid: Boolean(origin && destination)
    };
  }

  root.LaneFinderParse = {parseQuote, subjectRoute};
  if (typeof module !== 'undefined' && module.exports) module.exports = {parseQuote, subjectRoute};
})(typeof globalThis !== 'undefined' ? globalThis : this);
