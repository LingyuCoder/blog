layout: art
title: WebRTC的RTCDataChannel
subtitle: 使用WebRTC的数据通道实现高效的数据传输
tags: 
- WebSocket
- NodeJs
- WebIM
- WebRTC
- JavaScript
categories: 
- 即时通信
date: 2014/5/22
---



在两个浏览器中，为聊天、游戏、或是文件传输等需求发送信息是十分复杂的。通常情况下，我们需要建立一台服务器来转发数据，当然规模比较大的情况下，会扩展成多个数据中心。这种情况下很容易出现很高的延迟，同时难以保证数据的私密性。

这些问题可以通过WebRTC提供的RTCDataChannel API来解决，他能直接在点对点之间传输数据。这篇文章将介绍如何创建并使用数据通道，并提供了一些网络上常见的用例

<!-- more -->

> 为了充分理解这篇文章，你可能需要去了解一些RTCPeerConnection API的相关知识，以及STUN，TURN、信道如何工作。强烈推荐[Getting Started With WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)这篇文章

###为什么我们需要另外一个数据通道
我们已经有[WebSocket](http://www.html5rocks.com/en/tutorials/websockets/basics/)、[AJAX](http://www.html5rocks.com/en/tutorials/file/xhr2/)和[服务器发送事件](http://www.html5rocks.com/en/tutorials/eventsource/basics/)了，为什么我们需要另外一个通信信道？WebSocket是全双工的，但这些技术的设计都是让浏览器与服务器之间进行通信。

RTCDataChannel则是一个完全不同的途径：
* 它通过RTCPeerConnection API，可以建立点对点互联。由于不需要中介服务器，中间的“跳数”减少，延迟更低。
* RTCDataChannel使用[Stream Control Transmission Protocol](https://en.wikipedia.org/wiki/Stream_Control_Transmission_Protocol#Features)(SCTP)协议，允许我们配置传递语义：我们可以配置包传输的顺序并提供重传时的一些配置。

基于SCTP的支持的RTCDataChannel已经能够在桌面的Chrome、Opera和Firefox中使用，移动端则有Android支持。

###一个警告：信令、STUN和TURN
尽管WebRTC允许点对点的通信，但它依然需要服务器：
* 信令传输：建立点对点的连接需要传输一些媒体和网络相关的元数据信息，需要通过服务器
* NAT和防火墙穿透：我们需要通过ICE框架来建立点与点之间的网络路径。可以使用STUN服务器（确定双方的可公开访问你的IP地址和端口）以及TURN服务器（如果直接连接失败，就必须数据中继了）

[WebRTC in the real world: STUN, TURN, and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/) 文章详细介绍了WebRTC如何与这两种服务器进行交互

###功能
RTCDataChannel API支持灵活的数据类型。它的API是模仿WebSocket设计的，并且支持JavaScript中的二进制类型如Blob、ArrayBuffer和ArrayBufferView，另外还支持字符串。这些类型对于文件传输和多玩家的游戏来说意义重大。

![TCP、UDP、SCTP提供的功能](http://skyinlayerblog.qiniudn.com/blog/img/2014-5-22/1.png)
以上来自[Ilya Grigorik](http://www.igvita.com/)的[High Performance Browser Networking](http://chimera.labs.oreilly.com/books/1230000000545/ch18.html)

RTCDataChannel在不可靠模式（类似于UDP）或可靠模式（类似于TCP）下都能够正常工作。但这两种模式有一些不同：
* 可靠模式：保证消息传输一定成功，并保证按序到达。这自然需要一定量的开销，速度也更慢
* 不可靠模式：不保证消息传输一定成功，也不保证按序到达。这消除了那些开销，速度也更快

在不会丢包的情况下，这两种模式的效率差不多。然而，可靠模式下，丢包将造成后续的所有包阻塞，丢失的数据包也将重传直至其成功到达。当然，我们能在同一个应用中使用多个数据通道，每一个有他们自己的可靠性

下面将说明如何去配置可靠模式或不可靠模式的RTCDataChannel

###配置数据通道
网上已经有很多RTCDataChannel的例子了：
* [simpl.info/dc](http://simpl.info/dc)
* [googlechrome.github.io/webrtc/dc1.html](http://googlechrome.github.io/webrtc/dc1.html)(SCTP或者RTP)
* [pubnub.github.io/webrtc](http://pubnub.github.io/webrtc)(两个PubNub用户)

ps：PubBub是一个实时信息通讯应用开发公司

在这个例子中，浏览器创建了一个对等连接连接到自己。然后在这个对等连接n上创建了一个数据通道，发送了一些消息。最后，消息成功抵达并显示在页面上。

```javascript
var peerConnection = new RTCPeerConnection();

//使用信令传输信道创建对等连接
var dataChannel =
  peerConnection.createDataChannel("myLabel", dataChannelOptions);

dataChannel.onerror = function (error) {
  console.log("Data Channel Error:", error);
};

dataChannel.onmessage = function (event) {
  console.log("Got Data Channel Message:", event.data);
};

dataChannel.onopen = function () {
  dataChannel.send("Hello World!");
};

dataChannel.onclose = function () {
  console.log("The Data Channel is Closed");
};
```

`dataChannel`对象建立在一个已经创建完毕的对等连接之上。它可以创建在信令传输前后。另外，可以赋予一个label来作区分，并提供一系列的配置选项：
```javascript
var dataChannelOptions = {
  ordered: false, //不保证到达顺序
  maxRetransmitTime: 3000, //最大重传时间
};
```
我们可以加入一个`maxRetransimits`选项（最大重传次数），但`maxRetransimitTime`或`maxRetransimits`只能设定一个，不能两个懂事设定。如果想使用UDP的方式，设定`maxRetransmits`为0，`ordered`为`false`。如果想要获取更多信息，请查看[RFC 4960](http://tools.ietf.org/html/rfc4960)（SCTP）和[RFC 3758](http://tools.ietf.org/html/rfc3758)（SCTP部分可靠性）
* ordered: 数据通道是否保证按序传输数据
* maxRetrasmitTime：在信息失败前的最大重传时间（强迫进入不可靠模式）
* maxRetransmits：在信息失败前的最大重传次数（强迫进入不可靠模式）
* protocol：允许使用一个自协议，但如果协议不支持，将会失败
* negotiated：如果设为true，将一处对方的数据通道的自动设置，也就是说，将使用相同的id以自己配置的方式与对方建立数据通道
* id：为数据通道提供一个自己定义的ID

###它安全吗？
在WebRTC所有的组件中，都会强制进行加密。在RTCDataChannel中，所有的数据都使用[数据报传输层安全性](https://en.wikipedia.org/wiki/Datagram_Transport_Layer_Security)（DTLS）。DTLS是SSL的衍生，也就是说，你的数据将和使用基于SSL的连接一样安全。DTLS已经被标准化，并内置于所有支持WebRTC的浏览器中。如果需要更多关于DTLS信息，请访问[Wireshark的维基](http://wiki.wireshark.org/DTLS)

###改变你考虑数据的方式
处理大批量的数据，一直是JavaScript的一个难点。正如[Sharefest](http://www.sharefest.me/)所提出的观点，我们需要用一种新的方式来考虑数据。如果你需要传输一个比你当前可用内存更大的文件，就必须考虑新的保存信息的方式了。这也就是像[FileSystem API](http://www.html5rocks.com/en/tutorials/file/filesystem/)等技术存在的意义。我们将在下面进行介绍

###搭建一个文件共享应用
现在我们可以通过RTCDataChannel来创建文件共享应用。将应用建立在RTCDataChannel智商也意味着传输的文件数据都将加密，而且不会经过应用的服务器端。通过这个功能，我们能够实现多用户之间的互联，进行文件共享。

需要成功传输一个文件，我们需要如下几步：
1. [通过JavaScript的File API读取文件数据](http://www.html5rocks.com/en/tutorials/file/dndfiles/)
2. 使用RTCPeerConnection在用户间创建一个对等连接
3. 使用RTCDataChannel在用户间创建一个数据通道

在使用RTCDataChannel时，还有一些其他问题需要考虑：
* **文件大小**：如果文件很小，能够直接通过一个Blob进行存储和读取，那么我们可以直接使用File API将其读进内存，并通过可靠的数据通道发送（但是需要注意的是，浏览器有最大传输大小的限制）。随着文件变大的话，就不那么简单了。我们需要一个分块机制：文件将分成多个碎片，称为文件块。我们不再直接发送整个文件，而是一次发送一个文件块。当然文件块上会有一些元数据如块的ID，方便对方能够识别。接收到文件块之后，首先将这些文件块保存在离线存储中（例如，使用FileSystem API），只有当所有块都接收完毕，才将其拼合起来成为完整的文件，保存到用户的硬盘。
* **速度**：文件传输更适合使用可靠模式（像TCP）还是非可靠模式（像UDP）还有待商榷。如果应用知识简单的一对一文件传输，使用不可靠的数据通道将需要设计一定的响应/重传协议。你必须自己来实现它，就算你非常优秀，它仍然不会比使用可靠的数据传输快多少。可靠而无序的数据通道将会更加合适，但是如果是多方文件传输，结果可能会有所不同。
* **块大小**：这些是你的应用中的最小的“原子”数据。目前有传输大小限制（尽管以后可能不会有限制），所以必须要进行分块。目前建议的最大块大小为16KB。

如果文件已经被完全传输，就可以使用一个a标签提供下载了：
```javascript
function saveFile(blob) {
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'File Name';
  link.click();
};
```

目前已经有两个文件共享的应用使用了这种方式：[pubnub.github.io/rtc-pubnub-fileshare](http://pubnub.github.io/rtc-pubnub-fileshare/)和[github.com/Peer5/ShareFest](https://github.com/Peer5/ShareFest)，这两个应用都是开源的，并提供了基于RTCDataChannel的文件共享

###那么我们能做什么？
RTCDataChannel为文件共享、多人游戏以及内容交付应用提供了全新的实现思路：
* 上面已经提到了点对点的文件传输了
* 多人游戏，与诸如WebGL等其他技术相结合，比如Mozilla的[Banana Bread](https://hacks.mozilla.org/2013/03/webrtc-data-channels-for-great-multiplayer/)
* 内容交付：由[PeerCDN](https://peercdn.com/)重新改造的一个用于提供点对点通信提供资源的框架

###改变你构建应用的方式
现在我们可使用高新能、低延迟的RTCDataChannel来创建更优秀的应用了。一些框架，诸如[PeerJS](http://peerjs.com/)和[PubNub WebRTC SDK](https://github.com/pubnub/webrtc)，使得RTCDataChannel更加易于使用，其API也被各个平台所支持

RTCDataChannel所带来的优势能够改变你在浏览器中传输数据的观念。

###更多资讯
* [Getting started with WebRTC](http://www.html5rocks.com/en/tutorials/webrtc/basics/)
* [WebRTC in the real world: STUN, TURN and signaling](http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/)
* [WebRTC resources](http://bit.ly/webrtcwebaudio)
* [W3C Working Draft](http://www.w3.org/TR/webrtc/#peer-to-peer-data-api)
* [IETF WebRTC Data Channel Protocol Draft](http://tools.ietf.org/html/draft-jesup-rtcweb-data-protocol-04)
* [How to send a File Using WebRTC Data API](http://bloggeek.me/send-file-webrtc-data-api/)
* [7 Creative Uses of WebRTC’s Data Channel](http://bloggeek.me/webrtc-data-channel-uses/)
* [Banana Bread](https://developer.mozilla.org/en/demos/detail/bananabread) 3D first person shooter game compiled to JS+WebGL, using WebRTC data channels in multiplayer mode

