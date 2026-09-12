# HomePage 发布文件

此目录为构建完成的静态网站，无需安装依赖或运行构建。包含主页、About 终端页面、Resume 展示页及简历 PDF。

## 上传

将此目录内所有文件和文件夹放入 GitHub 仓库根目录，index.html 必须位于根目录，不要只上传 README 或 ZIP。

在当前仓库目录执行：

```sh
git add .
git commit -m "Publish homepage"
git push
```

首次发布需先创建 GitHub 仓库并配置远程地址。GitHub Pages 使用 main 分支根目录作为发布目录。

## 已配置导航

- Resume：站内 resume/index.html
- Profile：https://hi-im-zlwh.netlify.app/
- About：站内 about/index.html
- Gallery：https://faaaqwq.github.io/gallery/
- Contact：mailto:zl_13362017991@163.com
- Projects：https://faaaqwq.github.io/projects/
- GitHub：https://github.com/FaaaQwQ

## 后续修改

原始源码保留在 HomePage 目录。修改后在 HomePage 运行 node node_modules/gulp/bin/gulp.js build，再同步 dist 的页面及资源到发布仓库并提交。仅修改 config.json 不会自动改变本发布包。

主页仍使用原项目的外部字体和动画 CDN，因此在线显示依赖这些 CDN 可访问。
