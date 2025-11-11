// Importa os Models e Operadores do Sequelize
const { Reserva, Recurso } = require('../models');
const { Op } = require('sequelize');

// Controller para manipular operações relacionadas a Reservas
const reservaController = {
    async listarTodos(req, res) {
        // 1. Prepara a consulta ao banco
        try {
            const queryOptions = {
                include: [{
                    model: Recurso,
                    as: 'recurso',
                    attributes: ['nome']
                }],
                order: [['startAt', 'DESC']]
            };

            if (req.query.usuarioId) {
                queryOptions.where = {
                    usuarioId: req.query.usuarioId
                };
            }

            // 3. Executa a busca no Banco
            const reservas = await Reserva.findAll(queryOptions);

            // 4. Retorna as reservas
            res.status(200).json(reservas);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Erro ao buscar reservas',
                error: error.message
            });
        }
    },

    async criar(req, res) {
        try {
            // 1. Pega os dados do FrontEnd (script.js)
            const { recursoId, usuarioId, data, horaInicio, horaFim, justificativa } = req.body;

            // Validação básica
            if (!recursoId || !usuarioId || !data || !horaInicio || !horaFim || !justificativa) {
                return res.status(400).json({
                    message: 'Campos obrigarórios estão faltando'
                });
            }
            // 3. Conversão de data/hora FrontEnd -> BackEnd
            const startAt = new Date(`${data}T${horaInicio}`);
            const endAt = new Date(`${data}T${horaFim}`);

            // 4. Verificação de conflito
            const conflito = await Reserva.findOne({
                where: {
                    recursoId: recursoId,
                    status: { [Op.ne]: 'rejeitada' },
                    startAt: { [Op.lt]: endAt },
                    endAt: { [Op.gt]: startAt }
                }
            });

            // 5. Se encontrar conflito, retorna erro (409)
            if (conflito) {
                return res.status(409).json({
                    message: 'Conflito de horário. Já existe reserva'
                });
            }

            // 6. Se não há conflito cria a reserva no banco
            const novaReserva = await Reserva.create({
                recursoId,
                usuarioId,
                startAt,
                endAt,
                justificativa,
                status: 'pendente'
            });

            // Retorna reserva criada
            res.status(201).json(novaReserva);
        }
        catch (error) {
            console.error(error);

            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    message: error.message,
                    details: error.errors
                });
            }

            res.status(500).json({
                message: 'Erro ao criar nova reserva',
                error: error.message
            });
        }
    }
};

module.exports = reservaController;