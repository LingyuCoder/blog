var Editor = (function() {
	var converter = new Markdown.Converter();
	var AceMode = ace.require("ace/mode/markdown").Mode;
	var AceTheme = "ace/theme/dawn";
	var storage = window.localStorage;

	if (!storage.getItem("artList")) {
		storage.setItem("artList", JSON.stringify([]));
	}

	function transToDom(dom) {
		if (typeof dom === "string") {
			dom = document.getElementById(dom);
		}
		if (!dom) {
			alertify.error("需要被构建编辑器的节点不存在");
		}
		return dom;
	}

	function getRandomString() {
		return (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');
	}

	function trim(str) { //删除左右两端的空格
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}

	function Editor(dom) {
		if (!this instanceof Editor) {
			return new Editor(dom);
		}
		this.dom = transToDom(dom);
		this._init();
		this._bindCommands();
	}


	Editor.prototype._init = function() {
		var that = this;
		var editor = that.editor = ace.edit(that.dom);
		var session = that.session = editor.getSession();
		var scroll = that.scroll = that.dom.querySelector(".ace_scrollbar-v .ace_scrollbar-inner");

		editor.setTheme(AceTheme);
		editor.setShowPrintMargin(false);
		editor.setBehavioursEnabled(false);
		editor.setFontSize("16px");

		session.setMode(new AceMode());
		session.setUseWrapMode(true);
		session.setWrapLimitRange();
	};

	Editor.prototype._bindCommands = function() {
		var that = this;
		that.editor.commands.addCommand({
			name: 'save',
			bindKey: {
				win: 'Ctrl-S',
				mac: 'Command-S'
			},
			exec: function(editor) {
				that.save();
			},
			readOnly: true // false if this command should not apply in readOnly mode
		});
	};

	Editor.prototype.bindShower = function(dom) {
		var that = this;
		var shower = transToDom(dom);
		that.session.on("change", function() {
			var codes, i;
			shower.innerHTML = converter.makeHtml(that.session.getValue());
			codes = shower.getElementsByTagName("code");
			for (i = codes.length; i--;) {
				hljs.highlightBlock(codes[i]);
			}
		});

		that.session.on("changeScrollTop", function(scrollTop) {
			shower.scrollTop = (scrollTop / parseInt(that.scroll.style.height.replace("px", ""))) * shower.scrollHeight;
		});
	};

	Editor.prototype.getCurTitle = function() {
		var that = this;
		var i;
		var m;
		var title = "";
		var session = that.session;
		for (i = 0, m = session.getLength(); i < m; i++) {
			title = trim(session.getLine(i));
			if (title) {
				break;
			}
		}
		return title;
	};

	Editor.prototype.download = function() {
		var that = this;
		var content = that.session.getValue();
		var title = that.getCurTitle();

		var aLink = document.createElement('a');
		var blob = new Blob([content]);
		var evt = document.createEvent("HTMLEvents");
		if (!title) {
			alertify.error("无法下载，请先写点什么");
			return;
		}
		evt.initEvent("click", false, false);
		aLink.download = title + ".md";
		aLink.href = URL.createObjectURL(blob);
		aLink.dispatchEvent(evt);
	};

	Editor.prototype.save = function() {
		var that = this;
		var articleId = that.dom.getAttribute("aid");
		var content = that.session.getValue();
		var artList = JSON.parse(storage.getItem("artList"));
		var title = that.getCurTitle();
		if (!title) {
			alertify.error("无法保存空文章");
			return;
		}
		if (!articleId) {
			articleId = getRandomString();
			that.dom.setAttribute("aid", articleId);
		} else {
			artList.splice(artList.indexOf(articleId), 1);
		}

		artList.push(articleId);
		storage.setItem("artList", JSON.stringify(artList));

		storage.setItem(articleId, JSON.stringify({
			title: title,
			content: content,
			date: new Date().getTime()
		}));
		alertify.success("已成功保存到本地");
	};

	Editor.prototype.loadNewest = function() {
		var artList = JSON.parse(storage.getItem("artList"));
		if (artList.length > 0) {
			this.load(artList[artList.length - 1]);
		}
	};

	Editor.prototype.load = function(articleId) {
		var that = this;
		var article = JSON.parse(storage.getItem(articleId));
		if (article.content) {
			that.session.setValue(article.content);
			that.dom.setAttribute("aid", articleId);
			alertify.success("成功加载文章：" + article.title);
		}
	};

	Editor.prototype.listAll = function() {
		var artList = JSON.parse(storage.getItem("artList"));
		var infoList = [];
		var i;
		var m;
		var article;
		for (i = 0, m = artList.length; i < m; i++) {
			article = JSON.parse(storage.getItem(artList[i]));
			if (article && article.title) {
				infoList.push({
					id: artList[i],
					title: article.title,
					time: new Date(article.date)
				});
			}
		}
		return infoList;
	};

	Editor.prototype.new = function() {
		var that = this;
		that.dom.removeAttribute("aid");
		that.editor.setValue("");
	};

	return Editor;
}());


var editor = new Editor(document.getElementById("editor"));
var saveBtn = document.getElementById("save");
var newBtn = document.getElementById("new");
var newestBtn = document.getElementById("newest");
var historyBtn = document.getElementById("history");
var downloadBtn = document.getElementById("download");
var historyDlg = document.getElementById("historyDlg");
var closeHisDlgBtn = document.getElementById("closeHisBtn");
var artHistoryOl = document.getElementById("artHistory");
editor.bindShower(document.getElementById("shower"));
editor.loadNewest();

downloadBtn.addEventListener("click", function(evt) {
	editor.download();
}, false);

saveBtn.addEventListener("click", function(evt) {
	editor.save();
	evt.stopPropagation();
}, false);

newBtn.addEventListener("click", function(evt) {
	editor.new();
	evt.stopPropagation();
}, false);

newestBtn.addEventListener("click", function(evt) {
	editor.loadNewest();
	evt.stopPropagation();
}, false);

artHistoryOl.addEventListener("click", function(evt) {
	var id;
	var target = evt.target;
	if (target.tagName.toLowerCase() === 'li') {
		id = target.getAttribute("aid");
		if (id) {
			editor.load(id);
			closeHisDlgBtn.click();
		}
	}
	evt.stopPropagation();
}, false);

historyBtn.addEventListener("click", function(evt) {
	var artInfos = editor.listAll();
	var i;
	var m;
	var olHtml = "";
	for (i = 0, m = artInfos.length; i < m; i++) {
		olHtml += "<li aid='" + artInfos[i].id + "'>" + artInfos[i].title + "</li>"
	}
	artHistoryOl.innerHTML = olHtml;
	historyDlg.className = historyDlg.className.replace(" historyOut", "");
	if (historyDlg.className.indexOf("historyIn") === -1) {
		historyDlg.className = historyDlg.className + " historyIn";
	}
	evt.stopPropagation();
}, false);

closeHisDlgBtn.addEventListener("click", function(evt) {
	historyDlg.className = historyDlg.className.replace(" historyIn", "");
	if (historyDlg.className.indexOf("historyOut") === -1) {
		historyDlg.className = historyDlg.className + " historyOut";
	}
}, false);