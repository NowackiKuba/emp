package models

import (
	"time"

	"example.com/employees/db"
	"github.com/lib/pq"
)

type Survey struct {
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Title string`json:"title"`
	CreatedById int32 `json:"created_by_id"`
	CreatedBy User `json:"created_by"`
	CompanyId int32 `json:"company_id"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
	Questions []int32 `json:"questions"`
	SurveyQuestions []SurveyQuestion `json:"survey_questions"`

}

type SurveyQuestion struct { 
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time`json:"updated_at"`
	Title string `json:"title"`
	Type string `json:"type"`
	Answers []string `json:"answers"`
	SurveyId int32 `json:"survey_id"`
	Survey Survey `json:"survey"`
}


func (s *Survey) Create() error { 
	tx, err := db.DB.Begin()

	if err != nil { 
		return err
	}

	var surveyID int32
	query := `INSERT INTO surveys (title, created_by_id, company_id, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	
	err = tx.QueryRow(query, s.Title, s.CreatedById, s.CompanyId, s.StartDate, s.EndDate).Scan(&surveyID)

	if err != nil {
		tx.Rollback()
		return err
	}

	questionsQuery := `INSERT INTO survey_questions (title, type, answers, survey_id)
			VALUES ($1, $2, $3, $4)`

	for _, q := range s.SurveyQuestions {
		_, err := tx.Exec(questionsQuery, q.Title, q.Type, pq.Array(q.Answers), surveyID)

		if err != nil { 
			tx.Rollback()
			return err
		}
	}

	err = tx.Commit()

	return err
}


func GetCompanySurveys(id int32) (*[]Survey, error) { 
	query := `SELECT s.*, u.* AS user FROM surveys s LEFT JOIN users u ON s.created_by_id = u.id WHERE s.company_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var surveys []Survey

	for rows.Next() { 
		var survey Survey
		var user User
		err := rows.Scan(
			&survey.ID,
			&survey.CreatedAt,
			&survey.UpdatedAt,
			&survey.Title,
			&survey.CreatedById,
			&survey.CompanyId,
			&survey.StartDate,
			&survey.EndDate,
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
		survey.CreatedBy = user
		surveys = append(surveys, survey)
	}

	if rows.Err() != nil { 
		return nil, rows.Err()
	}

	return &surveys, nil
}

func GetSurveyQuestions(id int32) (*[]SurveyQuestion, error) { 
	query := `SELECT * FROM survey_questions WHERE survey_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var questions []SurveyQuestion

	for rows.Next() { 
		var question SurveyQuestion

		err := rows.Scan(
			&question.ID,
			&question.CreatedAt,
			&question.UpdatedAt,
			&question.Title,
			&question.Type,
			pq.Array(&question.Answers),
			&question.SurveyId,
		)

		if err != nil { 
			return nil, err
		}

		questions = append(questions, question)
	}


	if rows.Err() != nil { 
		return nil, rows.Err()
	}

	return &questions, nil

}
