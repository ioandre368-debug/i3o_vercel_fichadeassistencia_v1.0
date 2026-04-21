/* style.css - VERSÃO COMPLETA E FINAL */

:root { 
    --blue: #0055a5; 
    --bg: #f4f7f9; 
    --radius: 20px; 
}

* { 
    box-sizing: border-box; 
    -webkit-tap-highlight-color: transparent; 
}

body { 
    background: var(--bg); 
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
    padding: 10px; 
    margin: 0; 
    color: #333;
}

.app-container { 
    max-width: 800px; 
    margin: auto; 
    padding-bottom: 40px; 
}

/* Cartões de Interface */
.glass-card { 
    background: white; 
    padding: 20px; 
    border-radius: var(--radius); 
    box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
    margin-bottom: 15px; 
    border: 1px solid #eee; 
}

/* Cabeçalho */
.header-top { 
    display: flex; 
    align-items: center; 
    gap: 12px; 
    margin-bottom: 15px; 
}

.app-logo { 
    height: 45px; 
    object-fit: contain;
}

.header-title h1 { 
    margin: 0; 
    color: var(--blue); 
    font-size: 1.1rem; 
    text-transform: uppercase;
}

.header-title p { 
    margin: 0; 
    font-size: 0.75rem; 
    color: #888; 
}

/* Grelhas de Input */
.input-grid { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 12px; 
}

@media (min-width: 600px) { 
    .input-grid { grid-template-columns: 1fr 1fr; } 
}

.input-grid-inner { 
    display: grid; 
    grid-template-columns: 2fr 1fr; 
    gap: 8px; 
}

/* Labels e Campos */
.input-group label { 
    font-size: 0.65rem; 
    font-weight: bold; 
    color: #999; 
    margin-bottom: 4px; 
    display: block; 
    margin-left: 5px; 
    text-transform: uppercase;
}

input, select, textarea { 
    border: 2px solid #f0f0f0; 
    border-radius: 12px; 
    padding: 12px; 
    font-size: 16px; 
    background: #fafafa; 
    width: 100%; 
    font-family: inherit;
    transition: all 0.3s ease;
}

input:focus, textarea:focus { 
    border-color: var(--blue); 
    outline: none; 
    background: #fff; 
}

.input-destaque { 
    font-weight: bold; 
    color: var(--blue); 
    border-color: #dbeafe; 
}

/* Contactos e Estatísticas */
.contact-row { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 12px; 
    background: #f8fafc; 
    padding: 15px; 
    border-radius: 18px; 
}

@media (min-width: 600px) { 
    .contact-row { grid-template-columns: 1fr 1fr; } 
}

.stats-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 10px; 
}

.unit-group { 
    display: flex; 
    align-items: center; 
    background: #fff; 
    border-radius: 12px; 
    border: 2px solid #f0f0f0; 
    padding-right: 12px; 
}

.unit-group input { 
    border: none; 
    flex: 1; 
}

.unit-group span { 
    font-weight: bold; 
    color: #ccc; 
    font-size: 0.8rem; 
}

/* Assinaturas */
.signature-container { 
    display: grid; 
    grid-template-columns: 1fr; 
    gap: 15px; 
}

@media (min-width: 600px) { 
    .signature-container { grid-template-columns: 1fr 1fr; } 
}

canvas { 
    border: 1px dashed #ddd; 
    border-radius: 14px; 
    width: 100%; 
    height: 160px; 
    background: #fff; 
    touch-action: none; /* Crucial para tablets/telemóveis */
}

.btn-clear { 
    background: #eee; 
    border: none; 
    padding: 8px 12px; 
    border-radius: 8px; 
    font-size: 0.7rem; 
    cursor: pointer; 
    margin-top: 8px; 
    color: #666; 
    width: 100%;
}

/* Botão Gerar PDF */
.btn-submit { 
    width: 100%; 
    padding: 22px; 
    border-radius: var(--radius); 
    border: none; 
    background: var(--blue); 
    color: white; 
    font-size: 1.1rem; 
    font-weight: bold; 
    margin-top: 20px; 
    cursor: pointer; 
    box-shadow: 0 10px 20px rgba(0,85,165,0.2);
}

.btn-submit:active {
    transform: scale(0.98);
}

/* Utilitários */
.mt-15 { margin-top: 15px; }
.full-width { grid-column: 1 / -1; }
.section-title { 
    font-size: 0.9rem; 
    margin-top: 0; 
    margin-bottom: 15px; 
    color: #444; 
    display: flex; 
    align-items: center; 
    gap: 8px;
}
