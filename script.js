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
    ctx.lineWidth = 2; 
    ctx.strokeStyle = "#000";
    
    const getXY = (e) => {
        const r = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return [clientX - r.left, clientY - r.top];
    };

    const start = (e) => { 
        drawing = true; 
        ctx.beginPath(); 
        const [x,y] = getXY(e); 
        ctx.moveTo(x,y); 
    };

    const move = (e) => { 
        if(!drawing) return; 
        const [x,y] = getXY(e); 
        ctx.lineTo(x,y); 
        ctx.stroke(); 
        if(e.touches) e.preventDefault(); 
    };

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

    // Mapeamento das imagens de assinatura dos técnicos
    const fotosAssinaturas = {
        "André Silva": "andre.png",
        "Carlos Gomes": "carlos.png",
        "Eurico Mota": "eurico.png"
    };

    // Logótipo
    const logo = document.getElementById('logoImg');
    if (logo) pdf.addImage(logo, 'PNG', 15, 15, 35, 35);
    
    // Título do Relatório
    pdf.setFontSize(16); 
    pdf.setTextColor(0, 85, 165); 
    pdf.setFont(f, 'bold');
    pdf.text("RELATÓRIO DE ASSISTÊNCIA TÉCNICA", 132.5, 22, {align:'center'});
    pdf.line(70, 24, 195, 24);

    // Cabeçalho - Dados do Cliente
    pdf.setFontSize(10); 
    pdf.setTextColor(0);
    pdf.setFont(f, 'bold'); pdf.text("Nº CLIENTE:", 70, 32);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('numCliente').value || "-", 95, 32);
    pdf.setFont(f, 'bold'); pdf.text("Data:", 150, 32);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('dataInput').value || "-", 165, 32);

    pdf.setFont(f, 'bold'); pdf.text((document.getElementById('nomeCliente').value || "-").toUpperCase(), 70, 39);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('moradaCliente').value || "-", 70, 46);
    pdf.text(`${document.getElementById('localidadeCliente').value || "-"} (${document.getElementById('codPostal').value || "-"})`, 70, 53);

    let y = 65;
    const secao = (titulo) => {
        pdf.setFillColor(cinzaClaro[0], cinzaClaro[1], cinzaClaro[2]);
        pdf.rect(15, y, 180, 7, 'F');
        pdf.setFont(f, 'bold'); 
        pdf.text(titulo, 17, y + 5);
        y += 12;
    };

    // --- DETALHES DO EQUIPAMENTO & AVARIA ---
    secao("DETALHES DO EQUIPAMENTO");
    pdf.setFont(f, 'bold'); pdf.text("EQUIPAMENTO:", 15, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('equipamento').value || "-", 46, y);
    pdf.setFont(f, 'bold'); pdf.text("MARCA:", 110, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('marca').value || "-", 126, y);
    y += 7;
    pdf.setFont(f, 'bold'); pdf.text("MODELO:", 15, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('modelo').value || "-", 35, y);
    pdf.setFont(f, 'bold'); pdf.text("Nº SÉRIE:", 110, y); 
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('nSerie').value || "-", 130, y);
    y += 8;
    pdf.setFont(f, 'bold'); pdf.text("AVARIA:", 15, y);
    pdf.setFont(f, 'normal'); pdf.text(document.getElementById('avaria').value || "-", 30, y);
    y += 9;



    // --- INTERVENÇÃO TÉCNICA ---
    secao("INTERVENÇÃO TÉCNICA");
    const pecas = pdf.splitTextToSize(document.getElementById('pecas').value || "-", 180);
    pdf.setFont(f, 'normal'); pdf.text(pecas, 15, y);
    y += (pecas.length * 5) + 5;
    pdf.setFont(f, 'bold');
    pdf.text(`Mão de Obra: ${document.getElementById('maoObra').value || "0"} H`, 15, y);
    pdf.text(`Deslocação: ${document.getElementById('deslocacao').value || "0"} kms`, 110, y);
    y += 12;

    // --- NOTAS TÉCNICAS ---
    secao("NOTAS TÉCNICAS");
    const rel = pdf.splitTextToSize(document.getElementById('relatorio').value || "-", 180);
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

    // Desenho da Assinatura do Técnico
    const imgTecPath = fotosAssinaturas[nomeTecnico];
    let largTec = 40; let altTec = 15; let xPos = 30; let yPos = fy - 18;

    if (nomeTecnico === "Eurico Mota") {
        largTec = 50; altTec = 19; xPos = 25; yPos = fy - 22;
    }

    try {
        pdf.addImage(imgTecPath, 'PNG', xPos, yPos, largTec, altTec);
    } catch(e) { 
        console.error("Ficheiro de imagem não encontrado: " + imgTecPath); 
    }

    // Assinatura Digital do Cliente
    try {
        pdf.addImage(document.getElementById('padCliente').toDataURL(), 'PNG', 135, fy - 18, 50, 15);
    } catch(e) { 
        console.error("Erro ao converter assinatura digital do cliente"); 
    }

    // --- NOME DO FICHEIRO PDF ---
    const nomeClienteInput = document.getElementById('nomeCliente').value.trim();
    let identificadorFicheiro = "";

    if (nomeClienteInput) {
        // Formata o nome da loja removendo caracteres especiais para guardar em ficheiro
        identificadorFicheiro = nomeClienteInput.replace(/[^a-zA-Z0-9_\-]/g, "_");
    } else {
        // Gera um número aleatório de 6 dígitos se não for indicado o nome da loja
        identificadorFicheiro = Math.floor(100000 + Math.random() * 900000);
    }

    pdf.save(`RAT_${identificadorFicheiro}.pdf`);
}

window.onload = init;
