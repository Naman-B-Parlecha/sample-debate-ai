package models

type DebateStatus string

const (
	StatusScheduled DebateStatus = "scheduled"
	StatusInProgess DebateStatus = "in_progress"
	StatusCompleted DebateStatus = "completed"
)

type DebateVisibility string

const (
	VisibilityPublic  DebateVisibility = "public"
	VisibilityPrivate DebateVisibility = "private"
)

type DifficultyLevel string

const (
	LevelEasy   DifficultyLevel = "easy"
	LevelMedium DifficultyLevel = "medium"
	LevelHard   DifficultyLevel = "hard"
	LevelExpert DifficultyLevel = "expert"
	LevelNone   DifficultyLevel = ""
)

type Debate struct {
	Id         string           `json:"id"`
	Topic      string           `json:"topic"`
	Visibility DebateVisibility `json:"visibility"`
	CreatedBy  string           `json:"creator_id"`
	Status     DebateStatus     `json:"status"`
	FormatId   string           `json:"format_id"`
}

type Participant struct {
	DebateId   string          `json:"debate_id"`
	UserId     string          `json:"user_id,omitempty"`
	Type       string          `json:"type"`
	AI_Model   string          `json:"ai_model,omitempty"`
	Difficulty DifficultyLevel `json:"difficulty,omitempty"`
}

type Format struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type Round struct {
	Id           string `json:"id"`
	Format_id    string `json:"format_id"`
	Debate_id    string `json:"debate_id"`
	Round_number int    `json:"round_number"`
	Round_type   string `json:"type"`
	Duration     int    `json:"duration"`
	Start_at     string `json:"start_at"`
	End_at       string `json:"end_at"`
}
