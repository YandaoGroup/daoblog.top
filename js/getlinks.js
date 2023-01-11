!function links(target, getFor ) {
    var load, loadwerror, jsonTarget, name, blogLink, imageUrl, targetTemp = target.getElementById("app-links");
    jsonTarget = "https://yandao.is-a.dev/Friends/links/links.json",
    name = function(e) {
        var name, blogLink, imageUrl, slogan, content = "";
        for (var o in e) {
            var count = e[o];
            blogLink = count.url;
            blogLink = blogLink.replace('https://', '');
            if (blogLink.endsWith("/")) {
                blogLink = blogLink.substring(0,blogLink.length - 1);
            }          
            content += (name = o, blogLink, imageUrl = count.img, slogan = count.text, '<a href="' + count.url + '" target="_blank"><div class="friend-box media" style="width: 100%;"><img class="friend-avatar" src="' + imageUrl + '" alt="' + name + '"><div class="flink-info"><a class="gt-c-content-color-first" href="' + count.url + '" target="_blank">' + name + '</a><br /><div class="flink-info-desc gt-c-content-color-first slogan">' + slogan + '</div></div></div></a>')              
        }
        getFor(function() {
            targetTemp.innerHTML = content;
            target.getElementById("apps-links-load-tips").style.display='none',
            target.getElementById("apps-links-info").style.display='block';
        })
    },
    loadwerror = function() {
        targetTemp.innerHTML = '<p class="title tips">加载失败，请刷新重试！</p>'
    },
    (load = new XMLHttpRequest).open("GET", encodeURI(jsonTarget), !0),
    load.onload = function() {
        var e;
        200 <= load.status && load.status < 300 || 304 === load.status ? (e = JSON.parse(load.responseText), name(e)) : loadwerror()
    },
    load.timeout = 4500,
    load.ontimeout = blogLink,
    load.onerror = blogLink,
    load.send()
} (document, window.requestAnimationFrame)