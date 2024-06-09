package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() { 
	var err error
	connStr := "postgres://postgres:postgres@localhost:2022/postgres?sslmode=disable"

	DB, err = sql.Open("postgres", connStr)

	if err != nil { 

		panic("Could not connect to db")
	}

	// defer DB.Close()

	err = DB.Ping()

	if err != nil { 
		panic("Could not ping db")
	}
	CreateTables(DB)

}


func CreateTables(DB *sql.DB) {
	createCompaniesTable := `CREATE TABLE IF NOT EXISTS companies (
		id SERIAL PRIMARY KEY,
		name TEXT,
		email TEXT UNIQUE,
		logoUrl TEXT
	)`

	_, err := DB.Exec(createCompaniesTable)
	if err != nil {
		log.Fatal(err)
		panic("Could not create companies table")
	}

	createUsersTable := `	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		is_working BOOLEAN DEFAULT FALSE,
		work_start TIMESTAMP DEFAULT NOW(),
		work_end TIMESTAMP DEFAULT NOW(),
		is_on_vacation BOOLEAN DEFAULT FALSE,
		is_on_break BOOLEAN DEFAULT FALSE,
		img_url TEXT DEFAULT '',
		role TEXT NOT NULL,
		position TEXT NOT NULL,
		company_id INT NOT NULL,
		FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createUsersTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create users table")
	}
	createTasksTable := `	CREATE TABLE IF NOT EXISTS tasks (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		deadline TIMESTAMP DEFAULT NOW(),
		priority INT NOT NULL,
		status TEXT NOT NULL,
		company_id INT NOT NULL,
		assigned_by_id INT NOT NULL,
		assigned_to_id INT NOT NULL,
		FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE,
		FOREIGN KEY (assigned_by_id) REFERENCES users (id) ON DELETE CASCADE,
		FOREIGN KEY (assigned_to_id) REFERENCES users (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createTasksTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create tasks table")
	}
}