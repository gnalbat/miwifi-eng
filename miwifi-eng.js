// ==UserScript==
// @name         miwifi-eng
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
    "???????????????": "Xiaomi Router"
  },
  "login": {
    "???????????????????????????": "Xiaomi Router Web Interface",
    "????????????WiFi APP???????????????": "Download the Mi Wi-Fi App to manage the router",
    "????????????WiFi APP?????????????????????": "Use the Mi Wi-Fi App to avoid the trouble of remembering passwords",
    "??????????????????????????????": "Password",
  },
  "nav": {
    "????????????": "Status",
    "????????????": "Basic Settings",
    "????????????": "Advanced Settings",
    "??????Mesh????????????": "Add Mesh node routing",
    "???": "Home",
    "?????????????????????": "Modify router name",
    "????????????": "System Upgrade",
    "???????????????": "Download app",
    "??????": "Reboot",
    "??????": "Logout",
  },
  "home": {
    "???": "Home",
    "????????????": "Devices",
    "???": " Stations",
    "?????????": "Internet",
    "??????": "Bandwidth ",
  },
  "router" : {
    "Wi-Fi??????": "Wi-Fi SSID",
    "Wi-Fi??????": "Wi-Fi Password",
    "??????????????????": "Online stations",
    "??????": "Set up",
    "???????????????": "Model",
    "???????????????": "Xiaomi Router ",
    "??????ROM??????": "System ROM Version",
    "?????????": "Stable",
    "MAC??????": "MAC Address",
  },
  "devices" : {
    "Mesh????????????": "Mesh connected devices",
    "??????????????????": "Ethernet connected devices",
    "2.4G????????????": "2.4GHz connected devices",
    "5G????????????": "5GHz connected devices",
    "??????????????????": "Guest connected devices",
    "????????????": "Internet Access",
    "IP??????": "IP Address",
    "MAC??????": "MAC Address",
    "??????": "Native",
  },
  "internet" : {
    "????????????": "External network status",
    "????????????": "Connection Type",
    "IP??????": "IP Address",
    "????????????": "Gateway Address",
    "????????????": "External network bandwidth",
    "????????????": "Download bandwidth",
    "????????????": "Upload bandwidth",
    "????????????": "Set manually",
  },
  "footer": {
    "???????????????": "Xiaomi Router",
    "????????????": "Official Website",
    "????????????": "Official Weibo",
    "????????????": "Official WeChat",
    "????????????": "User Community",
    "????????????": "FAQ",
    "????????????": "Service Hotline",
    "????????????": "Firmware Version",
    "?????????": "Stable",
    "MAC??????": "MAC Address",
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