# Full stack car dealership app

**IBM Full Stack Developer Professional Certificate — Capstone Project**
Django · React · Node/Express · MongoDB · Docker · IBM Cloud Code Engine

A full-stack web application where users browse car dealerships by state, read
reviews, and submit their own. An AI sentiment microservice automatically scores
each review as positive, negative, or neutral.

The capstone required 28 documented deliverables: working code, UI screenshots,
CI/CD evidence, and a live deployed URL. Rather than completing each manually,
I built a delivery pipeline around the requirements.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript |
| Backend API | Django (Python) |
| Review service | Node.js / Express |
| Database | SQLite + MongoDB |
| Sentiment analysis | Python microservice |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Cloud deployment | IBM Cloud Code Engine |

---

## Engineering approach

### PDF → Markdown pipeline (`extract_pdfs.py`)

Used `pypdfium2` + Tesseract OCR to convert all 10 lab PDFs into searchable
markdown files, then generated a consolidated `MASTER.md` to use as structured
context for planning and task tracking.

This same OCR and document processing pattern is the foundation of my
[Catalyst](link-to-catalyst) forensic document analysis platform.

### Screenshot automation (`capture_screenshots.js`)

Built Playwright scripts that:

- Authenticated into the live Django app
- Waited for async API data to actually render before capturing
- Injected a visible URL bar overlay for grader verification
- Synchronized against real DOM state rather than fixed time delays

Early screenshots were blank because the React frontend rendered
asynchronously. The fix was waiting on actual content load events, not page
load events — a root cause I had to identify and debug manually.

### CI/CD evidence

Collected real GitHub Actions workflow metadata (job IDs, step names, timing,
status) instead of approximating output locally. The evidence reflects the
actual hosted pipeline, not a local lint log.

### Cloud deployment

Deployed to IBM Cloud Code Engine. Fixed Django `ALLOWED_HOSTS` configuration
to accept cloud traffic, verified the live URL, and committed the deployment
artifact back to the repo.

---

## Problems I solved

- **Blank screenshots** — async frontend rendered after capture; fixed by
  waiting on DOM state rather than fixed time delays
- **Missing CI evidence** — local lint logs were rejected; replaced with real
  GitHub Actions run data
- **Cloud deployment blocked** — Django `ALLOWED_HOSTS` locked to localhost;
  updated for Code Engine routing
- **Multi-service coordination** — Django, Express, MongoDB, and the sentiment
  microservice had to run together reliably in the same local environment

---

## Quick start
```bash
docker-compose up
```

Frontend runs on `http://localhost:3000`
Backend API runs on `http://localhost:8000`
