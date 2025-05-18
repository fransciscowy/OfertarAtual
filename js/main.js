// Funcionalidades principais para a plataforma de promoções em tempo real

// Esperar pelo carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar contadores regressivos
    initCountdowns();
    
    // Inicializar menu mobile
    initMobileMenu();
    
    // Inicializar categorias
    initCategories();
    
    // Inicializar animações de entrada
    initFadeAnimations();
});

// Função para inicializar contadores regressivos
function initCountdowns() {
    const countdownElements = document.querySelectorAll('.timer-countdown, .details-timer-countdown');
    
    countdownElements.forEach(element => {
        // Obter tempo final do atributo data
        const endTime = element.getAttribute('data-end-time');
        if (!endTime) return;
        
        // Converter para timestamp
        const endTimestamp = new Date(endTime).getTime();
        
        // Atualizar a cada segundo
        const interval = setInterval(() => {
            // Obter tempo atual
            const now = new Date().getTime();
            
            // Calcular diferença
            const distance = endTimestamp - now;
            
            // Verificar se o tempo acabou
            if (distance < 0) {
                clearInterval(interval);
                element.innerHTML = "ENCERRADO";
                
                // Adicionar classe para estilização
                element.closest('.promotion-timer, .details-timer').classList.add('expired');
                return;
            }
            
            // Calcular horas, minutos e segundos
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Formatar com zeros à esquerda
            const formattedHours = hours.toString().padStart(2, '0');
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');
            
            // Atualizar elemento
            element.innerHTML = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            
            // Adicionar classe de pulsação nos últimos 5 minutos
            if (distance < 300000) { // 5 minutos em milissegundos
                element.classList.add('pulse');
                element.closest('.promotion-timer, .details-timer').classList.add('urgent');
            }
        }, 1000);
    });
}

// Função para inicializar menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-hidden');
        });
    }
    
    // Dashboard sidebar toggle
    const sidebarToggle = document.querySelector('.dashboard-sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-visible');
        });
    }
}

// Função para inicializar categorias
function initCategories() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover classe ativa de todos os itens
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Adicionar classe ativa ao item clicado
            item.classList.add('active');
            
            // Obter categoria selecionada
            const category = item.getAttribute('data-category');
            
            // Filtrar promoções (simulação)
            filterPromotions(category);
        });
    });
}

// Função para filtrar promoções (simulação)
function filterPromotions(category) {
    const promotionCards = document.querySelectorAll('.promotion-card');
    
    if (category === 'all') {
        // Mostrar todas as promoções
        promotionCards.forEach(card => {
            card.style.display = 'block';
            
            // Adicionar animação de entrada
            card.classList.remove('fade-in');
            void card.offsetWidth; // Forçar reflow
            card.classList.add('fade-in');
        });
    } else {
        // Filtrar por categoria
        promotionCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (cardCategory === category) {
                card.style.display = 'block';
                
                // Adicionar animação de entrada
                card.classList.remove('fade-in');
                void card.offsetWidth; // Forçar reflow
                card.classList.add('fade-in');
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Função para inicializar animações de entrada
function initFadeAnimations() {
    const fadeElements = document.querySelectorAll('.promotion-card, .section-title, .banner');
    
    // Adicionar classe de animação com delay incremental
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in');
        }, 100 * index);
    });
}

// Funções para a página de detalhes
function initDetailsPage() {
    // Botão de voltar
    const backButton = document.querySelector('.details-back');
    
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
    
    // Botão de garantir oferta
    const reserveButton = document.querySelector('.details-cta');
    
    if (reserveButton) {
        reserveButton.addEventListener('click', () => {
            showReservationConfirmation();
        });
    }
}

