package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-resty/resty/v2"
	"github.com/nedpals/supabase-go"
)

type ArgumentService struct {
	client    *supabase.Client
	HF_APIkey string
}

func NewArgumentService(client *supabase.Client, HF_APIKey string) *ArgumentService {
	return &ArgumentService{client: client, HF_APIkey: HF_APIKey}
}

type DebateRequest struct {
	Messages    []Message `json:"messages"`
	MaxTokens   int       `json:"max_tokens"`
	Model       string    `json:"model"`
	Temperature float64   `json:"temperature"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type DebateResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

func (s *ArgumentService) GenerateArguments(debateHistory []map[string]string, topic string) (string, error) {
	apiURL := "https://router.huggingface.co/novita/v3/openai/chat/completions"

	messages := []Message{
		{
			Role: "system",
			Content: fmt.Sprintf(`You are an AI debater. Your job is to construct counterarguments using logical reasoning, evidence, and real-world examples.

			### Debate Rules:
			1. **Do NOT just react to the last argument**—analyze the full debate history.
			2. Identify flaws, inconsistencies, or weak points in the opponent’s stance.
			3. Use structured counterpoints (max 3-4) while maintaining debate flow.
			4. **No filler phrases** like "maybe" or "perhaps"—respond with confidence.
			5. Responses should be **concise (under 300 characters).**

			### Example:
			**User:** "Banning fossil fuels will ruin the economy."
			**AI:** "Fossil fuels already cost billions in climate damage. Green energy creates more jobs than it destroys. Transitioning wisely ensures economic stability."`, topic),
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
		Model:       "mistralai/mistral-7b-instruct",
		Temperature: 0.5,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal payload: %w", err)
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+s.HF_APIkey).
		SetHeader("Content-Type", "application/json").
		SetBody(jsonPayload).
		Post(apiURL)

	if err != nil {
		return "", fmt.Errorf("API request failed: %w", err)
	}

	if resp.StatusCode() != http.StatusOK {
		return "", fmt.Errorf("API returned status %d: %s", resp.StatusCode(), resp.Body())
	}

	var result DebateResponse
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %w", err)
	}

	if len(result.Choices) == 0 {
		return "", errors.New("no response generated")
	}
	fmt.Println(resp)
	return result.Choices[0].Message.Content, nil
}
