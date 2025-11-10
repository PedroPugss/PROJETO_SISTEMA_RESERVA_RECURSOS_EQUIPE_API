// 1. Importação dos pacotes
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// 2. Importações locais
const { sequelize } = require('.models');
const recursosRoute = require('./routes/recursosRoute');
const reservasRoutes = require('./routes/reservasRoute');

// 3. Inicialização do express
const app = express();
const PORT = process.env.PORT || 3001;

// 4. Configuração de MIDDLEWARE
app.use(cors());

// 5. Havilita o express para aceitar JSON nas requisições
app.use(express.json());

// 6. Definimos as rotas da api
app.use('api/recuros', recursosRoute);
app.use('api/reservas', reservasRoutes);
app.get('/', (req, res) => {
    res.send("API do Sistema de Reservas: OK");
});
sequelize.sync({
    // force:true // Só descomente se quiser pagar o banco e recriá-lo
}).then(() => {
    console.log("Banco de Dados conectado e Tabelas sincronizadas");
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http:localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Erro ao conectar ou sincronizar o Banco de Dados", err);
});