# Portfolio Website — Full Build Prompt (for Graphic Designer)

Build a complete personal portfolio website for a **Graphic Designer** using the architecture and technical style described below.

---

## 1. OVERALL ARCHITECTURE

The website is a Single Page Application (SPA) using pure HTML/CSS/JS (no frameworks). All content is data-driven, rendered dynamically from JSON files — nothing is hardcoded in HTML.

### Folder Structure:

```
portfolio/
├── index.html              ← Main page (skeleton HTML, content rendered by JS)
├── assets/
│   ├── css/style.css       ← All styling
│   ├── js/main.js          ← Render logic, animations, interactions
│   └── media/              ← Images, videos, PDFs (avatar, projects, CV)
├── data/
│   ├── profile.json        ← Personal info, skills, timeline, socials
│   ├── projects.json       ← Project list (highlights + categories)
│   ├── site.json           ← Meta tags, title, section titles, SEO
│   └── ui-config.json      ← Loading screen, cursor, typing effect, modal config
```

---

## 2. DESIGN SYSTEM & THEME

## 2. DESIGN SYSTEM & THEME

### Style: Cyber Esports Arcade / Neon Fantasy Game Event

- **Heading font:** "Russo One", "Rajdhani", or "Orbitron" (Google Fonts) — bold esports display font with sharp geometric shapes, suitable for large glowing game-event titles
- **Body font:** "Rajdhani", "Noto Sans", system sans-serif (Segoe UI, Tahoma...) — clean futuristic UI font for readable event rules, rewards, and descriptions
- **Dark background:** `#08051f` — deep purple-navy base, with radial gradients using `#1a0f3f`, `#2a145f`, and `#060716`
- **Primary color:** `#00eaff` — neon cyan, used for title glow, borders, HUD outlines, buttons, progress indicators, and key interactive elements
- **Secondary color:** `#b14cff` — electric purple/magenta, used for gradient title effects, panel lighting, hover states, and cyber arcade accents
- **Accent color:** `#ffd45a` — reward gold, used sparingly for coins, badges, prize highlights, level markers, and important reward numbers
- **Highlight color:** `#ffffff` — sharp white rim light for title edges, icon highlights, and premium glossy UI emphasis
- **Panel color:** `rgba(20, 10, 55, 0.78)` — semi-transparent dark violet HUD panels with inner glow and soft blur
- **Border style:** 1–2px neon cyan borders with angular clipped corners, pixel-corner decorations, and thin inner purple strokes
- **Heading style:** oversized esports title treatment with cyan-to-purple gradient fill, white top highlight, dark purple extrusion, subtle glitch/pixel offset, and strong outer glow
- **Button style:** rectangular cyber HUD buttons with cyan border, purple gradient background, glowing hover state, and small pixel-square corner details
- **Card style:** floating reward cards and rank panels with dark translucent background, neon cyan frame, purple bloom, and gold reward icons
- **Progress / level style:** vertical arcade meter or ranked ladder layout with glowing cyan bars, numbered circular markers, and purple-blue light trails
- **Glow effects:** text-shadow and box-shadow using layered cyan/purple bloom, e.g. `0 0 12px #00eaff`, `0 0 28px #b14cff`, plus subtle gold glow for rewards
- **Pixel accents:** small decorative pixel squares, 8-bit corner blocks, dotted particles, and step indicators; use as UI ornamentation, not as the main illustration style
- **Character art style:** semi-realistic fantasy/MOBA splash art with dynamic poses, glossy highlights, saturated rim lighting, and dramatic cyan-purple color grading
- **Background effects:** layered radial gradients, abstract wave trails, floating particles, glowing square pixels, and soft depth blur to create a premium game-event atmosphere
- **Overlay effects:** subtle digital grid, faint scanline/noise overlay, neon bloom, and low-opacity pixel particles to enhance the cyber arcade feeling
- **Custom cursor:** futuristic cyan pixel/HUD cursor or glowing triangular pointer matching the neon UI style

