document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById('search-input');
  const tableRows = Array.from(document.querySelectorAll('.table-row'));

  const rowsPerPage = 10;
  let currentPage = 1;
  let filteredRows = tableRows

  function displayPage(page) {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    tableRows.forEach(row => row.style.display = 'none');

    filteredRows.slice(start, end).forEach(row => row.style.display = '');

    updatePagination(page);
  }

  function updatePagination(page) {
    const totalPages = Math.ceil(tableRows.length / rowsPerPage);
    const container = document.getElementById("paginationControls");
    container.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.innerText = i;
      btn.className = (i === page) ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        displayPage(currentPage);
      });
      container.appendChild(btn);
    }
  }

  displayPage(currentPage);

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();


    if (query.length >= 3) {
      filteredRows = tableRows.filter(row => row.textContent.toLowerCase().includes(query));
    } else {
      filteredRows = tableRows;
    }

    currentPage = 1;
    displayPage(currentPage)
  })


  // Get contexts of the <canvas> elements
  const ctxBar = document.getElementById('barChart').getContext('2d');
  const ctxLine = document.getElementById('lineChart').getContext('2d');

  // Create Bar Chart
  new Chart(ctxBar, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Bar Dataset',
        data: barData,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Create Line Chart
  new Chart(ctxLine, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Line Dataset',
        data: lineData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });


})