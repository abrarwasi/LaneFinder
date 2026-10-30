# Security policy

This repository is a learning-oriented browser extension and has **not**
received an independent security audit. It is not certified for production,
enterprise deployment, or sensitive logistics/customer workflows.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature if enabled for the
repository. Otherwise, contact the maintainer privately through a channel they
explicitly provide. **Do not put secrets, API keys or private shipment data in
public GitHub issues.**

## Security and deployment notes

- Install only from source you have inspected.
- Minimum permission scope: Gmail content script; `storage`; Routes API host.
- Email parsing is explicitly triggered by user click, not by page-change events.
- Never commit an API key. Users enter their own key at runtime.
- Keys saved in `chrome.storage.local` can be recovered by someone with access
  to the browser profile and may not qualify as securely stored credentials.
- For wider distribution or team use, move paid API access to a properly
  authenticated server-side proxy and restrict its quotas and abuse.
- Google route results use standard driving roads, **not truck-verified routing**.
- Verify legal hours of service, equipment restrictions, road conditions, and
  appointments with carriers before making freight commitments.
- Changes to data access or external calls must be disclosed in `PRIVACY.md`.
