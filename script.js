document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    const resultDiv = document.getElementById("results");

    // Завантаження даних з JSON-файлу
    fetch("modes.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(modes => {
            form.addEventListener("submit", function (event) {
                event.preventDefault(); 

                const voltage = parseFloat(document.getElementById("voltage").value);
                const power = parseFloat(document.getElementById("power").value);
                const mode = document.getElementById("mode").value;

                // Перевірка введених даних
                if (!voltage || !power) {
                    resultDiv.innerHTML = `<p style="color: red;">Будь ласка, введіть усі параметри!</p>`;
                    return;
                }

                const resistance = modes[mode].resistance;
                const reactance = modes[mode].reactance;

                // Розрахунок сумарного опору
                const totalImpedance = Math.sqrt(Math.pow(resistance, 2) + Math.pow(reactance, 2));

                // Розрахунок струму трифазного короткого замикання
                const current = (power * 1000) / (Math.sqrt(3) * voltage * totalImpedance);

                // Виведення результатів
                resultDiv.innerHTML = `
                    <p><strong>Режим роботи:</strong> ${mode}</p>
                    <p><strong>Сумарний опір:</strong> ${totalImpedance.toFixed(2)} Ом</p>
                    <p><strong>Струм трифазного короткого замикання:</strong> ${current.toFixed(2)} А</p>
                `;
            });
        })
        .catch(error => {
            resultDiv.innerHTML = `<p style="color: red;">Помилка завантаження даних: ${error.message}</p>`;
        });
});
