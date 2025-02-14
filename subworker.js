let token = 'username';
let addresses = [
    "zula.ir:443#CFW-√1",
    "icook.hk:2083#CFW-√2",
    "cdnjs.com:8443#CFW-√4",
    "go.inmobi.com:2053#CFW-√5",
    "www.csgo.com:2083#CFW-√6",
    "www.speedtest.net:443#CFW-√7",
    "sky.rethinkdns.com:2053#CFW-√8",
    "creativecommons.org:443#CFW-√10",
];

let addressesapi = 'https://raw.githubusercontent.com/NiREvil/CFW-BOT/main/ips.txt';

let addressesnotls = [];
let addressesnotlsapi = [];

let addressescsv = [];
let DLS = 7;
let remarkIndex = 1;

let subConverter = 'SUBAPI.cmliussss.net';
let subConfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2NtbGl1L0FDTDRTU1IvbWFpbi9jb25maWcvQUNMNFNTUl9PbmxpbmVfRnVsbF9NdWx0aU1vZGUuaW5p');
let noTLS = 'false';
let link;
let 隧道版本作者 = atob('ZWQ=');
let 获取代理IP;
let proxyIPs = [
    atob('cHJveHlpcC5meHhrLmRlZHluLmlv'),
];
let 匹配PROXYIP = []
let socks5DataURL = '';
let BotToken = '';
let ChatID = '';
let 临时中转域名 = [];
let 临时中转域名接口 = '';
let EndPS = '';
let 协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
let FileName = 'subworker';
let SUBUpdateTime = 6;
let total = 24;
let timestamp = 4102329600000;
const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
let fakeUserID;
let fakeHostName;
let httpsPorts = ["2053", "2083", "2087", "2096", "8443"];
let validityPeriod = 7;
let updateTime = 3;
let MamaJustKilledAMan = ['telegram', 'twitter'];
let proxyIPPool = [];
let socks5Data;
let alpn = 'h3';
let netfiling = `<a href='https://t.me/s/F_NiREvil/6448'>Moe ICP Certificate-20240707</a>`; // Writing your own maintainer ad
let 额外ID = '0';
let enq = 'auto';
let websiteIcon, websiteAvatar, websiteBackground;

async function 整理优选列表(api) {
    if (!api || api.length === 0) return [];

    let newapi = "";

    // Create an AbortController object to control the cancellation of the fetch request
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort(); // Cancel all requests
    }, 2000); // Triggered after 2 seconds

    try {
        // Use Promise.allSettled to wait for all API requests to complete, regardless of success or failure
        // Traverse the api array and initiate a fetch request for each API address
        const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
            method: 'get',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'User-Agent': FileName + atob('IGNtbGl1L1dvcmtlclZsZXNzMnN1Yg==')
            },
            signal: controller.signal // Add an AbortController semaphore to the fetch request so that the request can be canceled if needed.
        }).then(response => response.ok ? response.text() : Promise.reject())));

        // Iterate through all responses
        for (const [index, response] of responses.entries()) {
            // Check if the response status is 'fulfilled', which means the request was completed successfully
            if (response.status === 'fulfilled') {
                // Get the response content
                const content = await response.value;

                const lines = content.split(/\r?\n/);
                let nodeRemark = '';
                let speedPort = '443';

                if (lines[0].split(',').length > 3) {
                    const idMatch = api[index].match(/id=([^&]*)/);
                    if (idMatch) nodeRemark = idMatch[1];

                    const portMatch = api[index].match(/port=([^&]*)/);
                    if (portMatch) speedPort = portMatch[1];

                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',')[0];
                        if (columns) {
                            newapi += `${columns}:${speedPort}${nodeRemark ? `#${nodeRemark}` : ''}\n`;
                            if (api[index].includes('proxyip=true')) proxyIPPool.push(`${columns}:${speedPort}`);
                        }
                    }
                } else {
                    // Verify whether the current apiUrl has 'proxyip=true'
                    if (api[index].includes('proxyip=true')) {
                        // If the URL contains 'proxyip=true', then add the content to proxyIPPool
                        proxyIPPool = proxyIPPool.concat((await organize(content)).map(item => {
                            const baseItem = item.split('#')[0] || item;
                            if (baseItem.includes(':')) {
                                const port = baseItem.split(':')[1];
                                if (!httpsPorts.includes(port)) {
                                    return baseItem;
                                }
                            } else {
                                return `${baseItem}:443`;
                            }
                            return null; // Returns null if the condition is not met
                        }).filter(Boolean)); // Filter out null values
                    }
                    // Add content to newapi
                    newapi += content + '\n';
                }
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        // Regardless of success or failure, the set timeout timer is cleared at the end
        clearTimeout(timeout);
    }

    const newAddressesapi = await organize(newapi);

    // Return the processed result
    return newAddressesapi;
}

async function organizeSpeedTestResults(tls) {
    // Parameter Validation
    if (!tls) {
        console.error('TLS parameter cannot be empty');
        return [];
    }

    // Check CSV Address List
    if (!Array.isArray(addressescsv) || addressescsv.length === 0) {
        console.warn('No CSV address list available');
        return [];
    }

    // CSV Parsing Functions
    function parseCSV(text) {
        return text
            .replace(/\r\n/g, '\n')              // Unify Windows line breaks
            .replace(/\r/g, '\n')                // Dealing with old Mac line breaks
            .split('\n')                         // Split by Unix/Linux style
            .filter(line => line.trim() !== '')  // Remove empty lines
            .map(line => line.split(',').map(cell => cell.trim()));
    }

    // Process CSV in parallel
    const csvPromises = addressescsv.map(async (csvUrl) => {
        try {
            const response = await fetch(csvUrl);

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            const text = await response.text();
            const rows = parseCSV(text);

            // Deconstructing and validating the CSV header
            const [header, ...dataRows] = rows;
            const tlsIndex = header.findIndex(col => col.toUpperCase() === 'TLS');

            if (tlsIndex === -1) {
                throw new Error('The CSV file is missing a required field');
            }

            return dataRows
                .filter(row => {
                    const tlsValue = row[tlsIndex].toUpperCase();
                    const speed = parseFloat(row[row.length - 1]);
                    return tlsValue === tls.toUpperCase() && speed > DLS;
                })
                .map(row => {
                    const ipAddress = row[0];
                    const port = row[1];
                    const dataCenter = row[tlsIndex + remarkIndex];
                    const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;

                    // Handling PROXY IP pools
                    if (csvUrl.includes('proxyip=true') &&
                        row[tlsIndex].toUpperCase() === 'TRUE' &&
                        !httpsPorts.includes(port)) {
                        proxyIPPool.push(`${ipAddress}:${port}`);
                    }

                    return formattedAddress;
                });
        } catch (error) {
            console.error(`Error processing CSV ${csvUrl}:`, error);
            return [];
        }
    });

    // Use Promise.all to process in parallel and flatten the results
    const results = await Promise.all(csvPromises);
    return results.flat();
}

