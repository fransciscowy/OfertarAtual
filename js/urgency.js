// Funções específicas para elementos de urgência e tempo real

// Função para inicializar e gerenciar todos os contadores regressivos
function initEnhancedCountdowns() {
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
                const timerContainer = element.closest('.promotion-timer, .details-timer, .promotion-card-timer');
                if (timerContainer) {
                    timerContainer.classList.add('expired');
                    
                    // Encontrar o botão CTA relacionado e desativá-lo
                    const card = timerContainer.closest('.promotion-card, .promotion-details, .dashboard-promotion-card');
                    if (card) {
                        const cta = card.querySelector('.promotion-cta, .details-cta, .promotion-card-action');
                        if (cta) {
                            cta.classList.add('disabled');
                            cta.textContent = "Oferta Encerrada";
                            if (cta.tagName === 'A') {
                                cta.href = "javascript:void(0)";
                                cta.addEventListener('click', (e) => e.preventDefault());
                            }
                        }
                    }
                }
                
                // Notificar usuário se a promoção acabou de expirar
                showUrgencyNotification("Uma oferta expirou", "A promoção acabou de expirar.");
                
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
            
            // Adicionar efeitos visuais baseados no tempo restante
            const timerContainer = element.closest('.promotion-timer, .details-timer, .promotion-card-timer');
            
            if (timerContainer) {
                // Últimos 5 minutos (300000ms) - Pulsação
                if (distance < 300000) {
                    element.classList.add('pulse');
                    timerContainer.classList.add('urgent');
                    
                    // Últimos 60 segundos - Pulsação mais intensa e cor mais vibrante
                    if (distance < 60000) {
                        timerContainer.classList.add('critical');
                        
                        // Notificar usuário se ainda não foi notificado
                        if (!timerContainer.hasAttribute('data-notified')) {
                            timerContainer.setAttribute('data-notified', 'true');
                            showUrgencyNotification("Oferta quase acabando!", "Menos de 1 minuto para aproveitar.");
                        }
                    }
                }
                
                // Atualizar o estilo do timer baseado no tempo restante (gradiente de cor)
                updateTimerUrgencyStyle(timerContainer, distance);
            }
        }, 1000);
    });
}

// Função para atualizar o estilo visual do timer baseado no tempo restante
function updateTimerUrgencyStyle(timerElement, timeRemaining) {
    // Tempo máximo considerado para o gradiente (24 horas em ms)
    const maxTime = 24 * 60 * 60 * 1000;
    
    // Calcular porcentagem de tempo restante (invertido para que menos tempo = mais urgente)
    const urgencyPercent = 100 - Math.min(100, (timeRemaining / maxTime) * 100);
    
    // Definir cores para o gradiente baseado na urgência
    // Vai de verde (pouca urgência) para amarelo (média) para vermelho (alta urgência)
    let color;
    
    if (urgencyPercent < 50) {
        // Verde para amarelo
        const g = Math.floor(255 - (urgencyPercent * 2 * (255 - 200) / 100));
        color = `rgb(255, ${g}, 0)`;
    } else {
        // Amarelo para vermelho
        const r = Math.floor(255);
        const g = Math.floor(200 - ((urgencyPercent - 50) * 2 * 200 / 100));
        color = `rgb(${r}, ${g}, 0)`;
    }
    
    // Aplicar cor ao elemento
    if (timerElement.querySelector('.timer-label, .timer-countdown, .details-timer-label, .details-timer-countdown')) {
        timerElement.style.backgroundColor = color;
        
        // Ajustar cor do texto para garantir contraste
        const textColor = urgencyPercent > 70 ? '#FFFFFF' : '#FFFFFF';
        const textElements = timerElement.querySelectorAll('.timer-label, .timer-countdown, .details-timer-label, .details-timer-countdown');
        textElements.forEach(el => {
            el.style.color = textColor;
        });
    }
}

