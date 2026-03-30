# Full Stack Car Dealership App
**IBM Full Stack Developer Capstone** | Django · React · Node/Express · MongoDB · Docker · IBM Cloud

---

## What It Does
A full-stack web application where users can browse car dealerships by state, read reviews, and submit their own. An AI sentiment microservice automatically scores each review as positive, negative, or neutral.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React, JavaScript |
| Backend API | Django (Python) |
| Review Service | Node.js / Express |
| Database | SQLite + MongoDB |
| Sentiment Analysis | Python Microservice |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Cloud Deployment | IBM Cloud Code Engine |

---

## The Engineering Approach

The capstone required 28 documented deliverables: working code, UI screenshots, CI/CD evidence, and a live deployed URL. Rather than completing each manually, I built a delivery pipeline around the requirements.

### PDF → Markdown Pipeline (`extract_pdfs.py`)
Used `pypdfium2` + Tesseract OCR to convert all 10 lab PDFs into searchable markdown files, then generated a consolidated MASTER.md to use as structured context for planning and task tracking.

> This same OCR/document processing pattern is the foundation of my [Catalyst](https://github.com/tjcollinsku/catalyst) document analysis platform.
>
> ### Screenshot Automation (`capture_screenshots.js`)
> Built Playwright scripts that:
> - Authenticated into the live Django app
> - - Waited for async API data to actually render before capturing
>   - - Injected a visible URL bar overlay for grader verification
>     - - Fixed blank screenshot issues by synchronizing against real DOM state rather than fixed delays
>      
>       - **Why this mattered:** Early screenshots were blank because the frontend rendered asynchronously. Solved by waiting on actual content load, not just page load events — a debugging decision I had to identify and fix manually.
>      
>       - ### CI/CD Evidence
>       - Collected real GitHub Actions workflow metadata (job IDs, step names, timing, status) instead of approximating output locally. The evidence reflects the actual hosted pipeline.
>      
>       - ### Cloud Deployment
> Deployed to IBM Cloud Code Engine — fixed Django `ALLOWED_HOSTS` configuration to accept cloud traffic, verified the live URL, and committed the deployment artifact back to the repo.
>
> ---
>
> ## Problems I Solved
>
> Real issues that came up during development:
>
> - **Blank screenshots** — async frontend rendered after capture; fixed by waiting on DOM state rather than using fixed time delays
> - - **Missing CI evidence** — local lint logs were rejected; replaced with real GitHub Actions run data
>   - - **Cloud deployment blocked** — Django `ALLOWED_HOSTS` locked to localhost; updated for Code Engine routing
>     - - **Multi-service coordination** — Django, Express, MongoDB, and sentiment microservice had to run together reliably in the same environment
>      
>       - ---
>
> ## What I Learned
> - Connecting multiple backend services into one working system
> - - Browser automation and async state synchronization with Playwright
>   - - Docker containerization and IBM Cloud deployment
>     - - CI/CD pipeline integration with GitHub Actions
>       - - OCR and document processing with Tesseract + pypdfium2
>         - - Root cause debugging vs. manual workarounds
