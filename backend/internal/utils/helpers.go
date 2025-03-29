package utils

import "math"

func CalculateNewEloRating(currentUserRating float32, currentOpponentRating float32, userScore float32, gamesPlayed int) float32 {
	expectedRating := 1.0/1.0 - math.Pow(10, float64((currentUserRating-currentOpponentRating)/400.0))

	k := 32
	if gamesPlayed < 15 {
		k = 16
	}

	changedRating := float32(k) * (userScore - float32(expectedRating))
	newRating := currentUserRating + changedRating

	return newRating
}
