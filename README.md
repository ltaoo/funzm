This is a starter template for [Learn Next.js](https://nextjs.org/learn).

## 创建 Mysql 表

```sql
/* 请确认以下SQL符合您的变更需求，务必确认无误后再提交执行 */

CREATE TABLE `caption` (
	`id` int NOT NULL COMMENT '自增id',
	`uid` linestring NOT NULL COMMENT '外部查询id',
	`name` linestring NOT NULL COMMENT '字幕名',
	`content` multilinestring NOT NULL COMMENT '字幕内容',
	`created` datetime NOT NULL COMMENT '创建时间',
	PRIMARY KEY (`id`,`uid`),
	KEY `name`(`name`)
) ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8
COMMENT='字幕';
```

## 授权认证

`next-auth` 支持许多种认证方式，本项目使用了 `credentials` 认证。

### `csrf` 跨站请求伪造
攻击发生在第三方网站，很好理解，用户在淘宝网登录后，访问了某个网站我们称为 `B` 网站，在 `B` 网站用户点击某个链接时，其实是点击了淘宝网修改密码的接口请求，淘宝在接收到请求后，由于用户的确是登录的，所以允许本次请求，用户的密码就被非法修改了。
为了规避这个问题，浏览器在未来会限制 `cookie` 的使用范围。
目前，淘宝在一些敏感接口增加 `csrf` 数据，这个数据只能在访问淘宝网站时获取到，随着请求一起发送给淘宝后端，后端校验存在该值并且合法，该请求才会被处理。

并且，为了避免 `csrf` 被伪造，该值应该通过服务端渲染和页面一起返回。


## next-auth 源码

本质上就是内置的一大段后端代码，提供了许多接口，前端可以直接调用这些接口来完成登录功能。

### 登录接口

`POST /api/auth/callback/:provider​`

由于接口文件名是 `pages/api/auth/[...nextauth]`，所以从请求体中解析到的 `query.nextauth` 会是

`['callback', 'credentials']`

对应的语义分别是 `action`、`providerId/error`，并且，还可以手动传入 `query` 参数，如 `/api/auth?action=callback&providerId=credentials&error` 这种形式，优先使用 `query` 指定的，默认值使用 `nextauth`。

```js
const {
	nextauth,
	action = nextauth[0],
	providerId = nextauth[1],
	error = nextauth[1]
} = req.query;
```

在登录请求场景下的 `action` 和 `providerId` 分别是 `['callback', 'credentials']`，根据 `providerId` 获取到 `provider`

```js
    const providers = (0, _providers.default)({
      providers: userOptions.providers,
      baseUrl,
      basePath
    });
    const provider = providers.find(({
      id
    }) => id === providerId);
```

得到的结果

```js
{
  id: 'credentials',
  name: 'Credentials',
  type: 'credentials',
  authorize: [AsyncFunction: authorize],
  credentials: {
    email: { label: '邮箱', type: 'text', placeholder: 'example@name.com' },
    password: { label: '密码', type: 'password' }
  },
  signinUrl: 'http://localhost:3000/api/auth/signin/credentials',
  callbackUrl: 'http://localhost:3000/api/auth/callback/credentials'
}
```

然后是根据 `req.method` 和 `action` 判断怎么处理这次请求，

```js

    if (req.method === "GET") {
      switch (action) {
        case "providers":
          return routes.providers(req, res);

        case "session":
          return routes.session(req, res);

        case "csrf":
          return res.json({
            csrfToken: req.options.csrfToken
          });

        case "signin":
          if (pages.signIn) {
            let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}callbackUrl=${req.options.callbackUrl}`;

            if (error) {
              signinUrl = `${signinUrl}&error=${error}`;
            }

            return res.redirect(signinUrl);
          }

          return render.signin();

        case "signout":
          if (pages.signOut) return res.redirect(pages.signOut);
          return render.signout();

        case "callback":
          if (provider) {
            if (await pkce.handleCallback(req, res)) return;
            if (await state.handleCallback(req, res)) return;
            return routes.callback(req, res);
          }

          break;

        case "verify-request":
          if (pages.verifyRequest) {
            return res.redirect(pages.verifyRequest);
          }

          return render.verifyRequest();

        case "error":
          if (pages.error) {
            return res.redirect(`${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`);
          }

          if (["Signin", "OAuthSignin", "OAuthCallback", "OAuthCreateAccount", "EmailCreateAccount", "Callback", "OAuthAccountNotLinked", "EmailSignin", "CredentialsSignin"].includes(error)) {
            return res.redirect(`${baseUrl}${basePath}/signin?error=${error}`);
          }

          return render.error({
            error
          });

        default:
      }
    } else if (req.method === "POST") {
      switch (action) {
        case "signin":
          if (req.options.csrfTokenVerified && provider) {
            if (await pkce.handleSignin(req, res)) return;
            if (await state.handleSignin(req, res)) return;
            return routes.signin(req, res);
          }

          return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`);

        case "signout":
          if (req.options.csrfTokenVerified) {
            return routes.signout(req, res);
          }

          return res.redirect(`${baseUrl}${basePath}/signout?csrf=true`);

        case "callback":
          if (provider) {
            if (provider.type === "credentials" && !req.options.csrfTokenVerified) {
              return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`);
            }

            if (await pkce.handleCallback(req, res)) return;
            if (await state.handleCallback(req, res)) return;
            return routes.callback(req, res);
          }

          break;

        case "_log":
          if (userOptions.logger) {
            try {
              const {
                code = "CLIENT_ERROR",
                level = "error",
                message = "[]"
              } = req.body;

              _logger.default[level](code, ...JSON.parse(message));
            } catch (error) {
              _logger.default.error("LOGGER_ERROR", error);
            }
          }

          return res.end();

        default:
      }
    }
