// Contains all the code related to the concept of users
// May not only affect the users tables but tables related to it as well
package db

import (
	"backend/utils"
	"context"
	"errors"
	"log/slog"

	"github.com/alexedwards/argon2id"
	"github.com/jackc/pgx/v5"
)

func getLogger() *slog.Logger {
	return utils.GetLogger().WithGroup("db").WithGroup("users")
}

// Creates a user in the user table
// Mainly used when registering a new user by username, email and password
func CreateUserByUsernameAndEmail(username string, email string, password string) error {
	logger := getLogger().With(slog.String("username", username), slog.String("email", email))

	logger.Info("Creating user")

	hash, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		logger.Warn("Unable to hash password", "err", err)
		return errors.New("Unable to create user")
	}

	conn := GetConn()
	_, err = conn.Exec(
		context.Background(),
		`INSERT INTO users
		(email, username, password_hash, verified_email)
		VALUES
		(@email, @username, @password_hash, FALSE)`,
		pgx.NamedArgs{"email": email, "username": username, "password_hash": hash},
	)
	if err != nil {
		logger.Warn("Unable to create user in db", "err", err)
		return errors.New("Unable to create user")
	}
	return nil
}
