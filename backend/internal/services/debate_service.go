package services

import (
	"fmt"
	"log"

	"github.com/Naman-B-Parlecha/sample-debate-ai/models"
	"github.com/nedpals/supabase-go"
)

type DebateService struct {
	client *supabase.Client
}

func NewDebateService(client *supabase.Client) *DebateService {
	return &DebateService{client: client}
}

func (s *DebateService) CreateDebate(debate *models.Debate) (string, error) {
	var results []models.Debate
	err := s.client.DB.From("Debate").Insert(map[string]interface{}{"topic": debate.Topic, "visibility": debate.Visibility, "creator_id": debate.CreatedBy, "status": debate.Status, "format_id": debate.FormatId}).Execute(&results)

	if err != nil {
		return "", fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return "", fmt.Errorf("no data returned after insert")
	}
	log.Printf("Inserted debate: %+v", results[0])
	return results[0].Id, nil
}

func (s *DebateService) CreateFormat(formatName string) (string, error) {
	// ctx := context.Background()

	var results []models.Format
	err := s.client.DB.From("Debate Format").
		Insert(map[string]interface{}{"name": formatName}).Execute(&results)

	if err != nil {
		return "", fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return "", fmt.Errorf("no data returned after insert")
	}

	log.Printf("Inserted format: %+v", results[0])
	return results[0].Id, nil
}

func (s *DebateService) CreateParticipant(participant *models.Participant) error {
	var results []models.Participant

	err := s.client.DB.From("Debate Participant").
		Insert(participant).Execute(&results)

	if err != nil {
		return fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return fmt.Errorf("no data returned after insert")
	}

	log.Printf("Inserted format: %+v", results[0])
	return nil
}
