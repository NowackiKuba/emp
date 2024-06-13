package models

import (
	"time"

	"example.com/employees/db"
)

type UserWorkingDays struct {
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Hours int32 `json:"hours"`
	UserId int32 `json:"user_id"`
	User User `json:"user"`
}

func (u *UserWorkingDays) Create() error { 
	query := `INSERT INTO user_working_days(created_at, updated_at, hours, user_id) VALUES ($1, $2, $3, $4)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(time.Now(), time.Now(), u.Hours, u.UserId)

	return err
}

func GetUserWorkHistory(id int32) (*[]UserWorkingDays, error) { 
	query := `SELECT * FROM user_working_days WHERE user_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var workHistory []UserWorkingDays

	for rows.Next() { 
		var workDay UserWorkingDays
		err := rows.Scan(
			&workDay.ID,
			&workDay.CreatedAt,
			&workDay.UpdatedAt,
			&workDay.Hours,
			&workDay.UserId,
		)

		if err != nil { 
			return nil, err
		}

		workHistory =append(workHistory, workDay)
	}

	if rows.Err() != nil { 
		return nil, rows.Err()
	}


	return &workHistory, nil
}