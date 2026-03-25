/# fullstack_developer_capstone

Car dealership full stack capstone project using Django, React, Express, MongoDB, and sentiment analysis microservices.

## Project Name

fullstack_developer_capstone

## Why I Built This

The capstone required 28 tasks with screenshots, API 
outputs, and submission artifacts. Rather than completing 
each manually, I built an automation pipeline to handle 
the repeatable parts.

## What Each Script Does

extract_pdfs.py
  OCR pipeline — converts lab PDF documents into 
  searchable markdown using Tesseract and pypdfium2.
  Same pattern applied in my Catalyst investigation 
  platform for forensic document processing.

capture_screenshots.js
  Playwright browser automation — logs into the 
  running Django app, navigates each required page, 
  fills forms, and captures all screenshots automatically.

capture_remaining_screenshots.js
  Extended screenshot script with injected URL bar 
  overlay so graders can verify each endpoint at a glance.

Submission_Responses.md
  Auto-generated task manifest mapping all 28 submission 
  requirements to their respective artifacts.

## Result

28 tasks documented and submitted. Zero manual screenshots.