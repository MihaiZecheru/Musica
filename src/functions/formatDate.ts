const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function formatDate(date: Date): string {
  return `${months[date.getMonth() + 1]} ${date.getDate()}, ${date.getFullYear()}`;
}