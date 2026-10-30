# Privacy and data flow

Lane Finder v0.2 is a **local Chrome extension** with no user accounts, analytics,
cloud database, advertising, or remote JavaScript.

## What the extension accesses

- The Chrome extension's content script is limited to `https://mail.google.com/*`.
- **Only when you click "Read open email"** it reads the visible Gmail subject and
  visible body of the open message to find locations and selected quote details.
- It does not call Gmail APIs, download attachments, read hidden messages, scrape
  the inbox list, or automatically monitor emails.
- Extracted quote details are held in memory in the current tab. They are not
  written to extension storage and are discarded when the page is reloaded.
- Chrome local storage contains only user interface preferences and, if provided,
  the user's Google Routes API key. Local Chrome storage is *not* a secure vault.

## External requests (user-initiated only)

- **Calculate road route:** sends only the pickup and delivery location strings
  to Google's Routes API using your key. Billing, Google terms, and Google privacy
  rules apply. The full email body, subject, quote comments, and reference are
  not sent to the route API.
- **Open Maps:** opens a Google Maps directions URL containing the two entered
  locations. Google receives those values as part of that request.
- **Copy lane:** copies the displayed lane summary to the system clipboard.
  This may include a quote reference if you have opted to read an email.

No routes are sent to the developer or to this project's maintainers.

## Workplace note

Do not upload real customer emails, screenshots, addresses, quotes, account
numbers, or proprietary forms into public issues or commits. Obtain your
employer's approval before reading work emails with any extension.
