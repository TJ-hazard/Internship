const monthInput = document.getElementById("monthInput");
const tableInput = document.getElementById("attendanceTable");
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');




monthInput.value = `${year}-${month}`;

monthInput.addEventListener('change', function () {

    tableBody.innerHTML = '';
    const [years, months] = this.value.split('-').map(Number);
    const week = 7;
    const numberOfDays = new Date(years, months, 0).getDate();

    for (let i = 1; i <= 7; i++) {


        const currentDate = new Date(years, months - 1, i);
        const dayName = currentDate.toLocaleString('default', { weekday: 'long' });
        const dateStr = currentDate.toISOString().slice(0, 10);
        //Create a row for the table 
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

        //Add the data to the row
        row.appendChild(dayCell);
        row.appendChild(dateCell);
        row.appendChild(checkCell);

        tableBody.appendChild(row);




    }
})



function goBack() {

}




// let dayjsCurrent = dayjs(); // current date
// let weekStartIndex = 0;

// function getMonthDays(year, month) {
//     const days = [];
//     let d = dayjs(`${year}-${String(month + 1).padStart(2, '0')}-01`);
//     while (d.month() === month) {
//         days.push(d);
//         d = d.add(1, 'day');
//     }
//     return days;
// }

// function renderDayjsTable() {
//     const year = dayjsCurrent.year();
//     const month = dayjsCurrent.month(); // 0-based
//     const days = getMonthDays(year, month);
//     const week = days.slice(weekStartIndex, weekStartIndex + 7);

//     const table = `
//       <table border="1" cellpadding="10" cellspacing="0" style="width:100%; border-collapse:collapse;">
//         <thead>
//           <tr style="background:#a3d9c6;">
//             <th>Day</th><th>Date</th><th>Present</th><th>Remarks</th>
//           </tr>
//         </thead>
//         <tbody>
//           ${week.map(d => `
//             <tr>
//               <td>${d.format('dddd')}</td>
//               <td>${d.format('YYYY-MM-DD')}</td>
//               <td><input type="checkbox"></td>
//               <td></td>
//             </tr>
//           `).join('')}
//         </tbody>
//       </table>
//     `;

//     document.getElementById('attendaceTable').innerHTML = table;
// }

// function changeWeekDayjs(dir) {
//     const days = getMonthDays(dayjsCurrent.year(), dayjsCurrent.month());
//     const newIndex = weekStartIndex + dir * 7;

//     if (newIndex >= 0 && newIndex < days.length) {
//         weekStartIndex = newIndex;
//         renderDayjsTable();
//     }
// }

// renderDayjsTable();