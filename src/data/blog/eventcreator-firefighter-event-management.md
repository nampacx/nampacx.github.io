---
author: Michael Kokonowskyj
pubDatetime: 2026-01-21T10:00:00Z
title: "EventCreator: Simple Calendar Event Management "
postSlug: eventcreator-firefighter-event-management
featured: true
draft: false
tags:
  - react
  - azure
  - static-web-app
  - ics
  - calendar
description: A simple React web app to create and manage calendar events with CSV bulk import and ICS file generation.
---

[GitHub Repository](https://github.com/nampacx/EventCreator-WebApp)

## The Problem

Our volunteer firefighter group needed to share our yearly *Dienstplan* (duty roster) and more spontanous meetings with all members. The challenge? We wanted everyone to have events in their personal calendars without:

- Collecting email addresses
- Using complex scheduling platforms
- Manually creating individual invites
- Depending on external services that might require accounts

**EventCreator** solves this: generate ICS calendar files that anyone can import—no email sharing, no accounts, just simple file sharing.

## What It Does

EventCreator creates calendar events and exports them as ICS files that work with any calendar app. Perfect for sharing your Dienstplan without collecting anyone's email.

Two workflows:

1. **Single events** - Fill a form, download the ICS file
2. **Bulk CSV import** - Upload your entire duty roster at once

Share the ICS file via WhatsApp, Telegram, file share, or any messaging app. Everyone imports it into their calendar—no email addresses needed.

Everything runs in your browser. No backend, no data storage, complete privacy.

## Tech Stack

- **React 17** - Simple UI without complexity
- **Azure Static Web Apps** - Free hosting with global CDN
- **RFC 5545** - Standard ICS format for universal compatibility

## Why Azure Static Web Apps?

Azure Static Web Apps turned out to be the perfect hosting solution for EventCreator:

**Zero-cost hosting** - The free tier provides everything a small tool needs—bandwidth, custom domains, and automatic SSL certificates without ongoing costs.

**Global CDN out of the box** - Your app loads fast everywhere. Azure automatically distributes static assets across edge locations worldwide, ensuring quick access for all team members.

**Automated GitHub deployments** - Push to main branch, and your changes go live automatically. No manual deployment steps, no CI/CD configuration headaches.

**Client-side focus** - Perfect fit for apps that run entirely in the browser. No backend infrastructure to manage or pay for, just pure static hosting.

**Enterprise-grade reliability** - Built on Azure's infrastructure with 99.95% SLA, even on the free tier. Your Dienstplan tool stays available when you need it.

## How It Works

### ICS File Generation

The core is simple—generate standard ICS calendar files:

```javascript
function generateICS(event) {
  const { title, date, time, description, location, duration } = event;
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@eventcreator.local`,
    `DTSTART:${formatDateTime(startDateTime)}`,
    `DTEND:${formatDateTime(endDateTime)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
```

### CSV Bulk Import

Upload a CSV file to create multiple events at once:


```csv
title,date,time,description,location,duration
Training Session,2026-02-15,19:00,Monthly equipment training,Fire Station,120
Exercise Drill,2026-02-22,14:00,Rescue simulation,Training Grounds,180
```

## Real-World Usage

Every month, our training coordinator:

1. Creates a CSV with our Dienstplan (training sessions, exercises, events)
2. Uploads it to EventCreator
3. Downloads the ICS file
4. Shares it in our WhatsApp group

Everyone clicks the file and imports 15-20 events instantly into their personal calendar. No emails collected, no accounts needed, no privacy concerns.

For last-minute changes, anyone can create a single event ICS and share it the same way.

## Why This Approach Works

**No email collection** - Share files instead of requiring email addresses. Respects privacy and avoids data collection concerns.

**Simple beats complex** - Generate an ICS file and share it. That's it. No accounts, no logins, no complexity.

**Client-side processing** - Everything happens in your browser. No data leaves your device except the file you choose to download.

**Universal compatibility** - ICS files work everywhere—Google Calendar, Outlook, Apple Calendar, any calendar app.

**CSV for bulk** - Create your entire Dienstplan in Excel/Google Sheets, upload once, done.

## Get Started

Run it locally:

```bash
git clone https://github.com/nampacx/EventCreator-WebApp.git
cd EventCreator-WebApp
npm install
npm start
```

Check out the [repository](https://github.com/nampacx/EventCreator-WebApp) to see the full code or contribute improvements.
