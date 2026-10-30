(() => {
  'use strict';
  if (window.__laneFinderInjected) return;
  window.__laneFinderInjected = true;

  const host = document.createElement('div');
  host.id = 'lane-finder-root';
  host.style.cssText = 'all:initial;position:fixed;top:105px;right:18px;z-index:2147483646;font-family:Arial,sans-serif';
  const shadow = host.attachShadow({mode: 'closed'});
  shadow.innerHTML = `
  <style>
    :host {color-scheme: light;}
    * {box-sizing:border-box}
    .shell {width:346px;max-height:min(88vh,790px);overflow:auto;background:#fff;border:1px solid #d7e2ed;border-radius:15px;box-shadow:0 16px 50px rgba(12,31,56,.22);font:13px/1.38 -apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#17253a}
    .head {background:linear-gradient(110deg,#123c75,#1462a6);display:flex;align-items:center;gap:9px;color:#fff;padding:12px 13px;cursor:move;touch-action:none;user-select:none}
    .head .logo {width:30px;height:30px;background:#ffffff26;border:1px solid #ffffff44;border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px}
    .head .heading {flex:1;font-size:14px;font-weight:750;letter-spacing:.15px}
    .head .sub {font-size:10px;font-weight:400;color:#cfdef2}
    .head button {border:0;color:#fff;background:#ffffff20;border-radius:7px;width:28px;height:28px;cursor:pointer;font-size:17px}
    .body {padding:12px;display:grid;gap:11px}
    .info {padding:8px 9px;background:#f1f6fb;border-radius:8px;color:#50627c;font-size:11px}
    .info.ok {background:#eaf8f0;color:#176140}
    .info.err {background:#fff0ee;color:#a63227}
    .toprow,.actions,.twocol {display:flex;gap:7px;align-items:center}
    .toprow button {flex:1}
    .btn {cursor:pointer;background:#eaf1f9;border:1px solid #d1dfec;color:#184878;border-radius:8px;padding:8px 9px;font-weight:650;font:inherit}
    .btn.primary {background:#155b9c;color:#fff;border-color:#155b9c;font-weight:650}
    .btn:disabled {opacity:.5;cursor:not-allowed}
    .btn.icon {flex:none;min-width:34px}
    .field {display:grid;gap:4px;min-width:0;flex:1}
    label {font-weight:700;color:#50627c;font-size:11px}
    input,select {width:100%;background:#fff;border:1px solid #bdcede;border-radius:8px;font:inherit;padding:9px;color:#17253a;outline-color:#1d72be}
    .lane {display:grid;gap:8px}
    .sectionline {font-size:10px;letter-spacing:1px;font-weight:800;color:#53718e;text-transform:uppercase}
    .summary {background:#f4f7fb;border:1px solid #e4ebf3;padding:9px;border-radius:9px;display:grid;gap:5px}
    .tag {display:inline-block;padding:2px 5px;border-radius:4px;background:#e0ebf6;color:#1c507d;font-weight:700;font-size:10px}
    .summary div {overflow-wrap:anywhere}
    #comments {white-space:pre-line;max-height:68px;overflow:auto;color:#55657a;font-size:11px}
    .result {background:#eff6fd;border:1px solid #d9e8f7;padding:11px;border-radius:10px}
    .result.hidden,.hidden {display:none!important}
    .stats {display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:7px 0}
    .stats b {display:block;font-size:19px;line-height:1.1;color:#123c75}
    .stats small {color:#62748d;font-size:10px}
    .warning {font-size:10px;color:#657690;margin-top:6px}
    details {border-top:1px solid #dfe8f1;padding-top:8px}
    summary {cursor:pointer;color:#265784;font-weight:650;font-size:12px}
    details .field {margin:9px 0}
    .footer {font-size:10px;color:#8693a8;text-align:center;padding:0 5px 9px}
    .minimized {width:172px;overflow:hidden}
    .minimized .head {cursor:move;border-radius:13px}
    .minimized .body,.minimized .footer {display:none}
    .shell.minimized {border-radius:13px}
    .external {color:#1a6eaf;text-decoration:underline;cursor:pointer;border:none;background:transparent;font:inherit;font-size:11px;padding:0}
  </style>
  <div class="shell" id="shell">
    <div class="head" id="dragHeader">
      <div class="logo">↗</div><div class="heading">Lane Finder<div class="sub">Freight quote helper · v0.2</div></div>
      <button id="minimize" title="Minimize" aria-label="Minimize widget">−</button>
      <button id="close" title="Hide widget" aria-label="Hide widget">×</button>
    </div>
    <div class="body">
      <div id="status" class="info">Open a quote email, then click Read open email. Nothing is read automatically.</div>
      <div class="toprow"><button id="scan" class="btn primary">↻ Read open email</button><button id="clear" class="btn">Clear</button></div>
      <div id="details" class="summary hidden">
        <div><span class="sectionline">Detected quote</span> <span id="ref" class="tag"></span></div>
        <div id="load"></div><div id="dates"></div><div id="comments"></div>
      </div>
      <div class="lane">
        <div class="field"><label for="origin">Pickup city, postal code or address</label><input id="origin" placeholder="Kingston, ON" autocomplete="off" /></div>
        <div class="toprow"><button id="swap" class="btn icon" title="Swap pickup and delivery">⇅ Swap</button><span style="font-size:10px;color:#7b8da4">Use a full address for precise routing</span></div>
        <div class="field"><label for="destination">Delivery city, postal code or address</label><input id="destination" placeholder="London, ON" autocomplete="off" /></div>
      </div>
      <button id="calculate" class="btn primary" style="width:100%">Calculate road route</button>
      <div id="result" class="result hidden" aria-live="polite">
        <div class="sectionline">Road route result</div>
        <div class="stats"><div><small>Distance</small><b id="distance">—</b><small id="miles">—</small></div><div><small>Estimated driving</small><b id="drive">—</b><small>Standard vehicle route</small></div><div><small>FTL driving days</small><b id="days">—</b><small id="hoursLabel">At 10 driving h/day</small></div><div><small>FTL planning window</small><b id="window">—</b><small>Indicative, not guaranteed</small></div></div>
        <div class="warning">Not a truck-verified route. Freight transit excludes loading, border, appointments, disruptions and LTL terminal time.</div>
      </div>
      <div class="actions"><button class="btn" id="maps" style="flex:1">Open Maps ↗</button><button class="btn" id="copy" style="flex:1">Copy lane</button></div>
      <details id="settings"><summary>⚙ Settings / Google Routes API</summary>
        <div class="field"><label for="apiKey">Google Routes API key (saved on this device)</label><input type="password" id="apiKey" placeholder="Paste API key" spellcheck="false" autocomplete="off" /></div>
        <div class="field"><label for="hoursPerDay">Planning assumption: driving hours per day</label><select id="hoursPerDay"><option value="8">8 hours</option><option value="10" selected>10 hours</option><option value="11">11 hours</option></select></div>
        <div class="toprow"><button class="btn" id="saveSettings">Save settings</button><button class="btn" id="removeKey">Remove key</button></div>
        <div class="warning">Optional: route calculations require your own Google Routes API key and billing. Clicking Calculate sends the pickup and delivery strings to Google; Open Maps sends them to Google Maps. No email text or comments are sent.</div>
      </details>
    </div>
    <div class="footer">Email parsing starts only when you click Read · No inbox-wide scanning</div>
  </div>`;
  document.documentElement.appendChild(host);

  const $ = id => shadow.getElementById(id);
  let currentQuote = null;
  let lastRoute = null;
  let minimized = false;
  let hoursPerDay = 10;

  function status(message, type) {
    const node = $('status'); node.textContent = message;
    node.className = 'info' + (type ? ' ' + type : '');
  }
  function fillText(id, value) {$(id).textContent = value || ''}
  function clearRoute() {lastRoute = null; $('result').classList.add('hidden')}
  function setLocations(origin, destination) {
    $('origin').value = origin; $('destination').value = destination;
    clearRoute();
  }

  function readOpenGmail() {
    const subject = document.querySelector('h2.hP')?.innerText?.trim() || '';
    const bodies = [...document.querySelectorAll('[role="main"] .a3s')].filter(node => node.getClientRects().length && node.innerText?.trim());
    const body = (bodies.length ? bodies[bodies.length-1].innerText : '') || '';
    if (!subject && !body) return null;
    // If a thread is collapsed or Gmail markup changes, the subject alone may still contain both cities.
    const parsed = window.LaneFinderParse.parseQuote(subject, body);
    if (!parsed.valid) return null;
    return parsed;
  }

  function applyQuote(q) {
    if (!q) {
      status('Could not detect both cities. Open/expand a quote request or type locations manually.', 'err');
      return false;
    }
    currentQuote = q;
    setLocations(q.origin, q.destination);
    $('details').classList.remove('hidden');
    fillText('ref', q.reference ? '#' + q.reference : 'Quote request');
    fillText('load', [q.loadType, q.trailerType].filter(Boolean).join(' · ') || 'Equipment not specified');
    fillText('dates', [q.pickupDate && `Pickup ${q.pickupDate}`, q.deliveryDate && `Delivery ${q.deliveryDate}`].filter(Boolean).join(' · '));
    fillText('comments', q.comments || '');
    $('comments').classList.toggle('hidden', !q.comments);
    status(`Read open quote: ${q.origin} → ${q.destination}`, 'ok');
    return true;
  }

  function calculateTransit(seconds) {
    const h = seconds / 3600;
    const days = Math.max(1, Math.ceil(h / hoursPerDay));
    return {days, window: days === 1 ? '1–2 days' : `${days}–${days+1} days`};
  }
  function renderRoute() {
    if (!lastRoute) return;
    const km = lastRoute.distanceMeters / 1000;
    const hrs = lastRoute.durationSeconds / 3600;
    const transit = calculateTransit(lastRoute.durationSeconds);
    fillText('distance', Math.round(km).toLocaleString('en-CA') + ' km');
    fillText('miles', Math.round(km * 0.621371).toLocaleString('en-CA') + ' mi');
    fillText('drive', hrs < 1 ? Math.round(hrs * 60) + ' min' : `${Math.floor(hrs)}h ${Math.round((hrs%1)*60)}m`);
    fillText('days', String(transit.days));
    fillText('window', transit.window);
    fillText('hoursLabel', `At ${hoursPerDay} driving h/day`);
    $('result').classList.remove('hidden');
  }

  // Privacy by design: read the email only after an explicit user click.
  $('scan').addEventListener('click', () => applyQuote(readOpenGmail()));
  $('clear').addEventListener('click', () => {
    setLocations('', ''); currentQuote=null;
    $('details').classList.add('hidden'); status('Enter a lane or open a quote request.', '');
  });
  for (const field of ['origin','destination']) $(field).addEventListener('input', () => {clearRoute()});
  $('swap').addEventListener('click', () => {
    const a = $('origin').value; $('origin').value = $('destination').value; $('destination').value = a;
    clearRoute(); status('Pickup and delivery swapped. Calculate again.');
  });
  $('calculate').addEventListener('click', async () => {
    const origin=$('origin').value.trim(), destination=$('destination').value.trim();
    if (!origin || !destination) return status('Enter both locations first.', 'err');
    $('calculate').disabled = true; $('calculate').textContent = 'Calculating…';
    status('Requesting a driving route from Google Routes…');
    try {
      const response = await chrome.runtime.sendMessage({type:'CALCULATE_ROUTE',origin,destination});
      if (!response?.ok) throw new Error(response?.error || 'Route service unavailable.');
      if (origin !== $('origin').value.trim() || destination !== $('destination').value.trim()) {
        status('Locations changed during lookup; please calculate again.');
        return;
      }
      lastRoute = response; renderRoute();
      status('Road route calculated successfully.', 'ok');
    } catch (error) {
      status(error.message || 'Unable to calculate route.', 'err');
      if (/API key/i.test(error.message || '')) $('settings').open=true;
    } finally {$('calculate').disabled=false;$('calculate').textContent='Calculate road route'}
  });
  $('maps').addEventListener('click', () => {
    const a=$('origin').value.trim(),b=$('destination').value.trim();
    if(!a || !b) return status('Enter both locations first.', 'err');
    window.open('https://www.google.com/maps/dir/?api=1&origin='+encodeURIComponent(a)+'&destination='+encodeURIComponent(b)+'&travelmode=driving', '_blank', 'noopener,noreferrer');
  });
  $('copy').addEventListener('click', async () => {
    const a=$('origin').value.trim(),b=$('destination').value.trim();
    if (!a || !b) return status('Enter both locations first.', 'err');
    const lines=[`${a} → ${b}`];
    if(currentQuote?.reference) lines.push(`Reference: #${currentQuote.reference}`);
    if(currentQuote?.loadType) lines.push(`Load: ${currentQuote.loadType}`);
    if(currentQuote?.trailerType) lines.push(`Equipment: ${currentQuote.trailerType}`);
    if(lastRoute) {
      const h=lastRoute.durationSeconds/3600;
      lines.push(`Road distance: ${Math.round(lastRoute.distanceMeters/1000)} km (${Math.round(lastRoute.distanceMeters/1609.344)} mi)`);
      lines.push(`Estimated drive time: ${h.toFixed(1)} h`);
      lines.push(`Indicative FTL planning window: ${calculateTransit(lastRoute.durationSeconds).window}`);
    }
    try {await navigator.clipboard.writeText(lines.join('\n'));status('Lane information copied.', 'ok')}
    catch {status('Clipboard unavailable; select the fields and copy manually.', 'err')}
  });

  $('saveSettings').addEventListener('click', async () => {
    const key=$('apiKey').value.trim();
    const settings={hoursPerDay:Number($('hoursPerDay').value)};
    if(key) settings.googleRoutesKey=key;
    await chrome.storage.local.set(settings);
    hoursPerDay=settings.hoursPerDay;
    $('apiKey').value='';
    renderRoute();status('Settings saved locally.','ok');
  });
  $('removeKey').addEventListener('click', async () => {
    await chrome.storage.local.remove('googleRoutesKey');$('apiKey').value='';
    status('Google Routes API key removed.','ok');
  });
  chrome.storage.local.get(['hoursPerDay','minimized'], settings => {
    if([8,10,11].includes(settings.hoursPerDay)) {hoursPerDay=settings.hoursPerDay;$('hoursPerDay').value=String(hoursPerDay)}
    if(settings.minimized) toggleMinimized(true);
  });

  function toggleMinimized(force) {
    minimized = typeof force === 'boolean' ? force : !minimized;
    $('shell').classList.toggle('minimized', minimized);
    $('minimize').textContent=minimized?'+':'−';
    $('minimize').title=minimized?'Expand':'Minimize';
    chrome.storage.local.set({minimized});
  }
  $('minimize').addEventListener('click', event => {event.stopPropagation();toggleMinimized()});
  $('close').addEventListener('click', event => {event.stopPropagation();host.style.display='none'});
  chrome.runtime.onMessage.addListener(message => {
    if(message?.type !== 'TOGGLE_WIDGET') return;
    if(host.style.display==='none') host.style.display='';
    else toggleMinimized();
  });

  // Move widget by dragging the blue header; don't interfere with Gmail scroll or inputs.
  let drag=null;
  $('dragHeader').addEventListener('pointerdown', event => {
    if(event.button!==0 || event.target.closest('button')) return;
    const rect=host.getBoundingClientRect();
    drag={x:event.clientX,y:event.clientY,left:rect.left,top:rect.top};
    $('dragHeader').setPointerCapture(event.pointerId);
  });
  $('dragHeader').addEventListener('pointermove', event => {
    if(!drag) return;
    const x=Math.min(Math.max(0,drag.left+event.clientX-drag.x),Math.max(0,window.innerWidth-host.offsetWidth));
    const y=Math.min(Math.max(0,drag.top+event.clientY-drag.y),Math.max(0,window.innerHeight-40));
    host.style.right='auto';host.style.left=x+'px';host.style.top=y+'px';
  });
  $('dragHeader').addEventListener('pointerup', () => {drag=null});
  $('dragHeader').addEventListener('pointercancel', () => {drag=null});

})();
