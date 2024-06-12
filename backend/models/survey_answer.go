package models

import (
	"time"

	"example.com/employees/db"
	"github.com/lib/pq"
)


type SurveyAnswer struct { 
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	AnsweredById int32 `json:"answered_by_id"`
	AnsweredBy User `json:"answered_by"`
	SurveyId int32 `json:"survey_id"`
	Survey Survey `json:"survey"`
	Answers []string `json:"answers"`
}

func (a *SurveyAnswer) Create() error { 
	query := `INSERT INTO survey_answers(created_at, updated_at, answered_by_id, survey_id, answers) VALUES ($1, $2, $3, $4, $5)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(time.Now(), time.Now(), a.AnsweredById, a.SurveyId, pq.Array(a.Answers))

	return err
}