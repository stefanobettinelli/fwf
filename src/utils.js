export function getGameRoute(routeBase, gameId, questionId) {
  console.log(`${routeBase}/${gameId}/question/${questionId}`);
  return `${routeBase}/${gameId}/question/${questionId}`;
}
