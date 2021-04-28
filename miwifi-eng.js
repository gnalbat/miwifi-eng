// ==UserScript==
// @name         MiWifi-Eng
// @namespace    https://gnalb.at
// @version      0.1
// @description  Userscript for Xiaomi Router Web UI translation
// @author       gnalbat
// @match        http://192.168.31.1/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function replacer(toreplace, replacewith) {
  str = toreplace.html();
  if (toreplace.attr('placeholder') !== undefined) {
    var plc = true;
    str = toreplace.attr('placeholder');
  }
  $.each(replacewith, function(key, value) {
    str = replaceAll(key, value, str);
  });
  if (plc) {
    toreplace.attr('placeholder', str);
  } else {
    toreplace.html(str);
  }
}

function hashHandler() {
  if (location.hash === '#devices') {
		tab_devices()
  } else if (location.hash === '#internet') {
		tab_internet()
  }
}

// Status tabs setting
function tab_devices() {
  setTimeout(function() {
    for (i in el['devices']) {
       for (j = 0; j < $(el['devices'][i]).length; j++) {
        replacer($(el['devices'][i]).eq(j), tl.devices);
      }
    }
	}, lt["devices"]);
}

function tab_router(tokenated) {
  setTimeout(function() {
    $.ajax({
      url: tokenated,
      type: 'GET',
      datatype: 'json',
      success: function(res) {
        res = $.parseJSON(res);
        if (res.code == 0) {
          // 2.4G
          $('.wifi_2g_name').text(tl.api['ssid'] + res['2g'].ssid);
          if (res['2g'].pssswd != '') {
            $('.wifi_2g_pssswd').val(res['2g'].pssswd);
          } else {
            $('.passwd_2g').html(tl.api['passwd'] + tl.api['passwd_none']);
          }
          $('.wifi_2g_online').html(tl.api['online_sta_count']+res['2g'].online_sta_count);
          // 5G
          $('.wifi_5g_name').text(tl.api['ssid'] + res['5g'].ssid);
          if (res['5g'].passwd != '') {
            $('.wifi_5g_pssswd').val(res['5g'].passwd);
          } else {
            $('.passwd_5g').html(tl.api['passwd'] + tl.api['passwd_none']);
          }
          $('.wifi_5g_online').html(tl.api['online_sta_count']+res['5g'].online_sta_count);
        } else {
          $.alert(res.msg);
        }
      }
    }); 
	}, lt["router"]);
}

function tab_internet() {
  setTimeout(function() {
    for (i in el['internet']) {
       for (j = 0; j < $(el['internet'][i]).length; j++) {
        replacer($(el['internet'][i]).eq(j), tl.internet);
      }
    }
	}, lt["internet"]);
}

// Wait time before loading
var lt = {
  "router": 1500,
  "devices": 2500,
  "internet": 1500,
}

// Elements to modify
var el = {
  "nav": ["#addMesh", "#sysmenu", "#dropmenu"],
	"home": [".devices.nav-tab > p", "#statusDevices", ".router.nav-tab > p", ".internet.nav-tab > p", "#statusInternet"],
  "router": [".passwd_2g", ".passwd_5g", ".wifi_2g_online", ".wifi_5g_online", ".btn_wifi", ".routerinfo > .bd > table"],
  "devices": [".s0", ".s1", ".k", ".name > .muted"],
  "internet": [".internet-panel"],
}

// Translation strings
var tl = {
  "title": {
    "小米路由器": "Xiaomi Router"
  },
  "login": {
    "欢迎使用小米路由器": "Xiaomi Router Web Interface",
    "下载小米WiFi APP管理路由器": "Download the Mi Wi-Fi App to manage the router",
    "使用小米WiFi APP免除记密码烦恼": "Use the Mi Wi-Fi App to avoid the trouble of remembering passwords",
    "请输入路由器管理密码": "Password",
  },
  "nav": {
    "路由状态": "Status",
    "常用设置": "Basic Settings",
    "高级设置": "Advanced Settings",
    "添加Mesh节点路由": "Add Mesh node routing",
    "家": "Home",
    "修改路由器名称": "Modify router name",
    "系统升级": "System Upgrade",
    "下载客户端": "Download app",
    "重启": "Reboot",
    "注销": "Logout",
  },
  "home": {
    "家": "Home",
    "终端设备": "Devices",
    "台": " Stations",
    "互联网": "Internet",
    "带宽": "Bandwidth ",
  },
  "router" : {
    "Wi-Fi名称": "Wi-Fi SSID",
    "Wi-Fi密码": "Wi-Fi Password",
    "连接设备数量": "Online stations",
    "设置": "Set up",
    "路由器型号": "Model",
    "小米路由器": "Xiaomi Router ",
    "系统ROM版本": "System ROM Version",
    "稳定版": "Stable",
    "MAC地址": "MAC Address",
  },
  "devices" : {
    "Mesh组网设备": "Mesh connected devices",
    "网线连网设备": "Ethernet connected devices",
    "2.4G连网设备": "2.4GHz connected devices",
    "5G连网设备": "5GHz connected devices",
    "访客连网设备": "Guest connected devices",
    "访问外网": "Internet Access",
    "IP地址": "IP Address",
    "MAC地址": "MAC Address",
    "本机": "Native",
  },
  "internet" : {
    "外网状态": "External network status",
    "连接类型": "Connection Type",
    "IP地址": "IP Address",
    "网关地址": "Gateway Address",
    "外网带宽": "External network bandwidth",
    "下载带宽": "Download bandwidth",
    "上传带宽": "Upload bandwidth",
    "手工设置": "Set manually",
  },
  "footer": {
    "小米路由器": "Xiaomi Router",
    "官方网站": "Official Website",
    "官方微博": "Official Weibo",
    "官方微信": "Official WeChat",
    "用户社区": "User Community",
    "常见问题": "FAQ",
    "服务热线": "Service Hotline",
    "系统版本": "Firmware Version",
    "稳定版": "Stable",
    "MAC地址": "MAC Address",
  },
  "api": {
    "ssid": "Wi-Fi SSID: ",
    "passwd": "Wifi Password: ",
    "passwd_none": "Not set",
    "online_sta_count": "Online stations: ",
  }
};

$(document).ready(function() {
  // Document
  path = window.location.pathname
  replacer($("title"), tl.title)
  
  // Footer
  replacer($("#ft"), tl.footer)

  // Login
  if (path === "/cgi-bin/luci/web" || path === "/cgi-bin/luci/web/home") {
    login = [".title", ".detail", ".tip", "#password"];
    for (i in login) {
      replacer($(login[i]), tl.login);
    }
  }

  // Logged in
  if (path.includes("stok")) {
    window.addEventListener('hashchange', hashHandler, false);
    var tokenated = path.replace(/\/web.*/g,"/api/misystem/newstatus")
    // Navbar
    for (i = 0; i < 3; i++) {
      replacer($("#nav > ul > li").eq(i), tl.nav);
    }
    for (i in el['nav']) {
          replacer($(el['nav'][i]), tl.nav);
    }
    // Home
    if (path.includes("/web/home")) {
      setTimeout(function() {
        for (i in el['home']) {
          replacer($(el['home'][i]), tl.home);
        }
        for (i in el['router']) {
          replacer($(el['router'][i]), tl.router);
        }
      }, lt["router"]);
      tab_router(tokenated);
    }
    // Devices
    if (location.hash === "#devices") {
      tab_devices();
    } else if (location.hash === '#internet') {
		tab_internet()
  	}
  }
});