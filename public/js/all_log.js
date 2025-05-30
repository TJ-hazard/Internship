const monthInput = document.getElementById('monthInput');

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');

monthInput.value = `${year}-${month}`;

