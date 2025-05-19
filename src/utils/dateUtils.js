export function formatDate(timestamp, short = false) {
  const date = new Date(timestamp * 1000);
  const options = short
    ? { weekday: 'short' }
    : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
} 