import { isSamePlayer, Player, stringToPlayer } from './types/player';
import { advantage, deuce, fifteen, forty, FortyData, game, Point, points, PointsData, Score, thirty } from './types/score';
import { pipe, Option } from 'effect'

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return stringToPlayer('PLAYER_TWO');
    case 'PLAYER_TWO':
      return stringToPlayer('PLAYER_ONE');
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string =>
  'You can use pattern matching with switch case pattern.';

export const scoreToString = (score: Score): string =>
  'You can use pattern matching with switch case pattern.';

export const scoreWhenDeuce = (winner: Player): Score => advantage(winner);

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if (isSamePlayer(advantagedPlayed, winner)) return game(winner);
  return deuce();
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    Option.match({
      onNone: () => deuce(),
      onSome: p => forty(currentForty.player, p) as Score
    })
  );
};


export const incrementPoint = (point: Point) : Option.Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return Option.some(fifteen());
    case 'FIFTEEN':
      return Option.some(thirty());
    case 'THIRTY':
      return Option.none();
    case 'FORTY':
      return Option.none();
  }
};



// Exercice 2
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const winnerPoint = current[winner];

  return pipe(
    incrementPoint(winnerPoint),
    Option.match({
      onNone: () =>
        forty(
          winner,
          current[winner === 'PLAYER_ONE' ? 'PLAYER_TWO' : 'PLAYER_ONE']
        ),

      onSome: (newPoint) =>
        points(
          winner === 'PLAYER_ONE' ? newPoint : current.PLAYER_ONE,
          winner === 'PLAYER_TWO' ? newPoint : current.PLAYER_TWO
        )
    })
  );
};

// Exercice 3
export const scoreWhenGame = (winner: Player): Score => {
  return game(winner);
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
  case 'POINTS':
    return scoreWhenPoint(currentScore.pointsData, winner);
  case 'FORTY':
    return scoreWhenForty(currentScore.fortyData, winner);
  case 'DEUCE':
    return scoreWhenDeuce(winner);
  case 'ADVANTAGE':
    return scoreWhenAdvantage(currentScore.player, winner);
  case 'GAME':
    return scoreWhenGame(currentScore.player);
}
};

