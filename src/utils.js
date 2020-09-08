import { ROUTES } from "./constants";

export function getGameRoute(gameId, questionId) {
  return `${ROUTES.GAMES}/${gameId}/question/${questionId}`;
}
