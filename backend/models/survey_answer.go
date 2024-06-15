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

func GetSurveyAnswers(id int32) (*[]SurveyAnswer, error) { 
	query := `SELECT * FROM survey_answers WHERE survey_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var surveyAnswers []SurveyAnswer

	for rows.Next() { 
		var surveyAnswer SurveyAnswer
		err := rows.Scan(
			&surveyAnswer.ID,
			&surveyAnswer.CreatedAt,
			&surveyAnswer.UpdatedAt,
			&surveyAnswer.AnsweredById,
			&surveyAnswer.SurveyId,
			pq.Array(&surveyAnswer.Answers),
		)

		if err != nil { 
			return nil, err
		}

		surveyAnswers = append(surveyAnswers, surveyAnswer)
	}

	if rows.Err() != nil { 
		return nil, rows.Err()
	}

	return &surveyAnswers, nil
}

func GetUseredAnsweredSurveys(id int32) (*[]Survey, error) {
	query := "SELECT survey_id FROM survey_answers WHERE answered_by_id = $1"

	rows, err := db.DB.Query(query, id)
	
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var survey_ids []int32
	for rows.Next() { 
		var answer SurveyAnswer
		err = rows.Scan(
			&answer.SurveyId,
		)

		if err != nil { 
			return nil, err
		}

		survey_ids = append(survey_ids, answer.SurveyId)
	}

	if rows.Err() != nil { 
		return nil, err
	}
	inResult := make(map[int32]bool)
	var uniqueIds []int32
	for _, id := range survey_ids {
        if _, ok := inResult[id]; !ok {
            inResult[id] = true
            uniqueIds = append(uniqueIds, id)
        }
    }

	// fmt.Println(uniqueIds)

	var surveys []Survey
	for _, surveyId := range uniqueIds { 
		survey, err := getSurvey(int32(surveyId))
		surveys = append(surveys, survey)
		if err != nil { 
			return nil, err
		}
	}

	return &surveys, nil
}
