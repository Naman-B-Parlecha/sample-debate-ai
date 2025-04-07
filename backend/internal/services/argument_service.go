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
	client          *supabase.Client
	HF_APIkey       string
	OPEN_ROUTER_API string
}

func NewArgumentService(client *supabase.Client, HF_APIKey string, OPEN_ROUTER_API string) *ArgumentService {
	return &ArgumentService{client: client, HF_APIkey: HF_APIKey, OPEN_ROUTER_API: OPEN_ROUTER_API}
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

type ModelConfig struct {
	APIURL string
	Model  string
	Token  int
}

var modelConfigs = map[string]ModelConfig{
	"Mistral-7b": {
		APIURL: "https://router.huggingface.co/novita/v3/openai/chat/completions",
		Model:  "mistralai/mistral-7b-instruct",
	},
	// "Falcon-7B": {
	// 	APIURL: "https://router.huggingface.co/hf-inference/models/tiiuae/falcon-7b-instruct/v1/chat/completions",
	// 	Model:  "tiiuae/falcon-7b-instruct",
	// },
	// "Mixtral 8x7B": {
	// 	APIURL: "https://router.huggingface.co/nebius/v1/chat/completions",
	// 	Model:  "mistralai/Mixtral-8x7B-Instruct-v0.1-fast",
	// },
	"Llama-3.1-405B": {
		APIURL: "https://router.huggingface.co/nebius/v1/chat/completions",
		Model:  "meta-llama/Meta-Llama-3.1-405B-Instruct",
	},
	"Llama-3.2": {
		APIURL: "https://openrouter.ai/api/v1/chat/completions",
		Model:  "meta-llama/llama-3.2-3b-instruct:free",
	},
	"Mistral Nemo": {
		APIURL: "https://openrouter.ai/api/v1/chat/completions",
		Model:  "mistralai/mistral-nemo:free",
	},
	"Mistral-Small-3.1": {
		APIURL: "https://openrouter.ai/api/v1/chat/completions",
		Model:  "mistralai/mistral-small-3.1-24b-instruct:free",
	},
	"Llama 3.3": {
		APIURL: "https://openrouter.ai/api/v1/chat/completions",
		Model:  "meta-llama/llama-3.3-70b-instruct:free",
	},
	"DeepSeek R1": {
		APIURL: "https://openrouter.ai/api/v1/chat/completions",
		Model:  "deepseek/deepseek-r1:free",
		Token:  10000,
	},
}

func (s *ArgumentService) GenerateArguments(modelName string, debateHistory []map[string]string, topic string) (string, error) {
	config, exists := modelConfigs[modelName]
	env := ""
	if config.APIURL == "https://openrouter.ai/api/v1/chat/completions" {
		env = s.OPEN_ROUTER_API
	} else {
		env = s.HF_APIkey
	}
	if !exists {
		return "", fmt.Errorf("unknown model: %s", modelName)
	}

	messages := []Message{
		{
			Role: "system",
			Content: fmt.Sprintf(`You are an AI debater. Your job is to construct counterarguments using logical reasoning, evidence, and real-world examples.

			### Debate Rules:
			1. **Do NOT just react to the last argument**—analyze the full debate history.
			2. Identify flaws, inconsistencies, or weak points in the opponent's stance.
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

	tokens := 500
	if config.Token != 0 {
		tokens = config.Token
	}
	payload := DebateRequest{
		Messages:    messages,
		MaxTokens:   tokens,
		Model:       config.Model,
		Temperature: 0.5,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("failed to marshal payload: %w", err)
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+env).
		SetHeader("Content-Type", "application/json").
		SetBody(jsonPayload).
		Post(config.APIURL)

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

// okay implement open router ka routes here
