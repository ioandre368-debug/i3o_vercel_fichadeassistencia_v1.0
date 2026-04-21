function init() {
    const now = new Date();
    document.getElementById('dataInput').value = now.toLocaleDateString('pt-PT');
    document.getElementById('horaInput').value = now.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'});
    configCanvas('padTecnico');
    configCanvas('padCliente');
}

function configCanvas(id) {
    const canvas = document.getElementById(id);
    canvas.width = canvas.offsetWidth;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    ctx.lineWidth = 2; ctx.strokeStyle = "#000";
    const getXY = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return [clientX - r.left, clientY - r.top];
    }
    const start = (e) => { drawing = true; ctx.beginPath(); const [x,y] = getXY(e); ctx.moveTo(x,y); };
    const move = (e) => { if(!drawing) return; const [x,y] = getXY(e); ctx.lineTo(x,y); ctx.stroke(); if(e.touches) e.preventDefault(); };
    const stop = () => drawing = false;
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', start, {passive:false});
    canvas.addEventListener('touchmove', move, {passive:false});
}

function limpar(id) {
    const c = document.getElementById(id);
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // USAMOS HELVETICA (A alternativa nativa mais próxima de Verdana)
    const f = "cortiera"; 
    const cinzaClaro = [235, 235, 235];

    const logo = document.getElementById('logoImg');
    if (logo) pdf.addImage(logo, 'PNG', 15, 15, 35, 35);
    
    pdf.setFontSize(16); pdf.setTextColor(0, 85, 165); pdf.setFont(f, 'bold');
    pdf.text("RELATÓRIO DE ASSISTÊNCIA TÉCNICA", 132.5, 22, {align:'center'});
    pdf.line(70, 24, 195, 24);

    pdf.setFontSize(10); pdf.setTextColor(0);
    pdf.setFont(f, 'bold'); pdf.text("Nº CLIENTE:", 70, 32);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('numCliente').value, 95, 32);
    pdf.setFont(f, 'bold'); pdf.text("Data:", 150, 32);
    pdf.setFont(f, 'normal'); pdf.text(`${document.getElementById('dataInput').value} ${document.getElementById('horaInput').value}`, 165, 32);

    pdf.setFont(f, 'bold'); pdf.text(document.getElementById('nomeCliente').value.toUpperCase(), 70, 39);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('moradaCliente').value, 70, 46);
    pdf.text(`${document.getElementById('localidadeCliente').value} (${document.getElementById('codPostal').value})`, 70, 53);

    pdf.setFont(f, 'bold'); pdf.setFontSize(9);
    pdf.text("CONTACTO:", 70, 60); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('contactoNome').value, 92, 60);
    pdf.setFont(f, 'bold'); pdf.text("TELEMÓVEL:", 125, 60);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('telemovel').value, 148, 60);

    // --- SECÇÃO 1: EQUIPAMENTO (EM BOLD) ---
    let y = 70;
    pdf.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
    pdf.rect(15, y, 180, 7, 'F');
    pdf.setFont(f, 'bold'); pdf.setTextColor(0); pdf.setFontSize(10);
    pdf.text("DETALHES DO EQUIPAMENTO", 17, y + 5);
    
    y += 12;
    pdf.setFont(f, 'bold'); pdf.text("EQUIPAMENTO:", 15, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('equipamento').value, 46, y);
    pdf.setFont(f, 'bold'); pdf.text("MARCA:", 110, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('marca').value, 126, y);
    y += 7;
    pdf.setFont(f, 'bold'); pdf.text("MODELO:", 15, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('modelo').value, 35, y);
    pdf.setFont(f, 'bold'); pdf.text("Nº SÉRIE:", 110, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('nSerie').value, 130, y);
    y += 7;
    pdf.setFont(f, 'bold'); pdf.text("AVARIA:", 15, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('avaria').value, 32, y);

    // --- SECÇÃO 2: INTERVENÇÃO (EM BOLD) ---
    y += 15;
    pdf.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
    pdf.rect(15, y, 180, 7, 'F');
    pdf.setFont(f, 'bold');
    pdf.text("INTERVENÇÃO E PEÇAS", 17, y + 5);
    
    y += 12;
    const pecasVal = document.getElementById('pecas').value.trim();
    if (pecasVal !== "") {
        pdf.setFont(f, 'bold'); pdf.text("PEÇAS UTILIZADAS:", 15, y);
        pdf.setFont(f, 'normal');
        const pLines = pdf.splitTextToSize(pecasVal, 180);
        pdf.text(pLines, 15, y + 6);
        y += (pLines.length * 5) + 10;
    }

    const moVal = document.getElementById('maoObra').value.trim();
    const desVal = document.getElementById('deslocacao').value.trim();
    if (moVal !== "" || desVal !== "") {
        pdf.setFont(f, 'bold');
        if (moVal !== "") { pdf.text("Mão de Obra:", 15, y); pdf.setFont(f, 'normal'); pdf.text(`${moVal} H`, 41, y); }
        if (desVal !== "") { pdf.setFont(f, 'bold'); pdf.text("Deslocação:", 110, y); pdf.setFont(f, 'normal'); pdf.text(`${desVal} kms`, 135, y); }
        y += 12;
    }

    // --- SECÇÃO 3: RELATÓRIO (EM BOLD) ---
    y += 5;
    pdf.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
    pdf.rect(15, y, 180, 7, 'F');
    pdf.setFont(f, 'bold');
    pdf.text("RELATÓRIO TÉCNICO DETALHADO", 17, y + 5);
    
    y += 12;
    pdf.setFont(f, 'normal');
    const rLines = pdf.splitTextToSize(document.getElementById('relatorio').value, 180);
    pdf.text(rLines, 15, y);

    const fy = 265;
    pdf.setFont(f, 'bold'); pdf.text(`Técnico: ${document.getElementById('tecnico').value}`, 15, fy - 25);
    pdf.line(15, fy, 85, fy); pdf.line(125, fy, 195, fy);
    pdf.setFontSize(8); pdf.text("ASSINATURA TÉCNICO", 28, fy + 5); pdf.text("ASSINATURA CLIENTE", 138, fy + 5);
    
    pdf.addImage(document.getElementById('padTecnico').toDataURL(), 'PNG', 20, fy - 22, 60, 20);
    pdf.addImage(document.getElementById('padCliente').toDataURL(), 'PNG', 130, fy - 22, 60, 20);

    pdf.save(`RAT_${document.getElementById('numCliente').value || 'S_N'}.pdf`);
}
window.onload = init;
