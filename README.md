## AppView for Emoji Generator
[![CircleCI](https://circleci.com/gh/emoji-gen/web-appview/tree/master.svg?style=shield)](https://circleci.com/gh/emoji-gen/web-appview/tree/master)
[![dependencies Status](https://david-dm.org/emoji-gen/web-appview/status.svg)](https://david-dm.org/emoji-gen/web-appview)
[![devDependencies Status](https://david-dm.org/emoji-gen/web-appview/dev-status.svg)](https://david-dm.org/emoji-gen/web-appview?type=dev) [![Greenkeeper badge](https://badges.greenkeeper.io/emoji-gen/web-appview.svg)](https://greenkeeper.io/)

:comet: The static pages for iOS and Android application WebView.

## Requirements

- Node `$(cat .node-version)`
- Yarn

## Getting started

```bash
$ yarn
$ yarn start     # for development
$ yarn run build # for production
```

## Deployment

```bash
$ yarn global add firebase-tools

$ yarn run build  # Build for production
$ firebase deploy # Deploy
```

## License

MIT &copy; [Emoji Generator](https://emoji-gen.ninja)