async function organize(content) {
    // Replace tabs, double quotes, single quotes, and newlines with commas
    // Then replace consecutive commas with a single comma
    var replacedContent = content.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');

    // Remove leading and trailing commas (if any)
    if (replacedContent.charAt(0) == ',') replacedContent = replacedContent.slice(1);
    if (replacedContent.charAt(replacedContent.length - 1) == ',') replacedContent = replacedContent.slice(0, replacedContent.length - 1);

    // Split the string by commas to get the address array
    const addressArray = replacedContent.split(',');

    return addressArray;
}

async function sendMessage(type, ip, add_data = "") {
    if (!BotToken || !ChatID) return;

    try {
        let msg = "";
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=en`);
        if (response.ok) {
            const ipInfo = await response.json();
            msg = `${type}\nIP: ${ip}\nCOUNTRY: ${ipInfo.country}\n<tg-spoiler>CITY: ${ipInfo.city}\nASN: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
        } else {
            msg = `${type}\nIP: ${ip}\n<tg-spoiler>${add_data}`;
        }

        const url = `https://api.telegram.org/bot${BotToken}/sendMessage?chat_id=${ChatID}&parse_mode=HTML&text=${encodeURIComponent(msg)}`;
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'Accept-Encoding': 'gzip, deflate, br',
                'User-Agent': 'Mozilla/5.0 Chrome/90.0.4430.72'
            }
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function nginx() {
    const text = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Welcome to nginx!</title>
    <style>
        body {
            width: 35em;
            margin: 0 auto;
            font-family: Tahoma, Verdana, Arial, sans-serif;
        }
    </style>
    </head>
    <body>
    <h1>Welcome to NGINX!</h1>
    <p>If you see this page, the Ransomware Evil is successfully uploaded in your system.
        stay in touch and maybe someday you will get decryption key ;)</p>

    <p>For online documentation and support please refer to
    <a href="http://nginx.org/">nginx.org</a>.<br/>
    Commercial support is available at
    <a href="http://github.com/NiREvil/">Ransomware Evil Github Acc</a>.</p>

    <p><em>Thank you for using nginx.</em></p>
    </body>
    </html>
    `
    return text;
}

function surge(content, url, path) {
    let eachLineContent;
    if (content.includes('\r\n')) {
        eachLineContent = content.split('\r\n');
    } else {
        eachLineContent = content.split('\n');
    }

    let outputContent = "";
    for (let x of eachLineContent) {
        if (x.includes(atob('PSB0cm9qYW4s'))) {
            const host = x.split("sni=")[1].split(",")[0];
            const correctContent = `skip-cert-verify=true, tfo=false, udp-relay=false`;
            const correctedContent = `skip-cert-verify=true, ws=true, ws-path=${path}, ws-headers=Host:"${host}", tfo=false, udp-relay=false`;
            outputContent += x.replace(new RegExp(correctContent, 'g'), correctedContent).replace("[", "").replace("]", "") + '\n';
        } else {
            outputContent += x + '\n';
        }
    }

    outputContent = `#!MANAGED-CONFIG ${url.href} interval=86400 strict=false` + outputContent.substring(outputContent.indexOf('\n'));
    return outputContent;
}

function getRandomProxyByMatch(CC, socks5Data) {
    // Convert the matching string to lowercase
    const lowerCaseMatch = CC.toLowerCase();

    // Filter out all proxy strings ending with the specified matching string
    let filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#${lowerCaseMatch}`));

    // If no proxy matches, try matching "US"
    if (filteredProxies.length === 0) {
        filteredProxies = socks5Data.filter(proxy => proxy.toLowerCase().endsWith(`#us`));
    }

    // If there is still no matching proxy, a random proxy is selected from the entire proxy list.
    if (filteredProxies.length === 0) {
        return socks5Data[Math.floor(Math.random() * socks5Data.length)];
    }

    // Randomly select one of the matching agents and return it
    const randomProxy = filteredProxies[Math.floor(Math.random() * filteredProxies.length)];
    return randomProxy;
}

async function MD5MD5(text) {
    const encoder = new TextEncoder();

    const firstPass = await crypto.subtle.digest('MD5', encoder.encode(text));
    const firstPassArray = Array.from(new Uint8Array(firstPass));
    const firstHex = firstPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const secondPass = await crypto.subtle.digest('MD5', encoder.encode(firstHex.slice(7, 27)));
    const secondPassArray = Array.from(new Uint8Array(secondPass));
    const secondHex = secondPassArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return secondHex.toLowerCase();
}

function revertFakeInfo(content, userID, hostName) {
    content = content.replace(new RegExp(fakeUserID, 'g'), userID).replace(new RegExp(fakeHostName, 'g'), hostName);
    return content;
}

function generateFakeInfo(content, userID, hostName) {
    content = content.replace(new RegExp(userID, 'g'), fakeUserID).replace(new RegExp(hostName, 'g'), fakeHostName);
    return content;
}

function isValidIPv4(address) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(address);
}