// Função para mostrar notificações de urgência
function showUrgencyNotification(title, message) {
    // Verificar se o navegador suporta notificações
    if (!("Notification" in window)) {
        console.log("Este navegador não suporta notificações desktop");
        return;
    }
    
    // Verificar permissão para notificações
    if (Notification.permission === "granted") {
        // Criar e mostrar notificação
        const notification = new Notification(title, {
            body: message,
            icon: '/img/logo-notification.png'
        });
        
        // Fechar automaticamente após 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
    } 
    // Se a permissão não foi negada, solicitar permissão
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                showUrgencyNotification(title, message);
            }
        });
    }
    
    // Criar notificação in-app
    createInAppNotification(title, message);
}

// Função para criar notificações dentro da aplicação
function createInAppNotification(title, message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = 'in-app-notification fade-in';
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="bi bi-alarm"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="bi bi-x"></i>
        </button>
    `;
    
    // Adicionar ao container de notificações ou ao body
    const container = document.querySelector('.notifications-container') || document.body;
    container.appendChild(notification);
    
    // Adicionar evento de fechar
    const closeButton = notification.querySelector('.notification-close');
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

// Função para destacar ofertas com pouco tempo restante
function highlightUrgentOffers() {
    const promotionCards = document.querySelectorAll('.promotion-card, .dashboard-promotion-card');
    
    promotionCards.forEach(card => {
        const timerElement = card.querySelector('.timer-countdown, .promotion-card-timer .timer-countdown');
        if (!timerElement) return;
        
        const endTime = timerElement.getAttribute('data-end-time');
        if (!endTime) return;
        
        const endTimestamp = new Date(endTime).getTime();
        const now = new Date().getTime();
        const timeRemaining = endTimestamp - now;
        
        // Se restam menos de 2 horas
        if (timeRemaining > 0 && timeRemaining < 2 * 60 * 60 * 1000) {
            // Adicionar destaque visual
            card.classList.add('urgent-offer');
            
            // Adicionar badge de urgência se ainda não existir
            if (!card.querySelector('.urgent-badge')) {
                const badge = document.createElement('div');
                badge.className = 'urgent-badge pulse';
                badge.innerHTML = 'QUASE ACABANDO!';
                
                // Inserir após o badge de categoria ou como primeiro elemento
                const categoryBadge = card.querySelector('.promotion-badge, .promotion-card-badge');
                if (categoryBadge) {
                    categoryBadge.parentNode.insertBefore(badge, categoryBadge.nextSibling);
                } else {
                    const cardHeader = card.querySelector('.promotion-image, .promotion-card-header');
                    if (cardHeader) {
                        cardHeader.appendChild(badge);
                    }
                }
            }
        }
    });
}

// Função para simular atualizações em tempo real
function simulateRealTimeUpdates() {
    // Simular novas reservas chegando
    setInterval(() => {
        // Verificar se estamos na página de estabelecimento
        const reservationsTable = document.querySelector('#dashboard-reservations .table tbody');
        if (reservationsTable) {
            // Chance aleatória de receber nova reserva (20%)
            if (Math.random() < 0.2) {
                // Criar nova linha de reserva
                const newReservation = document.createElement('tr');
                newReservation.className = 'new-reservation fade-in';
                
                // Gerar código aleatório
                const code = 'CAFE' + Math.floor(1000 + Math.random() * 9000);
                
                // Data atual formatada
                const now = new Date();
                const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                
                // Preencher com dados simulados
                newReservation.innerHTML = `
                    <td>${code}</td>
                    <td>Café + Croissant</td>
                    <td>Cliente Novo</td>
                    <td>${formattedDate}</td>
                    <td>17/05/2025, 21:30</td>
                    <td><span class="table-status active">Pendente</span></td>
                    <td>
                        <div class="table-actions">
                            <div class="table-action" title="Confirmar Resgate">
                                <i class="bi bi-check-circle"></i>
                            </div>
                            <div class="table-action" title="Cancelar">
                                <i class="bi bi-x-circle"></i>
                            </div>
                            <div class="table-action" title="Ver Detalhes">
                                <i class="bi bi-eye"></i>
                            </div>
                        </div>
                    </td>
                `;
                
                // Inserir no topo da tabela
                reservationsTable.insertBefore(newReservation, reservationsTable.firstChild);
                
                // Mostrar notificação
                showUrgencyNotification("Nova Reserva!", "Um cliente acabou de reservar uma oferta.");
                
                // Atualizar contador de reservas
                const reservationStat = document.querySelector('.stat-value:nth-child(2)');
                if (reservationStat) {
                    const currentValue = parseInt(reservationStat.textContent);
                    reservationStat.textContent = (currentValue + 1).toString();
                    
                    // Atualizar indicador de mudança
                    const changeIndicator = reservationStat.nextElementSibling;
                    if (changeIndicator) {
                        changeIndicator.innerHTML = '<i class="bi bi-arrow-up"></i> Nova reserva agora';
                        changeIndicator.classList.add('highlight-change');
                        
                        // Remover destaque após alguns segundos
                        setTimeout(() => {
                            changeIndicator.classList.remove('highlight-change');
                        }, 5000);
                    }
                }
                
                // Remover classe de destaque após alguns segundos
                setTimeout(() => {
                    newReservation.classList.remove('new-reservation');
                }, 5000);
                
                // Limitar número de linhas na tabela
                const rows = reservationsTable.querySelectorAll('tr');
                if (rows.length > 10) {
                    reservationsTable.removeChild(rows[rows.length - 1]);
                }
            }
        }
    }, 30000); // A cada 30 segundos
    
    // Simular atualizações de contadores de visualizações
    setInterval(() => {
        const viewCounters = document.querySelectorAll('.view-counter');
        viewCounters.forEach(counter => {
            const currentValue = parseInt(counter.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 3) + 1;
            counter.textContent = newValue.toString();
            
            // Adicionar efeito visual temporário
            counter.classList.add('counter-updated');
            setTimeout(() => {
                counter.classList.remove('counter-updated');
            }, 1000);
        });
    }, 15000); // A cada 15 segundos
}

// Função para adicionar elementos de FOMO (Fear of Missing Out)
function enhanceFOMOElements() {
    // Adicionar contador de visualizações às promoções
    const promotionCards = document.querySelectorAll('.promotion-card:not(.has-fomo)');
    
    promotionCards.forEach((card, index) => {
        // Marcar como processado
        card.classList.add('has-fomo');
        
        // Criar elemento de visualizações
        const viewsElement = document.createElement('div');
        viewsElement.className = 'promotion-views';
        
        // Gerar número aleatório de visualizações (mais alto para os primeiros cards)
        const baseViews = Math.max(10, 50 - (index * 5));
        const views = baseViews + Math.floor(Math.random() * 20);
        
        viewsElement.innerHTML = `
            <i class="bi bi-eye"></i>
            <span class="view-counter">${views}</span> pessoas estão vendo
        `;
        
        // Adicionar ao card
        const cardContent = card.querySelector('.promotion-content');
        if (cardContent) {
            cardContent.appendChild(viewsElement);
        }
        
        // Adicionar indicador de quantidade limitada para alguns cards (aleatoriamente)
        if (Math.random() < 0.3) {
            const limitedElement = document.createElement('div');
            limitedElement.className = 'promotion-limited pulse';
            
            // Gerar número aleatório de unidades restantes (entre 1 e 5)
            const remaining = Math.floor(Math.random() * 5) + 1;
            
            limitedElement.innerHTML = `
                <i class="bi bi-exclamation-circle"></i>
                <span>Apenas ${remaining} unidades restantes!</span>
            `;
            
            // Adicionar ao card
            if (cardContent) {
                cardContent.appendChild(limitedElement);
            }
        }
    });
}

// Função para inicializar todos os elementos de urgência
function initAllUrgencyElements() {
    // Inicializar contadores aprimorados
    initEnhancedCountdowns();
    
    // Destacar ofertas urgentes
    highlightUrgentOffers();
    
    // Adicionar elementos de FOMO
    enhanceFOMOElements();
    
    // Iniciar simulação de atualizações em tempo real
    simulateRealTimeUpdates();
    
    // Verificar periodicamente por novas ofertas urgentes
    setInterval(highlightUrgentOffers, 60000); // A cada minuto
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar elementos de urgência
    initAllUrgencyElements();
    
    // Inicializar outras funcionalidades já existentes
    if (typeof initCountdowns === 'function') initCountdowns();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initCategories === 'function') initCategories();
    if (typeof initFadeAnimations === 'function') initFadeAnimations();
    if (typeof initSpecificPage === 'function') initSpecificPage();
});