```

正常来说应该这在段逻辑中，请求就要被处理掉，如果没有匹配，就返回 400，请求错误。

在登录场景，会走到这段逻辑

```js
        case "callback":
          if (provider) {
            if (provider.type === "credentials" && !req.options.csrfTokenVerified) {
              return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`);
            }

            if (await pkce.handleCallback(req, res)) return;
            if (await state.handleCallback(req, res)) return;
            return routes.callback(req, res);
          }

          break;
```

可以看到会经过三次判断，都通过了才会调用 `routes.callback`，来完成真正的登录校验。

### routes.callback

里面会判断 `provider.type`，来调用不同的处理逻辑

```js
    else if (provider.type === "credentials" && req.method === "POST") {
    // console.log(
    //   "[next-auth]routes.callback provider type is credentials",
    //   useJwtSession
    // );
    if (!useJwtSession) {
      logger.error(
        "CALLBACK_CREDENTIALS_JWT_ERROR",
        "Signin in with credentials is only supported if JSON Web Tokens are enabled"
      );
      return res
        .status(500)
        .redirect(`${baseUrl}${basePath}/error?error=Configuration`);
    }

    if (!provider.authorize) {
      logger.error(
        "CALLBACK_CREDENTIALS_HANDLER_ERROR",
        "Must define an authorize() handler to use credentials authentication provider"
      );
      return res
        .status(500)
        .redirect(`${baseUrl}${basePath}/error?error=Configuration`);
    }

    const credentials = req.body;

    let userObjectReturnedFromAuthorizeHandler;
    try {
      userObjectReturnedFromAuthorizeHandler = await provider.authorize(
        credentials,
        { ...req, options: {}, cookies: {} }
      );
      if (!userObjectReturnedFromAuthorizeHandler) {
        return res
          .status(401)
          .redirect(
            `${baseUrl}${basePath}/error?error=CredentialsSignin&provider=${encodeURIComponent(
              provider.id
            )}`
          );
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(
          `${baseUrl}${basePath}/error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }
      return res.redirect(error);
    }

    const user = userObjectReturnedFromAuthorizeHandler;
    const account = { id: provider.id, type: "credentials" };
    try {
      // console.log(
      //   "[next-auth]routes.callback try sign in",
      //   user,
      //   account,
      //   credentials
      // );
      const signInCallbackResponse = await callbacks.signIn(
        user,
        account,
        credentials
      );
      // console.log(
      //   "[next-auth]routes.callback sign in response",
      //   signInCallbackResponse
      // );
      if (signInCallbackResponse === false) {
        return res
          .status(403)
          .redirect(`${baseUrl}${basePath}/error?error=AccessDenied`);
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.redirect(
          `${baseUrl}${basePath}/error?error=${encodeURIComponent(
            error.message
          )}`
        );
      }
      return res.redirect(error);
    }

    const defaultJwtPayload = {
      name: user.name,
      email: user.email,
      picture: user.image,
      sub: user.id?.toString(),
    };
    const jwtPayload = await callbacks.jwt(
      defaultJwtPayload,
      user,
      account,
      userObjectReturnedFromAuthorizeHandler,
      false
    );

    // Sign and encrypt token
    const newEncodedJwt = await jwt.encode({ ...jwt, token: jwtPayload });

    // Set cookie expiry date
    const cookieExpires = new Date();
    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
    // console.log("[next-auth]routes.callback set cookie");
    cookie.set(res, cookies.sessionToken.name, newEncodedJwt, {
      expires: cookieExpires.toISOString(),
      ...cookies.sessionToken.options,
    });

    // console.log("[next-auth]routes.callback dispatch event", user, account);
    await dispatchEvent(events.signIn, { user, account });

    return res.redirect(callbackUrl || baseUrl);
