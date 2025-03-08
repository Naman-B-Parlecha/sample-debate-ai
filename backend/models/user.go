package models

type Auth struct {
	Id       string `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID                string `json:"id"`
	Username          string `json:"username"`
	Email             string `json:"email"`
	Bio               string `json:"bio"`
	ProfilePictureURL string `json:"profile_picture_url"`
	EloRating         int    `json:"elo_rating"`
}
