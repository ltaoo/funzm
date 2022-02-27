import { describe, it, expect } from "vitest";

import {
  optimizeParagraphs,
  splitTextHasNotes,
  splitText2Words,
} from "../utils";

// describe("optimizeParagraphs", () => {
//   it("end with ,", () => {
//     const paragraphs = [];
//   });
// });

// describe("split text to words", () => {
//   it("no character", () => {
//     const text = "Everybody excited to start school Monday";

//     const result = splitText2Words(text);

//     expect(result).toStrictEqual([
//       ["", "Everybody", ""],
//       ["", "excited", ""],
//       ["", "to", ""],
//       ["", "start", ""],
//       ["", "school", ""],
//       ["", "Monday", ""],
//     ]);
//   });

//   it("has a character at begin", () => {
//     const text = "♪ Onward, Christian soldiers ♪";

//     const result = splitText2Words(text);

//     expect(result).toEqual([
//       ["♪", "", ""],
//       ["", "Onward", ","],
//       ["", "Christian", ""],
//       ["", "soldiers", ""],
//       ["♪", "", ""],
//     ]);
//   });

//   it("has a character at end", () => {
//     const text = "Everybody excited to start school Monday?";

//     const result = splitText2Words(text);

//     expect(result).toEqual([
//       ["", "Everybody", ""],
//       ["", "excited", ""],
//       ["", "to", ""],
//       ["", "start", ""],
//       ["", "school", ""],
//       ["", "Monday", "?"],
//     ]);
//   });

//   it("has multiple characters at begin", () => {
//     const text = "- You're goin'.";

//     const result = splitText2Words(text);

//     expect(result).toEqual([
//       ["-", "", ""],
//       ["", "You're", ""],
//       ["", "goin", "'."],
//     ]);
//   });

//   it("has multiple characters at end", () => {
//     const text = "to prove Newton's first law--";

//     const result = splitText2Words(text);

//     expect(result).toEqual([
//       ["", "to", ""],
//       ["", "prove", ""],
//       ["", "Newton's", ""],
//       ["", "first", ""],
//       ["", "law", "--"],
//     ]);
//   });
// });

describe("split text that has notes", () => {
  // it("has one note", () => {
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 43,
  //       end: 53,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if my career in theoretical physics hadn't ",
  //       range: [0, 43],
  //     },
  //     {
  //       type: "note",
  //       text: "worked out",
  //       range: [43, 53],
  //       note: {
  //         start: 43,
  //         end: 53,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: ",",
  //       range: [53, 54],
  //     },
  //   ]);
  // });

  // it("has multiple note but no mix", () => {
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 3,
  //       end: 12,
  //     },
  //     {
  //       start: 43,
  //       end: 53,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if ",
  //       range: [0, 3],
  //     },
  //     {
  //       type: "note",
  //       text: "my career",
  //       range: [3, 12],
  //       note: {
  //         start: 3,
  //         end: 12,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: " in theoretical physics hadn't ",
  //       range: [12, 43],
  //     },
  //     {
  //       type: "note",
  //       text: "worked out",
  //       range: [43, 53],
  //       note: {
  //         start: 43,
  //         end: 53,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: ",",
  //       range: [53, 54],
  //     },
  //   ]);
  // });

  // it("a note inside other note", () => {
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 3,
  //       end: 53,
  //     },
  //     {
  //       start: 43,
  //       end: 49,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if ",
  //       range: [0, 3],
  //     },
  //     {
  //       type: "note",
  //       text: "my career in theoretical physics hadn't ",
  //       range: [3, 43],
  //       note: {
  //         start: 3,
  //         end: 53,
  //       },
  //       children: [
  //         {
  //           type: "note",
  //           text: "worked",
  //           range: [43, 49],
  //           note: {
  //             start: 43,
  //             end: 49,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "note",
  //       text: " out",
  //       range: [49, 53],
  //       note: {
  //         start: 3,
  //         end: 53,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: ",",
  //       range: [53, 54],
  //     },
  //   ]);
  // });

  // it("a note inside other note and has same start", () => {
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 3,
  //       end: 53,
  //     },
  //     {
  //       start: 3,
  //       end: 5,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if ",
  //       range: [0, 3],
  //     },
  //     {
  //       type: "note",
  //       text: "",
  //       range: [3, 3],
  //       note: {
  //         start: 3,
  //         end: 53,
  //       },
  //       children: [
  //         {
  //           type: "note",
  //           text: "my",
  //           range: [3, 5],
  //           note: {
  //             start: 3,
  //             end: 5,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "note",
  //       text: " career in theoretical physics hadn't worked out",
  //       range: [5, 53],
  //       note: {
  //         start: 3,
  //         end: 53,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: ",",
  //       range: [53, 54],
  //     },
  //   ]);
  // });

  // it("has multiple note and has mix", () => {
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 3,
  //       end: 12,
  //     },
  //     {
  //       start: 6,
  //       end: 27,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if ",
  //       range: [0, 3],
  //     },
  //     {
  //       type: "note",
  //       text: "my ",
  //       range: [3, 12],
  //       note: {
  //         start: 3,
  //         end: 12,
  //       },
  //       children: [
  //         {
  //           type: "note",
  //           text: "career",
  //           range: [6, 12],
  //           note: {
  //             start: 6,
  //             end: 27,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "note",
  //       text: " in theoretical",
  //       range: [12, 27],
  //       note: {
  //         start: 6,
  //         end: 27,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: " physics hadn't worked out,",
  //       range: [27, 54],
  //     },
  //   ]);
  // });

  // it("mix notes mode 1", () => {
  //   // if [my [career] in [theoretical] physics] hadn't worked out,
  //   const text = "if my career in theoretical physics hadn't worked out,";
  //   const notes = [
  //     {
  //       start: 3,
  //       end: 12,
  //     },
  //     {
  //       start: 6,
  //       end: 27,
  //     },
  //     {
  //       start: 16,
  //       end: 35,
  //     },
  //   ];

  //   const result = splitTextHasNotes(text, notes);

  //   expect(result).toEqual([
  //     {
  //       type: "text",
  //       text: "if ",
  //       range: [0, 3],
  //     },
  //     {
  //       type: "note",
  //       text: "my ",
  //       range: [3, 12],
  //       note: {
  //         start: 3,
  //         end: 12,
  //       },
  //       children: [
  //         {
  //           type: "note",
  //           text: "career",
  //           range: [6, 12],
  //           note: {
  //             start: 6,
  //             end: 27,
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       type: "note",
  //       text: " in theoretical",
  //       range: [12, 27],
  //       note: {
  //         start: 6,
  //         end: 27,
  //       },
  //     },
  //     {
  //       type: "text",
  //       text: " physics hadn't worked out,",
  //       range: [27, 54],
  //     },
  //   ]);
  // });

  it("has one note", () => {
    const text = "I've found several ways [that I can be of help to you].";
    const notes = [
      {
        start: 11,
        end: 24,
      },
      {
        start: 27,
        end: 32,
      },
    ];

    const result = splitTextHasNotes(text, notes);

    expect(result).toEqual([
      {
        type: "text",
        text: "I've found ",
        range: [0, 11],
      },
      {
        type: "note",
        text: "several ways",
        range: [12, 24],
        note: {
          start: 11,
          end: 24,
        },
      },
      {
        type: "text",
        text: " [",
        range: [25, 27],
      },
      {
        type: "note",
        text: "that",
        range: [28, 32],
        note: {
          start: 27,
          end: 32,
        },
      },
      {
        type: "text",
        text: " I can be of help to you].",
        range: [33, 100],
      },
    ]);
  });
});
