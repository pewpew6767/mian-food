export function formatPKR(value) {
  const amount = Math.round(Number(value) || 0);
  return `Rs. ${String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function formatCount(value) {
  const count = Number(value) || 0;
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
  }
  return String(count);
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatClock(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

export function formatDate(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function pluralize(count, single, plural) {
  return count === 1 ? single : plural || `${single}s`;
}
