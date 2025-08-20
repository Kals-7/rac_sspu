## RAC Club Website

A clean, responsive static site scaffold for a club with four main sections, each containing multiple subsections:

- About: Mission, Vision, History, Leadership
- Events: Upcoming, Past, Workshops, Competitions
- Membership: Join, Benefits, Fees, FAQ
- Resources: Documents, Gallery, Sponsors, Contact

### Quick start

- Open `index.html` directly in your browser, or run a lightweight server:
  - Python 3: `python -m http.server 8000`
  - Node (npx): `npx serve .`

Then visit `http://localhost:8000` (or the URL shown by your server).

### Customize

- Update the club name, descriptions, and links in `index.html`.
- Colors and layout are defined in `styles.css` (CSS variables at the top).
- Subsection switching logic lives in `script.js`.
- Replace gallery placeholders by adding images and swapping `.photo` elements with `<img>` tags.
- Hook up the membership form to a backend or a form service to capture submissions.

### Structure

- `index.html`: Markup and content
- `styles.css`: Visual design and layout
- `script.js`: Interactivity (tabs, mobile nav, smooth scrolling)

### Notes

- This scaffold is fully static and requires no build step.
- Works on modern browsers; graceful fallbacks are included. 