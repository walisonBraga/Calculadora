function chart(principal, interest, monthly, payments) {
    var graph = document.getElementById("graph");
    graph.width = graph.width; // Limpa o canvas

    if (arguments.length == 0 || !graph.getContext) return;

    var ctx = graph.getContext("2d");
    var width = graph.width, height = graph.height;

    // Funções que convertem número de pagamentos e valores monetários em pixels
    function paymentToX(n) {
        return n * width / payments;
    }

    function amountToY(a) {
        return height - (a * height / (monthly * payments * 1.05));
    }

    // Desenhar a linha dos pagamentos totais (principal + juros)
    ctx.beginPath();
    ctx.moveTo(paymentToX(0), amountToY(0));
    ctx.lineTo(paymentToX(payments), amountToY(monthly * payments));
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Total de pagamentos de juros", 20, 20);

    // Desenhar o gráfico de total de capital (equity)
    var equity = 0;
    ctx.beginPath();
    ctx.moveTo(paymentToX(0), amountToY(0));

    for (var p = 1; p <= payments; p++) {
        var thisMonthsInterest = (principal - equity) * interest;
        equity += (monthly - thisMonthsInterest);
        ctx.lineTo(paymentToX(p), amountToY(equity));
    }

    ctx.lineTo(paymentToX(payments), amountToY(0));
    ctx.closePath();
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.fillText("Patrimônio Total", 20, 35);

    // Desenhar o gráfico do saldo do empréstimo
    var bal = principal;
    ctx.beginPath();
    ctx.moveTo(paymentToX(0), amountToY(bal));
    for (var p = 1; p <= payments; p++) {
        var thisMonthsInterest = bal * interest;
        bal -= (monthly - thisMonthsInterest);
        ctx.lineTo(paymentToX(p), amountToY(bal));
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.fillText("Saldo do Empréstimo", 20, 50);

// Desenhar marcações anuais no eixo x
ctx.textAlign = "center";
ctx.fillStyle = "#000";  // Define a cor do texto como preto
var y = amountToY(0);
for (var year = 1; year * 12 <= payments; year++) {
    var x = paymentToX(year * 12);
    ctx.fillRect(x - 0.5, y - 3, 1, 3);
    if (year == 1) ctx.fillText("Ano", x, y - 5);  // Mostra "Ano" no primeiro ano
    if (year % 5 == 0 && year * 12 !== payments) {
        ctx.fillText(String(year), x, y - 5);  // Mostra o número do ano a cada 5 anos
    }
}


    // Desenhar marcações de valores na margem direita
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    var ticks = [monthly * payments, principal];
    var rightEdge = paymentToX(payments);
    for (var i = 0; i < ticks.length; i++) {
        var tickY = amountToY(ticks[i]);
        ctx.fillRect(rightEdge - 3, tickY - 0.5, 3, 1);
        ctx.fillText(String(ticks[i].toFixed(0)), rightEdge - 5, tickY);
    }
}