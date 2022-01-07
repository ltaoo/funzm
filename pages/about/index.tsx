/**
 * @file 关于我们 页面
 */

import SiteLayout from "@/layouts/site";

const AboutPage = () => {
  return (
    <SiteLayout>
      <div>
        <section className="p-4 py-10 bg-gray-100">
          <div className="md:mx-auto md:w-240">
            <p className="text-2xl text-gray-800">想让英语学习更有趣一些</p>
            <div className="text-gray-500">litao</div>
            <div className="mt-12 text-gray-800">
              <p>
                Hi，我是本网站的开发者，职业是前端开发，属于程序员的一个工种吧。
              </p>
              <p>由于工作需要，我花了许多时间在英语学习上。</p>
              <p>
                大部分时间都是背单词，也系统性地学习过语法，从最后结果来看，两者都没有太大的效果，当我在技术社区想回复某个外国人时，发现自己无法写出句子，或者说无法判断自己的句子是否正确。
              </p>
              <p>
                我不得不借助翻译工具，但翻译出来的句子，看上去挺通顺的，可感觉不够口语化，毕竟我是去和别人聊天，不是写论文。
              </p>
              <p>
                后来我发现了语料库这个东西，各种场景、各种题材，如果在写句子时，能有类似的句子参考，不就可以写出正确，也口语化的句子了吗。
              </p>
              <p>这就和我们小学时的造句一样。</p>
              <p>
                但是问题又来了，语料库实在太庞大了，我该如何找到我需要的句子呢？
              </p>
              <p>
                我发现做不到，并且，我需要的句子类型并不会很多，能满足日常沟通就行。
              </p>
              <p>
                那我干脆从美剧中学习，一句一句背，先有所谓的语感，加上背诵的句子，总能找到类似的句子吧，如果能再记录下我背诵的句子，提供搜索工具，从我自己的语料库搜，肯定比公开语料库更简单。
              </p>
              <p>字幕还是比较好找的，还有中英对照。</p>
              <p>但下载下来发现没法直接看，字幕文件都是用在视频上的。</p>
              <p>
                作为技术，第一想法肯定是自己写一个工具，趣字幕网站就诞生了。
              </p>
              <p>
                开始是想作为一个简单的字幕解析工具，写完后意识到我需要在手机上也能看，最好是电脑上上传好字幕，手机就能同步看到。
              </p>
              <p>这个也简单，于是网站增加了注册登录、保存字幕功能。</p>
              <p>至此，网站已经满足了我的基本需求。</p>
              <p>
                自己用了几天后发现只是看字幕，无法验证自己是否真的记住了。这个简单，增加了一个测验功能，并且为了在手机上能用，做成了点击式，快捷高效。
              </p>
              <p>
                但是，学习这件事吧，的确太难了，尤其一集美剧的字幕都是 800
                句以上，每次打开字幕就感觉学不完，太累了。
              </p>
              <p>
                又于是我增加了字幕拆分，每次看一部分，记住进度，下次继续看。测验功能也是。
              </p>
              <p>至此，网站最核心的功能就完成了。</p>
              <p>
                但是这并不有趣，学习虽然痛苦，但可以有趣。许多游戏玩起来算不上痛苦，但也不是很轻松，尤其有难度设定的游戏，但是它们一定是有趣的。
              </p>
              <p>
                游戏为什么可以吸引人不知疲倦地玩呢，如果能把这些原因借鉴到学习上，是不是可以让学习变得稍微有趣些。
              </p>
              <p>
                目前对游戏最普遍的看法是游戏能给人即时反馈，在游戏世界，每一步操作都能明确告知你有什么结果，得到了什么，可以做什么。
              </p>
              <p>
                但学习不是，努力数月的学习，或许可以在某次考试得到反馈，但就当下的学习这个行为，是没有任何的反馈给到我们，所以我们觉得无聊。
              </p>
            </div>
            {/* <h2 className="text-xl text-center sm:text-2xl md:text-2xl lg:text-2xl">
              我怎么理解「学好」英语？
            </h2> */}
            {/* <div className="mt-4 space-y-1">
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
            </div> */}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};

export default AboutPage;