/**
 * Created by Jonathan Falkner on 4/5/16.
 */

w = unsafeWindow || window;

w.clickable_where = {};

w.clickable_where.DOMSubtreeModified_timer = null;
w.clickable_where.DOMSubtreeModified_HandleChange = function (e) {
    w.clickable_where.make_all_links_clickable_on_DOMSubtreeModified(e);
};
w.clickable_where.DOMSubtreeModified = function (e){
    if (typeof w.clickable_where.DOMSubtreeModified_timer == "number") {
        clearTimeout (w.clickable_where.DOMSubtreeModified_timer);
        w.clickable_where.DOMSubtreeModified_timer = null;
    }
    w.clickable_where.DOMSubtreeModified_timer = setTimeout (
        function () {
            w.clickable_where.DOMSubtreeModified_HandleChange(e);
        }, 100
    );
};


w.clickable_where.main = function main () {
    w.document.addEventListener('DOMSubtreeModified', w.clickable_where.DOMSubtreeModified);
};

w.clickable_where.remove_zero_width_spaces = function remove_zero_width_spaces(text){
    return text.replace('&#8203;', '');
};
w.clickable_where.make_all_links_clickable_on_DOMSubtreeModified = function make_all_links_clickable_on_DOMSubtreeModified (e) {
    w.clickable_where.make_all_links_clickable(e.path[0]);
};

w.clickable_where.make_all_links_clickable = function make_all_links_clickable (node) {
    if (node.hasChildNodes()) {
        var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
        var nodes = node.childNodes;
        for (var i = 0, m = nodes.length; i < m; i++) {
            var n = nodes[i];
            if (n.nodeType == n.TEXT_NODE) {
                n.textContent = n.textContent.replace('&#8203;','').replace(/\u200B/g,'');
                var g = n.textContent.match(exp);
                while (g) {
                    var idx = n.textContent.indexOf(g[0]);
                    var pre = n.textContent.substring(0, idx);
                    var t = document.createTextNode(pre);
                    var a = document.createElement("a");
                    a.href = g[0];
                    a.target = '_blank';
                    a.innerText = g[0];
                    n.textContent = n.textContent.substring(idx + g[0].length);
                    n.parentElement.insertBefore(t, n);
                    n.parentElement.insertBefore(a, n);
                    g = n.textContent.match(exp);
                }
            }
            else if (n.tagName.toLowerCase() != 'a') {
                w.clickable_where.make_all_links_clickable(n);
            }
        }
    }
};

if (typeof (opera) != "undefined") {
    // Start the mainpart, if the site is loaded
    window.addEventListener('DOMContentLoaded', w.clickable_where.main, true);
} else {
    w.clickable_where.main();
}

















// Fix for user scripts not working in opera unless lots of end content exists at the end of the file.  This text is useful only in that it is very long and fills up a lot of space, ensuring that Opera will be able to load this user script.
