import Exam, { ExamStatus } from "../index";

function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}
// beforeEach(() => {

// });
// beforeAll(() => {

// });

describe("Exam class", () => {
  it("init paragraphs", () => {
    const instance = new Exam({
      title: "测试",
      paragraphs: [
        {
          id: "1",
          text1: "我一直喜欢火车",
          text2: "I've always loved trains.",
        },
        {
          id: "2",
          text1: "事实上",
          text2: "In fact,",
        },
        {
          id: "3",
          text1: "如果我在理论物理上的事业没有成果",
          text2: "if my career in theoretical physics hadn't worked out.",
        },
        {
          id: "4",
          text1: "我的后备计划是",
          text2: "my backup plan",
        },
        {
          id: "5",
          text1: "成为一个职业检票员",
          text2: "was to become a professional ticket taker.",
        },
      ],
      onChange: () => {
        if (instance.remainingParagraphsCount === 1) {
          instance.appendParagraphs([
            {
              id: "6",
              text1: "或者流浪汉",
              text2: "Or hobo.",
            },
            {
              id: "7",
              text1: "而当我发现火车能让我",
              text2: "And when I figured out that trains allowed me",
            },
            {
              id: "8",
              text1: "证明牛顿第一定律...",
              text2: "to prove Newton's first law--",
            },
          ]);
        }
      },
    });
    expect(instance.toJSON().status === ExamStatus.Prepare).toBe(true);

    instance.start();
    let data = instance.toJSON();
    expect(data.status).toBe(ExamStatus.Started);
    expect(data.combo).toBe(0);
    expect(data.maxCombo).toBe(0);
    expect(data.curParagraphId).toBe("1");
    expect(data.curParagraph).toEqual({
      id: "1",
      text1: "我一直喜欢火车",
      text2: "I've always loved trains.",
    });

    // skip
    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("2");
    expect(data.skippedParagraphs).toEqual([
      {
        id: "1",
        text1: "我一直喜欢火车",
        text2: "I've always loved trains.",
      },
    ]);

    // input word
    instance.write({
      uid: 5,
      word: "In",
    });
    data = instance.toJSON();
    expect(data.inputtingWords).toEqual([
      {
        uid: 5,
        word: "In",
      },
    ]);

    // compare
    instance.write({ uid: 6, word: "fact" });
    data = instance.toJSON();
    expect(data.inputtingWords).toEqual([]);
    expect(data.correctParagraphs).toEqual([
      {
        id: "2",
        text1: "事实上",
        text2: "In fact,",
      },
    ]);
    expect(data.incorrectParagraphs).toEqual([]);
    expect(data.combo).toBe(1);
    expect(data.maxCombo).toBe(1);
    expect(data.curParagraphId).toBe("3");

    instance.write({
      uid: 6,
      word: "if",
    });
    instance.write({
      uid: 7,
      word: "my",
    });
    instance.write({
      uid: 8,
      word: "career",
    });
    instance.write({
      uid: 9,
      word: "in",
    });
    instance.write({
      uid: 10,
      word: "theoretical",
    });
    instance.write({
      uid: 11,
      word: "physics",
    });
    instance.write({
      uid: 12,
      word: "hadn't",
    });
    instance.write({
      uid: 13,
      word: "worked",
    });
    instance.write({
      uid: 14,
      word: "out",
    });
    data = instance.toJSON();
    expect(data.inputtingWords).toEqual([]);
    expect(data.correctParagraphs).toEqual([
      {
        id: "2",
        text1: "事实上",
        text2: "In fact,",
      },
      {
        id: "3",
        text1: "如果我在理论物理上的事业没有成果",
        text2: "if my career in theoretical physics hadn't worked out.",
      },
    ]);
    expect(data.incorrectParagraphs).toEqual([]);
    expect(data.combo).toBe(2);
    expect(data.maxCombo).toBe(2);
    expect(data.curParagraphId).toBe("4");

    instance.write({
      uid: 15,
      word: "my",
    });
    instance.write({
      uid: 16,
      word: "plan",
    });
    instance.write({
      uid: 17,
      word: "backup",
    });
    data = instance.toJSON();
    expect(data.inputtingWords).toEqual([]);
    expect(data.correctParagraphs).toEqual([
      {
        id: "2",
        text1: "事实上",
        text2: "In fact,",
      },
      {
        id: "3",
        text1: "如果我在理论物理上的事业没有成果",
        text2: "if my career in theoretical physics hadn't worked out.",
      },
    ]);
    expect(data.incorrectParagraphs).toEqual([
      {
        id: "4",
        text1: "我的后备计划是",
        text2: "my backup plan",
        error: "my plan backup",
      },
    ]);
    expect(data.combo).toBe(0);
    expect(data.maxCombo).toBe(2);
    expect(data.curParagraphId).toBe("5");
    expect(data.remainingParagraphsCount).toBe(4);
    expect(data.paragraphs.length).toBe(4);

    instance.skip();
    data = instance.toJSON();
    expect(data.status).toBe(ExamStatus.Started);
    expect(data.curParagraphId).toBe("6");
    expect(data.remainingParagraphsCount).toBe(3);
  });

  it("slow network but success loaded data.", async () => {
    const arr = [
      [],
      [
        {
          id: "6",
          text1: "或者流浪汉",
          text2: "Or hobo.",
        },
        {
          id: "7",
          text1: "而当我发现火车能让我",
          text2: "And when I figured out that trains allowed me",
        },
        {
          id: "8",
          text1: "证明牛顿第一定律...",
          text2: "to prove Newton's first law--",
        },
      ],
    ];
    function fetchParagraphs() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(arr.pop());
        }, 1000);
      });
    }
    const loadingRef = {
      current: false,
    };
    const moreRef = {
      current: [],
    };
    const instance = new Exam({
      title: "测试",
      paragraphs: [
        {
          id: "1",
          text1: "我一直喜欢火车",
          text2: "I've always loved trains.",
        },
        {
          id: "2",
          text1: "事实上",
          text2: "In fact,",
        },
        {
          id: "3",
          text1: "如果我在理论物理上的事业没有成果",
          text2: "if my career in theoretical physics hadn't worked out.",
        },
        {
          id: "4",
          text1: "我的后备计划是",
          text2: "my backup plan",
        },
      ],
      onChange: async (nextExam) => {
        const { remainingParagraphsCount } = nextExam;
        if (remainingParagraphsCount === 3) {
          loadingRef.current = true;
          const moreParagraphs = await fetchParagraphs();
          loadingRef.current = false;
          if (instance.remainingParagraphsCount === 1) {
            instance.appendParagraphs(moreParagraphs);
            let data = instance.toJSON();
            console.log("count", data.remainingParagraphsCount);
            return;
          }
          moreRef.current = moreParagraphs as unknown[];
        }
        if (remainingParagraphsCount === 1) {
          if (loadingRef.current) {
            // show loading to prevent user operate
            return;
          }
          if (moreRef.current.length !== 0) {
            instance.appendParagraphs(moreRef.current);
            moreRef.current = [];
            return;
          }
        }
      },
    });
    instance.start();

    instance.skip();
    let data = instance.toJSON();
    expect(data.remainingParagraphsCount).toBe(3);

    instance.skip();
    data = instance.toJSON();
    expect(data.remainingParagraphsCount).toBe(2);

    instance.skip();
    data = instance.toJSON();
    expect(data.remainingParagraphsCount).toBe(1);

    await sleep(3000);
    data = instance.toJSON();
    expect(data.remainingParagraphsCount).toBe(4);
  });

  it("slow network and fail loaded data.", async () => {
    const arr = [
      [],
      [
        {
          id: "5",
          text1: "成为一个职业检票员",
          text2: "was to become a professional ticket taker.",
        },
        {
          id: "6",
          text1: "或者流浪汉",
          text2: "Or hobo.",
        },
        {
          id: "7",
          text1: "而当我发现火车能让我",
          text2: "And when I figured out that trains allowed me",
        },
      ],
    ];
    function fetchParagraphs() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(arr.pop());
        }, 1000);
      });
    }
    const loadingRef = {
      current: false,
    };
    const moreRef = {
      current: [],
    };
    const instance = new Exam({
      title: "测试",
      paragraphs: [
        {
          id: "1",
          text1: "我一直喜欢火车",
          text2: "I've always loved trains.",
        },
        {
          id: "2",
          text1: "事实上",
          text2: "In fact,",
        },
        {
          id: "3",
          text1: "如果我在理论物理上的事业没有成果",
          text2: "if my career in theoretical physics hadn't worked out.",
        },
        {
          id: "4",
          text1: "我的后备计划是",
          text2: "my backup plan",
        },
      ],
      onChange: async (nextExam) => {
        const { remainingParagraphsCount } = nextExam;
        if (remainingParagraphsCount === 3) {
          loadingRef.current = true;
          const moreParagraphs = await fetchParagraphs();
          loadingRef.current = false;
          if (instance.remainingParagraphsCount === 1) {
            instance.appendParagraphs(moreParagraphs);
            let data = instance.toJSON();
            console.log("count", data.remainingParagraphsCount);
            return;
          }
          moreRef.current = moreParagraphs as unknown[];
        }
        if (remainingParagraphsCount === 1) {
          if (loadingRef.current) {
            // show loading to prevent user operate
            return;
          }
          if (moreRef.current.length !== 0) {
            instance.appendParagraphs(moreRef.current);
            moreRef.current = [];
            return;
          }
        }
      },
    });
    instance.start();
    let data = instance.toJSON();
    expect(data.curParagraphId).toBe("1");

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("2");
    expect(data.remainingParagraphsCount).toBe(3);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("3");
    expect(data.remainingParagraphsCount).toBe(2);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("4");
    expect(data.remainingParagraphsCount).toBe(1);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("4");
    expect(data.remainingParagraphsCount).toBe(1);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("4");
    expect(data.remainingParagraphsCount).toBe(1);

    await sleep(4000);
    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("5");
    expect(data.remainingParagraphsCount).toBe(3);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("6");
    expect(data.remainingParagraphsCount).toBe(2);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("7");
    expect(data.remainingParagraphsCount).toBe(1);

    instance.skip();
    data = instance.toJSON();
    expect(data.curParagraphId).toBe("7");
    expect(data.remainingParagraphsCount).toBe(1);
  });
});
