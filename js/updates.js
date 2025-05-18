// Funções atualizadas para elementos de urgência e tempo real

// Função para inicializar e gerenciar todos os contadores regressivos com barra de progresso
function initEnhancedCountdowns() {
    const countdownElements = document.querySelectorAll('.timer-countdown, .details-timer-countdown');
    
    countdownElements.forEach(element => {
        // Obter tempo final do atributo data
        const endTime = element.getAttribute('data-end-time');
        if (!endTime) return;
        
        // Converter para timestamp
        const endTimestamp = new Date(endTime).getTime();
        
        // Obter o container do timer
        const timerContainer = element.closest('.promotion-timer, .details-timer, .promotion-card-timer');
        
        // Adicionar barra de progresso se ainda não existir
        if (timerContainer && !timerContainer.querySelector('.timer-progress-bar')) {
            const progressBar = document.createElement('div');
            progressBar.className = 'timer-progress-bar';
            timerContainer.prepend(progressBar);
        }
        
        // Atualizar a cada segundo
        const interval = setInterval(() => {
            // Obter tempo atual
            const now = new Date().getTime();
            
            // Calcular diferença
            const distance = endTimestamp - now;
            
            // Obter a barra de progresso
            const progressBar = timerContainer ? timerContainer.querySelector('.timer-progress-bar') : null;
            
            // Verificar se o tempo acabou
            if (distance < 0) {
                clearInterval(interval);
                element.innerHTML = "ESGOTADO";
                
                // Adicionar classe para estilização
                if (timerContainer) {
                    timerContainer.classList.add('expired');
                    
                    // Encontrar o card ou container pai e marcar como esgotado
                    const card = timerContainer.closest('.promotion-card, .promotion-details, .dashboard-promotion-card');
                    if (card) {
                        card.classList.add('sold-out');
                        
                        // Adicionar badge de esgotado
                        if (!card.querySelector('.sold-out-badge')) {
                            const soldOutBadge = document.createElement('div');
                            soldOutBadge.className = 'sold-out-badge';
                            soldOutBadge.textContent = 'ESGOTADO';
                            
                            const imageContainer = card.querySelector('.promotion-image, .details-image, .promotion-card-header');
                            if (imageContainer) {
                                imageContainer.style.position = 'relative';
                                imageContainer.appendChild(soldOutBadge);
                            }
                        }
                        
                        // Encontrar o botão CTA relacionado e desativá-lo
                        const cta = card.querySelector('.promotion-cta, .details-cta, .promotion-card-action');
                        if (cta) {
                            cta.classList.add('disabled');
                            cta.textContent = "Oferta Esgotada";
                            if (cta.tagName === 'A') {
                                cta.href = "javascript:void(0)";
                                cta.addEventListener('click', (e) => e.preventDefault());
                            }
                        }
                        
                        // Desativar a barra de progresso
                        if (progressBar) {
                            progressBar.style.width = '0%';
                            progressBar.style.backgroundColor = '#999';
                        }
                    }
                }
                
                // Notificar usuário se a promoção acabou de expirar
                showUrgencyNotification("Oferta esgotada", "Esta promoção não está mais disponível.");
                
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
            
            // Atualizar barra de progresso
            if (progressBar) {
                // Tempo máximo considerado para o gradiente (24 horas em ms)
                const maxTime = 24 * 60 * 60 * 1000;
                
                // Calcular porcentagem de tempo restante
                const timePercent = Math.min(100, (distance / maxTime) * 100);
                
                // Atualizar largura da barra
                progressBar.style.width = `${timePercent}%`;
                
                // Atualizar cor da barra baseado no tempo restante
                updateProgressBarColor(progressBar, distance);
                
                // Verificar se está nos últimos 5 minutos
                if (distance < 300000) { // 5 minutos em ms
                    progressBar.classList.add('urgent');
                    
                    // Notificar usuário se ainda não foi notificado
                    if (!timerContainer.hasAttribute('data-notified')) {
                        timerContainer.setAttribute('data-notified', 'true');
                        showUrgencyNotification("Oferta quase acabando!", "Menos de 5 minutos para aproveitar.");
                    }
                } else {
                    progressBar.classList.remove('urgent');
                }
            }
        }, 1000);
    });
}

// Função para atualizar a cor da barra de progresso baseado no tempo restante
function updateProgressBarColor(progressBar, timeRemaining) {
    // Tempo máximo considerado (24 horas em ms)
    const maxTime = 24 * 60 * 60 * 1000;
    
    // Calcular porcentagem de tempo restante
    const timePercent = Math.min(100, (timeRemaining / maxTime) * 100);
    
    // Definir cor baseada no tempo restante
    if (timeRemaining < 300000) { // Menos de 5 minutos - vermelho
        progressBar.style.backgroundColor = '#FF0000';
    } else if (timePercent < 30) { // Menos de 30% do tempo - laranja mais escuro
        progressBar.style.backgroundColor = '#D95700';
    } else { // Normal - laranja padrão
        progressBar.style.backgroundColor = '#FF6B00';
    }
}

// Função para adicionar imagens do local e produto aos cards
function addEstablishmentAndProductImages() {
    const promotionCards = document.querySelectorAll('.promotion-card:not(.has-images)');
    
    promotionCards.forEach(card => {
        // Marcar como processado
        card.classList.add('has-images');
        
        // Criar container para as imagens
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'promotion-images';
        
        // Imagem do estabelecimento
        const placeImageContainer = document.createElement('div');
        placeImageContainer.className = 'promotion-place-image';
        
        const placeImage = document.createElement('img');
        // Usar o nome do estabelecimento para gerar uma imagem placeholder
        const placeName = card.querySelector('.promotion-place').textContent.trim();
        placeImage.src = `https://via.placeholder.com/300x150?text=${encodeURIComponent(placeName)}`;
        placeImage.alt = placeName;
        
        placeImageContainer.appendChild(placeImage);
        
        const placeLabel = document.createElement('div');
        placeLabel.className = 'promotion-place-image-label';
        placeLabel.textContent = 'Estabelecimento';
        
        // Imagem do produto
        const productImageContainer = document.createElement('div');
        productImageContainer.className = 'promotion-product-image';
        
        const productImage = document.createElement('img');
        // Usar o título da promoção para gerar uma imagem placeholder
        const productName = card.querySelector('.promotion-title').textContent.trim();
        productImage.src = `https://via.placeholder.com/300x150?text=${encodeURIComponent(productName)}`;
        productImage.alt = productName;
        
        productImageContainer.appendChild(productImage);
        
        const productLabel = document.createElement('div');
        productLabel.className = 'promotion-product-image-label';
        productLabel.textContent = 'Produto';
        
        // Adicionar ao container
        imagesContainer.appendChild(placeImageContainer);
        imagesContainer.appendChild(productImageContainer);
        
        // Adicionar labels
        placeImageContainer.appendChild(placeLabel);
        productImageContainer.appendChild(productLabel);
        
        // Inserir após o botão CTA
        const cta = card.querySelector('.promotion-cta');
        if (cta) {
            cta.insertAdjacentElement('afterend', imagesContainer);
        } else {
            // Se não encontrar o CTA, adicionar ao final do conteúdo
            const content = card.querySelector('.promotion-content');
            if (content) {
                content.appendChild(imagesContainer);
            }
        }
    });
    
    // Também adicionar à página de detalhes
    const detailsPage = document.querySelector('.promotion-details:not(.has-images)');
    if (detailsPage) {
        detailsPage.classList.add('has-images');
        
        // Criar container para as imagens
        const imagesContainer = document.createElement('div');
        imagesContainer.className = 'promotion-images';
        
        // Imagem do estabelecimento
        const placeImageContainer = document.createElement('div');
        placeImageContainer.className = 'promotion-place-image';
        
        const placeImage = document.createElement('img');
        // Usar o nome do estabelecimento para gerar uma imagem placeholder
        const placeName = detailsPage.querySelector('.details-place').textContent.trim();
        placeImage.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(placeName)}`;
        placeImage.alt = placeName;
        
        placeImageContainer.appendChild(placeImage);
        
        const placeLabel = document.createElement('div');
        placeLabel.className = 'promotion-place-image-label';
        placeLabel.textContent = 'Estabelecimento';
        
        // Imagem do produto
        const productImageContainer = document.createElement('div');
        productImageContainer.className = 'promotion-product-image';
        
        const productImage = document.createElement('img');
        // Usar o título da promoção para gerar uma imagem placeholder
        const productName = detailsPage.querySelector('.details-title').textContent.trim();
        productImage.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(productName)}`;
        productImage.alt = productName;
        
        productImageContainer.appendChild(productImage);
        
        const productLabel = document.createElement('div');
        productLabel.className = 'promotion-product-image-label';
        productLabel.textContent = 'Produto';
        
        // Adicionar ao container
        imagesContainer.appendChild(placeImageContainer);
        imagesContainer.appendChild(productImageContainer);
        
        // Adicionar labels
        placeImageContainer.appendChild(placeLabel);
        productImageContainer.appendChild(productLabel);
        
        // Inserir após o botão CTA
        const cta = detailsPage.querySelector('.details-cta');
        if (cta) {
            cta.insertAdjacentElement('afterend', imagesContainer);
        } else {
            // Se não encontrar o CTA, adicionar ao final do conteúdo
            const content = detailsPage.querySelector('.details-content');
            if (content) {
                content.appendChild(imagesContainer);
            }
        }
    }
}

