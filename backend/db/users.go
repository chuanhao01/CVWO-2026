// Contains all the code related to the concept of users
// May not only affect the users tables but tables related to it as well
package db

import (
	"context"
	"errors"
	"log/slog"

	"github.com/alexedwards/argon2id"
	"github.com/jackc/pgx/v5"
)

// Creates a user in the user table
// Mainly used when registering a new user by username, email and password
func CreateUserByUsernameAndEmail(logger *slog.Logger, username string, email string, password string) error {
	logger = logger.With(slog.String("username", username), slog.String("email", email))

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

func IsEmailUnique(logger *slog.Logger, email string) (bool, error) {
	logger = logger.With(slog.String("email", email))

	var exists bool
	conn := GetConn()
	err := conn.QueryRow(
		context.Background(),
		`SELECT EXISTS (SELECT 1 FROM users WHERE email = @email)`,
		pgx.NamedArgs{"email": email},
	).Scan(&exists)
	if err != nil {
		logger.Warn("Unable to check email")
		return false, errors.New("Unable to query email")
	}
	return !exists, nil
}

func IsUsernameUnique(logger *slog.Logger, username string) (bool, error) {
	logger = logger.With(slog.String("username", username))

	var exists bool
	conn := GetConn()
	err := conn.QueryRow(
		context.Background(),
		`SELECT EXISTS (SELECT 1 FROM users WHERE username = @username)`,
		pgx.NamedArgs{"username": username},
	).Scan(&exists)
	if err != nil {
		logger.With(slog.String("err", err.Error())).Warn("Unable to check username")
		return false, errors.New("Unable to query username")
	}
	return !exists, nil
}
