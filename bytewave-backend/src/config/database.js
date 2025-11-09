const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'Emily_adm',
  password: 'senha',
  database: 'escola_inteligente',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Cria pool de conexões
const pool = mysql.createPool(dbConfig);

// Testa a conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado ao MySQL - Escola Inteligente');
    connection.release();
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error.message);
  }
}

testConnection();

module.exports = pool;