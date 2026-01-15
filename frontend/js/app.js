// Configuração da API - Detecta automaticamente a URL base
const API_BASE_URL = (() => {
    // Em produção, usa a URL atual do servidor
    // Em desenvolvimento, pode usar localhost:3000 ou a URL atual
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Desenvolvimento local
        return `${window.location.protocol}//${window.location.hostname}:${window.location.port || 3000}/api`;
    } else {
        // Produção - usa a URL atual
        return `${window.location.origin}/api`;
    }
})();

/**
 * Constrói URL completa para imagens (relativas ou absolutas)
 */
function buildImageUrl(imageUrl) {
    if (!imageUrl) return '';
    
    // Se já é uma URL absoluta (http/https), retorna como está
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // Se é relativa, adiciona o origin atual
    return `${window.location.origin}${imageUrl}`;
}

// Estado da aplicação
const state = {
    gifts: [],
    filteredGifts: [],
    currentGift: null,
    isAdmin: false,
    currentPage: 1,
    itemsPerPage: 9,
    searchTerm: ''
};

// Elementos do DOM
const elements = {
    giftsContainer: document.getElementById('giftsContainer'),
    loading: document.getElementById('loading'),
    totalGifts: document.getElementById('totalGifts'),
    availableGifts: document.getElementById('availableGifts'),
    reservedGifts: document.getElementById('reservedGifts'),
    
    // Modais
    modalReserve: document.getElementById('modalReserve'),
    modalSuccess: document.getElementById('modalSuccess'),
    modalLogin: document.getElementById('modalLogin'),
    modalAdmin: document.getElementById('modalAdmin'),
    modalGiftForm: document.getElementById('modalGiftForm'),
    
    // Formulários
    reserveForm: document.getElementById('reserveForm'),
    loginForm: document.getElementById('loginForm'),
    giftForm: document.getElementById('giftForm'),
    
    // Botões
    btnAdmin: document.getElementById('btnAdmin'),
    btnAddGift: document.getElementById('btnAddGift'),
    
    // Inputs
    guestName: document.getElementById('guestName'),
    adminPassword: document.getElementById('adminPassword'),
    giftSearchInput: document.getElementById('giftSearchInput'),
    
    // Erros
    guestNameError: document.getElementById('guestNameError'),
    loginError: document.getElementById('loginError'),
    
    // Paginação
    paginationContainer: document.getElementById('paginationContainer')
};

// ==================== UTILITÁRIOS ====================

/**
 * Faz requisição HTTP
 */
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Erro na requisição');
        }
        
        return data;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

/**
 * Mostra/oculta loading
 */
function toggleLoading(show) {
    if (show) {
        elements.loading.style.display = 'block';
        elements.giftsContainer.classList.add('loading-state');
    } else {
        elements.loading.style.display = 'none';
        elements.giftsContainer.classList.remove('loading-state');
    }
}

/**
 * Formata data para exibição
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// ==================== MODAIS ====================

/**
 * Abre modal
 */
