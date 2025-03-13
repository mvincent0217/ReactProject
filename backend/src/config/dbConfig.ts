import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    server: process.env.DB_SERVER as string,
    database: process.env.DB_NAME as string,
    port: parseInt(process.env.DB_PORT!),
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const poolPromise = new sql.ConnectionPool(dbConfig as sql.config)
    .connect()
    .then((pool: sql.ConnectionPool) => {
        console.log("✅ Connected to SQL Server");
        return pool;
    })
    .catch((err: unknown) => {
        console.error("❌ Database Connection Failed:", err);
        throw err;
    });

export { sql, poolPromise };
