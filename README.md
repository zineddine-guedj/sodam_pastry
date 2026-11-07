# Sodam Pastry (소담)

*A Quiet Abundance of Joy*

Front-end website for **Sodam Pastry**, a small home-based pastry kitchen in Algiers, Algeria. The design is inspired by Korean cafés and cozy K-drama bakery scenes: soft beige and white tones, polaroid-style photo cards, gingham patterns and little handwritten notes.

Built with plain **HTML, CSS and JavaScript**. No framework, no build tools, no backend yet.

---

## Features

- **Portfolio:** a gallery of creations, each with a photo and a short description.
- **Reservations:** a 4-step order flow (Pastry, Details, Contact, Review) that ends with a thank-you page.
- **Contact:** phone/WhatsApp, Instagram, email, location and hours.
- **Owner area:** the owner can log in, add, edit and delete creations, and manage reservations.
- **Responsive:** designed for desktop (1440px), tablet (768px) and mobile (390px).

## Pages

| Page | File |
|---|---|
| Home | `index.html` |
| Creations | `creations.html` |
| Creation detail | `creation-detail.html` |
| Reserve · Pastry | `reserve-pastry.html` |
| Reserve · Details | `reserve-details.html` |
| Reserve · Contact | `reserve-contact.html` |
| Reserve · Review | `reserve-review.html` |
| Thank you | `thank-you.html` |
| Contact | `contact.html` |
| Owner login | `admin/login.html` |
| Manage creations | `admin/creations.html` |
| Manage reservations | `admin/reservations.html` |

## Getting started

1. Clone or download the project.
2. Open the folder in **VS Code**.
3. Install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.

> Don't open the HTML files by double-clicking them. Browsers block `fetch()` on the JSON files when a page is opened as `file://`, so the pages need a local server.

## Project structure

```
sodam-pastry/
├── index.html, creations.html, ...   # public pages
├── admin/                            # owner pages
├── assets/                           # logo, images, icons, patterns
├── css/
│   ├── base/                         # variables, reset, typography
│   ├── components/                   # buttons, navbar, cards, forms...
│   ├── pages/                        # one stylesheet per page
│   └── responsive.css                # tablet and mobile rules
├── js/
│   ├── main.js                       # runs on every page
│   ├── components/                   # navbar, footer, carousel, modal
│   ├── pages/                        # one script per page
│   └── utils/                        # storage, validators, WhatsApp link...
└── data/                             # creations, pastries, reservations, config
```

## Design system

**Colors**

| Name | Hex | Use |
|---|---|---|
| White | `#FFFFFF` | Cards, surfaces |
| Canvas | `#F9F9F7` | Page background |
| Cream | `#F5EFE6` | Alternate sections, footer |
| Linen | `#EADFCF` | Top bars, modal backdrop |
| Beige | `#D9C7AE` | Borders, buttons |
| Taupe | `#A89479` | Secondary text |
| Ink | `#2B2B2B` | Main text |
| Gold | `#C9A96E` | Thin lines and dividers only |
| Dusty rose | `#E0B4B4` | Tiny details, hover states |
| Rosewood | `#9B5A63` | Korean text, small highlights |

**Fonts** (loaded from Google Fonts)

| Role | Font |
|---|---|
| Headings | Cormorant Garamond |
| Labels, nav, buttons | Montserrat (uppercase, wide letter-spacing) |
| Body | Inter |
| Korean text | Noto Serif KR |
| Handwritten notes | Gaegu |

**Style rules:** rounded corners (16–24px), very light shadows, 1px gold lines, photos framed like polaroids, and a minimum tap area of 44px on mobile.

## Responsive breakpoints

The Figma frames are 1440px, 768px and 390px. In CSS, write desktop first, then adjust in `css/responsive.css`:

- **Tablet:** `max-width: 1024px`
- **Mobile:** `max-width: 600px`

## Data and storage (temporary)

There is no backend yet, so the site works with local data:

- `data/creations.json`, `pastries.json` and `reservations.json` hold the sample content.
- Reservations and any changes made in the owner area are saved in the browser's `localStorage` through `js/utils/storage.js`.
- The reservation form keeps its answers between the 4 steps in `js/utils/reservation-draft.js`.

> **The owner login is a mock.** It is not secure and only exists so the flow can be demoed. Replace it with real authentication when a backend is added.

## Before launch

- [ ] Replace the placeholders in `data/config.json` (phone, WhatsApp number, email, address, hours).
- [ ] Add the logo and favicon to `assets/logo/`.
- [ ] Export the photos from Figma or from her Instagram into `assets/images/creations/`.
- [ ] Export the icons (flower, cloud, wheat, cake, calendar, gift) into `assets/icons/`.
- [ ] Confirm with the client whether French and Arabic (RTL) versions are needed.
- [ ] Connect a real database and authentication (for example Supabase or Firebase).

## Progress

- [x] Folder structure
- [x] Home page HTML
- [ ] Base CSS (`variables.css`, `reset.css`, `typography.css`)
- [ ] Home page CSS
- [ ] Creations and Creation detail
- [ ] Reservation flow (4 steps) and Thank you
- [ ] Contact
- [ ] Owner area
- [ ] Responsive pass (tablet and mobile)
- [ ] Accessibility and performance check

## Credits

Design: Sodam Pastry UI kit and layouts (Figma).
Instagram: [@sodam_pastry](https://www.instagram.com/sodam_pastry)