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

func (s *DebateService) CreateDebate(debate *models.Debate) (map[string]interface{}, error) {
	var results []models.Debate
	err := s.client.DB.From("Debate").Insert(map[string]interface{}{"topic": debate.Topic, "visibility": debate.Visibility, "creator_id": debate.CreatedBy, "status": debate.Status, "format_id": debate.FormatId}).Execute(&results)

	if err != nil {
		return nil, fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("no data returned after insert")
	}
	log.Printf("Inserted debate: %+v", results[0])
	return map[string]interface{}{"Id": results[0].Id, "Topic": results[0].Topic, "Visibility": results[0].Visibility, "CreatedBy": results[0].CreatedBy, "Status": results[0].Status, "FormatId": results[0].FormatId}, nil
}

func (s *DebateService) CreateFormat(formatName string) (map[string]string, error) {
	// ctx := context.Background()

	var results []models.Format
	err := s.client.DB.From("Debate Format").
		Insert(map[string]interface{}{"name": formatName}).Execute(&results)

	if err != nil {
		return nil, fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("no data returned after insert")
	}

	log.Printf("Inserted format: %+v", results[0])
	return map[string]string{"id": results[0].Id, "name": results[0].Name}, nil
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

func (s *DebateService) CreateRound(roundDetails *models.Round) (map[string]interface{}, error) {
	var results []models.Round
	err := s.client.DB.From("Debate Round").
		Insert(roundDetails).Execute(&results)

	if err != nil {
		return nil, fmt.Errorf("Supabase error: %v", err)
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("no data returned after insert")
	}

	log.Printf("Inserted round: %+v", results[0])
	return map[string]interface{}{"format_id": results[0].Format_id, "debate_id": results[0].Debate_id, "round_number": results[0].Round_number, "type": results[0].Round_type, "duration": results[0].Duration, "start_at": results[0].Start_at, "end_at": results[0].End_at}, nil
}
