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
		FOREIGN KEY (assigned_by_id) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (assigned_to_id) REFERENCES users (id) ON DELETE SET NULL
	)`

	_, err = DB.Exec(createTasksTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create tasks table")
	}
	createPollsTable := `CREATE TABLE IF NOT EXISTS polls (
		id SERIAL PRIMARY KEY,
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		starts_on TIMESTAMP DEFAULT NOW(),
		ends_on TIMESTAMP DEFAULT NOW(),
		questions TEXT[] DEFAULT '{}',
		created_by INT NOT NULL,
		company_id INT NOT NULL,
		FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createPollsTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create polls table")
	}
	createAnswersTable := `CREATE TABLE IF NOT EXISTS answers (
		id SERIAL PRIMARY KEY,
		answered_by_id INT NOT NULL,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		poll_id INT NOT NULL,
		answer TEXT NOT NULL,
		FOREIGN KEY (answered_by_id) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (poll_id) REFERENCES polls (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createAnswersTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create polls table")
	}
	createPTOSTable := `CREATE TABLE IF NOT EXISTS ptos (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		title TEXT NOT NULL,
		description TEXT NOT NULL,
		send_by_id INTEGER NOT NULL,
		status TEXT NOT NULL,
		company_id INT NOT NULL,
		accepted BOOLEAN,
		start_date TIMESTAMP NOT NULL,
		end_date TIMESTAMP NOT NULL,
		FOREIGN KEY (send_by_id) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createPTOSTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}
	createSurveysQuestionsTable := `CREATE TABLE IF NOT EXISTS survey_questions (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		title TEXT NOT NULL,
		type TEXT NOT NULL,
		answers TEXT[] NOT NULL,
		survey_id INTEGER NOT NULL,
		FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createSurveysQuestionsTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}

	createSurveysTable := `CREATE TABLE IF NOT EXISTS surveys (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		title TEXT NOT NULL,
		created_by_id INTEGER NOT NULL,
		company_id INT NOT NULL,
		start_date TIMESTAMP NOT NULL,
		end_date TIMESTAMP NOT NULL,
		questions INTEGER[] NOT NULL,
		FOREIGN KEY (questions) REFERENCES survey_questions (id) ON DELETE SET NULL,
		FOREIGN KEY (created_by_id) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createSurveysTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}
	createSurveyAnswersTable := `CREATE TABLE IF NOT EXISTS survey_answers (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		answered_by_id INTEGER NOT NULL,
		survey_id INTEGER NOT NULL,
		answers TEXT[] NOT NULL,
		FOREIGN KEY (answered_by_id) REFERENCES users (id) ON DELETE SET NULL,
		FOREIGN KEY (survey_id) REFERENCES surveys (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createSurveyAnswersTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}
	createUserWorkigDaysTable := `CREATE TABLE IF NOT EXISTS user_working_days (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		hours INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createUserWorkigDaysTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}
	createNotificationTable := `CREATE TABLE IF NOT EXISTS notifications (
		id SERIAL PRIMARY KEY,
		created_at TIMESTAMP DEFAULT NOW(),
		updated_at TIMESTAMP DEFAULT NOW(),
		title TEXT NOT NULL,
		message TEXT NOT NULL,
		to_id INTEGER NOT NULL,
		is_read BOOLEAN DEFAULT FALSE,
		FOREIGN KEY (to_id) REFERENCES users (id) ON DELETE CASCADE
	)`

	_, err = DB.Exec(createNotificationTable)
	if err != nil {
		fmt.Println(err)
		panic("Could not create ptos table")
	}
}