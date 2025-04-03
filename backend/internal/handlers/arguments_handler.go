package handler

import (
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/services"
	"github.com/gin-gonic/gin"
)

type ArgumentsHandler struct {
	argumentService *services.ArgumentService
}

func NewArgumentsHandler(argumentService *services.ArgumentService) *ArgumentsHandler {
	return &ArgumentsHandler{argumentService: argumentService}
}

type ArgumentType struct {
	Sender   string `json:"user"`
	Argument string `json:"argument"`
}

func (h *ArgumentsHandler) GetArguments(ctx *gin.Context) {
	var requestBody struct {
		Topic     string `json:"topic"`
		AiModel   string `json:"ai_model"`
		Arguments []struct {
			Sender   string `json:"user"`
			Argument string `json:"argument"`
		} `json:"arguments"`
	}

	if err := ctx.ShouldBindJSON(&requestBody); err != nil {
		ctx.JSON(400, gin.H{"message": "Invalid request format", "error": err.Error()})
		return
	}

	args := make([]map[string]string, len(requestBody.Arguments))
	for i, arg := range requestBody.Arguments {
		args[i] = map[string]string{
			"user":     arg.Sender,
			"argument": arg.Argument,
		}
	}

	counterArgument, err := h.argumentService.GenerateArguments(requestBody.AiModel, args, requestBody.Topic)
	if err != nil {
		ctx.JSON(500, gin.H{"message": "Failed to generate arguments", "error": err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Success", "data": gin.H{
		"ai_model":  requestBody.AiModel,
		"arguments": counterArgument,
	}})
}
