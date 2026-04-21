// Preenche automaticamente com a data e hora atual no formato europeu
function configurarDataHoraAtual() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, '0');
    const min = String(agora.getMinutes()).padStart(2, '0');

    document.getElementById('dataManual').value = `${dia}/${mes}/${ano}`;
    document.getElementById('horaManual').value = `${hora}:${min}`;
}
configurarDataHoraAtual();

// Inicialização dos Canvas (Igual ao anterior)
function initCanvas(id) {
    const canvas = document.getElementById(id);
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let desenhando = false;
    ctx.lineWidth = 2; ctx.strokeStyle = "#000";

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e) => { desenhando = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); if(e.touches) e.preventDefault(); };
    const move = (e) => { if (!desenhando) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); if(e.touches) e.preventDefault(); };
    const stop = () => { desenhando = false; };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start, {passive: false});
    canvas.addEventListener('touchmove', move, {passive: false});
    canvas.addEventListener('touchend', stop);
}

initCanvas('assinaturaTecnico');
initCanvas('assinaturaCliente');

function limparCanvas(id) {
    const c = document.getElementById(id);
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

// GERAÇÃO DO PDF
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const fonte = "times";

    // 1. Logo
    const imgLogo = document.getElementById('logoEmpresa');
    if (imgLogo) {
        pdf.addImage(imgLogo, 'PNG', 15, 10, 41, 43);
    }

    // 2. Título
    pdf.setFont(fonte, "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(0, 85, 165);
    pdf.text("RELATÓRIO DE ASSISTÊNCIA TÉCNICA", 65, 20);

    // 3. Dados Cliente
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    let xCli = 65;
    let yCli = 30;

    pdf.setFont(fonte, "normal");
    pdf.text(`Nº cliente: ${document.getElementById('numCliente').value}`, xCli, yCli);
    yCli += 7;
    pdf.setFont(fonte, "bold");
    pdf.text((document.getElementById('nomeCliente').value || "").toUpperCase(), xCli, yCli);
    yCli += 6;
    pdf.setFont(fonte, "normal");
    pdf.text(document.getElementById('moradaCliente').value, xCli, yCli);
    yCli += 5;
    pdf.text(`${document.getElementById('localidadeCliente').value} | CP: ${document.getElementById('codigoPostal').value}`, xCli, yCli);

    // 4. Contacto, Tel e Data (Lado a Lado)
    let yBase = 58;
    pdf.setFontSize(11);
    pdf.text(`Contacto: ${document.getElementById('contactoCliente').value}`, 15, yBase);
    pdf.text(`Telemóvel: ${document.getElementById('telefoneCliente').value}`, 15, yBase + 6);

    // Pega nos campos manuais
    const dManual = document.getElementById('dataManual').value;
    const hManual = document.getElementById('horaManual').value;
    pdf.text(`Data: ${dManual} ${hManual}`, 195, yBase, { align: "right" });

    // 5. Equipamento
    let currentY = 78;
    pdf.setFont(fonte, "bold");
    pdf.setFontSize(12);
    pdf.text("Equipamento intervencionado", 15, currentY);
    currentY += 7;
    pdf.setFont(fonte, "normal");
    pdf.setFontSize(11);
    pdf.text(`Equipamento: ${document.getElementById('equipamento').value}`, 15, currentY);
    pdf.text(`Marca: ${document.getElementById('marca').value}`, 110, currentY);
    currentY += 6;
    pdf.text(`Modelo: ${document.getElementById('modelo').value}`, 15, currentY);
    pdf.text(`N° Série: ${document.getElementById('nSerie').value}`, 110, currentY);
    currentY += 6;
    pdf.text(`Avaria: ${document.getElementById('avaria').value}`, 15, currentY);

    // 6. Peças
    currentY += 12;
    pdf.setFont(fonte, "bold");
    pdf.text("Peças", 15, currentY);
    currentY += 6;
    pdf.setFont(fonte, "normal");
    const pecasText = document.getElementById('pecas').value || "";
    const pecas = pdf.splitTextToSize(pecasText, 180);
    pdf.text(pecas, 15, currentY);

    // 7. Intervenção Técnica (Com h e Kms)
    currentY += (pecas.length * 5) + 10;
    pdf.setFont(fonte, "bold");
    pdf.text("Intervenção Técnica", 15, currentY);
    currentY += 7;
    pdf.setFont(fonte, "normal");
    let mo = document.getElementById('maoObra').value;
    pdf.text(`Mão de obra: ${mo ? mo + ' h' : ''}`, 15, currentY);
    currentY += 6;
    let ds = document.getElementById('deslocacao').value;
    pdf.text(`Deslocação: ${ds ? ds + ' Kms' : ''}`, 15, currentY);

    // 8. Relatório
    currentY += 12;
    pdf.setFont(fonte, "bold");
    pdf.text("Relatório:", 15, currentY);
    currentY += 6;
    pdf.setFont(fonte, "normal");
    const relText = document.getElementById('relatorio').value || "";
    const rel = pdf.splitTextToSize(relText, 180);
    pdf.text(rel, 15, currentY);

    // 9. Assinaturas
    const footerY = 270;
    pdf.text(`Técnico responsável: ${document.getElementById('nomeTecnico').value}`, 15, footerY - 15);
    pdf.line(15, footerY, 80, footerY);
    pdf.line(125, footerY, 190, footerY);
    pdf.text("Técnico", 15, footerY + 5); 
    pdf.text("Cliente", 125, footerY + 5);

    pdf.addImage(document.getElementById('assinaturaTecnico').toDataURL(), 'PNG', 20, footerY - 18, 50, 15);
    pdf.addImage(document.getElementById('assinaturaCliente').toDataURL(), 'PNG', 130, footerY - 18, 50, 15);

    pdf.save(`RAT_${document.getElementById('numCliente').value || 'OS'}.pdf`);
}