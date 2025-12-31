package db

import (
	"backend/utils"
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var pg_conn *pgxpool.Pool

func GetConn() *pgxpool.Pool {
	logger := utils.GetLogger()
	logger = logger.WithGroup("db").WithGroup("client")

	if pg_conn == nil {
		logger.Info("create pgx connection")
		db_url := utils.GetEnv().DB_URL
		pool, err := pgxpool.New(context.Background(), db_url)
		// Should crash if db connection cannot be established
		if err != nil {
			logger.Error("Unable to connect to database")
			os.Exit(1)
		}
		pg_conn = pool

	}
	return pg_conn
}
