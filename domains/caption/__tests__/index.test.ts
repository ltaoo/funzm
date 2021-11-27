import { parseCaptionContent } from "../index";

describe("ass caption file", () => {
  it("1. ", () => {
    const captionContent = `[Script Info]
;SrtEdit 6.3.2012.1001
;Copyright(C) 2005-2012 Yuan Weiguo

Title: 
Original Script: 
Original Translation: 
Original Timing: 
Original Editing: 
Script Updated By: 
Update Details: 
ScriptType: v4.00+
Collisions: Reverse
PlayResX: 384
PlayResY: 288
Timer: 100.0000
Synch Point: 1
WrapStyle: 0
ScaledBorderAndShadow: no

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft YaHei,20,&H00FFFFFF,&HF0000000,&H006C3300,&H00000000,0,0,0,0,100,100,0,0,1,2,1,2,5,5,5,134

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:10.84,0:00:13.23,Default,NTP,0,0,0,,我从小喜欢火车\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}I've always loved trains.
Dialogue: 0,0:00:14.94,0:00:16.01,Default,NTP,0,0,0,,事实上\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}In fact,
Dialogue: 0,0:00:16.01,0:00:19.21,Default,NTP,0,0,0,,如果我理论物理学的工作没成\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}if my career in theoretical physics hadn't worked out,
Dialogue: 0,0:00:19.21,0:00:20.54,Default,NTP,0,0,0,,我的后备计划\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}my backup plan
Dialogue: 0,0:00:20.54,0:00:22.98,Default,NTP,0,0,0,,是打算当一个职业检票员\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}was to become a professional ticket taker.
Dialogue: 0,0:00:22.98,0:00:24.77,Default,NTP,0,0,0,,或者是流浪汉\N{\fs12}{\b0}{\c&HFFFFFF&}{\3c&H2F2F2F&}{\4c&H000000&}Or hobo.`;

    const result = parseCaptionContent(captionContent, "ass");

    expect(result).toBe([
      {
        line: 1,
        text1: "我从小喜欢火车",
        text2: "I've always loved trains.",
        start: "0:00:10.84",
        end: "0:00:13.23",
      },
      {
        line: 2,
        text1: "事实上",
        text2: "In fact,",
        start: "0:00:14.94",
        end: "0:00:16.01",
      },
      {
        line: 3,
        text1: "如果我理论物理学的工作没成",
        text2: "if my career in theoretical physics had't worked out,",
        start: "0:00:16.01",
        end: "0:00:19.21",
      },
      {
        line: 4,
        text1: "我的后备计划",
        text2: "my backup plan",
        start: "0:00:19.21",
        end: "0:00:20.54",
      },
      {
        line: 5,
        text1: "是打算当一个职业检票员",
        text2: "Or hobo.",
        start: "0:00:22.54",
        end: "0:00:22.98",
      },
      {
        line: 6,
        text1: "或者是流浪汉",
        text2: "was to become a professional ticket taker.",
        start: "0:00:22.98",
        end: "0:00:24.77",
      },
    ]);
  });
});
