function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function calculate() {
    // Obter os valores de entrada
    var principal = parseFloat(document.getElementById("amount").value);
    var interest = parseFloat(document.getElementById("apr").value) / 100 / 12;
    var payments = parseFloat(document.getElementById("years").value) * 12;

    // Calcular o pagamento mensal
    var x = Math.pow(1 + interest, payments);
    var monthly = (principal * x * interest) / (x - 1);

    // Verificar se o cálculo é válido
    if (isFinite(monthly)) {
        document.getElementById("payment").innerHTML = formatMoney(monthly);
        document.getElementById("total").innerHTML = formatMoney(monthly * payments);
        document.getElementById("totalinterest").innerHTML = formatMoney((monthly * payments) - principal);

        // Gera o gráfico
        chart(principal, interest, monthly, payments);
    } else {
        document.getElementById("payment").innerHTML = "";
        document.getElementById("total").innerHTML = "";
        document.getElementById("totalinterest").innerHTML = "";
    }
}

function save(amount, apr, years, zipcode) {
    if (window.localStorage) {
        localStorage.loan_amount = amount;
        localStorage.loan_apr = apr;
        localStorage.loan_years = years;
        localStorage.loan_zipcode = zipcode;
    }
}

window.onload = function () {
    // Verifica se o localStorage é suportado
    if (window.localStorage && localStorage.loan_amount) {
        // Se suportado, recupera os dados do localStorage
        document.getElementById("amount").value = localStorage.loan_amount;
        document.getElementById("apr").value = localStorage.loan_apr;
        document.getElementById("years").value = localStorage.loan_years;
        document.getElementById("zipcode").value = localStorage.loan_zipcode;
    }
}

function getLenders(amount, apr, years, zipcode) {
    if (!window.XMLHttpRequest) return;

    // Localiza o elemento para exibir a lista de financiadores
    var ad = document.getElementById("lenders");
    if (!ad) return;

    var url = "getLenders.php" +
        "?amt=" + encodeURIComponent(amount) +
        "&apr=" + encodeURIComponent(apr) +
        "&yrs=" + encodeURIComponent(years) +
        "&zip=" + encodeURIComponent(zipcode);

    // Busca o conteúdo desse URL usando o objeto XMLHttpRequest
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.send(null);

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            var response = req.responseText;
            var lenders = JSON.parse(response);

            // Converte o array de objetos lender em uma string HTML
            var list = "";
            for (var i = 0; i < lenders.length; i++) {
                list += "<li><a href='" + lenders[i].url + "'>" + lenders[i].name + "</a></li>";
            }
            ad.innerHTML = "<ul>" + list + "</ul>";
        }
    }
}
