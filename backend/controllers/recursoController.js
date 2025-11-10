// Importa o model Recusro
const { Recurso } = require('../models');

// Controller para manipular operações relacionados a Recursos
const recursoController = {
    // @route // Get/api/recursos
    // @desc // Listar todos os recursos
    // @access // Public

    async listarTodos(req, res) {
        try {
            const recursos = await Recurso.findAll({
                order: [['nome', 'ASC']]
            });

            res.status(200).json(recursos)
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "Erro ao buscar recursos",
                error: error.message
            });
        }
    },

    async criar(req, res) {
        try {
            // 1. Pega os dados enviados no corpo de requisição
            const { nome, tipo, status, capacity, location, meta } = req.body;

            // 2. Validação básica
            if (!nome || !tipo) {
                return res.status(400).json({
                    message: 'Os campos "Nome" e "Tipo" são obrigatórios'
                });
            }

            // 3. Cria um novo recurso no Banco de Dados
            // Equivale a: INSERT INTO recurso (...) VALUES (...)
            const novoRecurso = await Recurso.create({
                nome,
                tipo,
                status,
                capacity,
                location,
                meta
            });

            // 4. Retorna o recurso recém-criado com Status 201
            res.status(201).json(novoRecurso);
        }
        catch (error) {
            // 5. Em caso de erro
            console.error(error);
            res.status(500).json({
                message: 'Erro ao criar novo Recurso',
                error: error.message
            });
        }
    }
};

module.exports = recursoController;