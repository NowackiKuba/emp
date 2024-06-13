package models

import (
	"fmt"
	"time"

	"example.com/employees/db"
)

type Task struct { 
	ID int32 `json:"id"`
	Title string `json:"title"`
	Description string `json:"description"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
	Deadline string `json:"deadline"`
	Priority int `json:"priority"`
	Status string `json:"status"`
	CompanyId int32 `json:"company_id"`
	AssignedById int32 `json:"assigned_by_id"`
	AssignedToId int32 `json:"assigned_to_id"`
	AssignedBy User `json:"assigned_by"`
	AssignedTo User `json:"assigned_to"`
}

func (t *Task) Create() error { 
	query := `INSERT INTO tasks(title, description, created_at, updated_at, deadline, priority, status, company_id, assigned_to_id, assigned_by_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	if err != nil { 
		return err
	}

	_, err = stmt.Exec(
		t.Title, t.Description, time.Now(), time.Now(), t.Deadline, t.Priority, "ASSIGNED", t.CompanyId, t.AssignedToId, t.AssignedById,
	)
	if err != nil { 
		return err
	}

	return nil
}
func GetCompanyTasks(companyId int32) (*[]Task, error) { 
	query := `
	SELECT
    t.*,
    u1.* AS assigned_by_user,
    u2.* AS assigned_to_user
	FROM
    tasks t
	LEFT JOIN
    users u1 ON t.assigned_by_id = u1.id
	LEFT JOIN
    users u2 ON t.assigned_to_id = u2.id
	WHERE
    t.company_id = $1;
	`
	rows, err := db.DB.Query(query, companyId)
	if err != nil {
		return nil, fmt.Errorf("could not execute query: %v", err)
	}
	defer rows.Close()

	var tasks []Task

	for rows.Next() {
		var task Task
		var assignedBy User
		var assignedTo User

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.CreatedAt,
			&task.UpdatedAt,
			&task.Deadline,
			&task.Priority,
			&task.Status,
			&task.CompanyId,
			&task.AssignedById,
			&task.AssignedToId,
			&assignedBy.ID,
			&assignedBy.FirstName,
			&assignedBy.LastName,
			&assignedBy.Email,
			&assignedBy.Password,
			&assignedBy.CreatedAt,
			&assignedBy.UpdatedAt,
			&assignedBy.IsWorking,
			&assignedBy.WorkStart,
			&assignedBy.WorkEnd,
			&assignedBy.IsOnBreak,
			&assignedBy.IsOnVacation,
			&assignedBy.ImgUrl,
			&assignedBy.Role,
			&assignedBy.Position,
			&assignedBy.CompanyID,
			&assignedTo.ID,
			&assignedTo.FirstName,
			&assignedTo.LastName,
			&assignedTo.Email,
			&assignedTo.Password,
			&assignedTo.CreatedAt,
			&assignedTo.UpdatedAt,
			&assignedTo.IsWorking,
			&assignedTo.WorkStart,
			&assignedTo.WorkEnd,
			&assignedTo.IsOnBreak,
			&assignedTo.IsOnVacation,
			&assignedTo.ImgUrl,
			&assignedTo.Role,
			&assignedTo.Position,
			&assignedTo.CompanyID,
		)
		if err != nil {
			return nil, fmt.Errorf("could not scan row: %v", err)
		}

		task.AssignedBy = assignedBy
		task.AssignedTo = assignedTo

		tasks = append(tasks, task)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("rows iteration error: %v", rows.Err())
	}

	return &tasks, nil

}

func (t *Task) Delete() error { 
	query := `DELETE FROM tasks WHERE id = $1`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(t.ID)

	return err
}

func GetTask(id int32) (*Task, error) { 
	query := "SELECT * FROM tasks WHERE id = $1"

	row := db.DB.QueryRow(query, id)

	var task Task
	err := row.Scan(&task.ID,
		&task.Title,
		&task.Description,
		&task.CreatedAt,
		&task.UpdatedAt,
		&task.Deadline,
		&task.Priority,
		&task.Status,
		&task.CompanyId,
		&task.AssignedById,
		&task.AssignedToId,
	)

	if err != nil { 
		return nil, err
	}

	return &task, nil

}

func (t *Task) Update() error { 
	query := `
		UPDATE tasks SET title = $1, description = $2, deadline = $3, priority = $4, status = $5, assigned_by_id = $6, assigned_to_id = $7 WHERE id = $8
	`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(t.Title, t.Description, t.Deadline, t.Priority, t.Status,  t.AssignedById, t.AssignedToId, t.ID)

	return err
}


func GetUserTasks(userId int32) (*[]Task, error) { 
	query := `
	SELECT
    t.*,
    u1.* AS assigned_by_user,
    u2.* AS assigned_to_user
	FROM
    tasks t
	LEFT JOIN
    users u1 ON t.assigned_by_id = u1.id
	LEFT JOIN
    users u2 ON t.assigned_to_id = u2.id
	WHERE
    t.assigned_to_id = $1;
	`
	rows, err := db.DB.Query(query, userId)
	if err != nil {
		return nil, fmt.Errorf("could not execute query: %v", err)
	}
	defer rows.Close()

	var tasks []Task

	for rows.Next() {
		var task Task
		var assignedBy User
		var assignedTo User

		err := rows.Scan(
			&task.ID,
			&task.Title,
			&task.Description,
			&task.CreatedAt,
			&task.UpdatedAt,
			&task.Deadline,
			&task.Priority,
			&task.Status,
			&task.CompanyId,
			&task.AssignedById,
			&task.AssignedToId,
			&assignedBy.ID,
			&assignedBy.FirstName,
			&assignedBy.LastName,
			&assignedBy.Email,
			&assignedBy.Password,
			&assignedBy.CreatedAt,
			&assignedBy.UpdatedAt,
			&assignedBy.IsWorking,
			&assignedBy.WorkStart,
			&assignedBy.WorkEnd,
			&assignedBy.IsOnBreak,
			&assignedBy.IsOnVacation,
			&assignedBy.ImgUrl,
			&assignedBy.Role,
			&assignedBy.Position,
			&assignedBy.CompanyID,
			&assignedTo.ID,
			&assignedTo.FirstName,
			&assignedTo.LastName,
			&assignedTo.Email,
			&assignedTo.Password,
			&assignedTo.CreatedAt,
			&assignedTo.UpdatedAt,
			&assignedTo.IsWorking,
			&assignedTo.WorkStart,
			&assignedTo.WorkEnd,
			&assignedTo.IsOnBreak,
			&assignedTo.IsOnVacation,
			&assignedTo.ImgUrl,
			&assignedTo.Role,
			&assignedTo.Position,
			&assignedTo.CompanyID,
		)
		if err != nil {
			return nil, fmt.Errorf("could not scan row: %v", err)
		}

		task.AssignedBy = assignedBy
		task.AssignedTo = assignedTo

		tasks = append(tasks, task)
	}

	if rows.Err() != nil {
		return nil, fmt.Errorf("rows iteration error: %v", rows.Err())
	}

	return &tasks, nil

}