function generateDynamicUUID(key) {
    const timezoneOffset = 8; // Beijing time is UTC+8 hours
    const startDate = new Date(2007, 6, 7, updateTime, 0, 0); // Fixed start date is July 7, 2007, at 3 AM
    const millisecondsInAWeek = 1000 * 60 * 60 * 24 * validityPeriod;

    function getCurrentWeekNumber() {
        const now = new Date();
        const adjustedNow = new Date(now.getTime() + timezoneOffset * 60 * 60 * 1000);
        const timeDifference = Number(adjustedNow) - Number(startDate);
        return Math.ceil(timeDifference / millisecondsInAWeek);
    }

    function generateUUID(baseString) {
        const hashBuffer = new TextEncoder().encode(baseString);
        return crypto.subtle.digest('SHA-256', hashBuffer).then((hash) => {
            const hashArray = Array.from(new Uint8Array(hash));
            const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return `${hexHash.substr(0, 8)}-${hexHash.substr(8, 4)}-4${hexHash.substr(13, 3)}-${(parseInt(hexHash.substr(16, 2), 16) & 0x3f | 0x80).toString(16)}${hexHash.substr(18, 2)}-${hexHash.substr(20, 12)}`;
        });
    }

    const currentWeekNumber = getCurrentWeekNumber(); // Get the current week number
    const endTime = new Date(startDate.getTime() + currentWeekNumber * millisecondsInAWeek);

    // Generate two UUIDs
    const currentUUIDPromise = generateUUID(key + currentWeekNumber);
    const previousUUIDPromise = generateUUID(key + (currentWeekNumber - 1));

    // Format the expiration time
    const expirationTimeUTC = new Date(endTime.getTime() - timezoneOffset * 60 * 60 * 1000); // UTC time
    const expirationTimeString = `Expiration Time (UTC): ${expirationTimeUTC.toISOString().slice(0, 19).replace('T', ' ')} (UTC+8): ${endTime.toISOString().slice(0, 19).replace('T', ' ')}\n`;

    return Promise.all([currentUUIDPromise, previousUUIDPromise, expirationTimeString]);
}