function openModal(modalElement) {
    modalElement.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha modal
 */
function closeModal(modalElement) {
    modalElement.classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Fecha modal ao clicar fora
 */
function setupModalCloseOnOutsideClick(modalElement) {
    modalElement.addEventListener('click', (e) => {
        if (e.target === modalElement) {
            closeModal(modalElement);
        }
    });
}

/**
 * Configura fechamento de modais
 */
function setupModalCloseHandlers() {
    // Modal de reserva
    document.getElementById('closeReserveModal').addEventListener('click', () => {
        closeModal(elements.modalReserve);
        elements.reserveForm.reset();
        clearFormErrors('reserveForm');
    });
    
    document.getElementById('cancelReserve').addEventListener('click', () => {
        closeModal(elements.modalReserve);
        elements.reserveForm.reset();
        clearFormErrors('reserveForm');
    });
    
    // Modal de sucesso
    document.getElementById('closeSuccessModal').addEventListener('click', () => {
        closeModal(elements.modalSuccess);
    });
    
    // Modal de login
    document.getElementById('closeLoginModal').addEventListener('click', () => {
        closeModal(elements.modalLogin);
        elements.loginForm.reset();
        resetPasswordToggle();
        clearFormErrors('loginForm');
    });
    
    document.getElementById('cancelLogin').addEventListener('click', () => {
        closeModal(elements.modalLogin);
        elements.loginForm.reset();
        resetPasswordToggle();
        clearFormErrors('loginForm');
    });
    
    // Modal admin
    document.getElementById('closeAdminModal').addEventListener('click', () => {
        closeModal(elements.modalAdmin);
    });
    
    // Modal formulário de presente
    document.getElementById('closeGiftFormModal').addEventListener('click', () => {
        closeModal(elements.modalGiftForm);
        elements.giftForm.reset();
        clearFormErrors('giftForm');
    });
    
    document.getElementById('cancelGiftForm').addEventListener('click', () => {
        closeModal(elements.modalGiftForm);
        elements.giftForm.reset();
        clearFormErrors('giftForm');
    });
    
    // Fechar ao clicar fora
    setupModalCloseOnOutsideClick(elements.modalReserve);
    setupModalCloseOnOutsideClick(elements.modalSuccess);
    setupModalCloseOnOutsideClick(elements.modalLogin);
    setupModalCloseOnOutsideClick(elements.modalAdmin);
    setupModalCloseOnOutsideClick(elements.modalGiftForm);
}

/**
 * Limpa erros do formulário
 */
function clearFormErrors(formId) {
    const form = document.getElementById(formId);
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}

/**
 * Mostra erro no campo
 */
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// ==================== PRESENTES ====================

/**
 * Carrega lista de presentes
 */
async function loadGifts() {
    try {
        toggleLoading(true);
        const data = await apiRequest('/gifts');
        state.gifts = data.gifts || [];
        state.filteredGifts = [];
        state.currentPage = 1;
        filterGifts();
        updateMetrics();
    } catch (error) {
        console.error('Erro ao carregar presentes:', error);
        elements.giftsContainer.innerHTML = `
            <div class="error-message">
                <p>Erro ao carregar presentes. Tente novamente mais tarde.</p>
            </div>
        `;
    } finally {
        toggleLoading(false);
    }
}

/**
 * Filtra presentes baseado no termo de busca
 */
function filterGifts() {
    const searchTerm = state.searchTerm.toLowerCase().trim();
    
    if (!searchTerm) {
        // Sem busca: mostra todos os presentes
        state.filteredGifts = [...state.gifts];
    } else {
        // Com busca: filtra os presentes
        state.filteredGifts = state.gifts.filter(gift => {
            const name = gift.name.toLowerCase();
            const category = gift.category.toLowerCase();
            const description = gift.description.toLowerCase();
            
            return name.includes(searchTerm) || 
                   category.includes(searchTerm) || 
                   description.includes(searchTerm);
        });
    }
    
    // Reset para primeira página ao filtrar
    state.currentPage = 1;
    renderGifts();
}

/**
 * Renderiza cards de presentes com paginação
 */
function renderGifts() {
    // Se não há presentes filtrados, mostra mensagem apropriada
    if (state.filteredGifts.length === 0) {
        let messageHTML = '';
        const hasSearchTerm = state.searchTerm && state.searchTerm.trim().length > 0;
        
        if (hasSearchTerm) {
            // Há busca mas não encontrou resultados
            messageHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Nenhum presente encontrado</h3>
                    <p>Não encontramos nenhum presente compatível com a pesquisa "<strong>${escapeHtml(state.searchTerm)}</strong>".</p>
                    <p class="empty-state-suggestion">Tente pesquisar por outro nome, categoria ou descrição.</p>
                </div>
            `;
        } else if (state.gifts.length === 0) {
            // Não há busca e não há presentes cadastrados
            messageHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3>Nenhum presente cadastrado</h3>
                    <p>Ainda não há presentes cadastrados na lista.</p>
                </div>
            `;
        } else {
            // Caso especial: não deveria acontecer, mas garante que sempre mostra algo
            messageHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3>Nenhum presente disponível</h3>
                    <p>Não há presentes para exibir no momento.</p>
                </div>
            `;
        }
        
        elements.giftsContainer.innerHTML = messageHTML;
        renderPagination();
        return;
    }
    
    // Calcula paginação
    const totalPages = Math.ceil(state.filteredGifts.length / state.itemsPerPage);
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedGifts = state.filteredGifts.slice(startIndex, endIndex);
    
    // Renderiza apenas os presentes da página atual
    const giftsHTML = paginatedGifts.map(gift => createGiftCard(gift)).join('');
    elements.giftsContainer.innerHTML = giftsHTML;
    
    // Adiciona event listeners aos botões
    attachGiftCardListeners();
    
    // Renderiza paginação
    renderPagination();
}

/**
 * Renderiza controles de paginação com bullets
 */
function renderPagination() {
    const totalPages = Math.ceil(state.filteredGifts.length / state.itemsPerPage);
    
    if (totalPages <= 1) {
        elements.paginationContainer.innerHTML = '';
        return;
    }
    
    let bulletsHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === state.currentPage;
        bulletsHTML += `
            <button 
                class="pagination-bullet ${isActive ? 'active' : ''}" 
                data-page="${i}"
                aria-label="Página ${i}"
                ${isActive ? 'aria-current="page"' : ''}
            ></button>
        `;
    }
    
    elements.paginationContainer.innerHTML = bulletsHTML;
    
    // Adiciona event listeners aos bullets
    const bullets = elements.paginationContainer.querySelectorAll('.pagination-bullet');
    bullets.forEach(bullet => {
        bullet.addEventListener('click', () => {
            const page = parseInt(bullet.dataset.page);
            goToPage(page);
        });
    });
}

/**
 * Vai para uma página específica
 */
function goToPage(page) {
    const totalPages = Math.ceil(state.filteredGifts.length / state.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    state.currentPage = page;
    renderGifts();
    
    // Scroll suave para o topo dos presentes
    elements.giftsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Cria HTML do card de presente
 */
function createGiftCard(gift) {
    const isReserved = gift.status === 'reserved';
    const reservedInfo = isReserved 
        ? `<div class="gift-reserved-info">
             <span class="reserved-badge"><i class="fas fa-lock"></i> Reservado</span>
             <p class="reserved-by">Por: ${escapeHtml(gift.reserved_by)}</p>
           </div>`
        : '';
    
    const buyButton = gift.product_link && !isReserved
        ? `<a href="${escapeHtml(gift.product_link)}" target="_blank" class="btn btn-link">Comprar Agora</a>`
        : '';
    
    const chooseButton = !isReserved
        ? `<button class="btn btn-primary btn-choose" data-gift-id="${gift.id}">Escolher Presente</button>`
        : '';
    
    // Trata URL da imagem (pode ser relativa ou absoluta)
    const imageSrc = gift.image_url ? escapeHtml(buildImageUrl(gift.image_url)) : '';
    const imageHTML = imageSrc 
        ? `<div class="gift-image"><img src="${imageSrc}" alt="${escapeHtml(gift.name)}"></div>`
        : '';
    
    return `
        <div class="gift-card ${isReserved ? 'reserved' : ''}" data-gift-id="${gift.id}">
            ${imageHTML}
            <div class="gift-badge">${escapeHtml(gift.category)}</div>
            <h3 class="gift-name">${escapeHtml(gift.name)}</h3>
            <p class="gift-description">${escapeHtml(gift.description)}</p>
            ${reservedInfo}
            <div class="gift-actions">
                ${chooseButton}
                ${buyButton}
            </div>
        </div>
    `;
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Anexa listeners aos cards de presentes
 */
function attachGiftCardListeners() {
    const chooseButtons = document.querySelectorAll('.btn-choose');
    chooseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.dataset.giftId);
            handleChooseGift(giftId);
        });
    });
}

/**
 * Abre modal para escolher presente
 */
function handleChooseGift(giftId) {
    const gift = state.gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    if (gift.status === 'reserved') {
        alert('Este presente já foi reservado.');
        return;
    }
    
    state.currentGift = gift;
    document.getElementById('reserveModalTitle').textContent = gift.name;
    document.getElementById('reserveModalIcon').innerHTML = '<i class="fas fa-gift"></i>';
    elements.guestName.value = '';
    clearFormErrors('reserveForm');
    openModal(elements.modalReserve);
}

/**
 * Processa reserva de presente
 */
async function handleReserveGift(e) {
    e.preventDefault();
    
    const guestName = elements.guestName.value.trim();
    
    if (!guestName) {
        showFieldError('guestName', 'Nome completo é obrigatório');
        return;
    }
    
    if (guestName.length < 3) {
        showFieldError('guestName', 'Nome deve ter pelo menos 3 caracteres');
        return;
    }
    
    if (!state.currentGift) {
        alert('Erro: presente não encontrado');
        return;
    }
    
    try {
        clearFormErrors('reserveForm');
        const confirmButton = document.getElementById('confirmReserve');
        confirmButton.disabled = true;
        confirmButton.textContent = 'Processando...';
        
        const data = await apiRequest('/reserve', {
            method: 'POST',
            body: JSON.stringify({
                giftId: state.currentGift.id,
                guestName: guestName
            })
        });
        
        // Atualiza estado local
        const giftIndex = state.gifts.findIndex(g => g.id === state.currentGift.id);
        if (giftIndex !== -1) {
            state.gifts[giftIndex].status = 'reserved';
            state.gifts[giftIndex].reserved_by = guestName;
            state.gifts[giftIndex].reserved_at = new Date().toISOString();
        }
        
        // Mostra modal de sucesso
        document.getElementById('successGiftName').textContent = state.currentGift.name;
        document.getElementById('successGuestName').textContent = guestName;
        closeModal(elements.modalReserve);
        openModal(elements.modalSuccess);
        
        // Recarrega lista para garantir sincronização
        await loadGifts();
        
    } catch (error) {
        alert(error.message || 'Erro ao reservar presente. Tente novamente.');
    } finally {
        const confirmButton = document.getElementById('confirmReserve');
        confirmButton.disabled = false;
        confirmButton.textContent = 'Confirmar Escolha';
    }
}

/**
 * Atualiza métricas
 */
function updateMetrics() {
    const total = state.gifts.length;
    const reserved = state.gifts.filter(g => g.status === 'reserved').length;
    const available = total - reserved;
    
    elements.totalGifts.textContent = total;
    elements.availableGifts.textContent = available;
    elements.reservedGifts.textContent = reserved;
}

/**
 * Configura filtro de busca
 */
function setupSearchFilter() {
    if (!elements.giftSearchInput) return;
    
    // Busca ao digitar (com debounce)
    let searchTimeout;
    elements.giftSearchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.searchTerm = e.target.value;
            filterGifts();
        }, 300); // Aguarda 300ms após parar de digitar
    });
    
    // Limpa busca ao pressionar ESC
    elements.giftSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            e.target.value = '';
            state.searchTerm = '';
            filterGifts();
        }
    });
}

// ==================== ADMINISTRAÇÃO ====================

/**
 * Abre modal de login administrativo
 */
function handleAdminClick() {
    elements.loginForm.reset();
    clearFormErrors('loginForm');
    openModal(elements.modalLogin);
}

/**
 * Configura toggle de mostrar/ocultar senha
 */
function setupPasswordToggle() {
    const toggleButton = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (!toggleButton || !passwordInput || !toggleIcon) return;
    
    toggleButton.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        
        if (isPassword) {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
            toggleButton.setAttribute('aria-label', 'Ocultar senha');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
            toggleButton.setAttribute('aria-label', 'Mostrar senha');
        }
    });
}

/**
 * Reseta o toggle de senha para o estado inicial (oculto)
 */
function resetPasswordToggle() {
    const passwordInput = document.getElementById('adminPassword');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    const toggleButton = document.getElementById('togglePassword');
    
    if (passwordInput && toggleIcon && toggleButton) {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
        toggleButton.setAttribute('aria-label', 'Mostrar senha');
    }
}

/**
 * Processa login administrativo
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const password = elements.adminPassword.value;
    
    if (!password) {
        showFieldError('login', 'Senha é obrigatória');
        return;
    }
    
    try {
        clearFormErrors('loginForm');
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Entrando...';
        
        const data = await apiRequest('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ password })
        });
        
        state.isAdmin = true;
        localStorage.setItem('adminToken', data.token);
        closeModal(elements.modalLogin);
        await loadAdminGifts();
        openModal(elements.modalAdmin);
        
    } catch (error) {
        showFieldError('login', error.message || 'Senha incorreta');
    } finally {
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
    }
}

/**
 * Carrega presentes para administração
 */
async function loadAdminGifts() {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        const data = await apiRequest('/admin/gifts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        renderAdminGifts(data.gifts || []);
    } catch (error) {
        console.error('Erro ao carregar presentes admin:', error);
        showAlertDialog('Erro', 'Erro ao carregar lista administrativa', 'fas fa-exclamation-circle', 'danger');
    }
}

/**
 * Renderiza lista administrativa de presentes
 */
function renderAdminGifts(gifts) {
    const adminList = document.getElementById('adminGiftsList');
    
    if (gifts.length === 0) {
        adminList.innerHTML = '<p class="empty-message">Nenhum presente cadastrado.</p>';
        return;
    }
    
    const giftsHTML = gifts.map(gift => {
        const isReserved = gift.status === 'reserved';
        const reservedInfo = isReserved 
            ? `<div class="admin-reserved-info">
                 <span class="badge-reserved"><i class="fas fa-lock"></i> Reservado</span>
                 <p><strong>Por:</strong> ${escapeHtml(gift.reserved_by || 'Não informado')}</p>
                 <p><strong>Em:</strong> ${formatDate(gift.reserved_at)}</p>
               </div>`
            : '<span class="badge-available"><i class="fas fa-check-circle"></i> Disponível</span>';
        
        return `
            <div class="admin-gift-item ${isReserved ? 'reserved' : ''}">
                <div class="admin-gift-info">
                    <div class="admin-gift-details">
                        <h4>${escapeHtml(gift.name)}</h4>
                        <p class="admin-gift-category">${escapeHtml(gift.category)}</p>
                        <p class="admin-gift-description">${escapeHtml(gift.description)}</p>
                        ${reservedInfo}
                    </div>
                </div>
                <div class="admin-gift-actions">
                    <button class="btn btn-small btn-secondary" data-action="edit" data-gift-id="${gift.id}" title="Editar informações">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${isReserved 
                        ? `<button class="btn btn-small btn-success" data-action="unreserve" data-gift-id="${gift.id}" title="Liberar presente">
                            <i class="fas fa-unlock"></i> Liberar
                           </button>
                           <button class="btn btn-small btn-info" data-action="edit-reserved-by" data-gift-id="${gift.id}" title="Editar nome da pessoa">
                            <i class="fas fa-user-edit"></i> Nome
                           </button>`
                        : `<button class="btn btn-small btn-warning" data-action="reserve" data-gift-id="${gift.id}" title="Marcar como reservado">
                            <i class="fas fa-lock"></i> Reservar
                           </button>`
                    }
                    <button class="btn btn-small btn-danger" data-action="delete" data-gift-id="${gift.id}" title="Excluir presente">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    adminList.innerHTML = giftsHTML;
    
    // Anexa listeners
    attachAdminListeners();
}

/**
 * Anexa listeners aos botões administrativos
 */
function attachAdminListeners() {
    // Botão adicionar
    elements.btnAddGift.addEventListener('click', () => {
        openGiftForm();
    });
    
    // Botões editar
    document.querySelectorAll('[data-action="edit"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.closest('[data-action]').dataset.giftId);
            openGiftForm(giftId);
        });
    });
    
    // Botões reservar
    document.querySelectorAll('[data-action="reserve"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.closest('[data-action]').dataset.giftId);
            handleReserveGiftAdmin(giftId);
        });
    });
    
    // Botões liberar
    document.querySelectorAll('[data-action="unreserve"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.closest('[data-action]').dataset.giftId);
            handleUnreserveGift(giftId);
        });
    });
    
    // Botões editar nome
    document.querySelectorAll('[data-action="edit-reserved-by"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.closest('[data-action]').dataset.giftId);
            openEditReservedByForm(giftId);
        });
    });
    
    // Botões remover
    document.querySelectorAll('[data-action="delete"]').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = parseInt(e.target.closest('[data-action]').dataset.giftId);
            handleDeleteGift(giftId);
        });
    });
}

