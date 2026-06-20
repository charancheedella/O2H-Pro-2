# Premium Job Opportunities Portal

A modern, responsive, and accessible single-page application built with HTML5, CSS3, and Vanilla JavaScript (ES6) - no frameworks used. Designed to be a premium frontend assessment submission.

## Features

- **Dynamic Job Listings**: Fetches data from a mock API (`dummyjson.com/users`) and transforms it into job representations.
- **Search & Filtering**: Live search by job title or company, plus dropdown filters for location and company (no page refresh).
- **Pagination**: Client-side pagination displaying 6 jobs per page with an active state indicator.
- **Theme Toggle**: Switch between a sleek Light Mode (cool whites/grays) and a low-contrast Dark Mode (slate colors) with state preserved via `localStorage`.
- **Loading State (Skeleton UI)**: Modern shimmer effect shown while API data is fetching.
- **Error & Empty States**: Graceful fallback UI when no jobs match filters or if the API fails.
- **Responsive Layout**: Adapts smoothly to Mobile, Tablet, and Desktop screens using CSS Grid and Flexbox. Features a custom mobile hamburger menu.
- **Accessibility**: Built with semantic HTML, ARIA labels, focus states, and keyboard navigation in mind.

## Technologies Used

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3**: Custom Variables (Theming), CSS Grid, Flexbox, Media Queries, Keyframe Animations.
- **Vanilla JavaScript (ES6)**: Fetch API, DOM manipulation, Event Delegation, LocalStorage.

## Setup Instructions

This project requires zero build steps or package managers.

1. Clone or download the repository.
2. Open `index.html` in your favorite modern web browser.
3. *Optional*: Use an extension like Live Server in VS Code for hot-reloading during development.

## Folder Structure

```text
job-portal/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   └── app.js
└── README.md
```

## Live Demo

Because this project is built entirely with static HTML, CSS, and JS, it can be deployed immediately to platforms like:
- **Netlify**: Just drag and drop the folder.
- **Vercel**: Deploy directly from Git.
- **GitHub Pages**: Serve from the main branch.

---

*Developed for O2H Frontend Assessment*
