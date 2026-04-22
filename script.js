function init() {
    const now = new Date();
    document.getElementById('dataInput').value = now.toLocaleDateString('pt-PT');
    document.getElementById('horaInput').value = now.toLocaleTimeString('pt-PT', {hour:'2-digit', minute:'2-digit'});
    configCanvas('padCliente');
}

function configCanvas(id) {
    const canvas = document.getElementById(id);
    canvas.width = canvas.parentElement.offsetWidth;
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

async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const f = "helvetica";
    const cinzaClaro = [235, 235, 235];

    // Mapeamento das imagens
    const fotosAssinaturas = {
        "André Silva": "andre.png",
        "Carlos Gomes": "carlos.png",
        "Eurico Mota": "eurico.png"
    };

    const logo = document.getElementById('logoImg');
    if (logo) pdf.addImage(logo, 'PNG', 15, 15, 35, 35);
    
    pdf.setFontSize(16); pdf.setTextColor(0, 85, 165); pdf.setFont(f, 'bold');
    pdf.text("RELATÓRIO DE ASSISTÊNCIA TÉCNICA", 132.5, 22, {align:'center'});
    pdf.line(70, 24, 195, 24);

    // Cabeçalho PDF
    pdf.setFontSize(10); pdf.setTextColor(0);
    pdf.setFont(f, 'bold'); pdf.text("Nº CLIENTE:", 70, 32);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('numCliente').value, 95, 32);
    pdf.setFont(f, 'bold'); pdf.text("Data:", 150, 32);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('dataInput').value, 165, 32);

    pdf.setFont(f, 'bold'); pdf.text(document.getElementById('nomeCliente').value.toUpperCase(), 70, 39);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('moradaCliente').value, 70, 46);
    pdf.text(`${document.getElementById('localidadeCliente').value} (${document.getElementById('codPostal').value})`, 70, 53);

    let y = 65;
    const secao = (titulo) => {
        pdf.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
        pdf.rect(15, y, 180, 7, 'F');
        pdf.setFont(f, 'bold'); pdf.text(titulo, 17, y + 5);
        y += 12;
    };

    secao("DETALHES DO EQUIPAMENTO");
    pdf.setFont(f, 'bold'); pdf.text("EQUIPAMENTO:", 15, y); pdf.setFont(f, 'normal'); pdf.text(document.getElementById('equipamento').value, 46, y);
    pdf.setFont(f, 'bold'); pdf.text("MARCA:", 110, y); pdf.setFont(f, 'normal'); pdf.text(document.getElementById('marca').value, 126, y);
    y += 7;
    pdf.setFont(f, 'bold'); pdf.text("MODELO:", 15, y); pdf.setFont(f, 'normal'); pdf.text(document.getElementById('modelo').value, 35, y);
    pdf.setFont(f, 'bold'); pdf.text("Nº SÉRIE:", 110, y); pdf.setFont(f, 'normal'); pdf.text(document.getElementById('nSerie').value, 130, y);
    y += 12;

    secao("INTERVENÇÃO TÉCNICA");
    const pecas = pdf.splitTextToSize(document.getElementById('pecas').value, 180);
    pdf.setFont(f, 'normal'); pdf.text(pecas, 15, y);
    y += (pecas.length * 5) + 5;
    pdf.setFont(f, 'bold');
    pdf.text(`Mão de Obra: ${document.getElementById('maoObra').value} H`, 15, y);
    pdf.text(`Deslocação: ${document.getElementById('deslocacao').value} kms`, 110, y);
    y += 12;

    secao("NOTAS TÉCNICAS");
    const rel = pdf.splitTextToSize(document.getElementById('relatorio').value, 180);
    pdf.setFont(f, 'normal'); pdf.text(rel, 15, y);

    // --- ASSINATURAS NO RODAPÉ ---
    const fy = 265;
    const nomeTecnico = document.getElementById('tecnico').value;
    const nomeResponsavel = document.getElementById('nomeResponsavel').value.toUpperCase() || "CLIENTE / RESPONSÁVEL";

    pdf.setFont(f, 'bold'); pdf.setFontSize(9);
    pdf.text(nomeTecnico, 50, fy - 2, {align:'center'});
    pdf.text(nomeResponsavel, 160, fy - 2, {align:'center'});

    pdf.setDrawColor(180);
    pdf.line(15, fy, 85, fy); 
    pdf.line(125, fy, 195, fy);
    
    pdf.setFontSize(7); pdf.setTextColor(100);
    pdf.text("ASSINATURA TÉCNICO", 50, fy + 4, {align:'center'});
    pdf.text("ASSINATURA DO RESPONSÁVEL PRESENTE", 160, fy + 4, {align:'center'});

    // Lógica de tamanho da assinatura do técnico
    const imgTecPath = fotosAssinaturas[nomeTecnico];
    let largTec = 40; let altTec = 15; let xPos = 30; let yPos = fy - 18;

    if (nomeTecnico === "Eurico Mota") {
        largTec = 50; altTec = 19; xPos = 25; yPos = fy - 22;
    }

    try {
        pdf.addImage(imgTecPath, 'PNG', xPos, yPos, largTec, altTec);
    } catch(e) { console.error("Ficheiro não encontrado: " + imgTecPath); }

    // Assinatura do Cliente
    pdf.addImage(document.getElementById('padCliente').toDataURL(), 'PNG', 135, fy - 18, 50, 15);

    pdf.save(`RAT_${document.getElementById('numCliente').value || 'S_N'}.pdf`);
}
window.onload = init;