// Função para tornar as seções clicáveis
function makeAllSectionsClickable() {
    // Tornar categorias clicáveis
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            // Remover classe ativa de todos os itens
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // Adicionar classe ativa ao item clicado
            this.classList.add('active');
            
            // Filtrar cards baseado na categoria
            const category = this.getAttribute('data-category');
            const cards = document.querySelectorAll('.promotion-card');
            
            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Tornar cards de promoção clicáveis
    const promotionCards = document.querySelectorAll('.promotion-card');
    promotionCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function(e) {
            // Não redirecionar se o clique foi no botão CTA
            if (e.target.closest('.promotion-cta')) {
                return;
            }
            
            // Redirecionar para a página de detalhes
            window.location.href = 'detalhes.html'; /* Não quero em todos */
        });
    });
    
    // Tornar itens de navegação clicáveis
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            link.setAttribute('href', 'javascript:void(0)');
            link.addEventListener('click', function() {
                // Remover classe ativa de todos os links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                // Adicionar classe ativa ao link clicado
                this.classList.add('active');
            });
        }
    });
    
    // Tornar itens do dashboard clicáveis
    const dashboardNavItems = document.querySelectorAll('.dashboard-nav-item');
    dashboardNavItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            // Obter o target da seção
            const target = this.getAttribute('data-target');
            if (!target) return;
            
            // Remover classe ativa de todos os itens
            dashboardNavItems.forEach(navItem => navItem.classList.remove('active'));
            // Adicionar classe ativa ao item clicado
            this.classList.add('active');
            
            // Esconder todas as seções
            const sections = document.querySelectorAll('.dashboard-content-section');
            sections.forEach(section => section.classList.add('hidden'));
            
            // Mostrar a seção alvo
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            }
        });
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Carregar os estilos atualizados
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/styles_update.css';
    document.head.appendChild(link);
    
    // Inicializar contadores com barra de progresso
    initEnhancedCountdowns();
    
    // Adicionar imagens do local e produto
    addEstablishmentAndProductImages();
    
    // Tornar seções clicáveis
    makeAllSectionsClickable();
    
    // Inicializar outras funcionalidades já existentes
    if (typeof initCountdowns === 'function') initCountdowns();
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initCategories === 'function') initCategories();
    if (typeof initFadeAnimations === 'function') initFadeAnimations();
    if (typeof initSpecificPage === 'function') initSpecificPage();
    if (typeof initAllUrgencyElements === 'function') initAllUrgencyElements();
});