// Função para mostrar confirmação de reserva
function showReservationConfirmation() {
    // Criar modal de confirmação
    const modal = document.createElement('div');
    modal.className = 'reservation-modal fade-in';
    
    modal.innerHTML = `
        <div class="reservation-modal-content">
            <div class="reservation-modal-header">
                <h3>Oferta Garantida!</h3>
                <button class="reservation-modal-close">&times;</button>
            </div>
            <div class="reservation-modal-body">
                <div class="reservation-success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <p>Sua oferta foi garantida com sucesso!</p>
                <p class="reservation-code">Código: <strong>PROMO12345</strong></p>
                <p class="reservation-instructions">Apresente este código no estabelecimento para resgatar sua oferta.</p>
            </div>
            <div class="reservation-modal-footer">
                <button class="reservation-modal-button">OK</button>
            </div>
        </div>
    `;
    
    // Adicionar ao body
    document.body.appendChild(modal);
    
    // Adicionar evento de fechar
    const closeButton = modal.querySelector('.reservation-modal-close');
    const okButton = modal.querySelector('.reservation-modal-button');
    
    const closeModal = () => {
        modal.classList.remove('fade-in');
        modal.classList.add('fade-out');
        
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    closeButton.addEventListener('click', closeModal);
    okButton.addEventListener('click', closeModal);
}

// Funções para o dashboard de admin
function initAdminDashboard() {
    // Tabs de navegação
    const navItems = document.querySelectorAll('.dashboard-nav-item');
    const contentSections = document.querySelectorAll('.dashboard-content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remover classe ativa de todos os itens
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Adicionar classe ativa ao item clicado
            item.classList.add('active');
            
            // Obter seção alvo
            const target = item.getAttribute('data-target');
            
            // Mostrar seção correspondente
            contentSections.forEach(section => {
                if (section.id === target) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });
    
    // Formulário de nova promoção
    const newPromotionForm = document.querySelector('#new-promotion-form');
    
    if (newPromotionForm) {
        newPromotionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de envio de formulário
            const submitButton = newPromotionForm.querySelector('.form-button-primary');
            
            // Alterar texto do botão
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simular delay de envio
            setTimeout(() => {
                // Resetar formulário
                newPromotionForm.reset();
                
                // Restaurar botão
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Mostrar mensagem de sucesso
                showAdminNotification('Promoção criada com sucesso!', 'success');
            }, 1500);
        });
    }
}

// Função para mostrar notificação no dashboard
function showAdminNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type} fade-in`;
    
    notification.innerHTML = `
        <div class="admin-notification-content">
            <span class="admin-notification-message">${message}</span>
            <button class="admin-notification-close">&times;</button>
        </div>
    `;
    
    // Adicionar ao container de notificações
    const container = document.querySelector('.admin-notifications-container') || document.body;
    container.appendChild(notification);
    
    // Adicionar evento de fechar
    const closeButton = notification.querySelector('.admin-notification-close');
    
    closeButton.addEventListener('click', () => {
        notification.classList.remove('fade-in');
        notification.classList.add('fade-out');
        
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    });
    
    // Auto-fechar após 5 segundos
    setTimeout(() => {
        if (container.contains(notification)) {
            notification.classList.remove('fade-in');
            notification.classList.add('fade-out');
            
            setTimeout(() => {
                if (container.contains(notification)) {
                    container.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Funções para o dashboard de estabelecimento
function initEstablishmentDashboard() {
    // Similar ao dashboard de admin, mas com funcionalidades específicas
    initAdminDashboard(); // Reutilizar funcionalidades comuns
    
    // Formulário de edição de perfil
    const profileForm = document.querySelector('#establishment-profile-form');
    
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de envio de formulário
            const submitButton = profileForm.querySelector('.form-button-primary');
            
            // Alterar texto do botão
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Salvando...';
            submitButton.disabled = true;
            
            // Simular delay de envio
            setTimeout(() => {
                // Restaurar botão
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Mostrar mensagem de sucesso
                showAdminNotification('Perfil atualizado com sucesso!', 'success');
            }, 1500);
        });
    }
}

// Inicializar páginas específicas conforme necessário
function initSpecificPage() {
    // Verificar qual página está sendo exibida
    if (document.querySelector('.promotion-details')) {
        initDetailsPage();
    } else if (document.querySelector('.dashboard.admin')) {
        initAdminDashboard();
    } else if (document.querySelector('.dashboard.establishment')) {
        initEstablishmentDashboard();
    }
}

// Chamar inicialização de página específica após o carregamento
document.addEventListener('DOMContentLoaded', initSpecificPage);
