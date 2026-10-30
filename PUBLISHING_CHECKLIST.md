# Checklist before publishing a public repository

This project is packaged to reduce risks, **not to bypass or guarantee passage
through GitHub or Chrome Web Store reviews**.

- [ ] Confirm you have the right to publish the code; review any employment,
      contractor, and third-party intellectual-property/confidentiality terms.
- [ ] Confirm this README, source, commit history, and all future screenshots
      contain **no** real customer/client identifiers, private work emails,
      proprietary documents, pricing, addresses, or confidential information.
- [ ] Confirm no real API keys, credentials or private URLs in files **or git history**.
- [ ] Review `LICENSE`, `PRIVACY.md`, `SECURITY.md`, and the limited-use data flow.
- [ ] Run `npm test` and `npm run check`.
- [ ] Test **Load unpacked** on Gmail, including empty/collapsed threads and
      handling of a malformed subject.
- [ ] Check Chrome Web Store policies separately if you intend to publish to
      the Store (GitHub hosting alone is a separate process).
- [ ] If deploying to colleagues, get approval before reading workplace mail;
      use private infrastructure for paid API credentials.
- [ ] Recheck that third-party API usage and Google Maps terms are compatible
      with the intended use and that billing quotas are configured.
- [ ] If you edit the project to add images/icons/libraries, record their
      original source, copyright owner and exact license terms.
