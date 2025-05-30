const monthInput = document.getElementById("monthInput");
const tableInput = document.getElementById("attendanceTable");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');






monthInput.value = `${year}-${month}`;

monthInput.addEventListener('change', function () {

    tableBody.innerHTML = '';
    const [years, months] = this.value.split('-').map(Number);

    const numberOfDays = new Date(years, months, 0).getDate();

    for (let i = 1; i <= numberOfDays; i++) {

        const currentDate = new Date(years, months - 1, i);
        const dayName = currentDate.toLocaleString('default', { weekday: 'long' });
        const dateStr = currentDate.toISOString().slice(0, 10);

        const row = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = dayName;

        const dateCell = document.createElement('td');
        dateCell.textContent = dateStr;

        const checkCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkCell.appendChild(checkbox);

        checkbox.addEventListener('change', function () {
            if (this.checked) {
                console.log(checkbox[dateStr]);
                this.disabled = true;
            }
        })

        row.appendChild(dayCell);
        row.appendChild(dateCell);
        row.appendChild(checkCell);

        tableBody.appendChild(row);


    }
})



