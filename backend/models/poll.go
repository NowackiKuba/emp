package models

import (
	"fmt"
	"time"

	"example.com/employees/db"
	"github.com/lib/pq"
)

type Poll struct { 
	ID int32 `json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	StartsOn time.Time `json:"starts_on"`
	EndsOn time.Time `json:"ends_on"`
	Questions []string `json:"questions"`
	CreatedById int32 `json:"created_by_id"`
	CreatedBy User `json:"created_by"`
	Company Company `json:"company"`
	CompanyId int32 `json:"company_id"`

}

func (p *Poll) Create() error { 
	query := `INSERT INTO polls(title, description, starts_on, ends_on, questions, created_by, created_at, updated_at, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()
	
	_, err = stmt.Exec(p.Title, p.Description, p.StartsOn, p.EndsOn, pq.Array(p.Questions), p.CreatedById, time.Now(), time.Now(), p.CompanyId)
	if err != nil { 
		fmt.Println("ERROR IN EXEC")
	}
	return err

}

func GetCompanyPolls(id int32, startDate, endDate time.Time) (*[]Poll, error) { 
	query := `SELECT p.*, c.* AS company, u.* AS user FROM polls p LEFT JOIN companies c ON p.company_id = c.id LEFT JOIN users u ON p.created_by = u.id WHERE p.company_id = $1 AND p.starts_on::date > $2 AND p.ends_on::date < $3` 

	rows, err := db.DB.Query(query, id, startDate, endDate)

	if err != nil { 
		return nil, fmt.Errorf("could not execute query: %v", err)
	}

	defer rows.Close()

	var polls []Poll

	for rows.Next() { 
		var poll Poll
		var company Company
		var user User

		err := rows.Scan(
			&poll.ID,
			&poll.Title,
			&poll.Description,
			&poll.CreatedAt,
			&poll.UpdatedAt,
			&poll.StartsOn,
			&poll.EndsOn,
			pq.Array(&poll.Questions),
			&poll.CreatedById,
			&poll.CompanyId,
			&company.ID,
			&company.Name,
			&company.Email,
			&company.LogoUrl,
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
			return nil, fmt.Errorf("could not execute query: %v", err)
		}

		poll.Company = company
		poll.CreatedBy = user

		polls = append(polls, poll)
	}

	if rows.Err() != nil { 
		return nil, fmt.Errorf("could not execute query: %v", rows.Err())
	}

	return &polls, nil
}


func GetPoll(id int32) (Poll, error) { 
	query := `SELECT * FROM polls WHERE id = $1`

	row := db.DB.QueryRow(query, id)

	var poll Poll

	err := row.Scan(
		&poll.ID,
		&poll.Title,
		&poll.Description,
		&poll.CreatedAt,
		&poll.UpdatedAt,
		&poll.StartsOn,
		&poll.EndsOn,
		pq.Array(&poll.Questions),
		&poll.CreatedById,
		&poll.CompanyId,
	)

	if err != nil { 
		return Poll{}, err
	}

	return poll, err
}