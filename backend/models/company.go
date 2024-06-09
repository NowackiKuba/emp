package models

import (
	"example.com/employees/db"
)

type Company struct {
	ID      int32 `json:"id"`
	Name    string
	LogoUrl string
	Email   string
}

func (c *Company) Create() (int32, error) {
	query := `INSERT INTO companies(name, email, logoUrl) VALUES ($1, $2, $3) RETURNING id`

	var companyId int32

 	err := db.DB.QueryRow(query, c.Name, c.Email, c.LogoUrl).Scan(&companyId)

	if err != nil {

		return 0, err
	}

	return companyId, err

}
