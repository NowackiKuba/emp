package models

import (
	"time"

	"example.com/employees/db"
)


type Notification struct { 
	ID int32 `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Title string `json:"title"`
	Message string `json:"message"`
	ToId int32 `json:"to_id"`
	IsRead bool `json:"is_read"`
	To User `json:"to"`
}

func (n *Notification) Create() error { 
	query := `INSERT INTO notifications(created_at, updated_at, title, message, to_id, is_read) VALUES ($1, $2, $3, $4, $5, $6)`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(time.Now(), time.Now(), n.Title, n.Message, n.ToId, n.IsRead)

	return err
} 

func GetUserNotifications(id int32) (*[]Notification, error) { 
	query := `SELECT * FROM notifications WHERE to_id = $1`

	rows, err := db.DB.Query(query, id)

	if err != nil { 
		return nil, err
	}

	defer rows.Close()

	var notifications []Notification

	for rows.Next() { 
		var notification Notification
		err := rows.Scan(
			&notification.ID,
			&notification.CreatedAt,
			&notification.UpdatedAt,
			&notification.Title,
			&notification.Message,
			&notification.ToId,
			&notification.IsRead,
		)

		if err != nil { 
			return nil, err
		}

		notifications = append(notifications, notification)
	}

	if rows.Err() != nil { 
		return nil, rows.Err()
	}


	return &notifications, nil
}

func (n *Notification) ReadNotification() error { 
	query := `UPDATE notifications SET is_read = $1 WHERE id = $2`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(true, n.ID)

	return err
}

func GetNotification(id int32) (*Notification, error) { 
	query := `SELECT * FROM notifications WHERE id = $1`

	row := db.DB.QueryRow(query, id)

	var notification Notification

	err := row.Scan(
		&notification.ID,
		&notification.CreatedAt,
		&notification.UpdatedAt,
		&notification.Title,
		&notification.Message,
		&notification.ToId,
		&notification.IsRead,
	)

	if err != nil { 
		return nil, err
	}

	return &notification, nil

}

func (n *Notification) Delete() error { 
	query := `DELETE notifications WHERE id = $1`

	stmt, err := db.DB.Prepare(query)

	if err != nil { 
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(n.ID)

	return err
}