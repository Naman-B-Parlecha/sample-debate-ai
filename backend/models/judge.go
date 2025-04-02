package models

type Judge struct {
	JudgeType     string
	RoundId       string
	ParticipantId string
	RountType     string
	Arguments     []string
	Topic         string
	Score         float64
}

type JudgeService interface {
	ValidateArguments(topic string, argument string, roundType string) (bool, error)
	GenerateScore(map[string]float64) (float64, error)
	EvaluateArguments(topic string, arguments []string) (map[string]float64, error)
	StoreScore(roundId string, participantId string, score float64) error
}

func NewJudge(judgeType string, roundId string, participantId string, roundType string, topic string) JudgeService {
	return &Judge{
		JudgeType:     judgeType,
		RoundId:       roundId,
		ParticipantId: participantId,
		RountType:     roundType,
		Topic:         topic,
		Arguments:     []string{},
		Score:         0,
	}
}

func (j *Judge) ValidateArguments(topic string, argument string, roundType string) (bool, error) {
	// TODO: Implement validation logic
	return true, nil
}

func (j *Judge) GenerateScore(scores map[string]float64) (float64, error) {
	// TODO: Implement score generation logic
	return 0.0, nil
}

func (j *Judge) EvaluateArguments(topic string, arguments []string) (map[string]float64, error) {
	// TODO: Implement arguments evaluation logic
	return map[string]float64{}, nil
}

func (j *Judge) StoreScore(roundId string, participantId string, score float64) error {
	// TODO: Implement score storage logic
	return nil
}
