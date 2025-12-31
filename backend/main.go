package main

import (
	"backend/db"
)

func main() {
	db.CreateUserByUsernameAndEmail("bob", "bob@test.com", "no")
}
