package supabase

import (
	"github.com/Naman-B-Parlecha/sample-debate-ai/internal/config"
	"github.com/nedpals/supabase-go"
)

func NewSupabaseClient(cfg *config.Config) *supabase.Client {
	return supabase.CreateClient(cfg.SupabaseURL, cfg.SupabaseKey)
}