async function getLink(reorganizeAllLinks) {
    let nodeLINK = [];
    let subscriptionLinks = [];
    for (let x of reorganizeAllLinks) {
        if (x.toLowerCase().startsWith('http')) {
            subscriptionLinks.push(x);
        } else {
            nodeLINK.push(x);
        }
    }

    if (subscriptionLinks && subscriptionLinks.length !== 0) {
        function base64Decode(str) {
            const bytes = new Uint8Array(atob(str).split('').map(c => c.charCodeAt(0)));
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(bytes);
        }
        const controller = new AbortController(); // Create an AbortController instance to cancel requests

        const timeout = setTimeout(() => {
            controller.abort(); // Cancel all requests after 2 seconds
        }, 2000);

        try {
            // Use Promise.allSettled to wait for all API requests to complete, regardless of success or failure
            const responses = await Promise.allSettled(subscriptionLinks.map(apiUrl => fetch(apiUrl, {
                method: 'get',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;',
                    'User-Agent': `\u0076\u0032\u0072\u0061\u0079\u004e\u002f${FileName + atob('IGNtbGl1L1dvcmtlclZsZXNzMnN1Yg==')}`
                },
                signal: controller.signal // Add an AbortController semaphore to the fetch request
            }).then(response => response.ok ? response.text() : Promise.reject())));

            // Traverse all responses
            const modifiedResponses = responses.map((response, index) => {
                // Check if the request was successful
                return {
                    status: response.status,
                    value: response.status === 'fulfilled' ? response.value : null,
                    apiUrl: subscriptionLinks[index] // Add the original apiUrl to the return object
                };
            });

            console.log(modifiedResponses); // Output the modified response array

            for (const response of modifiedResponses) {
                // Check if the response status is 'fulfilled'
                if (response.status === 'fulfilled') {
                    const content = await response.value || 'null'; // Get the response content
                    if (content.includes('://')) {
                        const lines = content.includes('\r\n') ? content.split('\r\n') : content.split('\n');
                        nodeLINK = nodeLINK.concat(lines);
                    } else {
                        const tryBase64DecodeContent = base64Decode(content);
                        if (tryBase64DecodeContent.includes('://')) {
                            const lines = tryBase64DecodeContent.includes('\r\n') ? tryBase64DecodeContent.split('\r\n') : tryBase64DecodeContent.split('\n');
                            nodeLINK = nodeLINK.concat(lines);
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error); // Capture and output error information
        } finally {
            clearTimeout(timeout); // Clear the timeout
        }
    }

    return nodeLINK;
}

function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

export default {
    async fetch(request, env) {
        if (env.TOKEN) mytoken = await organize(env.TOKEN);
        BotToken = env.TGTOKEN || BotToken;
        ChatID = env.TGID || ChatID;
        subConverter = env.SUBAPI || subConverter;
        subConfig = env.SUBCONFIG || subConfig;
        FileName = env.SUBNAME || FileName;
        socks5DataURL = env.SOCKS5DATA || socks5DataURL;
        if (env.CMPROXYIPS) 匹配PROXYIP = await organize(env.CMPROXYIPS);;
        if (env.CFPORTS) httpsPorts = await organize(env.CFPORTS);
        EndPS = env.PS || EndPS;
        websiteIcon = env.ICO ? `<link rel="icon" sizes="32x32" href="${env.ICO}">` : '';
        websiteAvatar = env.PNG ? `<div class="logo-wrapper"><div class="logo-border"></div><img src="${env.PNG}" alt="Logo"></div>` : '';
        if (env.IMG) {
            const imgs = await organize(env.IMG);
            websiteBackground = `background-image: url('${imgs[Math.floor(Math.random() * imgs.length)]}');`;
        } else websiteBackground = '';
        netfiling = env.BEIAN || env.BY || netfiling;
        const userAgentHeader = request.headers.get('User-Agent');
        const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
        const url = new URL(request.url);
        const format = url.searchParams.get('format') ? url.searchParams.get('format').toLowerCase() : "null";
        let host = "";
        let uuid = "";
        let path = "";
        let sni = "";
        let type = "ws";
        alpn = env.ALPN || alpn;
        let UD = Math.floor(((timestamp - Date.now()) / timestamp * 99 * 1099511627776) / 2);
        if (env.UA) MamaJustKilledAMan = MamaJustKilledAMan.concat(await organize(env.UA));

        const currentDate = new Date();
        const fakeUserIDMD5 = await MD5MD5(Math.ceil(currentDate.getTime()));
        fakeUserID = fakeUserIDMD5.slice(0, 8) + "-" + fakeUserIDMD5.slice(8, 12) + "-" + fakeUserIDMD5.slice(12, 16) + "-" + fakeUserIDMD5.slice(16, 20) + "-" + fakeUserIDMD5.slice(20);
        fakeHostName = fakeUserIDMD5.slice(6, 9) + "." + fakeUserIDMD5.slice(13, 19) + ".xyz";

        total = total * 1099511627776;
        let expire = Math.floor(timestamp / 1000);

        link = env.LINK || link;

        if (env.ADD) addresses = await organize(env.ADD);
        if (env.ADDAPI) addressesapi = await organize(env.ADDAPI);
        if (env.ADDNOTLS) addressesnotls = await organize(env.ADDNOTLS);
        if (env.ADDNOTLSAPI) addressesnotlsapi = await organize(env.ADDNOTLSAPI);
        if (env.ADDCSV) addressescsv = await organize(env.ADDCSV);
        DLS = Number(env.DLS) || DLS;
        remarkIndex = Number(env.CSVREMARK) || remarkIndex;

        if (socks5DataURL) {
            try {
                const response = await fetch(socks5DataURL);
                const socks5DataText = await response.text();
                if (socks5DataText.includes('\r\n')) {
                    socks5Data = socks5DataText.split('\r\n').filter(line => line.trim() !== '');
                } else {
                    socks5Data = socks5DataText.split('\n').filter(line => line.trim() !== '');
                }
            } catch {
                socks5Data = null;
            }
        }

        if (env.PROXYIP) proxyIPs = await organize(env.PROXYIP);
        //console.log(proxyIPs);

        if (mytoken.length > 0 && mytoken.some(token => url.pathname.includes(token))) {
            host = "null";
            if (env.HOST) {
                const hosts = await organize(env.HOST);
                host = hosts[Math.floor(Math.random() * hosts.length)];
            }

            if (env.PASSWORD) {
                协议类型 = atob('Trojan');
                uuid = env.PASSWORD
            } else {
                协议类型 = atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`);
                if (env.KEY) {
                    validityPeriod = Number(env.TIME) || validityPeriod;
                    updateTime = Number(env.UPTIME) || updateTime;
                    const userIDs = await generateDynamicUUID(env.KEY);
                    uuid = userIDs[0];
                } else {
                    uuid = env.UUID || "null";
                }
            }

            path = env.PATH || "/?ed=2560";
            sni = env.SNI || host;
            type = env.TYPE || type;
            隧道版本作者 = env.ED || 隧道版本作者;
            获取代理IP = env.RPROXYIP || 'false';

            if (host == "null" || uuid == "null") {
                let emptyField;
                if (host == "null" && uuid == "null") emptyField = "HOST/UUID";
                else if (host == "null") emptyField = "HOST";
                else if (uuid == "null") emptyField = "UUID";
                EndPS += ` The built-in node ${emptyField} is not set!!!`;
            }

            await sendMessage(`#Get Subscription ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${userAgentHeader}</tg-spoiler>\nDomain: ${url.hostname}\n<tg-spoiler>Entry: ${url.pathname + url.search}</tg-spoiler>`);
        } else {
            host = url.searchParams.get('host');
            uuid = url.searchParams.get('uuid') || url.searchParams.get('password') || url.searchParams.get('pw');
            path = url.searchParams.get('path');
            sni = url.searchParams.get('sni') || host;
            type = url.searchParams.get('type') || type;
            alpn = url.searchParams.get('alpn') || alpn;
            隧道版本作者 = url.searchParams.get(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.get(atob('ZXBlaXVz')) || 隧道版本作者;
            获取代理IP = url.searchParams.get('proxyip') || 'false';

            if (url.searchParams.has('alterid')) {
                协议类型 = 'VMess';
                额外ID = url.searchParams.get('alterid') || 额外ID;
                enq = url.searchParams.get('security') || enq;
            } else if (url.searchParams.has(atob('ZWRnZXR1bm5lbA==')) || url.searchParams.has('uuid')) {
                协议类型 = atob('VLEVTVM=');
            } else if (url.searchParams.has(atob('ZXBlaXVz')) || url.searchParams.has('password') || url.searchParams.has('pw')) {
                协议类型 = atob('Trojan');
            }

            if (!url.pathname.includes("/sub")) {
                const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
                if (envKey) {
                    const URLs = await organize(env[envKey]);
                    if (URLs.includes('nginx')) {
                        return new Response(await nginx(), {
                            headers: {
                                'Content-Type': 'text/html; charset=UTF-8',
                            },
                        });
                    }
                    const URL = URLs[Math.floor(Math.random() * URLs.length)];
                    return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
                }
                return await subHtml(request);
            }

            if (!host || !uuid) {
                const responseText = `
                Missing required parameters: host and uuid
                پارامترهای ضروری وارد نشده: هاست و یوآی‌دی

                ${url.origin}/sub?host=[your host]&uuid=[your uuid]&path=[your path]

                `;

                return new Response(responseText, {
                    status: 202,
                    headers: { 'content-type': 'text/plain; charset=utf-8' },
                });
            }

            if (!path || path.trim() === '') {
                path = '/?ed=2560';
            } else {
                // If the first character is not a slash, add a slash at the beginning
                path = (path[0] === '/') ? path : '/' + path;
            }
        }

        if (host.toLowerCase().includes('notls') || host.toLowerCase().includes('worker') || host.toLowerCase().includes('trycloudflare')) noTLS = 'true';
        noTLS = env.NOTLS || noTLS;
        let subConverterUrl = generateFakeInfo(url.href, uuid, host);
        if (userAgent.includes('subconverter')) alpn = '';
        if (!userAgent.includes('subconverter') && MamaJustKilledAMan.some(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead => userAgent.includes(PutAGunAgainstHisHeadPulledMyTriggerNowHesDead)) && MamaJustKilledAMan.length > 0) {
            const envKey = env.URL302 ? 'URL302' : (env.URL ? 'URL' : null);
            if (envKey) {
                const URLs = await organize(env[envKey]);
                if (URLs.includes('nginx')) {
                    return new Response(await nginx(), {
                        headers: {
                            'Content-Type': 'text/html; charset=UTF-8',
                        },
                    });
                }
                const URL = URLs[Math.floor(Math.random() * URLs.length)];
                return envKey === 'URL302' ? Response.redirect(URL, 302) : fetch(new Request(URL, request));
            }
            return await subHtml(request);
        } else if ((userAgent.includes('clash') || (format === 'clash' && !userAgent.includes('subconverter'))) && !userAgent.includes('nekobox') && !userAgent.includes('cf-workers-sub')) {
            subConverterUrl = `https://${subConverter}/sub?target=clash&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
        } else if ((userAgent.includes('sing-box') || userAgent.includes('singbox') || (format === 'singbox' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
            if (协议类型 == 'VMess' && url.href.includes('path=')) {
                const prefixPart = url.href.split('path=')[0];
                const parts = url.href.split('path=')[1].split('&');
                const pathPart = url.href.split('path=')[1].split('&')[0] || '';
                if (pathPart.includes('%3F')) subConverterUrl = generateFakeInfo(prefixPart + 'path=' + pathPart.split('%3F')[0] + '&' + parts.slice(1).join('&') || '');
            }
            subConverterUrl = `https://${subConverter}/sub?target=singbox&url=${encodeURIComponent(subConverterUrl)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
        } else {
            if (host.includes('workers.dev')) {
                if (临时中转域名接口) {
                    try {
                        const response = await fetch(临时中转域名接口);

                        if (!response.ok) {
                            console.error('Error getting address:', response.status, response.statusText);
                            return; // Exit if there is an error
                        }

                        const text = await response.text();
                        const lines = text.split('\n');
                        // Filter out empty lines or lines containing only whitespace
                        const nonEmptyLines = lines.filter(line => line.trim() !== '');

                        临时中转域名 = 临时中转域名.concat(nonEmptyLines);
                    } catch (error) {
                        console.error('Error getting address:', error);
                    }
                }
                // Use Set object to remove duplicates
                临时中转域名 = [...new Set(临时中转域名)];
            }

            const newAddressesapi = await 整理优选列表(addressesapi);
            const newAddressescsv = await organizeSpeedTestResults('TRUE');
            const uniqueAddresses = Array.from(new Set(addresses.concat(newAddressesapi, newAddressescsv).filter(item => item && item.trim())));

            let notlsresponseBody;
            if ((noTLS == 'true' && 协议类型 == atob(`\u0056\u006b\u0078\u0046\u0055\u0031\u004d\u003d`)) || 协议类型 == 'VMess') {
                const newAddressesnotlsapi = await 整理优选列表(addressesnotlsapi);
                const newAddressesnotlscsv = await organizeSpeedTestResults('FALSE');
                const uniqueAddressesnotls = Array.from(new Set(addressesnotls.concat(newAddressesnotlsapi, newAddressesnotlscsv).filter(item => item && item.trim())));

                notlsresponseBody = uniqueAddressesnotls.map(address => {
                    let port = "-1";
                    let addressid = address;

                    const match = addressid.match(regex);
                    if (!match) {
                        if (address.includes(':') && address.includes('#')) {
                            const parts = address.split(':');
                            address = parts[0];
                            const subParts = parts[1].split('#');
                            port = subParts[0];
                            addressid = subParts[1];
                        } else if (address.includes(':')) {
                            const parts = address.split(':');
                            address = parts[0];
                            port = parts[1];
                        } else if (address.includes('#')) {
                            const parts = address.split('#');
                            address = parts[0];
                            addressid = parts[1];
                        }

                        if (addressid.includes(':')) {
                            addressid = addressid.split(':')[0];
                        }
                    } else {
                        address = match[1];
                        port = match[2] || port;
                        addressid = match[3] || address;
                    }

                    const httpPorts = ["8080", "8880", "2052", "2082", "2086", "2095"];
                    if (!isValidIPv4(address) && port == "-1") {
                        for (let httpPort of httpPorts) {
                            if (address.includes(httpPort)) {
                                port = httpPort;
                                break;
                            }
                        }
                    }
                    if (port == "-1") port = "80";
                    //console.log(address, port, addressid);

                    if (隧道版本作者.trim() === atob('Y21saXU=') && 获取代理IP.trim() === 'true') {
                        // Convert addressid to lowercase
                        let lowerAddressid = addressid.toLowerCase();
                        // Initialize foundProxyIP as null
                        let foundProxyIP = null;

                        if (socks5Data) {
                            const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
                            path = `/${socks5}`;
                        } else {
                            // Traverse the matchingPROXYIP array to find matches
                            for (let item of 匹配PROXYIP) {
                                if (item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
                                    foundProxyIP = item.split('#')[0];
                                    break; // Exit the loop if a match is found
                                } else if (item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
                                    foundProxyIP = item.split(':')[0];
                                    break; // Exit the loop if a match is found
                                }
                            }

                            if (foundProxyIP) {
                                // If a matching proxyIP is found, assign it to path
                                path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + foundProxyIP;
                            } else {
                                // If no match is found, randomly select a proxyIP
                                const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
                                path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + randomProxyIP;
                            }
                        }
                    }

                    if (协议类型 == 'VMess') {
                        const vmessLink = `vmess://${utf8ToBase64(`{"v":"2","ps":"${addressid + EndPS}","add":"${address}","port":"${port}","id":"${uuid}","aid":"${额外ID}","scy":"${enq}","net":"ws","type":"${type}","host":"${host}","path":"${path}","tls":"","sni":"","alpn":"${encodeURIComponent(alpn)}","fp":""}`)}`;
                        return vmessLink;
                    } else {
                        const vlessLink = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT0mdHlwZT0=') + type}&host=${host}&path=${encodeURIComponent(path)}#${encodeURIComponent(addressid + EndPS)}`;
                        return vlessLink;
                    }

                }).join('\n');
            }

            const responseBody = uniqueAddresses.map(address => {
                let port = "-1";
                let addressid = address;

                const match = addressid.match(regex);
                if (!match) {
                    if (address.includes(':') && address.includes('#')) {
                        const parts = address.split(':');
                        address = parts[0];
                        const subParts = parts[1].split('#');
                        port = subParts[0];
                        addressid = subParts[1];
                    } else if (address.includes(':')) {
                        const parts = address.split(':');
                        address = parts[0];
                        port = parts[1];
                    } else if (address.includes('#')) {
                        const parts = address.split('#');
                        address = parts[0];
                        addressid = parts[1];
                    }

                    if (addressid.includes(':')) {
                        addressid = addressid.split(':')[0];
                    }
                } else {
                    address = match[1];
                    port = match[2] || port;
                    addressid = match[3] || address;
                }

                if (!isValidIPv4(address) && port == "-1") {
                    for (let httpsPort of httpsPorts) {
                        if (address.includes(httpsPort)) {
                            port = httpsPort;
                            break;
                        }
                    }
                }
                if (port == "-1") port = "443";

                //console.log(address, port, addressid);

                if (隧道版本作者.trim() === atob('Y21saXU=') && 获取代理IP.trim() === 'true') {
                    // Convert addressid to lowercase
                    let lowerAddressid = addressid.toLowerCase();
                    // Initialize foundProxyIP as null
                    let foundProxyIP = null;

                    if (socks5Data) {
                        const socks5 = getRandomProxyByMatch(lowerAddressid, socks5Data);
                        path = `/${socks5}`;
                    } else {
                        // Traverse the matchingPROXYIP array to find matches
                        for (let item of 匹配PROXYIP) {
                            if (item.includes('#') && item.split('#')[1] && lowerAddressid.includes(item.split('#')[1].toLowerCase())) {
                                foundProxyIP = item.split('#')[0];
                                break; // Exit the loop if a match is found
                            } else if (item.includes(':') && item.split(':')[1] && lowerAddressid.includes(item.split(':')[1].toLowerCase())) {
                                foundProxyIP = item.split(':')[0];
                                break; // Exit the loop if a match is found
                            }
                        }

                        const 匹配ProxyIP = proxyIPPool.find(proxyIP => proxyIP.includes(address));
                        if (匹配ProxyIP) {
                            path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + 匹配ProxyIP;
                        } else if (foundProxyIP) {
                            // If a matching proxyIP is found, assign it to path
                            path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + foundProxyIP;
                        } else {
                            // If no match is found, randomly select a proxyIP
                            const randomProxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];
                            path = atob('Lz9lZD0yNTYwJnByb3h5aXA9') + randomProxyIP;
                        }
                    }
                }

                let spoofedDomain = host;
                let finalPath = path;
                let nodeRemark = EndPS;
                if (临时中转域名.length > 0 && (host.includes('.workers.dev'))) {
                    finalPath = `/${host}${path}`;
                    spoofedDomain = 临时中转域名[Math.floor(Math.random() * 临时中转域名.length)];
                    nodeRemark = EndPS + atob('IOW3suWQr+eUqOS4tOaXtuWfn+WQjeS4rei9rOacjeWKoe+8jOivt+WwveW/q+e7keWumuiHquWumuS5ieWfn++8gQ==');
                    sni = spoofedDomain;
                }

                if (协议类型 == 'VMess') {
                    const vmessLink = `vmess://${utf8ToBase64(`{"v":"2","ps":"${addressid + nodeRemark}","add":"${address}","port":"${port}","id":"${uuid}","aid":"${额外ID}","scy":"${enq}","net":"ws","type":"${type}","host":"${spoofedDomain}","path":"${finalPath}","tls":"tls","sni":"${sni}","alpn":"${encodeURIComponent(alpn)}","fp":""}`)}`;
                    return vmessLink;
                } else if (协议类型 == atob('Trojan')) {
                    const trojanLink = `${atob('dHJvamFuOi8v') + uuid}@${address}:${port + atob('P3NlY3VyaXR5PXRscyZzbmk9') + sni}&alpn=${encodeURIComponent(alpn)}&fp=randomized&type=${type}&host=${spoofedDomain}&path=${encodeURIComponent(finalPath)}#${encodeURIComponent(addressid + nodeRemark)}`;
                    return trojanLink;
                } else {
                    const vlessLink = `${atob('dmxlc3M6Ly8=') + uuid}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT10bHMmc25pPQ==') + sni}&alpn=${encodeURIComponent(alpn)}&fp=random&type=${type}&host=${spoofedDomain}&path=${encodeURIComponent(finalPath)}#${encodeURIComponent(addressid + nodeRemark)}`;
                    return vlessLink;
                }

            }).join('\n');

            let combinedContent = responseBody; // Combined content

            if (link) {
                const links = await organize(link);
                const organizedNodeLINK = (await getLink(links)).join('\n');
                combinedContent += '\n' + organizedNodeLINK;
                console.log("link: " + organizedNodeLINK)
            }

            if (notlsresponseBody && noTLS == 'true') {
                combinedContent += '\n' + notlsresponseBody;
                console.log("notlsresponseBody: " + notlsresponseBody);
            }

            if (协议类型 == atob('Trojan') && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
                const trojanLinks = combinedContent.split('\n');
                const trojanLinksJ8 = generateFakeInfo(trojanLinks.join('|'), uuid, host);
                subConverterUrl = `https://${subConverter}/sub?target=surge&ver=4&url=${encodeURIComponent(trojanLinksJ8)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=true&list=false&xudp=false&udp=false&tfo=false&expand=true&scv=true&fdn=false`;
            } else {

                let base64Response;
                try {
                    base64Response = btoa(combinedContent); // Re-encode the data in Base64
                } catch (e) {
                    function encodeBase64(data) {
                        const binary = new TextEncoder().encode(data);
                        let base64 = '';
                        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

                        for (let i = 0; i < binary.length; i += 3) {
                            const byte1 = binary[i];
                            const byte2 = binary[i + 1] || 0;
                            const byte3 = binary[i + 2] || 0;

                            base64 += chars[byte1 >> 2];
                            base64 += chars[((byte1 & 3) << 4) | (byte2 >> 4)];
                            base64 += chars[((byte2 & 15) << 2) | (byte3 >> 6)];
                            base64 += chars[byte3 & 63];
                        }

                        const padding = 3 - (binary.length % 3 || 3);
                        return base64.slice(0, base64.length - padding) + '=='.slice(0, padding);
                    }

                    base64Response = encodeBase64(combinedContent);
                }

                const response = new Response(base64Response, {
                    headers: {
                        //"Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
                        "content-type": "text/plain; charset=utf-8",
                        "Profile-Update-Interval": `${SUBUpdateTime}`,
                        //"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
                    },
                });

                return response;
            }

        }

        try {
            const subConverterResponse = await fetch(subConverterUrl);

            if (!subConverterResponse.ok) {
                throw new Error(`Error fetching subConverterUrl: ${subConverterResponse.status} ${subConverterResponse.statusText}`);
            }

            let subConverterContent = await subConverterResponse.text();

            if (协议类型 == atob('Trojan') && (userAgent.includes('surge') || (format === 'surge' && !userAgent.includes('subconverter'))) && !userAgent.includes('cf-workers-sub')) {
                subConverterContent = surge(subConverterContent, host, path);
            }
            subConverterContent = revertFakeInfo(subConverterContent, uuid, host);
            return new Response(subConverterContent, {
                headers: {
                    "Content-Disposition": `attachment; filename*=utf-8''${encodeURIComponent(FileName)}; filename=${FileName}`,
                    "content-type": "text/plain; charset=utf-8",
                    "Profile-Update-Interval": `${SUBUpdateTime}`,
                    //"Subscription-Userinfo": `upload=${UD}; download=${UD}; total=${total}; expire=${expire}`,
                },
            });
        } catch (error) {
            return new Response(`Error: ${error.message}`, {
                status: 500,
                headers: { 'content-type': 'text/plain; charset=utf-8' },
            });
        }
    }
};

async function subHtml(request) {
    const url = new URL(request.url);
    const HTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${FileName}</title>
                ${websiteIcon}
                <style>
                    :root {
                        --primary-color: #4361ee;
                        --hover-color: #3b4fd3;
                        --bg-color: #f5f6fa;
                        --card-bg: #ffffff;
                    }

                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }

                    body {
                        ${websiteBackground}
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                        background-color: var(--bg-color);
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .container {
                        position: relative;
                        /* Use rgba to set semi-transparent background */
                        background: rgba(255, 255, 255, 0.7);
                        /* Add frosted glass effect */
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px); /* Safari compatibility */
                        max-width: 600px;
                        width: 90%;
                        padding: 2rem;
                        border-radius: 20px;
                        /* Adjust the shadow effect to increase transparency */
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05),
                                    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
                        transition: transform 0.3s ease;
                    }

                    /* Adjust the hover effect */
                    .container:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 30px rgba(0,0,0,0.1),
                                    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
                    }

                    h1 {
                        text-align: center;
                        color: var(--primary-color);
                        margin-bottom: 2rem;
                        font-size: 1.8rem;
                    }

                    .input-group {
                        margin-bottom: 1.5rem;
                    }

                    label {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: #555;
                        font-weight: 500;
                    }

                    input {
                        width: 100%;
                        padding: 12px;
                        /* Change the border color from #eee to a darker color */
                        border: 2px solid rgba(0, 0, 0, 0.15);  /* Using RGBA to achieve more natural depth */
                        border-radius: 10px;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        /* Add a slight inner shadow to enhance the border effect */
                        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
                    }

                    input:focus {
                        outline: none;
                        border-color: var(--primary-color);
                        /* Enhance the shadow effect in focus state */
                        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15),
                                    inset 0 2px 4px rgba(0, 0, 0, 0.03);
                    }

                    button {
                        width: 100%;
                        padding: 12px;
                        background-color: var(--primary-color);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-bottom: 1.5rem;
                    }

                    button:hover {
                        background-color: var(--hover-color);
                        transform: translateY(-2px);
                    }

                    button:active {
                        transform: translateY(0);
                    }

                    #result {
                        background-color: #f8f9fa;
                        font-family: monospace;
                        word-break: break-all;
                    }

                    .github-corner svg {
                        fill: var(--primary-color);
                        color: var(--card-bg);
                        position: absolute;
                        top: 0;
                        right: 0;
                        border: 0;
                        width: 80px;
                        height: 80px;
                    }

                    .github-corner:hover .octo-arm {
                        animation: octocat-wave 560ms ease-in-out;
                    }

                    @keyframes octocat-wave {
                        0%, 100% { transform: rotate(0) }
                        20%, 60% { transform: rotate(-25deg) }
                        40%, 80% { transform: rotate(10deg) }
                    }

                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .logo-title {
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 2rem;
                    }

                    .logo-wrapper {
                        position: absolute;
                        left: 0;
                        width: 50px;
                        height: 50px;
                    }

                    .logo-title img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        position: relative;
                        z-index: 1;
                        background: var(--card-bg);
                        box-shadow: 0 0 15px rgba(67, 97, 238, 0.1);
                    }

                    .logo-border {
                        position: absolute;
                        /* Expanded borders to ensure complete coverage */
                        top: -3px;
                        left: -3px;
                        right: -3px;
                        bottom: -3px;
                        border-radius: 50%;
                        animation: rotate 3s linear infinite;
                        background: conic-gradient(
                            from 0deg,
                            transparent 0%,
                            var(--primary-color) 20%,
                            rgba(67, 97, 238, 0.8) 40%,
                            transparent 60%,
                            transparent 100%
                        );
                        box-shadow: 0 0 10px rgba(67, 97, 238, 0.3);
                        filter: blur(0.5px);
                    }

                    .logo-border::after {
                        content: '';
                        position: absolute;
                        /* Resize the inner circle mask */
                        inset: 3px;
                        border-radius: 50%;
                        background: var(--card-bg);
                    }

                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    .logo-title h1 {
                        margin-bottom: 0;
                        text-align: center;
                    }

                    @media (max-width: 480px) {
                        .container {
                            padding: 1.5rem;
                        }

                        h1 {
                            font-size: 1.5rem;
                        }

                        .github-corner:hover .octo-arm {
                            animation: none;
                        }
                        .github-corner .octo-arm {
                            animation: octocat-wave 560ms ease-in-out;
                        }

                        .logo-wrapper {
                            width: 40px;
                            height: 40px;
                        }
                    }

                    .beian-info {
                        text-align: center;
                        font-size: 13px;
                    }

                    .beian-info a {
                        color: var(--primary-color);
                        text-decoration: none;
                        border-bottom: 1px dashed var(--primary-color);
                        padding-bottom: 2px;
                    }

                    .beian-info a:hover {
                        border-bottom-style: solid;
                    }

                    #qrcode {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-top: 20px;
                    }

                    .info-icon {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background-color: var(--primary-color);
                        color: white;
                        font-size: 12px;
                        margin-left: 8px;
                        cursor: pointer;
                        font-weight: bold;
                        position: relative; /* Add relative positioning */
                        top: -3px;          /* Fine-tune vertical position */
                    }

                    .info-tooltip {
                        display: none;
                        position: fixed; /* Change to fixed positioning */
                        background: white;
                        border: 1px solid var(--primary-color);
                        border-radius: 8px;
                        padding: 15px;
                        z-index: 1000;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        min-width: 200px;
                        max-width: 90vw;  /* 90% of the viewport width */
                        width: max-content;  /* Adapt to content width */
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%); /* Center positioning */
                        margin: 0;
                        line-height: 1.6;
                        font-size: 13px;
                        white-space: normal;
                        word-wrap: break-word;
                        overflow-wrap: break-word;
                    }

                    /* Remove the original arrow */
                    .info-tooltip::before {
                        display: none;
                    }
                </style>
                <script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"></script>
            </head>
            <body>
                <a href="${atob('aHR0cHM6Ly9naXRodWIuY29tL2NtbGl1L1dvcmtlclZsZXNzMnN1Yg==')}" target="_blank" class="github-corner" aria-label="View source on Github">
                    <svg viewBox="0 0 250 250" aria-hidden="true">
                        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                        <path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
                        <path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
                    </svg>
                </a>
                <div class="container">
                        <div class="logo-title">
                            ${websiteAvatar}
                            <h1>${FileName}</h1>
                        </div>
                    <div class="input-group">
                        <label for="link">Node Links</label>
                        <input type="text" id="link" placeholder="${decodeURIComponent(atob('JUU4JUFGJUI3JUU4JUJFJTkzJUU1JTg1JUE1JTIwVk1lc3MlMjAlMkYlMjBWTEVTUyUyMCUyRiUyMFRyb2phbiUyMCVFOSU5MyVCRSVFNiU4RSVBNQ=='))}">
                    </div>

                    <button onclick="generateLink()">Generate preferred subscription</button>

                    <div class="input-group">
                        <div style="display: flex; align-items: center;">
                            <label for="result">Preferred Subscription</label>
                            <div style="position: relative;">
                                <span class="info-icon" onclick="toggleTooltip(event)">!</span>
                                <div class="info-tooltip" id="infoTooltip">
                                    <strong>Safety Tips</strong>: When using the preferred subscription generator, you need to submit <strong>Node configuration information</strong> to generate preferred subscription links. This means that the maintainer of the subscriber may obtain the node information. <strong>Please use at your own risk.</strong><br>
                                    <br>
                                    Subscription conversion backend: <strong>${subConverter}</strong><br>
                                    Subscription Conversion Profile: <strong>${subConfig}</strong>
                                </div>
                            </div>
                        </div>
                        <input type="text" id="result" readonly onclick="copyToClipboard()">
                        <label id="qrcode" style="margin: 15px 10px -15px 10px;"></label>
                    </div>
                    <div class="beian-info" style="text-align: center; font-size: 13px;">${netfiling}</div>
                </div>

                <script>
                    function toggleTooltip(event) {
                        event.stopPropagation(); // Stop event bubbling
                        const tooltip = document.getElementById('infoTooltip');
                        tooltip.style.display = tooltip.style.display === 'block' ? 'none' : 'block';
                    }

                    // Click other areas of the page to close the prompt box
                    document.addEventListener('click', function(event) {
                        const tooltip = document.getElementById('infoTooltip');
                        const infoIcon = document.querySelector('.info-icon');

                        if (!tooltip.contains(event.target) && !infoIcon.contains(event.target)) {
                            tooltip.style.display = 'none';
                        }
                    });

                    function copyToClipboard() {
                        const resultInput = document.getElementById('result');
                        if (!resultInput.value) {
                            return;
                        }

                        resultInput.select();
                        navigator.clipboard.writeText(resultInput.value).then(() => {
                            const tooltip = document.createElement('div');
                            tooltip.style.position = 'fixed';
                            tooltip.style.left = '50%';
                            tooltip.style.top = '20px';
                            tooltip.style.transform = 'translateX(-50%)';
                            tooltip.style.padding = '8px 16px';
                            tooltip.style.background = '#4361ee';
                            tooltip.style.color = 'white';
                            tooltip.style.borderRadius = '4px';
                            tooltip.style.zIndex = '1000';
                            tooltip.textContent = 'Copied to clipboard';

                            document.body.appendChild(tooltip);

                            setTimeout(() => {
                                document.body.removeChild(tooltip);
                            }, 2000);
                        }).catch(err => {
                            alert('Copy failed, please copy manually');
                        });
                    }

                    function generateLink() {
                        const link = document.getElementById('link').value;
                        if (!link) {
                            alert('Please enter the node link');
                            return;
                        }

                        let uuidType = 'uuid';
                        const isTrojan = link.startsWith(`\${atob('dHJvamFuOi8v')}\`);
                        if (isTrojan) uuidType = 'password';
                        let subLink = '';
                        try {
                            const isVMess = link.startsWith('vmess://');
                            if (isVMess){
                                const vmessLink = link.split('vmess://')[1];
                                const vmessJson = JSON.parse(atob(vmessLink));

                                const host = vmessJson.host;
                                const uuid = vmessJson.id;
                                const path = vmessJson.path || '/';
                                const sni = vmessJson.sni || host;
                                const type = vmessJson.type || 'none';
                                const alpn = vmessJson.alpn || '';
                                const alterId = vmessJson.aid || 0;
                                const security = vmessJson.scy || 'auto';
                                const domain = window.location.hostname;

                                subLink = `https://\${domain}/sub?host=\${host}&uuid=\${uuid}&path=\${encodeURIComponent(path)}&sni=\${sni}&type=\${type}&alpn=\${encodeURIComponent(alpn)}&alterid=\${alterId}&security=\${security}\`;
                            } else {
                                const uuid = link.split("//")[1].split("@")[0];
                                const search = link.split("?")[1].split("#")[0];
                                const domain = window.location.hostname;

                                subLink = `https://\${domain}/sub?\${uuidType}=\${uuid}&\${search}\`;
                            }
                            document.getElementById('result').value = subLink;

                            // Update QR code
                            const qrcodeDiv = document.getElementById('qrcode');
                            qrcodeDiv.innerHTML = '';
                            new QRCode(qrcodeDiv, {
                                text: subLink,
                                width: 220, // Adjust the width
                                height: 220, // Adjust the height
                                colorDark: "#4a60ea", // QR code color
                                colorLight: "#ffffff", // Background Color
                                correctLevel: QRCode.CorrectLevel.L, // Setting the Error Correction Level
                                scale: 1 // Adjust pixel granularity
                            });
                        } catch (error) {
                            alert('The link format is incorrect, please check your input');
                        }
                    }
                </script>
            </body>
            </html>
            `;

    return new Response(HTML, {
        headers: {
            "content-type": "text/html;charset=UTF-8",
        },
    });
}
