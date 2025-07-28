// Smooth scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Manipulação dos formulários de email com Supabase
async function handleEmailSubmit(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }
    
    const button = form.querySelector('button');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    button.disabled = true;
    
    try {
        // Salvar no Supabase
        const { data, error } = await window.supabase
            .from('emails')
            .insert([{ 
                email: email,
                created_at: new Date().toISOString()
            }]);
        
        if (error) {
            throw error;
        }
        
        // Sucesso
        button.innerHTML = '<i class="fas fa-check"></i> E-mail cadastrado!';
        button.style.background = 'linear-gradient(45deg, #10b981, #06d6a0)';
        
        // Mostrar mensagem de sucesso
        showSuccessMessage(email);
        
        // Reset depois de 3 segundos
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
            form.reset();
        }, 3000);
        
    } catch (error) {
        console.error('Erro ao salvar email:', error);
        
        // Em caso de erro, mostrar mensagem de erro
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro ao cadastrar';
        button.style.background = 'linear-gradient(45deg, #ef4444, #dc2626)';
        
        // Mostrar notificação de erro
        showErrorMessage('Ocorreu um erro ao cadastrar seu e-mail. Tente novamente.');
        
        // Reset depois de 3 segundos
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 3000);
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(email) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #10b981, #06d6a0);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 1000;
        font-weight: 600;
        max-width: 350px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle"></i>
            <div>
                <div>E-mail cadastrado com sucesso!</div>
                <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">
                    Você receberá o acesso em: ${email}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Função para mostrar mensagem de erro
function showErrorMessage(message) {
    // Criar elemento de notificação de erro
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ef4444, #dc2626);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
        z-index: 1000;
        font-weight: 600;
        max-width: 350px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <div>Erro no cadastro</div>
                <div style="font-size: 14px; opacity: 0.9; margin-top: 4px;">
                    ${message}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Animação de entrada dos elementos ao fazer scroll (mais sutil)
function animateOnScroll() {
    const elements = document.querySelectorAll('.benefit-card, .section-title');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 200;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Configurar animações iniciais (mais suaves)
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.benefit-card, .section-title');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Chamar animação inicial
    setTimeout(() => {
        animateOnScroll();
    }, 200);
    
    // Configurar formulários
    const emailForm = document.getElementById('emailForm');
    const emailFormFinal = document.getElementById('emailFormFinal');
    const emailFormUrgent = document.getElementById('emailFormUrgent');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('hero_signup', this.querySelector('input').value);
        });
    }
    
    if (emailFormFinal) {
        emailFormFinal.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('final_cta_signup', this.querySelector('input').value);
        });
    }
    
    if (emailFormUrgent) {
        emailFormUrgent.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('urgent_signup', this.querySelector('input').value);
        });
    }
});

// Event listener para scroll (apenas animações)
window.addEventListener('scroll', function() {
    animateOnScroll();
});

// Preloader simples (corrigido)
window.addEventListener('load', function() {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
});

// Função para tracking de eventos (para analytics)
function trackEvent(eventName, email = null) {
    // Em produção, você enviaria esses dados para seu sistema de analytics
    console.log(`Event tracked: ${eventName}`, email ? { email } : {});
    
    // Exemplo de como integrar com Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'Lead Generation',
            event_label: email || 'Unknown',
            value: 1
        });
    }
}

// Detectar quando o usuário está prestes a sair da página (exit intent) - apenas desktop
let hasShownExitIntent = false;

document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !hasShownExitIntent && window.innerWidth > 768) {
        hasShownExitIntent = true;
        showExitIntentPopup();
    }
});

function showExitIntentPopup() {
    // Criar popup de exit intent
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    popup.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            text-align: center;
            position: relative;
            animation: slideUp 0.3s ease;
        ">
            <button id="closePopup" style="
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            
            <h3 style="margin-bottom: 16px; color: #1a1a1a;">Espere! Não vá embora ainda...</h3>
            <p style="margin-bottom: 24px; color: #666;">
                Você está a um passo de revolucionar seu processo de DIFAL com o Tax Bot. 
                Cadastre seu e-mail e seja o primeiro a testar!
            </p>
            
            <form id="exitIntentForm" style="display: flex; gap: 12px; margin-bottom: 16px;">
                <input type="email" placeholder="Seu melhor e-mail" required style="
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 16px;
                ">
                <button type="submit" style="
                    background: linear-gradient(45deg, #f59e0b, #eab308);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                ">Quero acesso!</button>
            </form>
            
            <small style="color: #999;">Sem spam, prometemos! 🤝</small>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Event listeners para o popup
    document.getElementById('closePopup').addEventListener('click', function() {
        document.body.removeChild(popup);
    });
    
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            document.body.removeChild(popup);
        }
    });
    
    document.getElementById('exitIntentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        handleEmailSubmit(this);
        trackEvent('exit_intent_signup', email);
        
        setTimeout(() => {
            document.body.removeChild(popup);
        }, 2000);
    });
}

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .urgency-badge {
        animation: pulse 2s infinite;
    }
    
    .countdown .time-unit {
        animation: pulse 1s infinite;
    }
    
    .countdown .time-unit .number {
        color: white;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// Countdown dinâmico
function startCountdown() {
    const countdownElements = document.querySelectorAll('.countdown .time-unit .number');
    if (countdownElements.length === 0) return;
    
    let hours = 47;
    let minutes = 23;
    let seconds = 45;
    
    function updateCountdown() {
        seconds--;
        
        if (seconds < 0) {
            seconds = 59;
            minutes--;
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
                
                if (hours < 0) {
                    hours = 47;
                    minutes = 59;
                    seconds = 59;
                }
            }
        }
        
        if (countdownElements[0]) countdownElements[0].textContent = hours.toString().padStart(2, '0');
        if (countdownElements[1]) countdownElements[1].textContent = minutes.toString().padStart(2, '0');
        if (countdownElements[2]) countdownElements[2].textContent = seconds.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 1000);
}

// Iniciar countdown quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        startCountdown();
    }, 1000);
});
