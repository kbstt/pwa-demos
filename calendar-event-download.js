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

  /*try {
    await navigator.share({
      title: 'Add to Calendar',
      text: 'Here’s an event you can add to your calendar!',
      files: [file],
    });
    return;
  }
  catch(err){
    console.log(err);
  }*/

  // fallback to download
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'event.ics';
  a.click();
  URL.revokeObjectURL(url);
}

function generateDummyCalendarEvent(){
  const now = new Date();
  const startDate = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour after start

  shareCalendarEvent({
    title: 'Sample Meeting',
    description: 'This is a sample calendar invite',
    location: 'Zoom',
    startDate: startDate,
    endDate: endDate
  });
}
