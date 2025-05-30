const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const datePicker = document.getElementById('datepicker');

datePicker.value = `${year}-${month}-${day}`;


