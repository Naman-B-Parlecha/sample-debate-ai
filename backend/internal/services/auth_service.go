package services

import (
	"context"
	"log"

	"github.com/Naman-B-Parlecha/sample-debate-ai/models"
	"github.com/nedpals/supabase-go"
)

type AuthService struct {
	client *supabase.Client
}

func NewAuthService(client *supabase.Client) *AuthService {
	return &AuthService{client: client}
}

func (s *AuthService) RegisterUser(user *models.User) error {
	ctx := context.Background()
	_, err := s.client.Auth.SignUp(ctx, supabase.UserCredentials{Email: user.Email, Password: user.Password})
	return err
}

func (s *AuthService) LoginUser(user *models.User) (string, error) {
	ctx := context.Background()
	authResponse, err := s.client.Auth.SignIn(ctx, supabase.UserCredentials{Email: user.Email, Password: user.Password})
	if err != nil {
		log.Println("login err", err.Error())
		return "", err
	}
	return authResponse.AccessToken, nil
}
