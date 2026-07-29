export type CapturedCounts = {
  p: number;
  n: number;
  b: number;
  r: number;
  q: number;
};

export function getCapturedPieces(fen: string): {
  whiteCaptured: CapturedCounts;
  blackCaptured: CapturedCounts;
} {
  const pieces = fen.split(" ")[0];
  const counts: Record<string, number> = {
    p: 0,
    n: 0,
    b: 0,
    r: 0,
    q: 0,
    P: 0,
    N: 0,
    B: 0,
    R: 0,
    Q: 0,
  };

  for (let i = 0; i < pieces.length; i++) {
    const char = pieces[i];
    if (counts[char] !== undefined) {
      counts[char]++;
    }
  }

  return {
    whiteCaptured: {
      p: 8 - counts.p,
      n: 2 - counts.n,
      b: 2 - counts.b,
      r: 2 - counts.r,
      q: 1 - counts.q,
    },
    blackCaptured: {
      p: 8 - counts.P,
      n: 2 - counts.N,
      b: 2 - counts.B,
      r: 2 - counts.R,
      q: 1 - counts.Q,
    },
  };
}

export interface PieceDef {
  type: string;
  color: string;
}

export interface TrackedPiece extends PieceDef {
  id: string;
  square: string;
}

export function parseFen(fen: string): (PieceDef | null)[][] {
  const board: (PieceDef | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  const parts = fen.split(" ");
  const boardPart = parts[0];
  const rows = boardPart.split("/");

  for (let r = 0; r < 8; r++) {
    let c = 0;
    const rowStr = rows[r];
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (/\d/.test(char)) {
        c += parseInt(char, 10);
      } else {
        const color = char === char.toUpperCase() ? "w" : "b";
        const type = char.toLowerCase();
        board[r][c] = { type, color };
        c++;
      }
    }
  }

  return board;
}

const START_FEN_PREFIX = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
let nextPieceId = 0;

export function calculateNewPieces(
  oldPieces: TrackedPiece[],
  newFen: string,
  lastMove?: { from: string; to: string } | null,
): TrackedPiece[] {
  const board = parseFen(newFen);
  const newSquares: { type: string; color: string; square: string }[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c]) {
        newSquares.push({
          type: board[r][c]!.type,
          color: board[r][c]!.color,
          square: String.fromCharCode(97 + c) + (8 - r).toString(),
        });
      }
    }
  }

  if (oldPieces.length === 0 || newFen.split(" ")[0] === START_FEN_PREFIX) {
    return newSquares.map((s) => ({ ...s, id: `p_${nextPieceId++}` }));
  }

  const result: TrackedPiece[] = [];
  const unmatchedOld = [...oldPieces];
  const unmatchedNew = [...newSquares];

  // 1. Exact matches (same square, type, color)
  for (let i = unmatchedNew.length - 1; i >= 0; i--) {
    const nw = unmatchedNew[i];
    const oldIdx = unmatchedOld.findIndex(
      (o) =>
        o.square === nw.square && o.type === nw.type && o.color === nw.color,
    );
    if (oldIdx !== -1) {
      result.push({ ...nw, id: unmatchedOld[oldIdx].id });
      unmatchedOld.splice(oldIdx, 1);
      unmatchedNew.splice(i, 1);
    }
  }

  // 2. lastMove match (normal move, capture, promotion)
  if (lastMove) {
    const oldMoveIdx = unmatchedOld.findIndex(
      (o) => o.square === lastMove.from,
    );
    const newMoveIdx = unmatchedNew.findIndex((n) => n.square === lastMove.to);
    if (oldMoveIdx !== -1 && newMoveIdx !== -1) {
      result.push({
        ...unmatchedNew[newMoveIdx],
        id: unmatchedOld[oldMoveIdx].id,
      });
      unmatchedOld.splice(oldMoveIdx, 1);
      unmatchedNew.splice(newMoveIdx, 1);
    }
  }

  // 3. Same type & color match (e.g. castling rook)
  for (let i = unmatchedNew.length - 1; i >= 0; i--) {
    const nw = unmatchedNew[i];
    const oldIdx = unmatchedOld.findIndex(
      (o) => o.type === nw.type && o.color === nw.color,
    );
    if (oldIdx !== -1) {
      result.push({ ...nw, id: unmatchedOld[oldIdx].id });
      unmatchedOld.splice(oldIdx, 1);
      unmatchedNew.splice(i, 1);
    }
  }

  // 4. Any remaining new pieces get new IDs
  for (const nw of unmatchedNew) {
    result.push({ ...nw, id: `p_${nextPieceId++}` });
  }

  return result;
}
