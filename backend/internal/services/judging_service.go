package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/go-resty/resty/v2"
	"github.com/nedpals/supabase-go"
)

type JudgeService struct {
	client          *supabase.Client
	OPEN_ROUTER_API string
	HF_APIkey       string
}
type Judgement struct {
	Argument string `json:"argument"`
	Scores   struct {
		Clarity   int `json:"clarity"`
		Relevance int `json:"relevance"`
		Strength  int `json:"strength"`
	} `json:"scores"`
	Feedback string `json:"feedback"`
}

type JudgementResponse struct {
	Content string `json:"content"`
}

func NewJudgingService(client *supabase.Client, OPEN_ROUTER string, HF_API_KEY string) *JudgeService {
	return &JudgeService{client: client, OPEN_ROUTER_API: OPEN_ROUTER, HF_APIkey: HF_API_KEY}
}

func (s *JudgeService) GenerateScores(debateHistory []map[string]string, topic string) (map[string]float64, error) {

	messages := []Message{
		{
			Role: "system",
			Content: fmt.Sprintf(`You are a strict debate judge analyzing ONLY the last user argument. Respond EXCLUSIVELY in this JSON format:

			{
			  "argument": "[user's exact argument text]",
			  "scores": {
			    "clarity": [1-5],
			    "relevance": [1-5], 
			    "strength": [1-5]
			  },
			  "feedback": "[specific improvement suggestion]"
			}

			### Scoring Criteria (1-5):
			1. CLARITY: Is the argument unambiguous? (1=confusing, 5=crystal clear)
			2. RELEVANCE: Does it address the topic? (1=tangential, 5=directly on-point)
			3. STRENGTH: Is it well-supported? (1=unsubstantiated, 5=evidence-backed)

			### Rules:
			- NEVER include analysis text outside the JSON
			- NEVER evaluate assistant/ai arguments
			- ALWAYS provide all three scores
			- Feedback must be actionable

			Example Input: "We should prioritize ocean exploration"
			Example Output:
			{
			  "argument": "We should prioritize ocean exploration",
			  "scores": {
			    "clarity": 4,
			    "relevance": 5,
			    "strength": 3
			  },
			  "feedback": "Include specific examples of unexplored ocean resources to strengthen your case."
			}

			Now evaluate this argument: "%s"`, topic),
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
		Model:       "accounts/fireworks/models/mixtral-8x7b-instruct",
		Temperature: 0.2,
	}

	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		return map[string]float64{}, fmt.Errorf("failed to marshal payload: %w", err)
	}

	client := resty.New()
	resp, err := client.R().
		SetHeader("Authorization", "Bearer "+s.HF_APIkey).
		SetHeader("Content-Type", "application/json").
		SetBody(jsonPayload).
		Post("https://router.huggingface.co/fireworks-ai/inference/v1/chat/completions")

	if err != nil {
		return map[string]float64{}, fmt.Errorf("API request failed: %w", err)
	}

	if resp.StatusCode() != http.StatusOK {
		return map[string]float64{}, fmt.Errorf("API returned status %d: %s", resp.StatusCode(), resp.Body())
	}

	fmt.Println(resp)
	var result DebateResponse
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	if len(result.Choices) == 0 {
		return nil, errors.New("no response generated")
	}

	// Extract the JSON judgement from the response content
	content := result.Choices[0].Message.Content

	var judgement Judgement
	if err := json.Unmarshal([]byte(content), &judgement); err != nil {
		// If direct parsing fails, try to extract the JSON part
		start := strings.Index(content, "{")
		end := strings.LastIndex(content, "}") + 1
		if start == -1 || end == 0 {
			return nil, fmt.Errorf("no valid JSON judgement found in response")
		}

		if err := json.Unmarshal([]byte(content[start:end]), &judgement); err != nil {
			return nil, fmt.Errorf("failed to parse judgement: %w", err)
		}
	}

	// Convert scores to float64 map
	scores := map[string]float64{
		"clarity":   float64(judgement.Scores.Clarity),
		"relevance": float64(judgement.Scores.Relevance),
		"strength":  float64(judgement.Scores.Strength),
	}

	return scores, nil
}
