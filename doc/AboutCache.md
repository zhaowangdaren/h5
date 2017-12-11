WKWebView没有缓存，所以也无从清理。这样导致了在使用时遇到了H5页面修改了，AOO却没有更新，想清理缓存却无从下手，可以在URL后面加上时间戳来解决这个问题：
let url = NSURL(string: "http://xxxx?timestamp=\(NSDate().timeIntervalSince1970)")!
webView.loadRequest(NSURLRequest(URL: url))

通过HTTP的META设置expires和cache-control
<meta http-equiv="Cache-Control" content="max-age=7200" />
<meta http-equiv="Expires" content="Mon, 20 Jul 2009 23:00:00 GMT" />
上述设置仅为举例，实际使用其一即可。这样写的话仅对该网页有效，对网页中的图片或其他请求无效，并不会做任何cache。
这样客户端的请求就多了，尽管只是检查Last-modified状态的东西，但是请求一多对浏览速度必定有影响。