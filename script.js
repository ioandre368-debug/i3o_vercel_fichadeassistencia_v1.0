// Preenchimento automático da data/hora (24h)
function autoDataHora() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, '0');
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    document.getElementById('dataManual').value = `${dia}/${mes}/${agora.getFullYear()}`;
    document.getElementById('horaManual').value = `${horas}:${minutos}`;
}
autoDataHora();

// Setup das Assinaturas
function setupCanvas(id) {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');
    let drawing = false;
    ctx.lineWidth = 2; ctx.strokeStyle = "#000";

    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const cx = e.touches ? e.touches[0].clientX : e.clientX;
        const cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: cx - rect.left, y: cy - rect.top };
    };

    const start = (e) => { drawing = true; ctx.beginPath(); const p = getPos(e); ctx.moveTo(p.x, p.y); if(e.touches) e.preventDefault(); };
    const move = (e) => { if(!drawing) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); if(e.touches) e.preventDefault(); };
    const end = () => drawing = false;

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, {passive: false});
    canvas.addEventListener('touchmove', move, {passive: false});
    canvas.addEventListener('touchend', end);
}
setupCanvas('assinaturaTecnico');
setupCanvas('assinaturaCliente');

function limparCanvas(id) {
    const c = document.getElementById(id);
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
}

// GERAÇÃO DO PDF SEM RETÂNGULOS (APENAS LINHAS)
function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const f = "times";

    // 1. CABEÇALHO
    const img = document.getElementById('logoEmpresa');
    if (img) pdf.addImage(img, 'PNG', 10, 10, 35, 35);

    // Título Destacado com Linha Inferior
    pdf.setFont(f, "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(0, 85, 165);
    pdf.text("RELATÓRIO DE ASSISTÊNCIA TÉCNICA", 50, 20);
    
    pdf.setDrawColor(0, 85, 165);
    pdf.setLineWidth(1);
    pdf.line(50, 22, 200, 22); // Linha grossa de destaque por baixo do título

    // Dados do Cliente (Sem quadrado)
    pdf.setTextColor(0);
    pdf.setFontSize(10);
    pdf.setFont(f, "normal");
    pdf.text(`Nº Cliente: ${document.getElementById('numCliente').value}`, 50, 28);
    
    pdf.setFont(f, "bold");
    pdf.setFontSize(11);
    pdf.text(`CLIENTE: ${document.getElementById('nomeCliente').value.toUpperCase()}`, 50, 33);
    
    pdf.setFont(f, "normal");
    pdf.setFontSize(10);
    pdf.text(`Morada: ${document.getElementById('moradaCliente').value}`, 50, 38);
    pdf.text(`Contacto: ${document.getElementById('contactoCliente').value} | Tel: ${document.getElementById('telefoneCliente').value}`, 50, 43);
    pdf.text(`Data: ${document.getElementById('dataManual').value} | Hora: ${document.getElementById('horaManual').value}`, 150, 43);

    // 2. EQUIPAMENTO INTERVENCIONADO
    let y = 55;
    pdf.setDrawColor(200); // Linha cinza clara para separação
    pdf.setLineWidth(0.3);
    pdf.line(10, y, 200, y); // Linha de separação

    y += 8;
    pdf.setFont(f, "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(0, 85, 165);
    pdf.text("EQUIPAMENTO INTERVENCIONADO", 10, y);
    
    y += 7;
    pdf.setTextColor(0);
    pdf.setFontSize(11);
    pdf.setFont(f, "normal");
    pdf.text(`Equipamento: ${document.getElementById('equipamento').value}`, 10, y);
    pdf.text(`Marca: ${document.getElementById('marca').value}`, 110, y);
    
    y += 6;
    pdf.text(`Modelo: ${document.getElementById('modelo').value}`, 10, y);
    pdf.text(`Nº Série: ${document.getElementById('nSerie').value}`, 110, y);
    
    // Avaria com Destaque
    y += 10;
    pdf.setFont(f, "bold");
    pdf.text("AVARIA:", 10, y);
    const avariaLines = pdf.splitTextToSize(document.getElementById('avaria').value, 185);
    pdf.setFont(f, "normal");
    pdf.text(avariaLines, 10, y + 6);

    // 3. INTERVENÇÃO TÉCNICA
    y += (avariaLines.length * 5) + 12;
    pdf.setDrawColor(200);
    pdf.line(10, y, 200, y); // Linha de separação

    y += 8;
    pdf.setFont(f, "bold");
    pdf.setTextColor(0, 85, 165);
    pdf.text("INTERVENÇÃO TÉCNICA", 10, y);
    
    y += 8;
    pdf.setTextColor(0);
    pdf.text("PEÇAS:", 10, y);
    pdf.setFont(f, "normal");
    const pecas = pdf.splitTextToSize(document.getElementById('pecas').value, 185);
    pdf.text(pecas, 10, y + 6);
    
    y += (pecas.length * 5) + 12;
    pdf.setFont(f, "bold");
    pdf.text(`MÃO DE OBRA: ${document.getElementById('maoObra').value} h`, 10, y);
    pdf.text(`DESLOCAÇÃO: ${document.getElementById('deslocacao').value} Kms`, 110, y);

    y += 10;
    pdf.text("RELATÓRIO:", 10, y);
    pdf.setFont(f, "normal");
    const rel = pdf.splitTextToSize(document.getElementById('relatorio').value, 185);
    pdf.text(rel, 10, y + 6);

    // 4. ASSINATURAS (No fundo da página)
    const fy = 270;
    pdf.setDrawColor(200);
    pdf.line(10, fy - 25, 200, fy - 25); // Linha antes das assinaturas

    pdf.setFont(f, "bold");
    pdf.text(`Técnico Responsável: ${document.getElementById('nomeTecnico').value}`, 10, fy - 18);
    
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(10, fy, 80, fy);
    pdf.line(125, fy, 195, fy);
    
    pdf.setFontSize(10);
    pdf.text("Assinatura Técnico", 10, fy + 5);
    pdf.text("Assinatura Cliente", 125, fy + 5);

    // Imagens das assinaturas
    pdf.addImage(document.getElementById('assinaturaTecnico').toDataURL(), 'PNG', 15, fy - 14, 60, 12);
    pdf.addImage(document.getElementById('assinaturaCliente').toDataURL(), 'PNG', 130, fy - 14, 60, 12);

    pdf.save(`RAT_${document.getElementById('numCliente').value || 'OS'}.pdf`);
}
