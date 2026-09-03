<script src="script.js"></script>
/* ==========================================================================
   PROJETO ARES - COLONIZAÇÃO DE MARTE (LÓGICA JAVASCRIPT)
   ========================================================================== */

// Inicializar ícones da biblioteca Lucide
lucide.createIcons();

// --------------------------------------------------------------------------
// 1. Controle do Menu Mobile
// --------------------------------------------------------------------------
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// --------------------------------------------------------------------------
// 2. Calculadora de Gravidade e Oxigênio
// --------------------------------------------------------------------------
const inputWeight = document.getElementById('input-weight');
const resWeight = document.getElementById('res-weight');
const resOxygen = document.getElementById('res-oxygen');

if (inputWeight && resWeight && resOxygen) {
    inputWeight.addEventListener('input', () => {
        const w = parseFloat(inputWeight.value) || 0;
        
        // Gravidade em Marte é ~38% da Terra
        const marsWeight = (w * 0.38).toFixed(1);
        
        // Consumo médio estimado de O2 por pessoa (~0.84kg para um adulto de 70kg)
        const o2Consum = ((w / 70) * 0.84).toFixed(2);

        resWeight.textContent = `${marsWeight} kg`;
        resOxygen.textContent = `${o2Consum} kg`;
    });
}

// --------------------------------------------------------------------------
// 3. Sistema de Abas de Habitação
// --------------------------------------------------------------------------
const habitatData = {
    regolith: {
        title: "Domos de Regolito Impresso em 3D",
        desc: "Robôs autônomos pré-pouso sinterizam o solo marcial (regolito) utilizando micro-ondas ou lasers para criar estruturas ultrarresistentes semelhantes ao concreto, cobrindo módulos pressurizados internos.",
        rad: "98.5%",
        temp: "Excelente",
        cost: "Muitíssimo Baixo",
        highlights: [
            "Utiliza 95% de material local (In-Situ Resource Utilization)",
            "Blindagem contra micrometeoritos de alta velocidade",
            "Paredes com espessura de até 3 metros de rocha fundida"
        ]
    },
    lava: {
        title: "Tubos de Lava Subterrâneos",
        desc: "Túneis vulcânicos antigos oferecem cavernas gigantescas prontas onde colônias inteiras podem ser construídas longe dos perigos da superfície.",
        rad: "99.9%",
        temp: "Estável (-20°C)",
        cost: "Baixo",
        highlights: [
            "Elimina 100% dos raios solares diretos e radiação cósmica brutal",
            "Temperatura interna constante, reduzindo gasto de energia",
            "Proteção total contra tempestades de poeira globais"
        ]
    },
    inflatable: {
        title: "Módulos Infláveis de Tecido Técnico",
        desc: "Estruturas leves expansíveis fabricadas com camadas intercaladas de Kevlar, MyLar e gel de retenção de radiação. Transportadas dobradas da Terra e infladas no local.",
        rad: "85.0%",
        temp: "Moderado",
        cost: "Elevado (Peso)",
        highlights: [
            "Montagem ultra-rápida para primeiras missões",
            "Fácil interconexão através de túneis pressurizados",
            "Exige cobertura de regolito posterior para maior segurança"
        ]
    }
};

