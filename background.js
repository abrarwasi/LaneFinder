"use strict";

chrome.action.onClicked.addListener(async tab => {
  if (!tab.id) return; // Only the Gmail content script can receive this message.
  try { await chrome.tabs.sendMessage(tab.id, {type: 'TOGGLE_WIDGET'}); }
  catch (error) { console.warn('Lane Finder: open Gmail and reload to use the widget', error); }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'CALCULATE_ROUTE') return;
  // Only answer our own content script running on a Gmail tab.
  if (!sender.url?.startsWith('https://mail.google.com/')) {
    sendResponse({ok: false, error: 'Unexpected request origin.'});
    return;
  }
  (async () => {
    const {googleRoutesKey: key} = await chrome.storage.local.get('googleRoutesKey');
    if (!key) throw new Error('Add a Google Routes API key in Settings first.');
    const origin = String(message.origin || '').trim().slice(0, 250);
    const destination = String(message.destination || '').trim().slice(0, 250);
    if (!origin || !destination) throw new Error('Enter pickup and delivery locations.');
    const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration'
      },
      body: JSON.stringify({
        origin: {address: origin}, destination: {address: destination},
        travelMode: 'DRIVE', routingPreference: 'TRAFFIC_UNAWARE',
        units: 'METRIC', languageCode: 'en-CA'
      })
    });
    const json = await response.json();
    if (!response.ok) {
      const msg = json?.error?.message || `Google Routes API HTTP ${response.status}`;
      throw new Error(msg.slice(0, 350));
    }
    const route = json.routes?.[0];
    if (!route || typeof route.distanceMeters !== 'number') throw new Error('No road route returned. Check the locations.');
    return {ok: true, distanceMeters: route.distanceMeters, durationSeconds: Number.parseFloat(route.duration) || 0};
  })().then(sendResponse).catch(error => sendResponse({ok:false, error:String(error?.message || error)}));
  return true;
});
