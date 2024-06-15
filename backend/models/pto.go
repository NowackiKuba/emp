package models

import (
	"fmt"
	"time"

	"example.com/employees/db"
)

type PTO struct { 
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Title string `json:"title"`
	Description string `json:"description"`
	SendById int32 `json:"send_by_id"`
	SendBy User `json:"send_by"`
	Status string `json:"status"`
	CompanyId int32 `json:"company_id"`
	Company Company `json:"company"`
	Accepted bool `json:"accepted"`
	StartDate time.Time `json:"start_date"`
	EndDate time.Time `json:"end_date"`
}

func (p *PTO) Create() error { 
	query := `INSERT INTO ptos(created_at, updated_at, title, description, send_by_id, status, company_id, accepted, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(time.Now(), time.Now(), p.Title, p.Description, p.SendById, p.Status, p.CompanyId, false, p.StartDate, p.EndDate)

	return err
}


func GetCompanyPTOs(id int32) (*[]PTO, error) { 
	query := `SELECT p.*, u.* AS user, c.* AS company FROM ptos p LEFT JOIN users u ON p.send_by_id = u.id LEFT JOIN companies c ON p.company_id = c.id WHERE p.company_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, fmt.Errorf("could not execute query: %v", err)
	}

	defer rows.Close()

	var ptos []PTO

	for rows.Next() { 
		var pto PTO
		var user User
		var company Company

		rows.Scan(
			&pto.ID,
			&pto.CreatedAt,
			&pto.UpdatedAt,
			&pto.Title,
			&pto.Description,
			&pto.SendById,
			&pto.Status,
			&pto.CompanyId,
			&pto.Accepted,
			&pto.StartDate,
			&pto.EndDate,
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
			&company.ID,
			&company.Name,
			&company.Email,
			&company.LogoUrl,
		)
		
		if err != nil { 
			return nil, fmt.Errorf("could not execute query: %v", err)
		}

		pto.Company = company
		pto.SendBy = user

		ptos = append(ptos, pto)
	}

	if rows.Err() != nil { 
		return nil, fmt.Errorf("could not execute query: %v", rows.Err())
	}

	return &ptos, nil
}

func GetPTO(id int32) (*PTO, error) { 
	query := `SELECT * FROM ptos WHERE id = $1`

	row := db.DB.QueryRow(query, id)

	var pto PTO
	row.Scan(
			&pto.ID,
			&pto.CreatedAt,
			&pto.UpdatedAt,
			&pto.Title,
			&pto.Description,
			&pto.SendById,
			&pto.Status,
			&pto.CompanyId,
			&pto.Accepted,
			&pto.StartDate,
			&pto.EndDate,
	)

	if row.Err() != nil { 
		return nil, row.Err()
	}

	return &pto, nil
}

func (p *PTO) Update() (error, bool) {
	query := `UPDATE ptos SET status = $1, accepted = $2 WHERE id = $3`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err, false
	}

	defer stmt.Close()
	_, err = stmt.Exec(p.Status, p.Accepted, p.ID)


	return err, p.Accepted

}