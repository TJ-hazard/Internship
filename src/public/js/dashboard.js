const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');

const datePicker = document.getElementById('datepicker');

datePicker.value = `${year}-${month}-${day}`;



const form = document.getElementById('logForm');
const modal = document.getElementById('confirmationModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancel-Btn');

let shouldSubmit = false;

form.addEventListener('submit', function (e) {
    if (!shouldSubmit) {
        e.preventDefault();
        modal.style.display = 'flex';
    }
});

confirmBtn.addEventListener('click', function () {
    shouldSubmit = true;
    modal.style.display = 'none';
    form.submit();
});

cancelBtn.addEventListener('click', function () {
    shouldSubmit = false;
    modal.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {
    const alertSuccess = document.getElementById('alert-success');
    if (alertSuccess) {
        setTimeout(() => {
            alertSuccess.remove();
        }, 3000); // 5 seconds
    }
});