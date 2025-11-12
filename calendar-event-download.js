async function shareCalendarEvent({ title, description, location, startDate, endDate }) {
  const formatDate = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) + 'T' +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) + 'Z';
  };

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//WebShare Demo//EN
BEGIN:VEVENT
UID:${Date.now()}@example.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(new Date(startDate))}
DTEND:${formatDate(new Date(endDate))}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR
  `.trim();

  const file = new File([icsContent], 'event.ics', { type: 'text/calendar' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: 'Add to Calendar',
      text: 'Here’s an event you can add to your calendar!',
      files: [file],
    });
  } else {
    // fallback to download
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.ics';
    a.click();
    URL.revokeObjectURL(url);
  }
}
