package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-resty/resty/v2"
	"github.com/nedpals/supabase-go"
)

type JudgeService struct {
	client          *supabase.Client
	OPEN_ROUTER_API string
}

func NewJudgingService(client *supabase.Client, OPEN_ROUTER string) *JudgeService {
	return &JudgeService{client: client, OPEN_ROUTER_API: OPEN_ROUTER}
}

func (s *JudgeService) GenerateScores(debateHistory []map[string]string, topic string) (map[string]float64, error) {

	messages := []Message{
		{
			Role: "system",
			Content: fmt.Sprintf(`You are an impartial debate judge with expertise in logical reasoning, argument evaluation, and debate scoring.

	### **Task:**
	- Analyze the full debate history provided below.
	- Score the **human participant's overall performance** (ignore AI responses) based on three criteria:
	  1. **Clarity (1-10):** Are the human's arguments, as a whole, clear, coherent, and easy to follow?
	  2. **Relevance (1-10):** Do the human's arguments collectively address the debate topic "%s"?
	  3. **Strength (1-10):** Are the human's arguments, taken together, logically sound, supported by evidence, and effective against the opponent's points?

	### **Instructions:**
	- Provide a single set of scores for the human participant's overall contribution.
	- Return scores in a structured JSON-like format, e.g.:
	- Do not score individual arguments separately or generate additional commentary.

	### **Debate Context:**
	- Topic: "%s"
	- History follows below.`, topic, topic),
		},
	}
	for _, entry := range debateHistory {
		role := "user"
		if entry["user"] == "ai" {
			role = "assistant"
		}
		messages = append(messages, Message{
			Role:    role,
			Content: entry["argument"],
		})
	}

	messages = append(messages, Message{
		Role:    "user",
		Content: "Analyze the full debate and generate a well-structured counterargument.",
	})

	payload := DebateRequest{
		Messages:    messages,
		MaxTokens:   300,
		Model:       "deepseek/deepseek-r1:free",
		Temperature: 0.2,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return map[string]float64{}, fmt.Errorf("failed to marshal payload: %w", err)
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+s.OPEN_ROUTER_API).
		SetHeader("Content-Type", "application/json").
		SetBody(jsonPayload).
		Post("https://openrouter.ai/api/v1/chat/completions")

	if err != nil {
		return map[string]float64{}, fmt.Errorf("API request failed: %w", err)
	}

	if resp.StatusCode() != http.StatusOK {
		return map[string]float64{}, fmt.Errorf("API returned status %d: %s", resp.StatusCode(), resp.Body())
	}

	var result DebateResponse
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return map[string]float64{}, fmt.Errorf("failed to parse response: %w", err)
	}

	if len(result.Choices) == 0 {
		return map[string]float64{}, errors.New("no response generated")
	}

	fmt.Println(resp)
	return map[string]float64{}, nil
}
