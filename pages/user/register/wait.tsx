/**
 * @file 等待验证邮箱
 * 请激活你的账号
 * 你好，
 * 感谢你注册「趣字幕」。
 * 你的登录邮箱为 litao@funzm.com。请点击以下链接激活账号。
 * 
 * /api/email=encode&ticket=encode
 * 
 * 如果以上链接无法点击，请将上面的地址复制到你的浏览器地址栏并访问，即可激活账号。
 * 
 * hr
 * 趣字幕 @funzm.com
 */

import { useEffect } from "react";

const WaitConfirmEmailPage = (props) => {
  return (
    <div>
      <div>激活账号</div>
      <div>感谢注册，确认邮件已发送至你的注册邮箱: </div>
      <div>请进入邮箱查看邮件，并激活账号。</div>
      <hr />
      <div>
        <ul>
          <li>
            请检查邮箱地址是否正确，你可以返回<a>重新填写</a>
          </li>
          <li>检查你的邮件垃圾箱</li>
          <li>
            若仍未收到确认邮件，请尝试<a>重新发送</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WaitConfirmEmailPage;
