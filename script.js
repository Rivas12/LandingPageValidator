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
    const emailForm = document.getElementById('leadForm');
    const finalForm = document.getElementById('finalForm');
    const pricingForm = document.getElementById('pricingForm');
    
    if (emailForm) {
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('hero_signup', this.querySelector('input').value);
        });
    }
    
    if (finalForm) {
        finalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('final_cta_signup', this.querySelector('input').value);
        });
    }
    
    if (pricingForm) {
        pricingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEmailSubmit(this);
            trackEvent('pricing_signup', this.querySelector('input').value);
        });
    }
});

// Event listener para scroll (apenas animações)
window.addEventListener('scroll', function() {
    animateOnScroll();
});

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

// Demo calculation text animation
function animateCalculationText() {
    const calcText = document.getElementById('calc-text');
    if (!calcText) return;
    
    const texts = [
        'Calculando DIFAL...',
        'Consultando legislação...',
        'Aplicando regras estaduais...',
        'Finalizando cálculo...'
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        calcText.textContent = texts[currentIndex];
        currentIndex = (currentIndex + 1) % texts.length;
    }, 1200);
}

// Preloader simples
window.addEventListener('load', function() {
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
    
    // Inicializar animação do texto de cálculo
    animateCalculationText();
});
