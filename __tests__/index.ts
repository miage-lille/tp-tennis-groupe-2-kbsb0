import { advantage, deuce, fifteen, forty, game, love, Point, PointsData, thirty } from './../types/score';
import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, scoreWhenAdvantage, scoreWhenDeuce, scoreWhenForty, scoreWhenPoint } from '..';
import { Player, stringToPlayer } from '../types/player';



describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((w) => {
    const score = scoreWhenDeuce(stringToPlayer(w));
    const scoreExpected = advantage(stringToPlayer(w));
    expect(score).toStrictEqual(scoreExpected);
  })
});



  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
      const advantagedPlayer = stringToPlayer(advantaged);
      const winner = advantagedPlayer;
      const score = scoreWhenAdvantage(advantagedPlayer, winner);
      const scoreExpected = game(winner);
      expect(score).toStrictEqual(scoreExpected);
    })
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((advantaged) => {
    const advantagedPlayer = stringToPlayer(advantaged);
    const winner = otherPlayer(advantagedPlayer);
    const score = scoreWhenAdvantage(advantagedPlayer, winner);
    const scoreExpected = deuce();
    expect(score).toStrictEqual(scoreExpected);
  })
});


  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: stringToPlayer(winner),
      otherPoint: stringToPoint('THIRTY'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = game(stringToPlayer(winner));
    expect(score).toStrictEqual(scoreExpected);
  })
});


  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: otherPlayer(stringToPlayer(winner)),
      otherPoint: stringToPoint('THIRTY'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = deuce();
    expect(score).toStrictEqual(scoreExpected);
  })
});


  test('Given player at 40 and other at 15 when other wins, score is 40 - 30', () => {
  ['PLAYER_ONE', 'PLAYER_TWO'].forEach((winner) => {
    const fortyData = {
      player: otherPlayer(stringToPlayer(winner)),
      otherPoint: stringToPoint('FIFTEEN'),
    };
    const score = scoreWhenForty(fortyData, stringToPlayer(winner));
    const scoreExpected = forty(fortyData.player, thirty());
    expect(score).toStrictEqual(scoreExpected);
  })
});


  // -------------------------TESTS POINTS-------------------------- //
   test('Given players at 0 or 15 points score kind is still POINTS', () => {
    const cases: PointsData[] = [
      { PLAYER_ONE: love(), PLAYER_TWO: love() },
      { PLAYER_ONE: fifteen(), PLAYER_TWO: love() },
      { PLAYER_ONE: love(), PLAYER_TWO: fifteen() },
  ];

      cases.forEach((current) => {
        const score = scoreWhenPoint(current, 'PLAYER_ONE');
        expect(score.kind).toBe('POINTS');
      });
   });

   test('Given one player at 30 and win, score kind is forty', () => {
    const current: PointsData = {
      PLAYER_ONE: thirty(),
      PLAYER_TWO: fifteen()
    };
    const score = scoreWhenPoint(current, 'PLAYER_ONE');
    const expected = forty('PLAYER_ONE', fifteen());
    expect(score).toStrictEqual(expected);
   });
});


function stringToPoint(pts: string): Point {
  switch (pts) {
    case 'LOVE':
      return love();
    case 'FIFTEEN':
      return fifteen();
    case 'THIRTY':
      return thirty();
    case 'FORTY':
      throw new Error(
        "Cannot create FORTY with stringToPoint. Use forty(player, otherPoint) instead."
      );
    default:
      throw new Error(`Invalid point value: ${pts}`);
  }
}

