package handler

import (
	"net/http"

	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/gin-gonic/gin"
)

type JudgeHandler struct {
	judgeService *services.JudgeService
}

func NewJudgeHandler(judgeService *services.JudgeService) *JudgeHandler {
	return &JudgeHandler{judgeService: judgeService}
}

func (h *JudgeHandler) GenerateScores(c *gin.Context) {
	var requestBody struct {
		Topic     string `json:"topic"`
		Arguments []struct {
			Sender   string `json:"user"`
			Argument string `json:"argument"`
		} `json:"arguments"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	args := make([]map[string]string, len(requestBody.Arguments))
	for i, arg := range requestBody.Arguments {
		args[i] = map[string]string{
			"user":     arg.Sender,
			"argument": arg.Argument,
		}
	}

	scores, err := h.judgeService.GenerateScores(args, requestBody.Topic)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate scores"})
		return
	}

	c.JSON(http.StatusOK, scores)
}
