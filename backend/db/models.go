package db

type User struct {
	Email         string
	PasswordHash  string
	Username      string
	VerifiedEmail bool
}
