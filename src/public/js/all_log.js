document.addEventListener('DOMContentLoaded', () => {

    let monthInput = document.getElementById('monthInput');

    monthInput.addEventListener('change', async function (event) {
        const selectedValue = event.target.value;
        const [year, months] = selectedValue.trim().split('-');
        const month = String(months[1]).padStart(2, '0');
        console.log(month)
        monthInput.value = `${year}-${month}`;
        fetch(`/dashboard/allLog?month=${month} &year=${year}`, {
            method: 'GET'
        })
    });


});

// const allLogs = JSON.stringify(logs); // Logs injected from server
// const monthInput = document.getElementById('monthInput');
// const logContainer = document.getElementById('logContainer');

// // Format logs into cards
// function displayLogs(filteredLogs) {
//     logContainer.innerHTML = ''; // Clear old logs
//     if (filteredLogs.length === 0) {
//         logContainer.innerHTML = '<p>No logs for this month.</p>';
//         return;
//     }

//     filteredLogs.forEach(log => {
//         const card = document.createElement('div');
//         card.classList.add('log-card');
//         card.innerHTML = `
//         <p>${log.log}</p>
//         <p>${log.date}</p>
//       `;
//         logContainer.appendChild(card);
//     });
// }

// function filterLogsByMonth(year, month) {
//     return allLogs.filter(log => {
//         const date = new Date(log.date);
//         return date.getFullYear() === parseInt(year) &&
//             date.getMonth() === parseInt(month) - 1;
//     });
// }

// // Set default month to current
// const now = new Date();
// const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
// monthInput.value = defaultMonth;

// const [defYear, defMonth] = defaultMonth.split('-');
// displayLogs(filterLogsByMonth(defYear, defMonth));

// // Event when user changes month
// monthInput.addEventListener('change', () => {
//     const [year, month] = monthInput.value.split('-');
//     const filtered = filterLogsByMonth(year, month);
//     displayLogs(filtered);
// });






