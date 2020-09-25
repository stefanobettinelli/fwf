export function getGameRoute(routeBase, gameId, questionId) {
  return `${routeBase}/${gameId}/question/${questionId}`;
}
