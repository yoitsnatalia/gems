const pool = require('../config/database');

class User {
    static async create(userData) {
        const { username, password, password_hash } = userData;

        const query = `
            INSERT INTO users ( username, password, password_hash )
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
        `;

        const result = await pool.query(query, [ username, password, password_hash ]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [ email ]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [ username ]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, email, profile_image, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [ id ]);
        return result.rows[0];
    }

}

module.exports = User;