/**
 * @file 关于我们 页面
 */

import SiteLayout from "@/layouts/site";

const AboutPage = () => {
  return (
    <SiteLayout>
      <div>
        <section className="p-4 py-10 bg-gray-100">
          <div className="mx-auto lg:w-240">
            <h2 className="text-xl text-center sm:text-2xl md:text-2xl lg:text-2xl">
              我怎么理解「学好」英语？
            </h2>
            <div className="mt-4 space-y-1">
              <p className="text-gray-600">
                想和大家聊一聊，怎么才能学好英语。
              </p>
              <p className="text-gray-600">
                首先我们要搞清楚，你的「学好」是指什么，流利地日常沟通？看懂英语文档？还是能胜任专业的英语翻译。不同的目的，需要有不同的学习方式，来达到我们希望的「学好」。
              </p>
              <p className="text-gray-600">
                我作为一个前端开发，之前希望的「学好」就是能看懂英文技术文档，这其实不难，遇到不会的单词查一查，长句子就直接丢进翻译软件，磕磕绊绊地也能看懂，而且熟练之后，大部分单词和句型也能记住，不借助翻译软件也是能完整看完一篇技术文档、技术博客之类的。
              </p>
              <p className="text-gray-600">
                我也一直满足于这种程度，直到我遇到一个技术问题，需要在
                Github（一个代码托管平台，在这里可以和全世界的程序员交流）上和别人沟通，虽然我能看懂他们的日常沟通，但需要自己写时，写出的「句子」自己能看懂，别人能不能看懂就不知道了。
              </p>
              <p className="text-gray-600">
                这时我希望的「学好」英语，就变成能够写出自然的英语句子，也就是从开始的「读」，到现在的「读、写」。
              </p>
              <p className="text-gray-600">
                经过一些搜索，我意识到通过「语料」是一个比较好的方式，于是我每天背一些句子。但效果并不明显，我总是背完就忘记了。
              </p>
              <p className="text-gray-600">
                我觉得我需要一个「情景化」、「生活化」的场景，我把目标看向了美剧。
              </p>
              <p className="text-gray-600">
                各种情景、真实世界、母语发音、中英对照，还有什么比这更有效的吗？
              </p>
              <p className="text-gray-600">
                我下载了我的第一部美剧，《小谢尔顿》，因为觉得也许小孩说英语会更简单，毕竟他们词汇量还没有成人的大。
              </p>
              <p className="text-gray-600">
                当然，有一点是我从始至终都坚持的，不「痛苦」的学习是无效的，看美剧很快乐，看完后还能记得多少呢，情节或许还能记住，具体的对话内容呢，还能记住多少？
              </p>
              <p className="text-gray-600">
                所以我在看完美剧后，要求能够将中文台词翻译成英文，毕竟我的最终目的就是能够将自己的想法（中文）翻译成英文。
              </p>
              <p className="text-gray-600">
                这个网站就是为了完成这件事的，我可以将原始中英字幕导入，在方便我随时背句子的同时，它提供了「测验」功能，分为简单和困难两种模式。
              </p>
              <p className="text-gray-600">
                简单模式下，会按顺序显示中文字幕，下面提供单词选项，点击单词组成句子，与原句进行对比。
              </p>
              <p className="text-gray-600">
                专业模式就是单纯的「默写」了，给出所有的中文字幕，在中文下填入翻译内容，同样与原句进行对比。
              </p>
              <p className="text-gray-600">
                本来只有专业模式的，但实在是太困难了，简单句子还好，复杂句子即使我看过原文，还是翻译不出来。以及移动端输入内容不方便，所以又增加了简单模式，方便我在碎片时间也能翻译上几句。
              </p>
              <p className="text-gray-600">
                最后说说效果，这有自卖自夸的嫌疑，但通过这种「预习」、「考试」的模式，的确能记住大部分字幕，还能知道一些口语化的表达，比如「关你屁事」，可以用
                `None of your business.`
              </p>
              <p className="text-gray-600"></p>
            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};

export default AboutPage;
