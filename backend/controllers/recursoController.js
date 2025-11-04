// Importa o model Recusro
const { Recurso } = require('../models');

// Controller para manipular operações relacionados a Recursos
const recursoController = {
    @route // Get/api/recursos
    @desc // Listar todos os recursos
    @access // Public
};

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
}