package handler

import (
	"fmt"

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
		Topic           string `json:"topic"`
		Format          string `json:"format"`
		Visibility      string `json:"visibility"`
		ParticipantType string `json:"participant_type"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(400, gin.H{"message": "Invalid request format", "error": err.Error()})
		return
	}

	formatID, err := h.debateService.CreateFormat(requestBody.Format)
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
		FormatId:   formatID,
	}
	debate_id, err := h.debateService.CreateDebate(debate)
	if err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create debate", "error": err.Error()})
		return
	}

	fmt.Println("Debate ID:", debate_id)
	// // // make user participant
	participant := &models.Participant{
		DebateId:   debate_id,
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
		DebateId:   debate_id,
		Type:       "ai",
		UserId:     "",
		AI_Model:   "falcon-7b",
		Difficulty: models.DifficultyLevel("medium"),
	}
	if err := h.debateService.CreateParticipant(ai_participant); err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to create participant", "error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Successfully created new debate"})
}
