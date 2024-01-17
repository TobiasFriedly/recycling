document.addEventListener('DOMContentLoaded', function() {
    fetch('php/load_score.php') 
        .then(response => response.json())
        .then(data => {
            const highscoreTable = document.getElementById('highscoreTable');
            data.forEach((entry, index) => {
                let row = highscoreTable.insertRow();
                let cell1 = row.insertCell(0);
                let cell2 = row.insertCell(1);
                let cell3 = row.insertCell(2);
                cell1.innerHTML = index + 1;
                cell2.innerHTML = entry.name;
                cell3.innerHTML = entry.score;
            });
        })
        .catch(error => console.error('Error:', error));
});
