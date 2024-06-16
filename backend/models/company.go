package models

import (
	"example.com/employees/db"
)

type Company struct {
	ID      int32 `json:"id"`
	Name    string `json:"name"`
	LogoUrl string `json:"logo_url"`
	Email   string `json:"email"`
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



func GetCompany(id int32) (*Company, error) { 
	query := `SELECT * FROM companies WHERE id = $1`

	row := db.DB.QueryRow(query, id)

	var company Company 

	err := row.Scan(
		&company.ID,
		&company.Name,
		&company.Email,
		&company.LogoUrl,
	)


	if err != nil { 
		return nil, err
	}

	return &company, nil
}

func (c *Company) Update() error { 
	query := `UPDATE companies SET name = $1, email = $2, logourl = $3 WHERE id = $4`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(c.Name, c.Email, c.LogoUrl, c.ID)

	return err
}