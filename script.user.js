// ==UserScript==
// @name         Emoticons button
// @namespace    https://gamevn.com/
// @version      1.1.1
// @description  Adds a custom emoticons button.
// @author       Dmitry221060
// @run-at       document-start
// @match        https://gamevn.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://raw.githubusercontent.com/yanatan16/nanoajax/master/nanoajax.min.js
// ==/UserScript==
function init() {
    'use strict';
    $.get("https://raw.githubusercontent.com/Dmitry221060/Discord-CustomEmoticonsButton/master/selectors.json")
    .then(data => run(JSON.parse(data)))
    .fail(() => init());
}
init();

function run(selectors) {
    'use strict';
    var emoji = [ //Массив с ссылками на ваши смайлы
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png",
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png",
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png",
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png",
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png",
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Smiling_Emoji_with_Eyes_Opened_large.png"
    ];
    var BTNIcon = "http://trjvoron.ucoz.net/WIKI/stanicb.png"; //Ссылка на иконку для кнопки

    $(document).ready(function () {
        $('body').append("<style>" +
                         "#customEmoticonsBTN {" +
                         "width: 22px;" +
                         "height: 22px;" +
                         "background: url(" + BTNIcon + ");" +
                         "background-repeat: no-repeat;" +
                         "background-size: contain;" +
                         "cursor: pointer;" +
                         "position: absolute;" +
                         "right: 40px;" +
                         "top: 11px;" +
                         "}" +
                         "#emojiList {" +
                         "width: 326px;" + //Ширина списка смайлов
                         "position: absolute;" +
                         "background: rgba(0,0,0,0.4);" +
                         "padding: 7px;" +
                         "border-radius: 5px;" +
                         "max-height: 416px;" + //Максимальная высота списка смайлов
                         "min-height: 32px;" +
                         "line-height: 0px;" +
                         "overflow: auto;" +
                         "}" +
                         "#emojiList::-webkit-scrollbar {" +
                         "width: 6px;" +
                         "background: transparent;" +
                         "}" +
                         "#emojiList:hover::-webkit-scrollbar {" +
                         "background: rgba(0,0,0,0.2);" +
                         "border-radius: 0 5px 5px 0;" +
                         "}" +
                         "#emojiList:hover::-webkit-scrollbar-thumb {" +
                         "background: #000;" +
                         "border-radius: 10px;" +
                         "}" +
                         ".emojiListItem {" +
                         "width: 28px;" + //Размер смайла в списке
                         "height: 28px;" + //Размер смайла в списке
                         "margin: 2px 0 2px 4px;" +
                         "cursor: pointer;" +
                         "display: inline-block;" +
                         "background-position: 50%;" +
                         "background-repeat: no-repeat;" +
                         "background-size: contain;" +
                         "}" +
                         "form " + selectors.textarea + " {" +
                         "padding: 10px 62px 10px 10px;" +
                         "}" +
                         "</style>"
        );
        waitForPageLoad();
        createPopup();
    });

    function waitForPageLoad() {
        if ($('form ' + selectors.emojiButton).length != 0) {
            buildBTN();
            getReactID();
        } else {
            setTimeout(waitForPageLoad, 100);
        }
    }

    function buildBTN() {
        $('<div id="customEmoticonsBTN"></div>').insertBefore($('form ' + selectors.emojiButton));
    }

    function createPopup() {
        let popup = '<div id="emojiList" style="visibility: hidden;">';
        for (let i = 0; i < emoji.length; i++) {
            popup += '<div class="emojiListItem" style="background-image: url(' + emoji[i] + ');"></div>';
        }
        $('body').append(popup + "</div>");
    }

    function getReactID() {
        for (let key in $('form ' + selectors.textarea)[0]) {
            if (key.indexOf("__reactEvent") == 0) {
                window.reactID = key.replace("__reactEventHandlers", '');
                break;
            }
        }
    }

    $(document).on("click", selectors.guildAndChannelBTNs, () => {
        setTimeout(buildBTN, 0);
    });

    $(document).on("click", '#customEmoticonsBTN', e => {
        if ($('#emojiList')[0].style.visibility == "hidden") {
            $('#emojiList').css({
                "left": (e.clientX - e.offsetX - $('#emojiList').width() + 12),
                "top": (e.clientY - e.offsetY - $('#emojiList').height() - 28),
                "visibility": "visible"
            });
        }
    });

    $(document).on("click", e => {
        if (!$(e.target).closest('#emojiList').length && e.target.id != "customEmoticonsBTN") {
            if ($('#emojiList')[0].style.visibility == "visible") {
                $('#emojiList').css({"visibility": "hidden"});
            }
        }
    });

    $(document).on("click", '.emojiListItem', function () {
        let elem = $('form ' + selectors.textarea);
        elem.val(elem.val() == '' ? elem.val() + this.style.backgroundImage.replace(/^url\("|"\)$/g, '') : elem.val() + "\n" + this.style.backgroundImage.replace(/^url\("|"\)$/g, ''));
        elem[0].innerText = elem.val();
        $('form')[0]["__reactInternalInstance" + reactID].return.memoizedState.textValue = elem.val();
    });

}
