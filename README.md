# Lane Finder

A small, open-source **Chrome Manifest V3** widget for manually extracting a
freight lane from the **currently open Gmail quote email** and planning a route.
The public example data is entirely **fictional**.

> **Important:** This is an independent sample utility, not affiliated with
> Google, Gmail or any freight company. Standard driving directions are not
> truck-verified routing; transit estimates are rough planning aids, not
> delivery guarantees.

## Features

- Draggable / minimizable floating widget in Gmail.
- Click **Read open email** to extract pickup, delivery, reference, equipment,
  dates and comments from the visible email only. **No automatic mail scanning.**
- Edit cities, postal codes or complete pickup/delivery addresses directly.
- Swap locations, copy a lane summary, or open Google Maps directions.
- Optional Google Routes API integration to calculate road kilometres, miles,
  drive time and estimated FTL driving days.
- No tracking, third-party code packages, CDNs, embedded images, or analytics.

## Installation (unpacked extension)

1. Download or clone this repository (or extract its ZIP).
2. Open Chrome `chrome://extensions` and enable **Developer mode**.
3. Click **Load unpacked** and select the folder containing `manifest.json`.
4. Open Gmail and reload it. A Lane Finder widget appears.
5. Open an email, expand the message, and click **Read open email**.
   Or type the locations manually. There is no background email parsing.

To run the local tests (Node.js 18+):

```bash
npm test
npm run check
```

## Example (fictional)

Subject: `Kingston ON to London ON, reference # DEMO-101, BULK-LTL`

Body:

```text
New Quote Request
Load Type: BULK-LTL
Trailer Type: flatbedWithTarps
Pickup Date: 2026-11-04
Delivery Date: 2026-11-06
ORIGIN
Kingston, ON
DESTINATION
London, ON
COMMENTS
2 units, 75 x 66 x 66 inches each.
Requested by:
Sample customer
```

## Distance / route options

**Open Maps is free of developer API keys:** it opens a Google Maps URL with the
entered pickup and delivery details. Google Maps shows directions and distance
in its own interface; Lane Finder cannot capture those results automatically.

**Calculate road route** (optional): in Google Cloud, enable billing and the
**Google Routes API**. Create your **own** key, restrict it to the Routes API,
and enforce a small quota. Paste the key in Lane Finder **Settings** on your
own machine. **Never paste or commit a real key into source files or GitHub.**

The extension stores the key in the local Chrome profile; it is accessible to
someone with access to that profile, so this direct client-key method is
appropriate only for a personal experiment. For team/public production use,
use an authenticated backend rather than a shared browser-embedded paid key.

- Routes API: https://developers.google.com/maps/documentation/routes
- Routes billing: https://developers.google.com/maps/documentation/routes/usage-and-billing
- Maps URLs: https://developers.google.com/maps/documentation/urls/get-started

**Calculation:** rough FTL driving days = `max(1, ceil(estimated road drive hours /
selected driving hours per day))`, plus a one-day illustrative planning window.
The default is 10 driving hours per day. This is **not** a legal HOS calculation,
not a guaranteed transit service, and **not** an LTL terminal transit estimate.

## Data handling & extension permissions

| Permission or access | Reason |
| --- | --- |
| `https://mail.google.com/*` content script | Show widget on Gmail and parse a *visible open message only when asked*. |
| `storage` | Save minimize preference, planning hours, and optional user key locally. |
| `https://routes.googleapis.com/*` host permission | Make a user-triggered Routes API request with two locations. |

See [PRIVACY.md](PRIVACY.md) for exact data flows, and
[SECURITY.md](SECURITY.md) for limits. This version has no Gmail OAuth,
remote script dependencies, or telemetry.

## Publishing safely

This release intentionally contains **no employer name, company branding,
real quote, user email, customer example, customer screenshot, or API key**.
All code uses original CSS/HTML/JavaScript; the MIT license only applies to
materials for which you have permission to license.

Read [PUBLISHING_CHECKLIST.md](PUBLISHING_CHECKLIST.md) before creating a
public GitHub repository. Uploading to GitHub **does not guarantee freedom
from copyright, confidentiality, security, employer ownership, privacy or
Chrome Web Store obligations**. GitHub repo visibility and Chrome Web Store
approval are separate things.

## Limitations

- Parser is tailored to a simple quote-request pattern and depends on Gmail's
  HTML structure. It may fail when Gmail changes or a customer uses a different
  email template. There is **no OCR or PDF reading**.
- Without a Routes API key, numbers do not populate inside the widget; use
  **Open Maps** to view the route in Google Maps instead.
- This is a personal prototype, not a security-audited product.

## License

MIT; see [LICENSE](LICENSE). Before licensing work done for an employer, confirm
who owns the relevant intellectual property.
