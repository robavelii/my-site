const DATE = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "2026-11-04" to "4 November 2026", the same on the server and in the browser. */
export const formatDate = (iso: string) => DATE.format(new Date(`${iso}T00:00:00Z`));
