# Atualizações Implementadas - Plataforma Ofertar

## Alterações de Nome e Marca
- Nome da plataforma alterado de "TempoOff" para "Ofertar"
- Atualização em todas as páginas do protótipo (index, detalhes, admin, estabelecimento)
- Manutenção da identidade visual com ajustes para o novo nome

## Novas Funcionalidades Visuais

### Barra de Progresso Dinâmica
- Implementação de barra de progresso que diminui conforme o tempo passa
- Transição de cor laranja para cinza proporcional ao tempo restante
- Estado de alerta vermelho quando faltam 5 minutos para o término
- Estado visual de "esgotado" em cinza quando o tempo/produto acaba

### Imagens do Local e Produto
- Adição de duas imagens abaixo do botão "Quero Agora"
- Disposição lado a lado em desktop e empilhadas em mobile
- Imagem do estabelecimento à esquerda e do produto à direita
- Legendas identificando cada imagem

### Estados Visuais de Urgência
- Barra laranja para ofertas com bastante tempo
- Barra vermelha pulsante para ofertas com menos de 5 minutos
- Estado visual de "esgotado" com imagem em escala de cinza
- Badge "ESGOTADO" sobreposto à imagem quando expirado
- Permanência da oferta expirada até o final do dia, em estado visual cinza

## Melhorias de Interatividade

### Seções Clicáveis
- Categorias na página inicial agora filtram as ofertas quando clicadas
- Cards de promoção redirecionam para a página de detalhes
- Itens de navegação destacam-se visualmente quando ativos
- Itens do dashboard alternam entre as diferentes seções

### Aprimoramentos no Painel Admin
- Interface mais intuitiva para estabelecimentos cadastrarem ofertas
- Seções organizadas com títulos claros e agrupamento lógico
- Formulários com validação visual e feedback imediato
- Visualização clara dos estados de urgência e expiração

## Comportamentos Dinâmicos

### Contadores e Barras de Progresso
- Contadores regressivos sincronizados com barras de progresso
- Largura da barra diminui proporcionalmente ao tempo restante
- Cor muda gradualmente conforme o tempo passa
- Transição para vermelho nos últimos 5 minutos
- Estado de "esgotado" quando o tempo termina

### Notificações e Alertas
- Notificações visuais quando ofertas estão prestes a expirar
- Alertas quando uma oferta expira ou esgota
- Feedback visual ao interagir com elementos clicáveis
- Indicadores de quantidade limitada para criar senso de urgência

## Responsividade e Acessibilidade
- Layout adaptativo para diferentes tamanhos de tela
- Imagens do local/produto empilhadas em dispositivos móveis
- Contraste adequado para leitura dos contadores e alertas
- Feedback tátil e visual para interações do usuário