function switchHabitat(type) {
    // Atualizar visual dos botões
    document.querySelectorAll('.habitat-tab').forEach(tab => {
        tab.classList.remove('border-mars-rust', 'active');
        tab.classList.add('border-transparent');
    });

    const activeBtn = document.getElementById(`btn-${type}`);
    if (activeBtn) {
        activeBtn.classList.remove('border-transparent');
        activeBtn.classList.add('border-mars-rust', 'active');
    }

    // Renderizar conteúdo dinâmico do habitat
    const data = habitatData[type];
    const contentDiv = document.getElementById('habitat-content');

    if (contentDiv && data) {
        contentDiv.innerHTML = `
            <span class="text-xs font-mono text-mars-glow tracking-widest uppercase block mb-2">Engenharia Arquitetônica</span>
            <h3 class="text-2xl font-bold text-white mb-3">${data.title}</h3>
            <p class="text-gray-300 text-sm leading-relaxed mb-6">${data.desc}</p>

            <h4 class="text-xs font-mono text-gray-400 uppercase tracking-wider mb-3">Destaques Tecnológicos:</h4>
            <ul class="space-y-2">
                ${data.highlights.map(h => `
                    <li class="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                        <i data-lucide="check" class="w-4 h-4 text-mars-glow"></i>
                        ${h}
                    </li>
                `).join('')}
            </ul>
        `;

        // Atualizar estatísticas do habitat
        document.getElementById('stat-rad').textContent = data.rad;
        document.getElementById('stat-temp').textContent = data.temp;
        document.getElementById('stat-cost').textContent = data.cost;

        // Recriar ícones inseridos dinamicamente
        lucide.createIcons();
    }
}

// Inicializar com a primeira aba ativa ao carregar
switchHabitat('regolith');

// --------------------------------------------------------------------------
// 4. Integração do Chatbot IA com Gemini API
// --------------------------------------------------------------------------
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatSubmit = document.getElementById('chat-submit');

const apiKey = ""; // A chave de API é injetada dinamicamente pelo ambiente
const modelName = "gemini-2.5-flash-preview-09-2025";

async function fetchGeminiResponse(promptText) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    
    const systemPrompt = "Você é Ares, a Inteligência Artificial especialista em colonização de Marte. Responda em português do Brasil de forma concisa, empolgante, amigável e cientificamente precisa sobre o planeta Marte, estufas, trajes, radiação e habitação.";

    const payload = {
        contents: [
            {
                parts: [{ text: promptText }]
            }
        ],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        }
    };

    // Tentativas com Exponential Backoff (até 5 vezes em caso de erro)
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                return data.candidates?.[0]?.content?.parts?.[0]?.text || "Não consegui processar sua resposta no momento, colono.";
            }
        } catch (err) {
            // Tenta novamente após a falha
        }
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
    }
    return "A conexão com a estação de comunicação da Terra falhou temporariamente. Tente novamente mais tarde.";
}

if (chatForm && chatInput && chatMessages && chatSubmit) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Adicionar mensagem digitada pelo usuário
        appendMessage('user', message);
        chatInput.value = '';
        chatSubmit.disabled = true;

        // Exibir indicador visual de carregamento
        const loadingId = appendLoading();

        // Fazer requisição à API
        const aiResponse = await fetchGeminiResponse(message);

        // Remover indicador e exibir resposta
        removeMessage(loadingId);
        appendMessage('bot', aiResponse);
        chatSubmit.disabled = false;
    });
}

function appendMessage(sender, text) {
    const div = document.createElement('div');
    const isBot = sender === 'bot';
    
    div.className = `flex items-start gap-3 ${sender === 'user' ? 'flex-row-reverse' : ''}`;

    const icon = isBot ? 'bot' : 'user';
    const bgClass = isBot ? 'bg-mars-surface border-gray-800 text-gray-200' : 'bg-mars-rust text-white';

    div.innerHTML = `
        <div class="w-7 h-7 rounded-full ${isBot ? 'bg-mars-rust' : 'bg-gray-700'} flex items-center justify-center text-white text-xs shrink-0">
            <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>
        <div class="p-3 rounded-2xl ${bgClass} border max-w-[85%] leading-relaxed">
            ${escapeHtml(text)}
        </div>
    `;

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    lucide.createIcons();
}

function appendLoading() {
    const id = 'loading-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'flex items-start gap-3';
    div.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-mars-rust flex items-center justify-center text-white text-xs shrink-0">
            <i data-lucide="bot" class="w-4 h-4"></i>
        </div>
        <div class="p-3 rounded-2xl bg-mars-surface border border-gray-800 text-gray-400 text-xs flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-mars-glow animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-mars-glow animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-2 h-2 rounded-full bg-mars-glow animate-bounce [animation-delay:0.4s]"></span>
            Analisando dados telemétricos de Marte...
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    lucide.createIcons();
    return id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}