### Light Theme:

- Toggle button (floating, top-right corner) styled as a small neon HUD control with cyan outline and purple glow
- Light theme uses CSS variable overrides: pale lavender background `#f6f2ff`, primary becomes royal purple `#6b3fd6`, secondary becomes teal-cyan `#159fb3`, accent remains reward gold `#d99a00`
- Dark panels become soft translucent lavender cards with reduced glow and clearer contrast
- Scanline/noise overlay disabled or reduced to very low opacity
- Glow effects reduced by 60–70%, keeping only subtle cyan/purple shadows for premium UI depth
- Pixel accents remain visible but softer, using lavender, teal, and muted purple instead of intense neon

---

## 3. SECTIONS (top to bottom)

### 3.1 Loading Screen

- Displays a pixel art icon + progress bar + "Loading..." text
- Configured from `ui-config.json`
- Hidden after data finishes loading

### 3.2 Navbar (fixed top)

- Brand name (pixel font, yellow glow)
- Links: Home, Highlights, About, Projects, Experience, Contact, View CV
- Responsive: hamburger menu on mobile
- Active link highlight on scroll

### 3.3 Hero Section

- Full viewport height
- "Hi, I'm [Name]" — pixel font with glow
- Typing effect for tagline (loops through multiple phrases from config)
- CTA buttons: "View My Work" + "View CV"
- RPG Stats Bar: displays stats (Years EXP, Projects Completed, Clients Served) as pixel cards with icon, animated count-up value, and label
- Scroll hint: "Press ▼ to continue" + bouncing arrow

### 3.4 Highlights Section

- Displays 1–3 featured projects in full-width layout
- Layout: image/video on left, text on right (alternates per item)
- Video hover preview: hovering the image plays the video
- Buttons: "Detail"
- Badge showing project count if multiple versions exist

### 3.5 About Section

- Avatar (supports both image and looping video) with zoom/offset config
- Description text (HTML allowed)
- Quote in pixel font with border-left accent

### 3.6 Skills Section

- Grid cards (3 columns on desktop, responsive)
- Each card: icon + title (pixel font) + description + animated progress bar
- Pagination if many skills (6–9 per page)
- Slide animation when changing pages

### 3.7 Projects Section

- Filter bar: "All" + category buttons
- Each category displays a grid of cards (3 columns, 6 per page)
- Project card: thumbnail (hover → video preview), title, tech tags, "Detail" button
- Pagination per category with slide animation
- Click "Detail" → opens Modal

### 3.8 Project Detail Modal

- Video player (local or embed)
- Meta badges: Duration + Role
- Description (HTML)
- Design Process section
- Tools Used section
- Store/portfolio links
- Tech/tool tags

### 3.9 Experience Timeline

- Vertical timeline, items alternate left/right
- Each item: period, role, company, description
- Dot markers on the timeline line
- Responsive: single column on mobile

### 3.10 Contact Section

- Form: Name, Email, Message
- Submit via Formspree (or similar)
- Pixel font labels, dark-styled inputs

### 3.11 Footer

- Social links (icons)
- Copyright text

---

## 4. ANIMATIONS & INTERACTIONS

- **Scroll Reveal:** elements fade-in + translateY when scrolling into viewport (IntersectionObserver)
- **Variants:** from-left, from-right, scale-up
- **Stagger delay** for children elements
- **Count-up animation** for stats
- **Typing effect** loop for hero tagline
- **Video hover preview** on project cards
- **Card hover:** translateY(-4px) + glowing border
- **Button bounce** animation on card hover
- **Page transition:** slide-out/slide-in when changing pages
- **Smooth scroll** for nav links
- **Theme transition:** smooth CSS variable change

---

## 5. DATA FORMAT

### profile.json