/**
 * Abre formulário de presente (novo ou edição)
 */
async function openGiftForm(giftId = null) {
    const form = elements.giftForm;
    const isEdit = giftId !== null;
    
    document.getElementById('giftFormTitle').textContent = isEdit ? 'Editar Presente' : 'Adicionar Presente';
    document.getElementById('giftFormIcon').innerHTML = isEdit ? '<i class="fas fa-edit"></i>' : '<i class="fas fa-gift"></i>';
    
    // Limpa preview de imagem
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    imagePreview.style.display = 'none';
    imagePreviewImg.src = '';
    document.getElementById('giftImageFile').value = '';
    
    if (isEdit) {
        // Busca o presente atualizado da API administrativa
        try {
            const token = localStorage.getItem('adminToken');
            const data = await apiRequest(`/admin/gifts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const gift = (data.gifts || []).find(g => g.id === giftId) || state.gifts.find(g => g.id === giftId);
            
            if (gift) {
                document.getElementById('giftId').value = gift.id;
                document.getElementById('giftName').value = gift.name;
                document.getElementById('giftCategory').value = gift.category || '';
                document.getElementById('giftDescription').value = gift.description || '';
                document.getElementById('giftProductLink').value = gift.product_link || '';
                
                // Mostra preview se houver imagem existente
                if (gift.image_url) {
                    imagePreviewImg.src = buildImageUrl(gift.image_url);
                    imagePreview.style.display = 'flex';
                    imagePreview.style.alignItems = 'center';
                }
            }
        } catch (error) {
            console.error('Erro ao carregar presente para edição:', error);
            // Fallback para estado local
            const gift = state.gifts.find(g => g.id === giftId);
            if (gift) {
                document.getElementById('giftId').value = gift.id;
                document.getElementById('giftName').value = gift.name;
                document.getElementById('giftCategory').value = gift.category || '';
                document.getElementById('giftDescription').value = gift.description || '';
                document.getElementById('giftProductLink').value = gift.product_link || '';
                
                // Mostra preview se houver imagem existente
                if (gift.image_url) {
                    imagePreviewImg.src = buildImageUrl(gift.image_url);
                    imagePreview.style.display = 'flex';
                    imagePreview.style.alignItems = 'center';
                }
            }
        }
    } else {
        form.reset();
        document.getElementById('giftId').value = '';
    }
    
    clearFormErrors('giftForm');
    openModal(elements.modalGiftForm);
}

/**
 * Processa formulário de presente
 */
async function handleGiftFormSubmit(e) {
    e.preventDefault();
    
    const giftId = document.getElementById('giftId').value;
    const isEdit = giftId !== '';
    const imageFile = document.getElementById('giftImageFile').files[0];
    
    // Validação básica
    const name = document.getElementById('giftName').value.trim();
    const category = document.getElementById('giftCategory').value.trim();
    const description = document.getElementById('giftDescription').value.trim();
    
    if (!name) {
        showFieldError('giftName', 'Nome é obrigatório');
        return;
    }
    if (!category) {
        showFieldError('giftCategory', 'Categoria é obrigatória');
        return;
    }
    if (!description) {
        showFieldError('giftDescription', 'Descrição é obrigatória');
        return;
    }
    
    try {
        clearFormErrors('giftForm');
        const submitButton = document.getElementById('submitGiftForm');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';
        
        const token = localStorage.getItem('adminToken');
        const endpoint = isEdit ? `/admin/gifts/${giftId}` : '/admin/gifts';
        const method = isEdit ? 'PUT' : 'POST';
        
        // Se há arquivo de imagem, usa FormData
        if (imageFile) {
            const formDataToSend = new FormData();
            formDataToSend.append('image', imageFile);
            formDataToSend.append('data', JSON.stringify({
                name,
                category,
                description,
                product_link: document.getElementById('giftProductLink').value.trim() || null,
                image_url: null
            }));
            
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao salvar presente');
            }
        } else {
            // Se não há arquivo, envia JSON normalmente
            const productLink = document.getElementById('giftProductLink').value.trim();
            const formData = {
                name,
                category,
                description,
                product_link: productLink || null,
                image_url: null
            };
            
            await apiRequest(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
        }
        
        closeModal(elements.modalGiftForm);
        await loadAdminGifts();
        await loadGifts();
        
    } catch (error) {
        showAlertDialog('Erro', error.message || 'Erro ao salvar presente', 'fas fa-exclamation-circle', 'danger');
    } finally {
        const submitButton = document.getElementById('submitGiftForm');
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar';
    }
}

/**
 * Remove presente
 */
async function handleDeleteGift(giftId) {
    const gift = state.gifts.find(g => g.id === giftId);
    const message = gift && gift.status === 'reserved'
        ? `Tem certeza que deseja remover este presente?<br><br><strong>Este presente está reservado por:</strong> ${escapeHtml(gift.reserved_by || 'Não informado')}<br><br>Esta ação não pode ser desfeita.`
        : 'Tem certeza que deseja remover este presente? Esta ação não pode ser desfeita.';
    
    showConfirmDialog(
        'Excluir Presente',
        message,
        'fas fa-trash',
        'btn-danger',
        async () => {
            try {
                const token = localStorage.getItem('adminToken');
                await apiRequest(`/admin/gifts/${giftId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                await loadAdminGifts();
                await loadGifts();
            } catch (error) {
                showAlertDialog('Erro', error.message || 'Erro ao remover presente', 'fas fa-exclamation-circle', 'danger');
            }
        }
    );
}

/**
 * Reserva presente (admin)
 */
async function handleReserveGiftAdmin(giftId) {
    showInputNameDialog(
        'Reservar Presente',
        'Digite o nome da pessoa que está reservando este presente:',
        async (name) => {
            if (!name || name.trim().length < 3) {
                showAlertDialog('Atenção', 'Nome deve ter pelo menos 3 caracteres', 'fas fa-exclamation-triangle', 'warning');
                return false;
            }
            
            try {
                const token = localStorage.getItem('adminToken');
                await apiRequest(`/admin/gifts/${giftId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'reserved',
                        reserved_by: name.trim()
                    })
                });
                
                await loadAdminGifts();
                await loadGifts();
                return true;
            } catch (error) {
                showAlertDialog('Erro', error.message || 'Erro ao reservar presente', 'fas fa-exclamation-circle', 'danger');
                return false;
            }
        }
    );
}

/**
 * Libera presente (admin)
 */
async function handleUnreserveGift(giftId) {
    showConfirmDialog(
        'Liberar Presente',
        'Tem certeza que deseja liberar este presente? O nome da pessoa será removido e o presente voltará a ficar disponível.',
        'fas fa-unlock',
        'btn-success',
        async () => {
            try {
                const token = localStorage.getItem('adminToken');
                await apiRequest(`/admin/gifts/${giftId}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        status: 'available'
                    })
                });
                
                await loadAdminGifts();
                await loadGifts();
            } catch (error) {
                showAlertDialog('Erro', error.message || 'Erro ao liberar presente', 'fas fa-exclamation-circle', 'danger');
            }
        }
    );
}

