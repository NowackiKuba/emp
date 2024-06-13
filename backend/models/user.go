package models

import (
	"errors"
	"fmt"
	"time"

	"example.com/employees/db"
	"example.com/employees/utils"
)


type User struct {
	ID           int32     `json:"id"`
	FirstName    string    `json:"first_name"`
	LastName     string    `json:"last_name"`
	Email        string    `json:"email"`
	Password     string    `json:"password"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
	WorkStart    time.Time `json:"work_start"`
	WorkEnd      time.Time `json:"work_end"`
	IsWorking    bool      `json:"is_working"`
	IsOnBreak    bool      `json:"is_on_break"`
	IsOnVacation bool      `json:"is_on_vacation"`
	ImgUrl       string    `json:"img_url"`
	Role		 string	   `json:"role"`
	Position 	 string    `json:"position"`
	CompanyID    int32     `json:"company_id"`
}

func (u *User) Save() error { 
	query := `INSERT INTO users(
		email, password, first_name, last_name, created_at, updated_at, company_id, role, position
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil { 
		return err
	}

	_, err = stmt.Exec(
		u.Email, hashedPassword, u.FirstName, u.LastName, time.Now(), time.Now(), u.CompanyID, u.Role, u.Position,
	)
	if err != nil { 
		return err
	}

	return nil
}


func (u *User) ValidateCredentials() error { 
	query := "SELECT id, password FROM users WHERE email = $1"

	row := db.DB.QueryRow(query, u.Email)

	var retrievedPassword string

	err := row.Scan(&u.ID, &retrievedPassword)

	if err != nil { 
		return errors.New("failed to get user")
	}

	passwordIsValid := utils.CheckPasswordHash(u.Password, retrievedPassword)

	if !passwordIsValid { 
		return errors.New("invalid credentials")
	}
	return nil
}

func AssignUserToCompany(userId, companyId string) error { 
	query := `
	UPDATE users 
	SET companyId = $1
	WHERE id = $2
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil { 
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(companyId, userId)

	return err
}

func GetCompanyUsers(id int32) (*[]User, error) { 
	query := `
        SELECT
            *
        FROM
            users
        WHERE
            company_id = $1
    `
    rows, err := db.DB.Query(query, id)
    if err != nil {
        return nil, fmt.Errorf("could not execute query: %v", err)
    }
    defer rows.Close()

    var users []User

    for rows.Next() {
        var user User
        err := rows.Scan(
            &user.ID,
            &user.FirstName,
            &user.LastName,
            &user.Email,
            &user.Password,
            &user.CreatedAt,
            &user.UpdatedAt,
            &user.IsWorking,
            &user.WorkStart,
            &user.WorkEnd,
            &user.IsOnBreak,
            &user.IsOnVacation,
            &user.ImgUrl,
            &user.Role,
			&user.Position,
            &user.CompanyID,
        )
        if err != nil {
            return nil, fmt.Errorf("could not scan row: %v", err)
        }
        users = append(users, user)
    }

    if rows.Err() != nil {
        return nil, fmt.Errorf("rows iteration error: %v", rows.Err())
    }

    return &users, nil
}

func GetUser(id int32) (*User, error) { 
	query := `SELECT * FROM users WHERE id = $1`
	row := db.DB.QueryRow(query, id)

	var user User
	err := row.Scan(
			&user.ID,
            &user.FirstName,
            &user.LastName,
            &user.Email,
            &user.Password,
            &user.CreatedAt,
            &user.UpdatedAt,
            &user.IsWorking,
            &user.WorkStart,
            &user.WorkEnd,
            &user.IsOnBreak,
            &user.IsOnVacation,
            &user.ImgUrl,
            &user.Role,
			&user.Position,
            &user.CompanyID,
	)
	if err != nil { 
		return nil, err
	}

	return &user, nil
}


func (u *User) CreateEmployee() (error) { 
	query := `INSERT INTO users(first_name, last_name, email, password, position, role, company_id, img_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)
	if err != nil { 
		return err
	}

	_, err = stmt.Exec(
		u.FirstName, u.LastName, u.Email, hashedPassword, u.Position, u.Role, u.CompanyID, u.ImgUrl,
	)
	if err != nil { 
		return err
	}

	return nil
}

func StartWork(id int32) error { 
	query := `UPDATE users SET is_working = $1, work_start = $2 WHERE id = $3`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(true, time.Now(), id)

	return err
}
func EndWork(id int32) error { 
	query := `UPDATE users SET is_working = $1, work_end = $2 WHERE id = $3`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(false, time.Now(), id)

	return err
}

func (u *User) Update() error { 
	query := `UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5, position = $6, img_url = $7 WHERE id = $8`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	hashedPassword, err := utils.HashPassword(u.Password)

	if err != nil { 
		return err
	}

	_, err = stmt.Exec(u.FirstName, u.LastName, u.Email, hashedPassword, u.Role, u.Position, u.ImgUrl, u.ID)

	return err
}

func DeleteEmployee(id int32) error { 
	query := `DELETE FROM users WHERE id = $1`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(id)

	return err
}