package handler

import (
	"fmt"
	"time"

	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/Naman-B-Parlecha/sample-debate-ai/models"
	"github.com/gin-gonic/gin"
)

type DebateHandler struct {
	debateService *services.DebateService
}

func NewDebateHandler(debateService *services.DebateService) *DebateHandler {
	return &DebateHandler{debateService: debateService}
}

func (h *DebateHandler) CreateDebate(ctx *gin.Context) {
	var requestBody struct {
		Topic           string   `json:"topic"`
		Visibility      string   `json:"visibility"`
		FormatType      string   `json:"format_type"`
		FormatNames     []string `json:"format_names"`
		Duration        int      `json:"duration"`
		ParticipantType string   `json:"participant_type"`
		Difficulty      string   `json:"difficulty"`
		AiModel         string   `json:"ai_model"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(400, gin.H{"message": "Invalid request format", "error": err.Error()})
		return
	}

	format, err := h.debateService.CreateFormat(requestBody.FormatType)
	if err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create debate format", "error": err.Error()})
		return
	}

	// // Get user ID from auth token
	userID, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(401, gin.H{"message": "Unauthorized, user not found in token"})
		return
	}

	if requestBody.Visibility != "public" && requestBody.Visibility != "private" {
		ctx.JSON(400, gin.H{"message": "Invalid visibility type"})
		return
	}

	// // make debate
	debate := &models.Debate{
		Topic:      requestBody.Topic,
		CreatedBy:  fmt.Sprintf("%v", userID),
		Visibility: models.DebateVisibility(requestBody.Visibility),
		Status:     "scheduled",
		FormatId:   format["id"],
	}
	debate_details, err := h.debateService.CreateDebate(debate)
	if err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create debate", "error": err.Error()})
		return
	}

	fmt.Println("Debate ID:", debate.Id)
	// // // make user participant
	participant := &models.Participant{
		DebateId:   debate_details["Id"].(string),
		UserId:     fmt.Sprintf("%v", userID),
		Type:       "human",
		AI_Model:   "",
		Difficulty: "",
	}
	if err := h.debateService.CreateParticipant(participant); err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create participant", "error": err.Error()})
		return
	}

	fmt.Printf("Participant user created")
	// // // make ai participant
	ai_participant := &models.Participant{
		DebateId:   debate_details["Id"].(string),
		Type:       "ai",
		UserId:     "",
		AI_Model:   requestBody.AiModel,
		Difficulty: models.DifficultyLevel(requestBody.Difficulty),
	}
	if err := h.debateService.CreateParticipant(ai_participant); err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create participant", "error": err.Error()})
		return
	}

	fmt.Printf("AI participant created")

	// making rounds here
	round := &models.Round{
		Format_id:    format["id"],
		Debate_id:    debate_details["Id"].(string),
		Round_number: 1,
		Round_type:   requestBody.FormatNames[0],
		Duration:     requestBody.Duration,
		Start_at:     time.Now().Format("2006-01-02T15:04:05Z07:00"),
		End_at:       time.Now().Add(time.Duration(requestBody.Duration) * time.Minute).Format("2006-01-02T15:04:05Z07:00"),
	}

	round_details, err := h.debateService.CreateRound(round)
	if err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create round", "error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Successfully created new debate", "data": gin.H{
		"debate":         debate_details,
		"participant":    participant,
		"ai_participant": ai_participant,
		"round":          round_details,
		"format":         format,
	}})
}
