# Planet G - Header & Footer Partials Guide

Aapko ab har page me alag se Header ya Footer edit karne ki bilkul zaroorat nahi hai.

### Files:
- **`partials/header.html`**: Master Topbar, Navbar, aur Menu Drawer modal.
- **`partials/footer.html`**: Master 4-Column Footer aur Horizontal Company Menu bar.

### Kaise Use Karein:
1. `partials/header.html` ya `partials/footer.html` me jo bhi change karna ho, edit karke save karein.
2. `NewPlanetG` folder me jakar **`sync-components.bat`** par double click karein (ya terminal me `powershell .\sync-components.ps1` chalayein).
3. Script automatic sabhi 6 pages (`index.html`, `services.html`, `about.html`, `projects.html`, `testimonials.html`, `contact.html`) me updated header & footer daal dega, aur har page ka `active` navigation link bhi khud set kar dega.

### Fayde:
- **100% SEO Friendly**: Googlebot aur search engine crawlers ko pure static HTML milta hai (zero client-side delay).
- **100% Offline Compatible**: Windows Explorer se bina server ke double click karne par bhi CORS error nahi aata.
- **Single Source of Truth**: Header/Footer bas 1 jagah edit karna hota hai.
