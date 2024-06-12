package models

import (
	"fmt"
	"time"

	"example.com/employees/db"
	"github.com/lib/pq"
)


type Answer struct { 
	ID int32 `json:"id"`
	AnsweredById int32 `json:"answered_by_id"`
	AnsweredBy User `json:"answered_by"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Poll Poll `json:"poll"`
	PollId int32 `json:"poll_id"`
	Answer string `json:"answer"`
}

func (a *Answer) Create() error { 
	query := "INSERT INTO answers(answered_by_id, created_at, updated_at, poll_id, answer) VALUES ($1, $2, $3, $4, $5)"

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(a.AnsweredById, time.Now(), time.Now(), a.PollId, a.Answer)

	return err
}

func GetPollAnswers(id int32) (*[]Answer, error) { 
	query := `SELECT a.*, p.* AS poll, u.* AS user FROM answers a LEFT JOIN polls p ON a.poll_id = p.id LEFT JOIN users u ON a.answered_by_id = u.id WHERE a.poll_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var answers []Answer

	for rows.Next() { 
		var answer Answer
		var poll Poll
		var user User

		err := rows.Scan(
			&answer.ID,
			&answer.AnsweredById,
			&answer.CreatedAt,
			&answer.UpdatedAt,
			&answer.PollId,
			&answer.Answer,
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

		answer.Poll = poll
		answer.AnsweredBy = user
		answers = append(answers, answer)
	}

	if rows.Err() != nil { 
		return nil, fmt.Errorf("could not execute query: %v", err)
	}

	return &answers, nil
}