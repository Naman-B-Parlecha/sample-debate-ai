package services

import (
	"github.com/Naman-B-Parlecha/sample-debate-ai/models"
	"github.com/nedpals/supabase-go"
)

type ProfileService struct {
	client *supabase.Client
}

func NewProfileServer(client *supabase.Client) *ProfileService {
	return &ProfileService{client: client}
}

func (s *ProfileService) GetProfile(userId string) (*models.User, error) {
	var user models.User
	err := s.client.DB.From("users").Select("*").Eq("id", userId).Execute(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *ProfileService) UpdateProfile(userId string, profile *models.User) error {
	err := s.client.DB.From("users").Update(profile).Eq("id", userId).Execute(nil)

	return err
}