```json
{
  "hero": {
    "name": "Your Name",
    "tagline": "Graphic Designer | Visual Storyteller",
    "cta": "View My Work"
  },
  "stats": [
    { "icon": "🎨", "value": "auto", "label": "Years EXP", "startDate": "2020-01" },
    { "icon": "📁", "value": "50+", "label": "Projects Done" },
    { "icon": "🤝", "value": "30+", "label": "Clients Served" }
  ],
  "about": {
    "description": "Graphic Designer with X years of experience specializing in branding, visual identity, and digital design...",
    "cvLink": "assets/media/CV.pdf",
    "avatar": "assets/media/avatars/avatar.jpg",
    "avatarZoom": 1.2,
    "avatarOffsetX": 0,
    "avatarOffsetY": 0,
    "quote": "Design is not just what it looks like — it's how it works."
  },
  "skills": [
    { "icon": "bi-palette", "title": "Branding & Identity", "desc": "Logo design, brand guidelines, visual systems" },
    { "icon": "bi-fonts", "title": "Typography", "desc": "Type pairing, custom lettering, hierarchy" },
    { "icon": "bi-layout-text-window", "title": "Layout Design", "desc": "Editorial, print, multi-page documents" },
    { "icon": "bi-brush", "title": "Illustration", "desc": "Digital illustration, icon sets, infographics" },
    { "icon": "bi-image", "title": "Photo Editing", "desc": "Retouching, compositing, color grading" },
    { "icon": "bi-film", "title": "Motion Graphics", "desc": "Animated logos, social media content, transitions" },
    { "icon": "bi-printer", "title": "Print Design", "desc": "Packaging, posters, business cards, brochures" },
    { "icon": "bi-phone", "title": "UI/UX Design", "desc": "Wireframes, prototypes, design systems, Figma" }
  ],
  "timeline": [
    { "period": "2023 – Present", "role": "Senior Graphic Designer", "company": "Creative Agency", "desc": "Leading brand identity projects, mentoring junior designers, managing client relationships." },
    { "period": "2021 – 2023", "role": "Graphic Designer", "company": "Design Studio", "desc": "Created visual identities, marketing materials, and digital assets for various clients." },
    { "period": "2020 – 2021", "role": "Junior Designer", "company": "Freelance", "desc": "Started freelancing, building portfolio with logo design, social media graphics, and print materials." }
  ],
  "socials": [
    { "icon": "bi-behance", "link": "https://behance.net/yourname" },
    { "icon": "bi-dribbble", "link": "https://dribbble.com/yourname" },
    { "icon": "bi-instagram", "link": "https://instagram.com/yourname" },
    { "icon": "bi-linkedin", "link": "https://linkedin.com/in/yourname" },
    { "icon": "bi-envelope-fill", "link": "mailto:your@email.com" }
  ]
}
```

### projects.json

```json
{
  "highlights": [
    {
      "title": "Brand Identity — Coffee House",
      "desc": "Complete visual identity system for a specialty coffee brand.",
      "detail": "Developed the full brand identity including logo, color palette, typography system, packaging, signage, and social media templates.<br><br>Role: Lead Designer<br>Delivered a cohesive brand system that increased brand recognition by 40% within the first quarter of launch.",
      "image": "assets/media/projects/img/coffee-brand.jpg",
      "video": "assets/media/projects/mp4/coffee-brand.mp4",
      "tech": ["Illustrator", "Photoshop", "InDesign", "After Effects"],
      "duration": { "from": "2024-01", "to": "2024-03" },
      "role": "Lead Designer",
      "designProcess": [
        { "step": "Research", "desc": "Competitor analysis, mood boards, client interviews" },
        { "step": "Concept", "desc": "3 initial directions presented to client" },
        { "step": "Refinement", "desc": "Chosen direction refined through 4 iterations" },
        { "step": "Delivery", "desc": "Full brand book + all assets delivered" }
      ],
      "impacts": [
        { "label": "Brand Recognition", "desc": "Increased by 40% in first quarter" },
        { "label": "Deliverables", "desc": "50+ assets including packaging, signage, digital templates" },
        { "label": "Client Satisfaction", "desc": "Led to 3 additional project referrals" }
      ]
    }
  ],
  "projectCategories": [
    {
      "id": "Branding",
      "label": "Branding & Identity",
      "projects": [
        {
          "title": "Tech Startup Logo",
          "desc": "Minimal logo and brand guidelines for a SaaS company.",
          "detail": "Designed a clean, modern logo mark...",
          "image": "assets/media/projects/img/tech-logo.jpg",
          "video": "assets/media/projects/mp4/tech-logo.mp4",
          "tech": ["Illustrator", "Figma"],
          "duration": { "from": "2024-02", "to": "2024-02" },
          "role": "Designer"
        }
      ]
    },
    {
      "id": "Print",
      "label": "Print & Editorial",
      "projects": []
    },
    {
      "id": "Digital",
      "label": "Digital & Social",
      "projects": []
    },
    {
      "id": "Illustration",
      "label": "Illustration & Art",
      "projects": []
    }
  ]
}
```

