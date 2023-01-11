if (window.console) {
    Function.prototype.makeMulti = function () {
      let l = new String(this);
      l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"));
      return l;
    };
    let string = function () {
      /*
   __     __         _____              _       ____  _             
   \ \   / /        |  __ \            ( )     |  _ \| |            
    \ \_/ /_ _ _ __ | |  | | __ _  ___ |/ ___  | |_) | | ___   __ _ 
     \   / _` | '_ \| |  | |/ _` |/ _ \  / __| |  _ <| |/ _ \ / _` |
      | | (_| | | | | |__| | (_| | (_) | \__ \ | |_) | | (_) | (_| |
      |_|\__,_|_| |_|_____/ \__,_|\___/  |___/ |____/|_|\___/ \__, |
                                                               __/ |
                                                              |___/ 
      */
    };
    console.log(string.makeMulti());
    console.log("欢迎访问%cYandao's Blog!", "color:#1fc7b6;font-weight:bold");
  }