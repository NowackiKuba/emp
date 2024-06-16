package models

import (
	"time"

	"example.com/employees/db"
)



type Question struct {
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Question string `json:"question"`
	Answer *string `json:"answer"`
	ToId int32 `json:"to_id"`
	FromId int32 `json:"from_id"`
	CompanyId int32 `json:"company_id"`
	To User `json:"to"`
	From User `json:"from"`
	Company Company `json:"company"`
}

func (q *Question) Create() error { 
	query := `INSERT INTO questions(created_at, updated_at, question, to_id, from_id, company_id) VALUES($1, $2, $3, $4, $5, $6)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(time.Now(), time.Now(), q.Question, q.ToId, q.FromId, q.CompanyId)

	return err
}

func GetCompanyQuestions(userId int32) (*[]Question, error) {
	query := `SELECT q.*, f.* AS from, t.* AS to FROM questions q LEFT JOIN users f ON q.from_id = f.id LEFT JOIN users t ON q.to_id = t.id WHERE q.company_id = $1`

	rows, err := db.DB.Query(query, userId)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var questions []Question
	
	for rows.Next() { 
		var question Question
		var from User
		var to User

		err := rows.Scan(
			&question.ID,
			&question.CreatedAt,
			&question.UpdatedAt,
			&question.Question,
			&question.Answer,
			&question.ToId,
			&question.FromId,
			&question.CompanyId,
			&from.ID,
            &from.FirstName,
            &from.LastName,
            &from.Email,
            &from.Password,
            &from.CreatedAt,
            &from.UpdatedAt,
            &from.IsWorking,
            &from.WorkStart,
            &from.WorkEnd,
            &from.IsOnVacation,
            &from.IsOnBreak,
            &from.ImgUrl,
            &from.Role,
			&from.Position,
            &from.CompanyID,
			&to.ID,
            &to.FirstName,
            &to.LastName,
            &to.Email,
            &to.Password,
            &to.CreatedAt,
            &to.UpdatedAt,
            &to.IsWorking,
            &to.WorkStart,
            &to.WorkEnd,
            &to.IsOnVacation,
            &to.IsOnBreak,
            &to.ImgUrl,
            &to.Role,
			&to.Position,
            &to.CompanyID,
		)

		if err != nil { 
			return nil, err
		}

		question.From = from
		question.To = to

		questions = append(questions, question)
	}

	if rows.Err() != nil { 
		return nil, rows.Err()
	}

	return &questions, nil
}


func (q *Question) Update() error { 
	query := `UPDATE questions SET answer = $1, updated_at = $2 WHERE id = $3`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(q.Answer, time.Now(), q.ID)

	return err
}