### site.json

```json
{
  "title": "Your Name — Graphic Designer Portfolio",
  "copyright": "2025 Your Name. All rights reserved.",
  "description": "Graphic Designer portfolio specializing in branding, visual identity, and digital design.",
  "url": "https://yourname.github.io/portfolio/",
  "ogImage": "assets/media/og-preview.png",
  "favicon": "assets/media/favicon.png",
  "sectionTitles": {
    "highlights": "Featured Work",
    "about": "About Me",
    "skills": "Skills & Expertise",
    "projects": "Projects",
    "experience": "Experience",
    "contact": "Get In Touch"
  }
}
```

### ui-config.json

```json
{
  "loading": {
    "icon": "assets/media/loading-icon.png",
    "text": "Loading..."
  },
  "cursor": {
    "default": "assets/media/cursor.png",
    "size": 24
  },
  "typing": {
    "phrases": [
      "Graphic Designer",
      "Visual Storyteller",
      "Brand Identity Specialist",
      "Creative Problem Solver"
    ],
    "typeSpeed": 20,
    "deleteSpeed": 15,
    "pauseDuration": 2000,
    "startDelay": 400
  },
  "modal": {
    "sections": {
      "impacts": { "icon": "💡", "title": "Key Results" },
      "designProcess": { "icon": "🎯", "title": "Design Process" }
    },
    "badges": {
      "duration": { "icon": "⏱" },
      "role": { "icon": "🎨" }
    },
    "storeButtons": {
      "behance": { "icon": "bi-behance", "text": "View on Behance" },
      "dribbble": { "icon": "bi-dribbble", "text": "View on Dribbble" }
    }
  }
}
```

---

## 6. RESPONSIVE & PERFORMANCE

- Mobile-first responsive design (Bootstrap 5 grid)
- Pixel font sizes reduced on mobile
- Timeline becomes single-column on mobile
- Object pooling for particles
- Lazy-load video (only plays on hover)
- FOUC prevention: apply saved theme before render

---

## 7. SEO & META

- Open Graph tags (title, description, image, url)
- Twitter Card tags
- Dynamic document title from config
- Favicon from config

---

## 8. LIBRARIES USED

- **Bootstrap 5.3.3** (CSS + JS bundle) — CDN
- **Bootstrap Icons 1.11.3** — CDN
- **Google Fonts:** Press Start 2P
- **No JS frameworks** (vanilla JavaScript only)

---

## 9. REQUIREMENTS

Build everything from scratch and ensure:

1. Create all files following the folder structure above
2. Sample JSON data tailored for a Graphic Designer
3. Complete CSS with both dark and light themes
4. Complete JS with all animations and interactions
5. Fully responsive on all devices
6. Clean, well-commented code
7. All sections functional and connected to data
