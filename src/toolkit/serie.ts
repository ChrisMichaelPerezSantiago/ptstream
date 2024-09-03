export const formatRuntime = (minutes: number): string | null => {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return hours > 0
    ? `${hours}h ${remainingMinutes}min`
    : `${remainingMinutes}min`;
}

export const parseDate = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-US', options);
}