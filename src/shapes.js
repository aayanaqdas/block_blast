export const SHAPES = {
  DOT: [[1]],

  SQUARE_2: [
    [1, 1],
    [1, 1],
  ],
  SQUARE_3: [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],

  LINE_2: [[1, 1]],
  LINE_3: [[1, 1, 1]],
  LINE_4: [[1, 1, 1, 1]],
  LINE_5: [[1, 1, 1, 1, 1]],

  LINE_2_V: [[1], [1]],
  LINE_3_V: [[1], [1], [1]],
  LINE_4_V: [[1], [1], [1], [1]],
  LINE_5_V: [[1], [1], [1], [1], [1]],

  DIAG_3: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  DIAG_3_FLIP: [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],

  L_SMALL: [
    [1, 0],
    [1, 1],
  ],
  L_SMALL_90: [
    [1, 1],
    [1, 0],
  ],
  L_SMALL_180: [
    [1, 1],
    [0, 1],
  ],
  L_SMALL_270: [
    [0, 1],
    [1, 1],
  ],

  L_STANDARD: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  L_STANDARD_90: [
    [1, 1, 1],
    [1, 0, 0],
  ],
  L_STANDARD_180: [
    [1, 1],
    [0, 1],
    [0, 1],
  ],
  L_STANDARD_270: [
    [0, 0, 1],
    [1, 1, 1],
  ],

  L_BIG: [
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1],
  ],
  L_BIG_90: [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  L_BIG_180: [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  L_BIG_270: [
    [0, 0, 1],
    [0, 0, 1],
    [1, 1, 1],
  ],

  T_SHAPE: [
    [1, 1, 1],
    [0, 1, 0],
  ],
  T_SHAPE_90: [
    [1, 0],
    [1, 1],
    [1, 0],
  ],
  T_SHAPE_180: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  T_SHAPE_270: [
    [0, 1],
    [1, 1],
    [0, 1],
  ],

  CORNER_2: [
    [1, 1],
    [1, 0],
  ],
  CORNER_2_90: [
    [1, 1],
    [0, 1],
  ],
  CORNER_2_180: [
    [0, 1],
    [1, 1],
  ],
  CORNER_2_270: [
    [1, 0],
    [1, 1],
  ],

  Z_SHAPE: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  Z_SHAPE_90: [
    [0, 1],
    [1, 1],
    [1, 0],
  ],

  S_SHAPE: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  S_SHAPE_90: [
    [1, 0],
    [1, 1],
    [0, 1],
  ],

  RECT: [
    [1, 1, 1],
    [1, 1, 1],
  ],
  RECT_V: [
    [1, 1],
    [1, 1],
    [1, 1],
  ],
};

export const CHUNKS = [
  "SQUARE_2",
  "SQUARE_3",
  "RECT",
  "RECT_V",
  "L_STANDARD",
  "L_STANDARD_90",
  "L_STANDARD_180",
  "L_STANDARD_270",
];

export const SPANNERS = [
  "LINE_3",
  "LINE_4",
  "LINE_5",
  "LINE_3_V",
  "LINE_4_V",
  "LINE_5_V",
];

export const FILLERS = [
  "L_BIG",
  "L_BIG_90",
  "L_BIG_180",
  "L_BIG_270",
  "T_SHAPE",
  "T_SHAPE_90",
  "T_SHAPE_180",
  "T_SHAPE_270",
  "Z_SHAPE",
  "Z_SHAPE_90",
  "S_SHAPE",
  "S_SHAPE_90",
];

export const HELPERS = [
  "DOT",
  "LINE_2",
  "LINE_2_V",
  "L_SMALL",
  "L_SMALL_90",
  "L_SMALL_180",
  "L_SMALL_270",
  "CORNER_2",
  "CORNER_2_90",
  "CORNER_2_180",
  "CORNER_2_270",
];
