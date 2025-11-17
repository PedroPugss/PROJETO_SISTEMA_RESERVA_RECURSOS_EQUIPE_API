// SPRINT 4: Centralizar toda a comunicação com o backend

// Definir rota base da nossa API
const API_BASE_URL = 'http://localhost:3001/api'

// Criar um objeto que centraliza as chamadas da API
const api = {
    // Busca todos os recursos da API

    // Usado para popular os <select>
    async getRecursos() {
        try {
            const response = await fetch(`${API_BASE_URL}/recursos`);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Falha ao buscar Recursos: ", error);

            // Retorna um array vazio para não quebrar a UI
            return [];
        }
    },

    // Busca reservas da API
    // Usada para carregar histórico
    async getReservas(usuarioId = null) {
        try {
            let url = `${API_BASE_URL}/reservas`;

            // Se um usuarioId for fornecido, filtra as reservas
            if (usuarioId) {
                url += `?usuarioId = ${encodeURIComponent(usuarioId)}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error("Falha ao buscar Reservas", error);
        }
    },

    // Envia recursos para a API
    // Usada no formulário de 'Solicitar'
    // @param {object} dadosReservas
    async createReserva(dadosReservas) {
        const response = await fetch(`${API_BASE_URL}/reservas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReservas)
        });

        // Pega a resposta da API (Seja sucesso 201 ou erro 409)
        const data = await response.json();

        // Se a resposta não for ok
        if (!response.ok) {
            throw new Error(data.message || "Erro desconhecido ao criar reserva");
        }

        // Se for ok retorna nova reserva
        return data;
    }
};