/**
 * Abre formulário para editar nome da pessoa que reservou
 */
async function openEditReservedByForm(giftId) {
    try {
        const token = localStorage.getItem('adminToken');
        const data = await apiRequest(`/admin/gifts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const gift = (data.gifts || []).find(g => g.id === giftId);
        
        if (!gift || gift.status !== 'reserved') {
            showAlertDialog('Atenção', 'Este presente não está reservado', 'fas fa-info-circle', 'info');
            return;
        }
        
        document.getElementById('editReservedByGiftId').value = gift.id;
        document.getElementById('reservedByName').value = gift.reserved_by || '';
        document.getElementById('reservedByNameError').textContent = '';
        document.getElementById('reservedByNameError').style.display = 'none';
        
        openModal(document.getElementById('modalEditReservedBy'));
        
    } catch (error) {
        console.error('Erro ao carregar presente:', error);
        showAlertDialog('Erro', 'Erro ao carregar informações do presente', 'fas fa-exclamation-circle', 'danger');
    }
}

/**
 * Processa formulário de editar nome da pessoa
 */
async function handleEditReservedBySubmit(e) {
    e.preventDefault();
    
    const giftId = document.getElementById('editReservedByGiftId').value;
    const reservedByName = document.getElementById('reservedByName').value.trim();
    
    try {
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Salvando...';
        
        const token = localStorage.getItem('adminToken');
        await apiRequest(`/admin/gifts/${giftId}/reserved-by`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reserved_by: reservedByName || null
            })
        });
        
        closeModal(document.getElementById('modalEditReservedBy'));
        await loadAdminGifts();
        await loadGifts();
        
    } catch (error) {
        const errorElement = document.getElementById('reservedByNameError');
        errorElement.textContent = error.message || 'Erro ao atualizar nome';
        errorElement.style.display = 'block';
    } finally {
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar';
    }
}

// ==================== MODAIS PERSONALIZADOS ====================

/**
 * Mostra modal de confirmação
 */
function showConfirmDialog(title, message, iconClass = 'fas fa-exclamation-triangle', confirmBtnClass = 'btn-primary', onConfirm) {
    const modal = document.getElementById('modalConfirm');
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalMessage').innerHTML = message;
    document.getElementById('confirmModalIcon').innerHTML = `<i class="${iconClass}"></i>`;
    
    const confirmBtn = document.getElementById('confirmAction');
    confirmBtn.className = `btn ${confirmBtnClass}`;
    confirmBtn.textContent = 'Confirmar';
    
    // Remove listeners anteriores
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    
    // Adiciona novo listener
    document.getElementById('confirmAction').addEventListener('click', async () => {
        closeModal(modal);
        if (onConfirm) {
            await onConfirm();
        }
    });
    
    openModal(modal);
}

/**
 * Mostra modal de input de nome
 */
function showInputNameDialog(title, label, onSubmit) {
    const modal = document.getElementById('modalInputName');
    document.getElementById('inputNameModalTitle').textContent = title;
    document.getElementById('inputNameLabel').textContent = label;
    document.getElementById('inputNameField').value = '';
    document.getElementById('inputNameError').textContent = '';
    document.getElementById('inputNameError').style.display = 'none';
    
    // Remove listeners anteriores
    const form = document.getElementById('inputNameForm');
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adiciona novo listener
    document.getElementById('inputNameForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('inputNameField').value.trim();
        const result = await onSubmit(name);
        if (result !== false) {
            closeModal(modal);
        }
    });
    
    openModal(modal);
    document.getElementById('inputNameField').focus();
}

/**
 * Mostra modal de alerta
 */
function showAlertDialog(title, message, iconClass = 'fas fa-info-circle', type = 'info') {
    const modal = document.getElementById('modalAlert');
    document.getElementById('alertModalTitle').textContent = title;
    document.getElementById('alertModalMessage').textContent = message;
    document.getElementById('alertModalIcon').innerHTML = `<i class="${iconClass}"></i>`;
    
    const closeBtn = document.getElementById('closeAlert');
    let btnClass = 'btn-primary';
    if (type === 'danger') btnClass = 'btn-danger';
    if (type === 'warning') btnClass = 'btn-warning';
    if (type === 'success') btnClass = 'btn-success';
    if (type === 'info') btnClass = 'btn-info';
    
    closeBtn.className = `btn ${btnClass}`;
    
    openModal(modal);
}

// ==================== INICIALIZAÇÃO ====================

/**
 * Configura preview de imagem
 */
function setupImagePreview() {
    const imageFileInput = document.getElementById('giftImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const removeImagePreviewBtn = document.getElementById('removeImagePreview');
    
    // Preview ao selecionar arquivo
    imageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Valida tipo de arquivo
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showAlertDialog('Tipo de arquivo inválido', 'Use apenas imagens nos formatos: JPEG, PNG, GIF ou WebP.', 'fas fa-exclamation-triangle', 'warning');
                e.target.value = '';
                return;
            }
            
            // Valida tamanho (5MB)
            if (file.size > 5 * 1024 * 1024) {
                showAlertDialog('Arquivo muito grande', 'O tamanho máximo permitido é 5MB. Por favor, escolha uma imagem menor.', 'fas fa-exclamation-triangle', 'warning');
                e.target.value = '';
                return;
            }
            
            // Mostra preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreviewImg.src = e.target.result;
                imagePreview.style.display = 'flex';
                imagePreview.style.alignItems = 'center';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Remove preview
    removeImagePreviewBtn.addEventListener('click', function() {
        imageFileInput.value = '';
        imagePreview.style.display = 'none';
        imagePreviewImg.src = '';
    });
}

/**
 * Inicializa aplicação
 */
function init() {
    setupModalCloseHandlers();
    setupImagePreview();
    setupPasswordToggle();
    setupSearchFilter();
    
    // Event listeners principais
    elements.reserveForm.addEventListener('submit', handleReserveGift);
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.giftForm.addEventListener('submit', handleGiftFormSubmit);
    elements.btnAdmin.addEventListener('click', handleAdminClick);
    
    // Formulário de editar nome da pessoa
    document.getElementById('editReservedByForm').addEventListener('submit', handleEditReservedBySubmit);
    
    // Fechar modal de editar nome
    document.getElementById('closeEditReservedByModal').addEventListener('click', () => {
        closeModal(document.getElementById('modalEditReservedBy'));
        document.getElementById('editReservedByForm').reset();
    });
    
    document.getElementById('cancelEditReservedBy').addEventListener('click', () => {
        closeModal(document.getElementById('modalEditReservedBy'));
        document.getElementById('editReservedByForm').reset();
    });
    
    setupModalCloseOnOutsideClick(document.getElementById('modalEditReservedBy'));
    
    // Fechar modais personalizados
    document.getElementById('closeConfirmModal').addEventListener('click', () => {
        closeModal(document.getElementById('modalConfirm'));
    });
    
    document.getElementById('cancelConfirm').addEventListener('click', () => {
        closeModal(document.getElementById('modalConfirm'));
    });
    
    document.getElementById('closeInputNameModal').addEventListener('click', () => {
        closeModal(document.getElementById('modalInputName'));
        document.getElementById('inputNameForm').reset();
    });
    
    document.getElementById('cancelInputName').addEventListener('click', () => {
        closeModal(document.getElementById('modalInputName'));
        document.getElementById('inputNameForm').reset();
    });
    
    document.getElementById('closeAlertModal').addEventListener('click', () => {
        closeModal(document.getElementById('modalAlert'));
    });
    
    document.getElementById('closeAlert').addEventListener('click', () => {
        closeModal(document.getElementById('modalAlert'));
    });
    
    setupModalCloseOnOutsideClick(document.getElementById('modalConfirm'));
    setupModalCloseOnOutsideClick(document.getElementById('modalInputName'));
    setupModalCloseOnOutsideClick(document.getElementById('modalAlert'));
    
    // Carrega dados iniciais
    loadGifts();
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