```

### client signin 方法

`next-auth` 包除了提供 `api` 接口外，还提供了一些 `js` 方法，如登录用的 `signin` 方法。
由于是客户端调用，在一些操作下是直接调用接口，如获取 `providers`，实际的登录也是调用接口

```js
  const signInUrl = isCredentials
    ? `${baseUrl}/callback/${provider}`
    : `${baseUrl}/signin/${provider}`;
  const res = await fetch(_signInUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      ...options,
      csrfToken: await getCsrfToken(),
      callbackUrl,
      json: true,
    }),
  });

  const data = await res.json();
```

所以，这其实就是把一些【最佳实践】封装成一个包直接用，但是定制能力就需要自己对这个包有深入的理解了。


### client signout

和 `signin` 同理。

### 邮箱验证

邮箱登录原理可以猜测，用户输入邮箱地址，我们往这个邮箱发送一封邮件，邮件中附上一个带有 `token` 的地址，当点击这个地址即可跳转到应用，并且将 `token` 写入 `cookie`，之后请求都会带上该 `cookie`，用户就算登录成功了。

邮箱验证同理，

## 问题记录

句子前面正常的符号被移除
【吃啥炸薯球啊】
'ought 

## 服务器

47.103.40.8
120.26.201.239

### 配置 RDS 与服务器

内网 `ip` 172.19.44.203，点击修改，出现 加载ECS内网IP，可选择的就是 172.19.44.203，这是在同一内网机器下自动出现的。
虽然另外有一台服务器，但由于地区在上海，所以没有出现在这里。
逗号分割多个 `ip`，172.19.44.203,47.103.40.8

一个内网一个公网。

点击账号管理，新增一个 `root` 账号，账号类型选择高权限账号，并配置密码。

数据库地址
rm-bp19r1z17mp58btqu.mysql.rds.aliyuncs.com:3306

实例ID rm-bp19r1z17mp58btqu

mysql://litao:Li1218040201@地址

### 安装 git
https://cloud.tencent.com/developer/article/1590046

先安装相关依赖

```bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker
```

```base
wget https://github.com/git/git/archive/refs/tags/v2.34.1.tar.gz
# curl -L https://github.com/yarnpkg/yarn/releases/download/v0.23.4/ya‌​rn-v0.23.4.tar.gz > yarn.tar.gz
```

```bash
tar xf v2.34.1.tar.gz
```

指定安装目录

```bash
./configure prefix=/usr/local/git/
```

安装即可

```bash
make && make install
```

完成后，会在 `/usr/local` 新增 `git` 文件夹，里面有 `bin` 目录，存放的就是二进制文件，可以直接到这个目录

```bash
./git --version
# git version 2.34.1
```

为了能在任意目录使用，需要将 `/usr/local/git/bin` 加入到环境变量

```bash
PATH="$PATH":/usr/local/git/bin
echo $PATH
# /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin:/usr/local/git/bin
```
http://cn.linux.vbird.org/linux_basic/0320bash_2.php

但是无法 `clone` 项目，提示
git：'remote-https' 不是一个 git 命令


### 安装 nodejs

依赖
```bash
yum install gcc gcc-c++
```

下载源码

```bash
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1.tar.gz

tar xf node-v16.13.1.tar.gz

./configure prefix=/usr/local/node/

make && make install
```

太慢了，直接下载二进制文件好了

```bash
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz
```

然后拷贝到 `/usr/local/nodejs` 目录，设置环境变量，直接 `node -v` 没问题，安装成果。
