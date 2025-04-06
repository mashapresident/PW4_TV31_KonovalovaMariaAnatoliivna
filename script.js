document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calc-form");
    const resultsDiv = document.getElementById("results");

    fetch("modes.json")
        .then(response => {
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            return response.json();
        })
        .then(data => {
            form.addEventListener("submit", function (event) {
                event.preventDefault();

                const voltage = parseFloat(document.getElementById("voltage").value);
                const power = parseFloat(document.getElementById("power").value);
                const mode = document.getElementById("mode").value;

                if (!voltage || !power || voltage <= 0 || power <= 0) {
                    resultsDiv.innerHTML = `<p style="color: red;">Введіть дійсні значення напруги та потужності!</p>`;
                    return;
                }

                const modeData = data.modes[mode];
                const resistance = modeData.resistance;
                const reactance = modeData.reactance;
                const totalImpedance = Math.sqrt(Math.pow(resistance, 2) + Math.pow(reactance, 2));

                const threePhaseCurrent = (power * 1000) / (Math.sqrt(3) * voltage * totalImpedance);
                const singlePhaseCurrent = threePhaseCurrent * 0.7;

                const selectedCable = data.cables.find(cable => threePhaseCurrent <= cable.maxCurrent);

                resultsDiv.innerHTML = `
                    <h3>Результати:</h3>
                    <p><strong>Сумарний опір:</strong> ${totalImpedance.toFixed(2)} Ом</p>
                    <p><strong>Струм трифазного КЗ:</strong> ${threePhaseCurrent.toFixed(2)} А</p>
                    <p><strong>Струм однофазного КЗ:</strong> ${singlePhaseCurrent.toFixed(2)} А</p>
                    <p><strong>Вибраний кабель:</strong> ${selectedCable ? selectedCable.name : "Немає відповідного кабелю"}</p>
                `;
            });
        })
        .catch(error => {
            resultsDiv.innerHTML = `<p style="color: red;">Помилка завантаження даних: ${error.message}</p>`;
        });
});
