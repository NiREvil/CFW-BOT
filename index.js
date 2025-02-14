/**
* @ts-nocheck   <!--GAMFC-->version base on commit 43fad05dcdae3b723c53c226f8181fc5bd47223e, time is 2023-06-22 15:20:05 UTC<!--GAMFC-END-->.
* Last Update: 10:59 - sunday, 30 June 2024 by REvil
* Many thanks to https://github.com/cmliu/edgetunnel
*/

import { connect } from 'cloudflare:sockets';

let userID = 'uuid';
let proxyIP = 'newproxy';
let sub = 'subworkerhost';
let subConverter = atob('U1VCQVBJLkNNTGl1c3Nzcy5uZXQ=');
let subConfig = atob('aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvY29uZmlnL0FDTDRTU1JfT25saW5lX01pbmlfTXVsdGlNb2RlLmluaQ==');
let subProtocol = 'https';
let subEmoji = 'true';
let socks5Address = '';
let parsedSocks5Address = {};
let enableSocks = false;

let noTLS = 'false';
const expire = 4102329600;//2099-12-31
let proxyIPs;
let socks5s;
let go2Socks5s = [
	'*ttvnw.net',
	'*tapecontent.net',
	'*cloudatacdn.com',
	'*.loadshare.org',
];
let addresses = [];
let addressesapi = [];
let addressesnotls = [];
let addressesnotlsapi = [];
let addressescsv = [];
let DLS = 8;
let remarkIndex = 1;//CSV comment column offset
let FileName = atob('ZWRnZXR1bm5lbA==');
let BotToken;
let ChatID;
let proxyhosts = [];
let proxyhostsURL = '';
let RproxyIP = 'false';
let httpsPorts = ["2053", "2083", "2087", "2096", "8443"];
let 有效时间 = 7;
let 更新时间 = 3;
let userIDLow;
let userIDTime = "";
let proxyIPPool = [];
let path = '/?ed=2560';
let 动态UUID;
let link = [];
let banHosts = [atob('c3BlZWQuY2xvdWRmbGFyZS5jb20=')];
export default {
	async fetch(request, env, ctx) {
		try {
			const UA = request.headers.get('User-Agent') || 'null';
			const userAgent = UA.toLowerCase();
			userID = env.UUID || env.uuid || env.PASSWORD || env.pswd || userID;
			if (env.KEY || env.TOKEN || (userID && !isValidUUID(userID))) {
				动态UUID = env.KEY || env.TOKEN || userID;
				有效时间 = Number(env.TIME) || 有效时间;
				更新时间 = Number(env.UPTIME) || 更新时间;
				const userIDs = await 生成动态UUID(动态UUID);
				userID = userIDs[0];
				userIDLow = userIDs[1];
			}

			if (!userID) {
				return new Response('Please set your UUID variable, or try redeploying. Is your variable effective?', {
					status: 404,
					headers: {
						"Content-Type": "text/plain;charset=utf-8",
					}
				});
			}
			const currentDate = new Date();
			currentDate.setHours(0, 0, 0, 0);
			const timestamp = Math.ceil(currentDate.getTime() / 1000);
			const fakeUserIDMD5 = await 双重哈希(`${userID}${timestamp}`);
			const fakeUserID = [
				fakeUserIDMD5.slice(0, 8),
				fakeUserIDMD5.slice(8, 12),
				fakeUserIDMD5.slice(12, 16),
				fakeUserIDMD5.slice(16, 20),
				fakeUserIDMD5.slice(20)
			].join('-');

			const fakeHostName = `${fakeUserIDMD5.slice(6, 9)}.${fakeUserIDMD5.slice(13, 19)}`;

			proxyIP = env.PROXYIP || env.proxyip || proxyIP;
			proxyIPs = await 整理(proxyIP);
			proxyIP = proxyIPs[Math.floor(Math.random() * proxyIPs.length)];

			socks5Address = env.SOCKS5 || socks5Address;
			socks5s = await 整理(socks5Address);
			socks5Address = socks5s[Math.floor(Math.random() * socks5s.length)];
			socks5Address = socks5Address.split('//')[1] || socks5Address;
			if (env.GO2SOCKS5) go2Socks5s = await 整理(env.GO2SOCKS5);
			if (env.CFPORTS) httpsPorts = await 整理(env.CFPORTS);
			if (env.BAN) banHosts = await 整理(env.BAN);
			if (socks5Address) {
				try {
					parsedSocks5Address = socks5AddressParser(socks5Address);
					RproxyIP = env.RPROXYIP || 'false';
					enableSocks = true;
				} catch (err) {
					let e = err;
					console.log(e.toString());
					RproxyIP = env.RPROXYIP || !proxyIP ? 'true' : 'false';
					enableSocks = false;
				}
			} else {
				RproxyIP = env.RPROXYIP || !proxyIP ? 'true' : 'false';
			}

			const upgradeHeader = request.headers.get('Upgrade');
			const url = new URL(request.url);
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				if (env.ADD) addresses = await 整理(env.ADD);
				if (env.ADDAPI) addressesapi = await 整理(env.ADDAPI);
				if (env.ADDNOTLS) addressesnotls = await 整理(env.ADDNOTLS);
				if (env.ADDNOTLSAPI) addressesnotlsapi = await 整理(env.ADDNOTLSAPI);
				if (env.ADDCSV) addressescsv = await 整理(env.ADDCSV);
				DLS = Number(env.DLS) || DLS;
				remarkIndex = Number(env.CSVREMARK) || remarkIndex;
				BotToken = env.TGTOKEN || BotToken;
				ChatID = env.TGID || ChatID;
				FileName = env.SUBNAME || FileName;
				subEmoji = env.SUBEMOJI || env.EMOJI || subEmoji;
				if (subEmoji == '0') subEmoji = 'false';
				if (env.LINK) link = await 整理(env.LINK);
				let sub = env.SUB || '';
				subConverter = env.SUBAPI || subConverter;
				if (subConverter.includes("http://")) {
					subConverter = subConverter.split("//")[1];
					subProtocol = 'http';
				} else {
					subConverter = subConverter.split("//")[1] || subConverter;
				}
				subConfig = env.SUBCONFIG || subConfig;
				if (url.searchParams.has('sub') && url.searchParams.get('sub') !== '') sub = url.searchParams.get('sub');
				if (url.searchParams.has('notls')) noTLS = 'true';

				if (url.searchParams.has('proxyip')) {
					path = `/?ed=2560&proxyip=${url.searchParams.get('proxyip')}`;
					RproxyIP = 'false';
				} else if (url.searchParams.has('socks5')) {
					path = `/?ed=2560&socks5=${url.searchParams.get('socks5')}`;
					RproxyIP = 'false';
				} else if (url.searchParams.has('socks')) {
					path = `/?ed=2560&socks5=${url.searchParams.get('socks')}`;
					RproxyIP = 'false';
				}

				const 路径 = url.pathname.toLowerCase();
				if (路径 == '/') {
					if (env.URL302) return Response.redirect(env.URL302, 302);
					else if (env.URL) return await 代理URL(env.URL, url);
					else return new Response(JSON.stringify(request.cf, null, 4), {
						status: 200,
						headers: {
							'content-type': 'application/json',
						},
					});
				} else if (路径 == `/${fakeUserID}`) {
					const fakeConfig = await 生成配置信息(userID, request.headers.get('Host'), sub, 'CF-Workers-SUB', RproxyIP, url, fakeUserID, fakeHostName, env);
					return new Response(`${fakeConfig}`, { status: 200 });
				} else if (url.pathname == `/${动态UUID}/edit` || 路径 == `/${userID}/edit`) {
					const html = await KV(request, env);
					return html;
				} else if (url.pathname == `/${动态UUID}` || 路径 == `/${userID}`) {
					await sendMessage(`#获取订阅 ${FileName}`, request.headers.get('CF-Connecting-IP'), `UA: ${UA}</tg-spoiler>\n域名: ${url.hostname}\n<tg-spoiler>入口: ${url.pathname + url.search}</tg-spoiler>`);
					const 维列斯Config = await 生成配置信息(userID, request.headers.get('Host'), sub, UA, RproxyIP, url, fakeUserID, fakeHostName, env);
					const now = Date.now();
					//const timestamp = Math.floor(now / 1000);
					const today = new Date(now);
					today.setHours(0, 0, 0, 0);
					const UD = Math.floor(((now - today.getTime()) / 86400000) * 24 * 1099511627776 / 2);
					let pagesSum = UD;
					let workersSum = UD;
					let total = 24 * 1099511627776;

					if (userAgent && userAgent.includes('mozilla')) {
						return new Response(维列斯Config, {
							status: 200,
							headers: {
								"Content-Type": "text/html;charset=utf-8",
								"Profile-Update-Interval": "6",
								"Subscription-Userinfo": `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${expire}`,
								"Cache-Control": "no-store",
							}
						});
					} else {
						return new Response(维列斯Config, {
							status: 200,
							headers: {
								"Content-Disposition": `attachment; filename=${FileName}; filename*=utf-8''${encodeURIComponent(FileName)}`,
								//"Content-Type": "text/plain;charset=utf-8",
								"Profile-Update-Interval": "6",
								"Subscription-Userinfo": `upload=${pagesSum}; download=${workersSum}; total=${total}; expire=${expire}`,
							}
						});
					}
				} else {
					if (env.URL302) return Response.redirect(env.URL302, 302);
					else if (env.URL) return await 代理URL(env.URL, url);
					else return new Response('No doubt! Your UUID is wrong!!!', { status: 404 });
				}
			} else {
				socks5Address = url.searchParams.get('socks5') || socks5Address;
				if (new RegExp('/socks5=', 'i').test(url.pathname)) socks5Address = url.pathname.split('5=')[1];
				else if (new RegExp('/socks://', 'i').test(url.pathname) || new RegExp('/socks5://', 'i').test(url.pathname)) {
					socks5Address = url.pathname.split('://')[1].split('#')[0];
					if (socks5Address.includes('@')) {
						let userPassword = socks5Address.split('@')[0];
						const base64Regex = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=)?\$/i;
						if (base64Regex.test(userPassword) && !userPassword.includes(':')) userPassword = atob(userPassword);
						socks5Address = `${userPassword}@${socks5Address.split('@')[1]}`;
					}
				}

				if (socks5Address) {
					try {
						parsedSocks5Address = socks5AddressParser(socks5Address);
						enableSocks = true;
					} catch (err) {
						let e = err;
						console.log(e.toString());
						enableSocks = false;
					}
				} else {
					enableSocks = false;
				}

				if (url.searchParams.has('proxyip')) {
					proxyIP = url.searchParams.get('proxyip');
					enableSocks = false;
				} else if (new RegExp('/proxyip=', 'i').test(url.pathname)) {
					proxyIP = url.pathname.toLowerCase().split('/proxyip=')[1];
					enableSocks = false;
				} else if (new RegExp('/proxyip.', 'i').test(url.pathname)) {
					proxyIP = `proxyip.${url.pathname.toLowerCase().split("/proxyip.")[1]}`;
					enableSocks = false;
				} else if (new RegExp('/pyip=', 'i').test(url.pathname)) {
					proxyIP = url.pathname.toLowerCase().split('/pyip=')[1];
					enableSocks = false;
				}

				return await 维列斯OverWSHandler(request);
			}
		} catch (err) {
			let e = err;
			return new Response(e.toString());
		}
	},
};

async function 维列斯OverWSHandler(request) {

	// @ts-ignore
	const webSocketPair = new WebSocketPair();
	const [client, webSocket] = Object.values(webSocketPair);

	// Accept the WebSocket connection
	webSocket.accept();

	let address = '';
	let portWithRandomLog = '';
	// Log function to record connection information
	const log = (/** @type {string} */ info, /** @type {string | undefined} */ event) => {
		console.log(`[${address}:${portWithRandomLog}] ${info}`, event || '');
	};
	// Get early data header, which may contain some initialization data
	const earlyDataHeader = request.headers.get('sec-websocket-protocol') || '';

	// Wrapper to store remote Socket
	let remoteSocketWapper = {
		value: null,
	};
	// Flag to indicate whether it is a DNS query
	let isDns = false;

	// WebSocket data stream to remote server pipeline
	readableWebSocketStream.pipeTo(new WritableStream({
		async write(chunk, controller) {
			if (isDns) {
				// If it is a DNS query, call the DNS processing function
				return await handleDNSQuery(chunk, webSocket, null, log);
			}
			if (remoteSocketWapper.value) {
				// If there is already a remote Socket, write the data directly
				const writer = remoteSocketWapper.value.writable.getWriter()
				await writer.write(chunk);
				writer.releaseLock();
				return;
			}

			// Process 维列斯 protocol header
			const {
				hasError,
				message,
				addressType,
				portRemote = 443,
				addressRemote = '',
				rawDataIndex,
				维列斯Version = new Uint8Array([0, 0]),
				isUDP,
			} = process维列斯Header(chunk, userID);
			// Set address and port information for logging
			address = addressRemote;
			portWithRandomLog = `${portRemote}--${Math.random()} ${isUDP ? 'udp ' : 'tcp '} `;
			if (hasError) {
				// If there is an error, throw an exception
				throw new Error(message);
				return;
			}
			// If it is UDP and the port is not a DNS port (53), then close the connection
			if (isUDP) {
				if (portRemote === 53) {
					isDns = true;
				} else {
					throw new Error('UDP proxy is only enabled for DNS (port 53)');
					return;
				}
			}
			// Construct 维列斯 response header
			const 维列斯ResponseHeader = new Uint8Array([维列斯Version[0], 0]);
			// Get the actual client data
			const rawClientData = chunk.slice(rawDataIndex);

			if (isDns) {
				// If it is a DNS query, call the DNS processing function
				return handleDNSQuery(rawClientData, webSocket, 维列斯ResponseHeader, log);
			}
			// Process TCP outbound connection
			if (!banHosts.includes(addressRemote)) {
				log(`Processing TCP outbound connection ${addressRemote}:${portRemote}`);
				handleTCPOutBound(remoteSocketWapper, addressType, addressRemote, portRemote, rawClientData, webSocket, 维列斯ResponseHeader, log);
			} else {
				throw new Error(`Blacklist closed TCP outbound connection ${addressRemote}:${portRemote}`);
			}
		},
		close() {
			log(`readableWebSocketStream has been closed`);
		},
		abort(reason) {
			log(`readableWebSocketStream has been aborted`, JSON.stringify(reason));
		},
	})).catch((err) => {
		log('readableWebSocketStream pipeline error', err);
	});

	// Return a WebSocket upgrade response
	return new Response(null, {
		status: 101,
		// @ts-ignore
		webSocket: client,
	});
}

async function handleTCPOutBound(remoteSocket, addressType, addressRemote, portRemote, rawClientData, webSocket, 维列斯ResponseHeader, log,) {
	async function useSocks5Pattern(address) {
		if (go2Socks5s.includes(atob('YWxsIGlu')) || go2Socks5s.includes(atob('Kg=='))) return true;
		return go2Socks5s.some(pattern => {
			let regexPattern = pattern.replace(/\*/g, '.*');
			let regex = new RegExp(`^${regexPattern}$`, 'i');
			return regex.test(address);
		});
	}

	async function connectAndWrite(address, port, socks = false) {
		log(`connected to ${address}:${port}`);
		//if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\$/.test(address)) address = `${atob('d3d3Lg==')}${address}${atob('LmlwLjA5MDIyNy54eXo=')}`;
		// If SOCKS5 proxy is specified, connect via SOCKS5 protocol; otherwise, connect directly
		const tcpSocket = socks ? await socks5Connect(addressType, address, port, log)
			: connect({
				hostname: address,
				port: port,
			});
		remoteSocket.value = tcpSocket;
		//log(`connected to ${address}:${port}`);
		const writer = tcpSocket.writable.getWriter();
		// First write, usually the TLS client Hello message
		await writer.write(rawClientData);
		writer.releaseLock();
		return tcpSocket;
	}

	/**
	 * Retry function: When Cloudflare's TCP Socket does not pass data, we try to redirect the IP
	 * This may be due to some network issues causing the connection to fail
	 */
	async function retry() {
		if (enableSocks) {
			// If SOCKS5 is enabled, retry connecting via SOCKS5 proxy
			tcpSocket = await connectAndWrite(addressRemote, portRemote, true);
			} else {
			// Otherwise, try to connect using the pre-set proxy IP (if any) or the original address
			if (!proxyIP || proxyIP == '') {
				proxyIP = atob('UFJPWFlJUC50cDEuMDkwMjI3Lnh5eg==');
			} else if (proxyIP.includes(']:')) {
				portRemote = proxyIP.split(']:')[1] || portRemote;
				proxyIP = proxyIP.split(']:')[0] || proxyIP;
			} else if (proxyIP.split(':').length === 2) {
				portRemote = proxyIP.split(':')[1] || portRemote;
				proxyIP = proxyIP.split(':')[0] || proxyIP;
			}
			if (proxyIP.includes('.tp')) portRemote = proxyIP.split('.tp')[1].split('.')[0] || portRemote;
			tcpSocket = await connectAndWrite(proxyIP || addressRemote, portRemote);
		}
		// Regardless of whether the retry is successful, close the WebSocket (possibly to re-establish the connection)
		tcpSocket.closed.catch(error => {
			console.log('retry tcpSocket closed error', error);
		}).finally(() => {
			safeCloseWebSocket(webSocket);
		})
		// Establish a data stream from the remote Socket to the WebSocket
		remoteSocketToWS(tcpSocket, webSocket, 维列斯ResponseHeader, null, log);
	}

	let useSocks = false;
	if (go2Socks5s.length > 0 && enableSocks) useSocks = await useSocks5Pattern(addressRemote);
	// First attempt to connect to the remote server
	let tcpSocket = await connectAndWrite(addressRemote, portRemote, useSocks);

	// When the remote Socket is ready, pass it to the WebSocket
	// Establish a data stream from the remote server to the WebSocket to send the remote server's response back to the client
	// If the connection fails or there is no data, the retry function will be called
	remoteSocketToWS(tcpSocket, webSocket, 维列斯ResponseHeader, retry, log);
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
	// Flag to indicate whether the readable stream has been canceled
	let readableStreamCancel = false;

	// Create a new readable stream
	const stream = new ReadableStream({
		// Initialization function when the stream starts
		start(controller) {
			// Listen for WebSocket messages
			webSocketServer.addEventListener('message', (event) => {
				// If the stream has been canceled, do not process new messages
				if (readableStreamCancel) {
					return;
				}
				const message = event.data;
				// Add the message to the stream's queue
				controller.enqueue(message);
			});

			// Listen for WebSocket close events
			// Note: This event means that the client has closed the client -> server stream
			// But the server -> client stream is still open until the server side calls close()
			webSocketServer.addEventListener('close', () => {
				// The client has sent a close signal, the server side needs to close
				safeCloseWebSocket(webSocketServer);
				// If the stream has not been canceled, close the controller
				if (readableStreamCancel) {
					return;
				}
				controller.close();
			});

			// Listen for WebSocket error events
			webSocketServer.addEventListener('error', (err) => {
				log('WebSocket server encountered an error');
				// Pass the error to the controller
				controller.error(err);
			});

			// Handle WebSocket 0-RTT (zero round-trip time) early data
			// 0-RTT allows sending data before the connection is fully established, improving efficiency
			const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
			if (error) {
				// If there is an error decoding the early data, pass the error to the controller
				controller.error(error);
			} else if (earlyData) {
				// If there is early data, add it to the stream's queue
				controller.enqueue(earlyData);
			}
		},

		// When the consumer pulls data from the stream
		pull(controller) {
			// Here you can implement backpressure
			// If the WebSocket can stop reading when the stream is full, we can implement backpressure
			// Reference: https://streams.spec.whatwg.org/#example-rs-push-backpressure
		},

		// When the stream is canceled
		cancel(reason) {
			// The stream is canceled for several reasons:
			// 1. When the WritableStream in the pipeline has an error, this cancel function will be called, so handle the WebSocket server's closure in this function
			// 2. If the ReadableStream is canceled, all controller.close/enqueue should be skipped
			// 3. However, after testing, even if the ReadableStream is canceled, controller.error is still valid
			if (readableStreamCancel) {
				return;
			}
			log(`Readable stream has been canceled, reason: ${reason}`);
			readableStreamCancel = true;
			// Safely close the WebSocket
			safeCloseWebSocket(webSocketServer);
		}
	});

	return stream;
}

// https://xtls.github.io/development/protocols/维列斯.html
// https://github.com/zizifn/excalidraw-backup/blob/main/v2ray-protocol.excalidraw

/**
 * Parse the 维列斯 protocol header data
 * @param { ArrayBuffer} 维列斯Buffer 维列斯 protocol raw header data
 * @param {string} userID User ID for verification
 * @returns {Object} Parsing result, including whether there is an error, error message, remote address information, etc.
 */
function process维列斯Header(维列斯Buffer, userID) {
	// Check if the data length is sufficient (at least 24 bytes)
	if (维列斯Buffer.byteLength < 24) {
		return {
			hasError: true,
			message: 'invalid data',
		};
	}

	// Parse the 维列斯 protocol version (first byte)
	const version = new Uint8Array(维列斯Buffer.slice(0, 1));

	let isValidUser = false;
	let isUDP = false;

	// Verify the user ID (next 16 bytes)
	function isUserIDValid(userID, userIDLow, buffer) {
		const userIDArray = new Uint8Array(buffer.slice(1, 17));
		const userIDString = stringify(userIDArray);
		return userIDString === userID || userIDString === userIDLow;
	}

	// Use the function to verify
	isValidUser = isUserIDValid(userID, userIDLow, 维列斯Buffer);

	// If the user ID is invalid, return an error
	if (!isValidUser) {
		return {
			hasError: true,
			message: `invalid user ${(new Uint8Array(维列斯Buffer.slice(1, 17)))}`,
		};
	}

	// Get the additional options length (17th byte)
	const optLength = new Uint8Array(维列斯Buffer.slice(17, 18))[0];
	// Skip the additional options for now

	// Parse the command (following the options, 1 byte)
	// 0x01: TCP, 0x02: UDP, 0x03: MUX (multiplexing)
	const command = new Uint8Array(
		维列斯Buffer.slice(18 + optLength, 18 + optLength + 1)
	)[0];

	// 0x01 TCP
	// 0x02 UDP
	// 0x03 MUX
	if (command === 1) {
		// TCP command, no special handling required
	} else if (command === 2) {
		// UDP command
		isUDP = true;
	} else {
		// Unsupported command
		return {
			hasError: true,
			message: `command ${command} is not support, command 01-tcp,02-udp,03-mux`,
		};
	}

	// Parse the remote port (big-endian, 2 bytes)
	const portIndex = 18 + optLength + 1;
	const portBuffer = 维列斯Buffer.slice(portIndex, portIndex + 2);
	// port is big-Endian in raw data etc 80 == 0x005d
	const portRemote = new DataView(portBuffer).getUint16(0);

	// Parse the address type and address
	let addressIndex = portIndex + 2;
	const addressBuffer = new Uint8Array(
		维列斯Buffer.slice(addressIndex, addressIndex + 1)
	);

	// Address type: 1-IPv4(4 bytes), 2-domain name(variable length), 3-IPv6(16 bytes)
	const addressType = addressBuffer[0];
	let addressLength = 0;
	let addressValueIndex = addressIndex + 1;
	let addressValue = '';

	switch (addressType) {
		case 1:
			// IPv4 address
			addressLength = 4;
			// Convert 4 bytes to dot-decimal format
			addressValue = new Uint8Array(
				维列斯Buffer.slice(addressValueIndex, addressValueIndex + addressLength)
			).join('.');
			break;
		case 2:
			// Domain name
			// The first byte is the domain name length
			addressLength = new Uint8Array(
				维列斯Buffer.slice(addressValueIndex, addressValueIndex + 1)
			)[0];
			addressValueIndex += 1;
			// Decode the domain name
			addressValue = new TextDecoder().decode(
				维列斯Buffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			break;
		case 3:
			// IPv6 address
			addressLength = 16;
			const dataView = new DataView(
				维列斯Buffer.slice(addressValueIndex, addressValueIndex + addressLength)
			);
			// Each 2 bytes form a part of the IPv6 address
			const ipv6 = [];
			for (let i = 0; i < 8; i++) {
				ipv6.push(dataView.getUint16(i * 2).toString(16));
			}
			addressValue = ipv6.join(':');
			// seems no need add [] for ipv6
			break;
		default:
			// Invalid address type
			return {
				hasError: true,
				message: `invild addressType is ${addressType}`,
			};
	}

	// Ensure the address is not empty
	if (!addressValue) {
		return {
			hasError: true,
			message: `addressValue is empty, addressType is ${addressType}`,
		};
	}

	// Return the parsing result
	return {
		hasError: false,
		addressRemote: addressValue,  // Parsed remote address
		addressType,				 // Address type
		portRemote,				 // Remote port
		rawDataIndex: addressValueIndex + addressLength,  // Actual start position of the raw data
		维列斯Version: version,	  // 维列斯 protocol version
		isUDP,					 // Whether it is a UDP request
	};
}

async function remoteSocketToWS(remoteSocket, webSocket, 维列斯ResponseHeader, retry, log) {
	// Pipe the data stream from the remote Socket to the WebSocket
	let remoteChunkCount = 0;
	let chunks = [];
	/** @type {ArrayBuffer | null} */
	let 维列斯Header = 维列斯ResponseHeader;
	let hasIncomingData = false; // Flag to check if the remote Socket has incoming data

	// Use a WritableStream to connect the readable stream of the remote Socket to a writable stream
	await remoteSocket.readable
		.pipeTo(
			new WritableStream({
				start() {
					// No initialization required
				},
				/**
				 * Handle each chunk of data
				 * @param {Uint8Array} chunk Data chunk
				 * @param {*} controller Controller
				 */
				async write(chunk, controller) {
					hasIncomingData = true; // Mark that data has been received
					// remoteChunkCount++; // For flow control, not needed now

					// Check if the WebSocket is open
					if (webSocket.readyState !== WS_READY_STATE_OPEN) {
						controller.error(
							'webSocket.readyState is not open, maybe close'
						);
					}

					if (维列斯Header) {
						// If there is a 维列斯 response header, send it along with the first data chunk
						webSocket.send(await new Blob([维列斯Header, chunk]).arrayBuffer());
						维列斯Header = null; // Clear the header after sending it once
					} else {
						// Send the data chunk directly
						// Previously, there was flow control code here to limit the sending rate of large amounts of data
						// But now Cloudflare seems to have fixed this issue
						// if (remoteChunkCount > 20000) {
						// 	// cf one package is 4096 byte(4kb),  4096 * 20000 = 80M
						// 	await delay(1);
						// }
						webSocket.send(chunk);
					}
				},
				close() {
					// When the readable stream of the remote connection is closed
					log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
					// No need to actively close the WebSocket, as this may cause an HTTP ERR_CONTENT_LENGTH_MISMATCH issue
					// The client will always send a close event
					// safeCloseWebSocket(webSocket);
				},
				abort(reason) {
					// When the readable stream of the remote connection is aborted
					console.error(`remoteConnection!.readable abort`, reason);
				},
			})
		)
		.catch((err) => {
			// Catch and log any exceptions
			console.error(
				`remoteSocketToWS has exception `,
				err.stack || err
			);
			// Safely close the WebSocket when an exception occurs
			safeCloseWebSocket(webSocket);
		});

	// Handle the special error case of Cloudflare's connection Socket
	// 1. Socket.closed will have an error
	// 2. Socket.readable will be closed, but there will be no data
	if (hasIncomingData === false && retry) {
		log(`retry`);
		retry(); // Call the retry function to attempt re-establishing the connection
	}
}

/**
 * Convert Base64 encoded string to ArrayBuffer
 *
 * @param {string} base64Str Base64 encoded input string
 * @returns {{ earlyData: ArrayBuffer | undefined, error: Error | null }} Returns the decoded ArrayBuffer or error
 */
function base64ToArrayBuffer(base64Str) {
	// If the input is empty, return an empty result
	if (!base64Str) {
		return { earlyData: undefined, error: null };
	}
	try {
		// Go language uses a URL-safe variant of Base64 (RFC 4648)
		// This variant uses '-' and '_' instead of the standard Base64 '+' and '/'
		// JavaScript's atob function does not directly support this variant, so we need to convert it first
		base64Str = base64Str.replace(/-/g, '+').replace(/_/g, '/');

		// Use the atob function to decode the Base64 string
		// atob converts a Base64 encoded ASCII string to the original binary string
		const decode = atob(base64Str);

		// Convert the binary string to a Uint8Array
		// This is done by iterating over each character in the string and getting its Unicode code value (0-255)
		const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));

		// Return the underlying ArrayBuffer of the Uint8Array
		// This is the actual binary data, which can be used for network transmission or other binary operations
		return { earlyData: arryBuffer.buffer, error: null };
	} catch (error) {
		// If there is an error at any step (such as invalid Base64 characters), return the error
		return { earlyData: undefined, error };
	}
}

/**
 * This is not a real UUID validation, but a simplified version
 * @param {string} uuid UUID string to validate
 * @returns {boolean} Returns true if the string matches the UUID format, otherwise returns false
 */
function isValidUUID(uuid) {
	// Define a regular expression to match the UUID format
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\$/i;

	// Use the regular expression to test the UUID string
	return uuidRegex.test(uuid);
}

// WebSocket's two important state constants
const WS_READY_STATE_OPEN = 1;	 // WebSocket is in the open state, can send and receive messages
const WS_READY_STATE_CLOSING = 2;  // WebSocket is in the closing process

function safeCloseWebSocket(socket) {
	try {
		// Only call close() if the WebSocket is in the open or closing state
		// This avoids calling close() on an already closed or connecting WebSocket
		if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
			socket.close();
		}
	} catch (error) {
		// Log any errors that may occur
		console.error('safeCloseWebSocket error', error);
	}
}

// Precompute the hexadecimal representation of each byte
const byteToHex = [];
for (let i = 0; i < 256; ++i) {
	// (i + 256).toString(16) ensures a two-digit hexadecimal representation
	// .slice(1) removes the leading '1' to get only the last two digits
	byteToHex.push((i + 256).toString(16).slice(1));
}

/**
 * Quickly convert a byte array to a UUID string without performing validity checks
 * This is a low-level function that directly manipulates bytes and does not perform any validity checks
 * @param {Uint8Array} arr Array containing UUID bytes
 * @param {number} offset Offset in the array where the UUID starts, default is 0
 * @returns {string} UUID string
 */
function unsafeStringify(arr, offset = 0) {
	// Directly get the hexadecimal representation of each byte from the lookup table and concatenate them to form a UUID string
	// The 8-4-4-4-12 format is achieved by carefully placing hyphens '-'
	// toLowerCase() ensures the entire UUID is in lowercase
	return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" +
		byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" +
		byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" +
		byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" +
		byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] +
		byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

/**
 * Convert a byte array to a UUID string and validate its format
 * This is a safe function that ensures the returned UUID string is valid
 * @param {Uint8Array} arr Array containing UUID bytes
 * @param {number} offset Offset in the array where the UUID starts, default is 0
 * @returns {string} Valid UUID string
 * @throws {TypeError} Throws an error if the generated UUID string is invalid
 */
function stringify(arr, offset = 0) {
	// Use the unsafe function to quickly generate a UUID string
	const uuid = unsafeStringify(arr, offset);
	// Validate the generated UUID string
	if (!isValidUUID(uuid)) {
		// Original: throw TypeError("Stringified UUID is invalid");
		throw TypeError(`Generated UUID does not conform to the specification ${uuid}`);
		//uuid = userID;
	}
	return uuid;
}

/**
 * Handle DNS query
 * @param {ArrayBuffer} udpChunk - Client-sent DNS query data
 * @param {ArrayBuffer} 维列斯ResponseHeader - 维列斯 protocol response header
 * @param {(string)=> void} log - Logging function
 */
async function handleDNSQuery(udpChunk, webSocket, 维列斯ResponseHeader, log) {
	// Regardless of which DNS server the client sends to, we use a hardcoded DNS server
	// Because some DNS servers do not support DNS over TCP
	try {
		// Use Google's DNS server (note: after Cloudflare fixes the issue of connecting to its own IP, it will be changed to 1.1.1.1)
		const dnsServer = '8.8.4.4'; // In Cloudflare, after fixing the bug of connecting to its own IP, it will be changed to 1.1.1.1
		const dnsPort = 53; // Standard port for DNS service

		let 维列斯Header = 维列斯ResponseHeader; // Save the 维列斯 response header to send it later

		// Connect to the specified DNS server
		const tcpSocket = connect({
			hostname: dnsServer,
			port: dnsPort,
		});

		log(`Connected to ${dnsServer}:${dnsPort}`); // Log connection information
		const writer = tcpSocket.writable.getWriter();
		await writer.write(udpChunk); // Send the client's DNS query data to the DNS server
		writer.releaseLock(); // Release the writer to allow other parts to use it

		// Send the DNS server's response data back to the client via WebSocket
		await tcpSocket.readable.pipeTo(new WritableStream({
			async write(chunk) {
				if (webSocket.readyState === WS_READY_STATE_OPEN) {
					if (维列斯Header) {
						// If there is a 维列斯 header, concatenate it with the DNS response data and send it
						webSocket.send(await new Blob([维列斯Header, chunk]).arrayBuffer());
						维列斯Header = null; // Set the header to null after sending it once
					} else {
						// Otherwise, send the DNS response data directly
						webSocket.send(chunk);
					}
				}
			},
			close() {
				log(`DNS server(${dnsServer}) TCP connection closed`); // Log connection closure information
			},
			abort(reason) {
				console.error(`DNS server(${dnsServer}) TCP connection aborted`, reason); // Log abnormal closure reason
			},
		}));
	} catch (error) {
		// Catch and log any errors that may occur
		console.error(
			`handleDNSQuery function encountered an error, error message: ${error.message}`
		);
	}
}

/**
 * Establish a SOCKS5 proxy connection
 * @param {number} addressType Target address type (1: IPv4, 2: domain name, 3: IPv6)
 * @param {string} addressRemote Target address (can be IP or domain name)
 * @param {number} portRemote Target port
 * @param {function} log Logging function
 */
async function socks5Connect(addressType, addressRemote, portRemote, log) {
	const { username, password, hostname, port } = parsedSocks5Address;
	// Connect to the SOCKS5 proxy server
	const socket = connect({
		hostname, // SOCKS5 server hostname
		port,	// SOCKS5 server port
	});

	// Request header format (Worker -> SOCKS5 server):
	// +----+----------+----------+
	// |VER | NMETHODS | METHODS  |
	// +----+----------+----------+
	// | 1  |	1	 | 1 to 255 |
	// +----+----------+----------+

	// https://en.wikipedia.org/wiki/SOCKS#SOCKS5
	// METHODS field meaning:
	// 0x00 no authentication required
	// 0x02 username/password authentication https://datatracker.ietf.org/doc/html/rfc1929
	const socksGreeting = new Uint8Array([5, 2, 0, 2]);
	// 5: SOCKS5 version number, 2: number of supported authentication methods, 0 and 2: two authentication methods (no authentication and username/password)

	const writer = socket.writable.getWriter();

	await writer.write(socksGreeting);
	log('SOCKS5 greeting message sent');

	const reader = socket.readable.getReader();
	const encoder = new TextEncoder();
	let res = (await reader.read()).value;
	// Response format (SOCKS5 server -> Worker):
	// +----+--------+
	// |VER | METHOD |
	// +----+--------+
	// | 1  |   1	|
	// +----+--------+
	if (res[0] !== 0x05) {
		log(`SOCKS5 server version error: received ${res[0]}, expected 5`);
		return;
	}
	if (res[1] === 0xff) {
		log("Server does not accept any authentication methods");
		return;
	}

	// If the response is 0x0502, it means username/password authentication is required
	if (res[1] === 0x02) {
		log("SOCKS5 server requires authentication");
		if (!username || !password) {
			log("Please provide username and password");
			return;
		}
		// Authentication request format:
		// +----+------+----------+------+----------+
		// |VER | ULEN |  UNAME   | PLEN |  PASSWD  |
		// +----+------+----------+------+----------+
		// | 1  |  1   | 1 to 255 |  1   | 1 to 255 |
		// +----+------+----------+------+----------+
		const authRequest = new Uint8Array([
			1,				   // Authentication subprotocol version
			username.length,	// Username length
			...encoder.encode(username), // Username
			password.length,	// Password length
			...encoder.encode(password)  // Password
		]);
		await writer.write(authRequest);
		res = (await reader.read()).value;
		// Expected response is 0x0100, indicating successful authentication
		if (res[0] !== 0x01 || res[1] !== 0x00) {
			log("SOCKS5 authentication failed");
			return;
		}
	}

	// Request data format (Worker -> SOCKS5 server):
	// +----+-----+-------+------+----------+----------+
	// |VER | CMD |  RSV  | ATYP | DST.ADDR | DST.PORT |
	// +----+-----+-------+------+----------+----------+
	// | 1  |  1  | X'00' |  1   | Variable |	2	 |
	// +----+-----+-------+------+----------+----------+
	// ATYP: Address type
	// 0x01: IPv4 address
	// 0x03: Domain name
	// 0x04: IPv6 address
	// DST.ADDR: Target address
	// DST.PORT: Target port (network byte order)

	// addressType
	// 1 --> IPv4   address length = 4
	// 2 --> Domain name
	// 3 --> IPv6   address length = 16
	let DSTADDR;	// DSTADDR = ATYP + DST.ADDR
	switch (addressType) {
		case 1: // IPv4
			DSTADDR = new Uint8Array(
				[1, ...addressRemote.split('.').map(Number)]
			);
			break;
		case 2: // Domain name
			DSTADDR = new Uint8Array(
				[3, addressRemote.length, ...encoder.encode(addressRemote)]
			);
			break;
		case 3: // IPv6
			DSTADDR = new Uint8Array(
				[4, ...addressRemote.split(':').flatMap(x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)])]
			);
			break;
		default:
			log(`Invalid address type: ${addressType}`);
			return;
	}
	const socksRequest = new Uint8Array([5, 1, 0, ...DSTADDR, portRemote >> 8, portRemote & 0xff]);
	// 5: SOCKS5 version, 1: CONNECT request, 0: reserved field
	// ...DSTADDR: target address, portRemote >> 8 and & 0xff: convert the port to network byte order
	await writer.write(socksRequest);
	log('SOCKS5 request sent');

	res = (await reader.read()).value;
	// Response format (SOCKS5 server -> Worker):
	//  +----+-----+-------+------+----------+----------+
	// |VER | REP |  RSV  | ATYP | BND.ADDR | BND.PORT |
	// +----+-----+-------+------+----------+----------+
	// | 1  |  1  | X'00' |  1   | Variable |	2	 |
	// +----+-----+-------+------+----------+----------+
	if (res[1] === 0x00) {
		log("SOCKS5 connection established");
	} else {
		log("SOCKS5 connection establishment failed");
		return;
	}
	writer.releaseLock();
	reader.releaseLock();
	return socket;
}

/**
 * SOCKS5 proxy address parser
 * This function parses a SOCKS5 proxy address string to extract the username, password, hostname, and port number
 *
 * @param {string} address SOCKS5 proxy address, format can be:
 *   - "username:password@hostname:port" (with authentication)
 *   - "hostname:port" (no authentication)
 *   - "username:password@[ipv6]:port" (IPv6 address needs to be enclosed in square brackets)
 */
function socks5AddressParser(address) {
	// Split the address string using '@' to separate the authentication part and the server address part
	// reverse() is used to ensure that the latter part always contains the server address
	let [latter, former] = address.split("@").reverse();
	let username, password, hostname, port;

	// If the former part exists, it means authentication information is provided
	if (former) {
		const formers = former.split(":");
		if (formers.length !== 2) {
			throw new Error('Invalid SOCKS address format: authentication part must be in the format "username:password"');
		}
		[username, password] = formers;
	}

	// Parse the server address part
	const latters = latter.split(":");
	// Extract the port number (since IPv6 addresses also contain colons)
	port = Number(latters.pop());
	if (isNaN(port)) {
		throw new Error('Invalid SOCKS address format: port number must be a number');
	}

	// The remaining part is the hostname (can be domain name, IPv4 address, or IPv6 address)
	hostname = latters.join(":");

	// Handle the special case of IPv6 addresses
	// IPv6 addresses contain multiple colons, so they must be enclosed in square brackets, e.g., [2001:db8::1]
	const regex = /^$$
.*
$$\$/;
	if (hostname.includes(":") && !regex.test(hostname)) {
		throw new Error('Invalid SOCKS address format: IPv6 addresses must be enclosed in square brackets, e.g., [2001:db8::1]');
	}

	//if (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\$/.test(hostname)) hostname = `${atob('d3d3Lg==')}${hostname}${atob('LmlwLjA5MDIyNy54eXo=')}`;
	// Return the parsed result
	return {
		username,  // Username, undefined if not provided
		password,  // Password, undefined if not provided
		hostname,  // Hostname, can be domain name, IPv4 address, or IPv6 address
		port,	 // Port number, converted to number type
	}
}

/**
 * Restore the obfuscated information
 * This function replaces the placeholder user ID and hostname in the content with the actual values
 *
 * @param {string} content Content to process
 * @param {string} userID Actual user ID
 * @param {string} hostName Actual hostname
 * @param {boolean} isBase64 Whether the content is Base64 encoded
 * @returns {string} Content with restored actual information
 */
function 恢复伪装信息(content, userID, hostName, fakeUserID, fakeHostName, isBase64) {
	if (isBase64) content = atob(content);  // If the content is Base64 encoded, decode it first

	// Use regular expressions to globally replace all occurrences of the placeholder user ID and hostname with the actual values
	content = content.replace(new RegExp(fakeUserID, 'g'), userID)
		.replace(new RegExp(fakeHostName, 'g'), hostName);

	if (isBase64) content = btoa(content);  // If the original content was Base64 encoded, re-encode it

	return content;
}

/**
 * Double MD5 hash function
 * This function performs a double MD5 hash on the input text to enhance security
 * The second hash uses part of the result of the first hash as input
 *
 * @param {string} Text to hash
 * @returns {Promise<string>} Double MD5 hashed string in lowercase hexadecimal format
 */
async function 双重哈希(文本) {
	const 编码器 = new TextEncoder();

	const 第一次哈希 = await crypto.subtle.digest('MD5', 编码器.encode(文本));
	const 第一次哈希数组 = Array.from(new Uint8Array(第一次哈希));
	const 第一次十六进制 = 第一次哈希数组.map(字节 => 字节.toString(16).padStart(2, '0')).join('');

	const 第二次哈希 = await crypto.subtle.digest('MD5', 编码器.encode(第一次十六进制.slice(7, 27)));
	const 第二次哈希数组 = Array.from(new Uint8Array(第二次哈希));
	const 第二次十六进制 = 第二次哈希数组.map(字节 => 字节.toString(16).padStart(2, '0')).join('');

	return 第二次十六进制.toLowerCase();
}

async function 代理URL(代理网址, 目标网址) {
	const 网址列表 = await 整理(代理网址);
	const 完整网址 = 网址列表[Math.floor(Math.random() * 网址列表.length)];

	// Parse the target URL
	let 解析后的网址 = new URL(完整网址);
	console.log(解析后的网址);
	// Extract and possibly modify URL components
	let 协议 = 解析后的网址.protocol.slice(0, -1) || 'https';
	let 主机名 = 解析后的网址.hostname;
	let 路径名 = 解析后的网址.pathname;
	let 查询参数 = 解析后的网址.search;

	// Handle the pathname
	if (路径名.charAt(路径名.length - 1) == '/') {
		路径名 = 路径名.slice(0, -1);
	}
	路径名 += 目标网址.pathname;

	// Construct the new URL
	let 新网址 = `${协议}://${主机名}${路径名}${查询参数}`;

	// Reverse proxy request
	let 响应 = await fetch(新网址);

	// Create a new response
	let 新响应 = new Response(响应.body, {
		status: 响应.status,
		statusText: 响应.statusText,
		headers: 响应.headers
	});

	// Add custom headers, including the URL information
	//New Response.headers.set('X-Proxied-By', 'Cloudflare Worker');
	//New Response.headers.set('X-Original-URL', Full URL);
	新响应.headers.set('X-New-URL', 新网址);

	return 新响应;
}

const 啥啥啥_写的这是啥啊 = atob('ZG14bGMzTT0=');
function 配置信息(UUID, 域名地址) {
	const 协议类型 = atob(啥啥啥_写的这是啥啊);

	const 别名 = FileName;
	let 地址 = 域名地址;
	let 端口 = 443;

	const 用户ID = UUID;
	const 加密方式 = 'none';

	const 传输层协议 = 'ws';
	const 伪装域名 = 域名地址;
	const 路径 = path;

	let 传输层安全 = ['tls', true];
	const SNI = 域名地址;
	const 指纹 = 'randomized';

	if (域名地址.includes('.workers.dev')) {
		地址 = atob('dmlzYS5jbg==');
		端口 = 80;
		传输层安全 = ['', false];
	}

	const 威图瑞 = `${协议类型}://${用户ID}@${地址}:${端口}\u003f\u0065\u006e\u0063\u0072\u0079` + 'p' + `${atob('dGlvbj0=') + 加密方式}\u0026\u0073\u0065\u0063\u0075\u0072\u0069\u0074\u0079\u003d${传输层安全[0]}&sni=${SNI}&fp=${指纹}&type=${传输层协议}&host=${伪装域名}&path=${encodeURIComponent(路径)}#${encodeURIComponent(别名)}`;
	const 猫猫猫 = `- {name: ${FileName}, server: ${地址}, port: ${端口}, type: ${协议类型}, uuid: ${用户ID}, tls: ${传输层安全[1]}, alpn: [h3], udp: false, sni: ${SNI}, tfo: false, skip-cert-verify: true, servername: ${伪装域名}, client-fingerprint: ${指纹}, network: ${传输层协议}, ws-opts: {path: "${路径}", headers: {${伪装域名}}}}`;
	return [威图瑞, 猫猫猫];
}

let subParams = ['sub', 'base64', 'b64', 'clash', 'singbox', 'sb'];
const cmad = decodeURIComponent(atob('dGVsZWdyYW0lMjAlRTQlQkElQTQlRTYlQjUlODElRTclQkUlQTQlMjAlRTYlOEElODAlRTYlOUMlQUYlRTUlQTQlQTclRTQlQkQlQUMlN0UlRTUlOUMlQTglRTclQkElQkYlRTUlOEYlOTElRTclODklOEMhJTNDYnIlM0UKJTNDYSUyMGhyZWYlM0QlMjdodHRwcyUzQSUyRiUyRnQubWUlMkZDTUxpdXNzc3MlMjclM0VodHRwcyUzQSUyRiUyRnQubWUlMkZDTUxpdXNzc3MlM0MlMkZhJTNFJTNDYnIlM0UKLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJTNDYnIlM0UKZ2l0aHViJTIwJUU5JUExJUI5JUU3JTlCJUFFJUU1JTlDJUIwJUU1JTlEJTgwJTIwU3RhciFTdGFyIVN0YXIhISElM0NiciUzRQolM0NhJTIwaHJlZiUzRCUyN2h0dHBzJTNBJTJGJTJGZ2l0aHViLmNvbSUyRmNtbGl1JTJGZWRnZXR1bm5lbCUyNyUzRWh0dHBzJTNBJTJGJTJGZ2l0aHViLmNvbSUyRmNtbGl1JTJGZWRnZXR1bm5lbCUzQyUyRmElM0UlM0NiciUzRQotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0lM0NiciUzRQolMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjMlMjM='));
/**
 * @param {string} userID
 * @param {string | null} hostName
 * @param {string} sub
 * @param {string} UA
 * @returns {Promise<string>}
 */
async function 生成配置信息(userID, hostName, sub, UA, RproxyIP, _url, fakeUserID, fakeHostName, env) {
	if (sub) {
		const match = sub.match(/^(?:https?:\/\/)?([^\/]+)/);
		if (match) {
			sub = match[1];
		}
		const subs = await 整理(sub);
		if (subs.length > 1) sub = subs[0];
	} else {
		if (env.KV) {
			await 迁移地址列表(env);
			const 优选地址列表 = await env.KV.get('ADD.txt');
			if (优选地址列表) {
				const 优选地址数组 = await 整理(优选地址列表);
				const 分类地址 = {
					接口地址: new Set(),
					链接地址: new Set(),
					优选地址: new Set()
				};

				for (const 元素 of 优选地址数组) {
					if (元素.startsWith('https://')) {
						分类地址.接口地址.add(元素);
					} else if (元素.includes('://')) {
						分类地址.链接地址.add(元素);
					} else {
						分类地址.优选地址.add(元素);
					}
				}

				addressesapi = [...分类地址.接口地址];
				link = [...分类地址.链接地址];
				addresses = [...分类地址.优选地址];
			}
		}

if ((addresses.length + addressesapi.length + addressesnotls.length + addressesnotlsapi.length + addressescsv.length) == 0) {
    // Define Cloudflare IP range CIDR list
    let cfips = [
        '103.21.244.0/23',
        '104.16.0.0/13',
        '104.24.0.0/14',
        '172.64.0.0/14',
        '103.21.244.0/23',
        '104.16.0.0/14',
        '104.24.0.0/15',
        '141.101.64.0/19',
        '172.64.0.0/14',
        '188.114.96.0/21',
        '190.93.240.0/21',
    ];

    // Generate a random IP address that matches the given CIDR range
    function generateRandomIPFromCIDR(cidr) {
        const [base, mask] = cidr.split('/');
        const baseIP = base.split('.').map(Number);
        const subnetMask = 32 - parseInt(mask, 10);
        const maxHosts = Math.pow(2, subnetMask) - 1;
        const randomHost = Math.floor(Math.random() * maxHosts);

        const randomIP = baseIP.map((octet, index) => {
            if (index < 2) return octet;
            if (index === 2) return (octet & (255 << (subnetMask - 8))) + ((randomHost >> 8) & 255);
            return (octet & (255 << subnetMask)) + (randomHost & 255);
        });

        return randomIP.join('.');
    }
    addresses = addresses.concat('127.0.0.1:1234#CFnat');
    if (hostName.includes(".workers.dev")) {
        addressesnotls = addressesnotls.concat(cfips.map(cidr => generateRandomIPFromCIDR(cidr) + '#CF随机节点'));
    } else {
        addresses = addresses.concat(cfips.map(cidr => generateRandomIPFromCIDR(cidr) + '#CF随机节点'));
    }
}
}

const uuid = (_url.pathname == `/${动态UUID}`) ? 动态UUID : userID;
const userAgent = UA.toLowerCase();
const Config = 配置信息(userID, hostName);
const v2ray = Config[0];
const clash = Config[1];
let proxyhost = "";
if (hostName.includes(".workers.dev")) {
    if (proxyhostsURL && (!proxyhosts || proxyhosts.length == 0)) {
        try {
            const response = await fetch(proxyhostsURL);

            if (!response.ok) {
                console.error('Error fetching addresses:', response.status, response.statusText);
                return; // Return immediately if there is an error
            }

            const text = await response.text();
            const lines = text.split('\n');
            // Filter out empty lines or lines containing only whitespace
            const nonEmptyLines = lines.filter(line => line.trim() !== '');

            proxyhosts = proxyhosts.concat(nonEmptyLines);
        } catch (error) {
            //console.error('Error fetching addresses:', error);
        }
    }
    if (proxyhosts.length != 0) proxyhost = proxyhosts[Math.floor(Math.random() * proxyhosts.length)] + "/";
}

if (userAgent.includes('mozilla') && !subParams.some(_searchParams => _url.searchParams.has(_searchParams))) {
    const newSocks5s = socks5s.map(socks5Address => {
        if (socks5Address.includes('@')) return socks5Address.split('@')[1];
        else if (socks5Address.includes('//')) return socks5Address.split('//')[1];
        else return socks5Address;
    });

    let socks5List = '';
    if (go2Socks5s.length > 0 && enableSocks) {
        socks5List = `${decodeURIComponent('SOCKS5%EF%BC%88%E7%99%BD%E5%90%8D%E5%8D%95%EF%BC%89%3A%20')}`;
        if (go2Socks5s.includes(atob('YWxsIGlu')) || go2Socks5s.includes(atob('Kg=='))) socks5List += `${decodeURIComponent('%E6%89%80%E6%9C%89%E6%B5%81%E9%87%8F')}<br>`;
        else socks5List += `<br>&nbsp;&nbsp;${go2Socks5s.join('<br>&nbsp;&nbsp;')}<br>`;
    }

    let 订阅器 = '<br>';
    if (sub) {
        if (enableSocks) 订阅器 += `CFCDN（访问方式）: Socks5<br>&nbsp;&nbsp;${newSocks5s.join('<br>&nbsp;&nbsp;')}<br>${socks5List}`;
        else if (proxyIP && proxyIP != '') 订阅器 += `CFCDN（访问方式）: ProxyIP<br>&nbsp;&nbsp;${proxyIPs.join('<br>&nbsp;&nbsp;')}<br>`;
        else if (RproxyIP == 'true') 订阅器 += `CFCDN（访问方式）: 自动获取ProxyIP<br>`;
        else 订阅器 += `CFCDN（访问方式）: 无法访问, 需要您设置 proxyIP/PROXYIP ！！！<br>`
        订阅器 += `<br>SUB（优选订阅生成器）: ${sub}`;
    } else {
        if (enableSocks) 订阅器 += `CFCDN（访问方式）: Socks5<br>&nbsp;&nbsp;${newSocks5s.join('<br>&nbsp;&nbsp;')}<br>${socks5List}`;
        else if (proxyIP && proxyIP != '') 订阅器 += `CFCDN（访问方式）: ProxyIP<br>&nbsp;&nbsp;${proxyIPs.join('<br>&nbsp;&nbsp;')}<br>`;
        else 订阅器 += `CFCDN（访问方式）: 无法访问, 需要您设置 proxyIP/PROXYIP ！！！<br>`;
        let 判断是否绑定KV空间 = '';
        if (env.KV) 判断是否绑定KV空间 = ` <a href='${_url.pathname}/edit'>编辑优选列表</a>`;
        订阅器 += `<br>您的订阅内容由 内置 addresses/ADD* 参数变量提供${判断是否绑定KV空间}<br>`;
        if (addresses.length > 0) 订阅器 += `ADD（TLS优选域名&IP）: <br>&nbsp;&nbsp;${addresses.join('<br>&nbsp;&nbsp;')}<br>`;
        if (addressesnotls.length > 0) 订阅器 += `ADDNOTLS（noTLS优选域名&IP）: <br>&nbsp;&nbsp;${addressesnotls.join('<br>&nbsp;&nbsp;')}<br>`;
        if (addressesapi.length > 0) 订阅器 += `ADDAPI（TLS优选域名&IP 的 API）: <br>&nbsp;&nbsp;${addressesapi.join('<br>&nbsp;&nbsp;')}<br>`;
        if (addressesnotlsapi.length > 0) 订阅器 += `ADDNOTLSAPI（noTLS优选域名&IP 的 API）: <br>&nbsp;&nbsp;${addressesnotlsapi.join('<br>&nbsp;&nbsp;')}<br>`;
        if (addressescsv.length > 0) 订阅器 += `ADDCSV（IPTest测速csv文件 限速 ${DLS} ）: <br>&nbsp;&nbsp;${addressescsv.join('<br>&nbsp;&nbsp;')}<br>`;
    }

    if (动态UUID && _url.pathname !== `/${动态UUID}`) 订阅器 = '';
    else 订阅器 += `<br>SUBAPI（订阅转换后端）: ${subProtocol}://${subConverter}<br>SUBCONFIG（订阅转换配置文件）: ${subConfig}`;
    const 动态UUID信息 = (uuid != userID) ? `TOKEN: ${uuid}<br>UUIDNow: ${userID}<br>UUIDLow: ${userIDLow}<br>${userIDTime}TIME（动态UUID有效时间）: ${有效时间} 天<br>UPTIME（动态UUID更新时间）: ${更新时间} 时（北京时间）<br><br>` : `${userIDTime}`;
    const 节点配置页 = `
        ################################################################<br>
        Subscribe / sub 订阅地址, 点击链接自动 <strong>复制订阅链接</strong> 并 <strong>生成订阅二维码</strong> <br>
        ---------------------------------------------------------------<br>
        自适应订阅地址:<br>
        <a href="javascript:void(0)" onclick="copyToClipboard('https://${proxyhost}${hostName}/${uuid}?sub','qrcode_0')" style="color:blue;text-decoration:underline;cursor:pointer;">https://${proxyhost}${hostName}/${uuid}</a><br>
        <div id="qrcode_0" style="margin: 10px 10px 10px 10px;"></div>
        Base64订阅地址:<br>
        <a href="javascript:void(0)" onclick="copyToClipboard('https://${proxyhost}${hostName}/${uuid}?b64','qrcode_1')" style="color:blue;text-decoration:underline;cursor:pointer;">https://${proxyhost}${hostName}/${uuid}?b64</a><br>
        <div id="qrcode_1" style="margin: 10px 10px 10px 10px;"></div>
        clash订阅地址:<br>
        <a href="javascript:void(0)" onclick="copyToClipboard('https://${proxyhost}${hostName}/${uuid}?clash','qrcode_2')" style="color:blue;text-decoration:underline;cursor:pointer;">https://${proxyhost}${hostName}/${uuid}?clash</a><br>
        <div id="qrcode_2" style="margin: 10px 10px 10px 10px;"></div>
        singbox订阅地址:<br>
        <a href="javascript:void(0)" onclick="copyToClipboard('https://${proxyhost}${hostName}/${uuid}?sb','qrcode_3')" style="color:blue;text-decoration:underline;cursor:pointer;">https://${proxyhost}${hostName}/${uuid}?sb</a><br>
        <div id="qrcode_3" style="margin: 10px 10px 10px 10px;"></div>
        <strong><a href="javascript:void(0);" id="noticeToggle" onclick="toggleNotice()">实用订阅技巧∨</a></strong><br>
            <div id="noticeContent" class="notice-content" style="display: none;">
                <strong>1.</strong> 如您使用的是 PassWall、PassWall2 路由插件，订阅编辑的 <strong>用户代理(User-Agent)</strong> 设置为 <strong>PassWall</strong> 即可；<br>
                <br>
                <strong>2.</strong> 如您使用的是 SSR+ 路由插件，推荐使用 <strong>Base64订阅地址</strong> 进行订阅；<br>
                <br>
                <strong>3.</strong> 快速切换 <a href='${atob('aHR0cHM6Ly9naXRodWIuY29tL2NtbGl1L1dvcmtlclZsZXNzMnN1Yg==')}'>优选订阅生成器</a> 至：sub.google.com，您可将"?sub=sub.google.com"参数添加到链接末尾，例如：<br>
                &nbsp;&nbsp;https://${proxyhost}${hostName}/${uuid}<strong>?sub=sub.google.com</strong><br>
                <br>
                <strong>4.</strong> 快速更换 PROXYIP 至：proxyip.cmliussss.net:443，您可将"?proxyip=proxyip.cmliussss.net:443"参数添加到链接末尾，例如：<br>
                &nbsp;&nbsp; https://${proxyhost}${hostName}/${uuid}<strong>?proxyip=proxyip.cmliussss.net:443</strong><br>
                <br>
                <strong>5.</strong> 快速更换 SOCKS5 至：user:password@127.0.0.1:1080，您可将"?socks5=user:password@127.0.0.1:1080"参数添加到链接末尾，例如：<br>
                &nbsp;&nbsp;https://${proxyhost}${hostName}/${uuid}<strong>?socks5=user:password@127.0.0.1:1080</strong><br>
                <br>
                <strong>6.</strong> 如需指定多个参数则需要使用'&'做间隔，例如：<br>
                &nbsp;&nbsp;https://${proxyhost}${hostName}/${uuid}?sub=sub.google.com<strong>&</strong>proxyip=proxyip.cmliussss.net<br>
            </div>
        <script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"></script>
        <script>
        function copyToClipboard(text, qrcode) {
            navigator.clipboard.writeText(text).then(() => {
                alert('已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
            const qrcodeDiv = document.getElementById(qrcode);
            qrcodeDiv.innerHTML = '';
            new QRCode(qrcodeDiv, {
                text: text,
                width: 220, // Adjust width
                height: 220, // Adjust height
                colorDark: "#000000", // QR code color
                colorLight: "#ffffff", // Background color
                correctLevel: QRCode.CorrectLevel.Q, // Error correction level
                scale: 1 // Pixel granularity
            });
        }

        function toggleNotice() {
            const noticeContent = document.getElementById('noticeContent');
            const noticeToggle = document.getElementById('noticeToggle');
            if (noticeContent.style.display === 'none') {
                noticeContent.style.display = 'block';
                noticeToggle.textContent = '实用订阅技巧∧';
            } else {
                noticeContent.style.display = 'none';
                noticeToggle.textContent = '实用订阅技巧∨';
            }
        }
        </script>
        ---------------------------------------------------------------<br>
        ################################################################<br>
        ${FileName} 配置信息<br>
        ---------------------------------------------------------------<br>
        ${动态UUID信息}HOST: ${hostName}<br>
        UUID: ${userID}<br>
        FKID: ${fakeUserID}<br>
        UA: ${UA}<br>
        ${订阅器}<br>
        ---------------------------------------------------------------<br>
        ################################################################<br>
        v2ray<br>
        ---------------------------------------------------------------<br>
        <a href="javascript:void(0)" onclick="copyToClipboard('${v2ray}','qrcode_v2ray')" style="color:blue;text-decoration:underline;cursor:pointer;">${v2ray}</a><br>
        <div id="qrcode_v2ray" style="margin: 10px 10px 10px 10px;"></div>
        ---------------------------------------------------------------<br>
        ################################################################<br>
        clash-meta<br>
        ---------------------------------------------------------------<br>
        ${clash}<br>
        ---------------------------------------------------------------<br>
        ################################################################<br>
        ${cmad}
        `;
    return `<div style="font-size:13px;">${节点配置页}</div>`;
} else {
    if (typeof fetch != 'function') {
        return 'Error: fetch is not available in this environment.';
    }

    let newAddressesapi = [];
    let newAddressescsv = [];
    let newAddressesnotlsapi = [];
    let newAddressesnotlscsv = [];

    // If using the default domain name, change it to a workers domain name, the subscriber will add a proxy
    if (hostName.includes(".workers.dev")) {
        noTLS = 'true';
        fakeHostName = `${fakeHostName}.workers.dev`;
        newAddressesnotlsapi = await 整理优选列表(addressesnotlsapi);
        newAddressesnotlscsv = await 整理测速结果('FALSE');
    } else if (hostName.includes(".pages.dev")) {
        fakeHostName = `${fakeHostName}.pages.dev`;
    } else if (hostName.includes("worker") || hostName.includes("notls") || noTLS == 'true') {
        noTLS = 'true';
        fakeHostName = `notls${fakeHostName}.net`;
        newAddressesnotlsapi = await 整理优选列表(addressesnotlsapi);
        newAddressesnotlscsv = await 整理测速结果('FALSE');
    } else {
        fakeHostName = `${fakeHostName}.xyz`
    }
    console.log(`虚假HOST: ${fakeHostName}`);
    let url = `${subProtocol}://${sub}/sub?host=${fakeHostName}&uuid=${fakeUserID + atob('JmVkZ2V0dW5uZWw9Y21saXUmcHJveHlpcD0=') + RproxyIP}&path=${encodeURIComponent(path)}`;
    let isBase64 = true;

    if (!sub || sub == "") {
        if (hostName.includes('workers.dev')) {
            if (proxyhostsURL && (!proxyhosts || proxyhosts.length == 0)) {
                try {
                    const response = await fetch(proxyhostsURL);

                    if (!response.ok) {
                        console.error('Error fetching addresses:', response.status, response.statusText);
                        return; // Return immediately if there is an error
                    }

                    const text = await response.text();
                    const lines = text.split('\n');
                    // Filter out empty lines or lines containing only whitespace
                    const nonEmptyLines = lines.filter(line => line.trim() !== '');

                    proxyhosts = proxyhosts.concat(nonEmptyLines);
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                }
            }
            // Use Set object to deduplicate
            proxyhosts = [...new Set(proxyhosts)];
        }

        newAddressesapi = await 整理优选列表(addressesapi);
        newAddressescsv = await 整理测速结果('TRUE');
        url = `https://${hostName}/${fakeUserID + _url.search}`;
        if (hostName.includes("worker") || hostName.includes("notls") || noTLS == 'true') {
            if (_url.search) url += '&notls';
            else url += '?notls';
        }
        console.log(`虚假订阅: ${url}`);
    }

    if (!userAgent.includes(('CF-Workers-SUB').toLowerCase()) && !_url.searchParams.has('b64')  && !_url.searchParams.has('base64')) {
        if ((userAgent.includes('clash') && !userAgent.includes('nekobox')) || (_url.searchParams.has('clash') && !userAgent.includes('subconverter'))) {
            url = `${subProtocol}://${subConverter}/sub?target=clash&url=${encodeURIComponent(url)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=${subEmoji}&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
            isBase64 = false;
        } else if (userAgent.includes('sing-box') || userAgent.includes('singbox') || ((_url.searchParams.has('singbox') || _url.searchParams.has('sb')) && !userAgent.includes('subconverter'))) {
            url = `${subProtocol}://${subConverter}/sub?target=singbox&url=${encodeURIComponent(url)}&insert=false&config=${encodeURIComponent(subConfig)}&emoji=${subEmoji}&list=false&tfo=false&scv=true&fdn=false&sort=false&new_name=true`;
            isBase64 = false;
        }
    }

    try {
        let content;
        if ((!sub || sub == "") && isBase64 == true) {
            content = await 生成本地订阅(fakeHostName, fakeUserID, noTLS, newAddressesapi, newAddressescsv, newAddressesnotlsapi, newAddressesnotlscsv);
        } else {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': UA + atob('IENGLVdvcmtlcnMtZWRnZXR1bm5lbC9jbWxpdQ==')
                }
            });
            content = await response.text();
        }

        if (_url.pathname == `/${fakeUserID}`) return content;

        return 恢复伪装信息(content, userID, hostName, fakeUserID, fakeHostName, isBase64);

    } catch (error) {
        console.error('Error fetching content:', error);
        return `Error fetching content: ${error.message}`;
    }
}

async function 整理优选列表(api) {
    if (!api || api.length === 0) return [];

    let newapi = "";

    // Create an AbortController object to control the cancellation of fetch requests
    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort(); // Cancel all requests
    }, 2000); // Trigger after 2 seconds

    try {
        // Use Promise.allSettled to wait for all API requests to complete, whether they succeed or fail
        // Traverse the api array and initiate a fetch request for each API address
        const responses = await Promise.allSettled(api.map(apiUrl => fetch(apiUrl, {
            method: 'get',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;',
                'User-Agent': atob('Q0YtV29ya2Vycy1lZGdldHVubmVsL2NtbGl1')
            },
            signal: controller.signal // Add the AbortController signal to the fetch request to allow for cancellation if needed
        }).then(response => response.ok ? response.text() : Promise.reject())));

        // Traverse all responses
        for (const [index, response] of responses.entries()) {
            // Check if the response status is 'fulfilled', i.e., the request completed successfully
            if (response.status === 'fulfilled') {
                // Get the response content
                const content = await response.value;

                const lines = content.split(/\r?\n/);
                let 节点备注 = '';
                let 测速端口 = '443';

                if (lines[0].split(',').length > 3) {
                    const idMatch = api[index].match(/id=([^&]*)/);
                    if (idMatch) 节点备注 = idMatch[1];

                    const portMatch = api[index].match(/port=([^&]*)/);
                    if (portMatch) 测速端口 = portMatch[1];

                    for (let i = 1; i < lines.length; i++) {
                        const columns = lines[i].split(',')[0];
                        if (columns) {
                            newapi += `${columns}:${测速端口}${节点备注 ? `#${节点备注}` : ''}\n`;
                            if (api[index].includes('proxyip=true')) proxyIPPool.push(`${columns}:${测速端口}`);
                        }
                    }
                } else {
                    // Verify if the current apiUrl contains 'proxyip=true'
                    if (api[index].includes('proxyip=true')) {
                        // If the URL contains 'proxyip=true', add the content to proxyIPPool
                        proxyIPPool = proxyIPPool.concat((await 整理(content)).map(item => {
                            const baseItem = item.split('#')[0] || item;
                            if (baseItem.includes(':')) {
                                const port = baseItem.split(':')[1];
                                if (!httpsPorts.includes(port)) {
                                    return baseItem;
                                }
                            } else {
                                return `${baseItem}:443`;
                            }
                            return null; // Return null when the condition is not met
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
        // Clear the timeout set earlier, regardless of success or failure
        clearTimeout(timeout);
    }

    const newAddressesapi = await 整理(newapi);

    // Return the processed result
    return newAddressesapi;
}

async function 整理测速结果(tls) {
    if (!addressescsv || addressescsv.length === 0) {
        return [];
    }

    let newAddressescsv = [];

    for (const csvUrl of addressescsv) {
        try {
            const response = await fetch(csvUrl);

            if (!response.ok) {
                console.error('Error fetching CSV address:', response.status, response.statusText);
                continue;
            }

            const text = await response.text();// Use the correct character encoding to parse the text content
            let lines;
            if (text.includes('\r\n')) {
                lines = text.split('\r\n');
            } else {
                lines = text.split('\n');
            }

            // Check if the CSV header contains the required fields
            const header = lines[0].split(',');
            const tlsIndex = header.indexOf('TLS');

            const ipAddressIndex = 0;// Position of IP address in CSV header
            const portIndex = 1;// Position of port in CSV header
            const dataCenterIndex = tlsIndex + remarkIndex; // Data center is the field after TLS

            if (tlsIndex === -1) {
                console.error('CSV file missing required field');
                continue;
            }

            // Traverse CSV rows starting from the second row
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(',');
                const speedIndex = columns.length - 1; // Last field
                // Check if TLS is "TRUE" and speed is greater than DLS
                if (columns[tlsIndex].toUpperCase() === tls && parseFloat(columns[speedIndex]) > DLS) {
                    const ipAddress = columns[ipAddressIndex];
                    const port = columns[portIndex];
                    const dataCenter = columns[dataCenterIndex];

                    const formattedAddress = `${ipAddress}:${port}#${dataCenter}`;
                    newAddressescsv.push(formattedAddress);
                    if (csvUrl.includes('proxyip=true') && columns[tlsIndex].toUpperCase() == 'true' && !httpsPorts.includes(port)) {
                        // If the URL contains 'proxyip=true', add the content to proxyIPPool
                        proxyIPPool.push(`${ipAddress}:${port}`);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching CSV address:', error);
            continue;
        }
    }

    return newAddressescsv;
}

function 生成本地订阅(host, UUID, noTLS, newAddressesapi, newAddressescsv, newAddressesnotlsapi, newAddressesnotlscsv) {
    const regex = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[.*\]):?(\d+)?#?(.*)?$/;
    addresses = addresses.concat(newAddressesapi);
    addresses = addresses.concat(newAddressescsv);
    let notlsresponseBody;
    if (noTLS == 'true') {
        addressesnotls = addressesnotls.concat(newAddressesnotlsapi);
        addressesnotls = addressesnotls.concat(newAddressesnotlscsv);
        const uniqueAddressesnotls = [...new Set(addressesnotls)];

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

            let 伪装域名 = host;
            let 最终路径 = path;
            let 节点备注 = '';
            const 协议类型 = atob(啥啥啥_写的这是啥啊);

            const 维列斯Link = `${协议类型}://${UUID}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT1mdHlwZT13cyZob3N0PQ==') + 伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;

            return 维列斯Link;

        }).join('\n');

    }

    // Use Set object to deduplicate
    const uniqueAddresses = [...new Set(addresses)];

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

        let 伪装域名 = host;
        let 最终路径 = path;
        let 节点备注 = '';
        const matchingProxyIP = proxyIPPool.find(proxyIP => proxyIP.includes(address));
        if (matchingProxyIP) 最终路径 += `&proxyip=${matchingProxyIP}`;

        if (proxyhosts.length > 0 && (伪装域名.includes('.workers.dev'))) {
           最终路径 = `/${伪装域名}${最终路径}`;
           伪装域名 = proxyhosts[Math.floor(Math.random() * proxyhosts.length)];
           节点备注 = ` 已启用临时域名中转服务，请尽快绑定自定义域！`;
        }

        const 协议类型 = atob(啥啥啥_写的这是啥啊);
        const 维列斯Link = `${协议类型}://${UUID}@${address}:${port + atob('P2VuY3J5cHRpb249bm9uZSZzZWN1cml0eT10bHMmc25pPQ==') + 伪装域名}&fp=random&type=ws&host=${伪装域名}&path=${encodeURIComponent(最终路径)}#${encodeURIComponent(addressid + 节点备注)}`;

        return 维列斯Link;
    }).join('\n');

    let base64Response = responseBody; // Re-encode in Base64
    if (noTLS == 'true') base64Response += `\n${notlsresponseBody}`;
    if (link.length > 0) base64Response += '\n' + link.join('\n');
    return btoa(base64Response);
}

async function 整理(内容) {
    // Replace tabs, double quotes, single quotes, and newlines with commas
    // Then replace consecutive multiple commas with a single comma
    var 替换后的内容 = 内容.replace(/[	|"'\r\n]+/g, ',').replace(/,+/g, ',');

    // Remove leading and trailing commas (if any)
    if (替换后的内容.charAt(0) == ',') 替换后的内容 = 替换后的内容.slice(1);
    if (替换后的内容.charAt(替换后的内容.length - 1) == ',') 替换后的内容 = 替换后的内容.slice(0, 替换后的内容.length - 1);

    // Split the string by commas to get the address array
    const 地址数组 = 替换后的内容.split(',');

    return 地址数组;
}

async function sendMessage(type, ip, add_data = "") {
    if (!BotToken || !ChatID) return;

    try {
        let msg = "";
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        if (response.ok) {
            const ipInfo = await response.json();
            msg = `${type}\nIP: ${ip}\n国家: ${ipInfo.country}\n<tg-spoiler>城市: ${ipInfo.city}\n组织: ${ipInfo.org}\nASN: ${ipInfo.as}\n${add_data}`;
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

function isValidIPv4(address) {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(address);
}

function 生成动态UUID(密钥) {
    const 时区偏移 = 8; // Time zone offset from UTC for Beijing time +8 hours
    const 起始日期 = new Date(2007, 6, 7, 更新时间, 0, 0); // Fixed start date July 7, 2007, 3 AM
    const 一周的毫秒数 = 1000 * 60 * 60 * 24 * 有效时间;

    function 获取当前周数() {
        const 现在 = new Date();
        const 调整后的现在 = new Date(现在.getTime() + 时区偏移 * 60 * 60 * 1000);
        const 时间差 = Number(调整后的现在) - Number(起始日期);
        return Math.ceil(时间差 / 一周的毫秒数);
    }

    function 生成UUID(基础字符串) {
        const 哈希缓冲区 = new TextEncoder().encode(基础字符串);
        return crypto.subtle.digest('SHA-256', 哈希缓冲区).then((哈希) => {
            const 哈希数组 = Array.from(new Uint8Array(哈希));
            const 十六进制哈希 = 哈希数组.map(b => b.toString(16).padStart(2, '0')).join('');
            return `${十六进制哈希.substr(0, 8)}-${十六进制哈希.substr(8, 4)}-4${十六进制哈希.substr(13, 3)}-${(parseInt(十六进制哈希.substr(16, 2), 16) & 0x3f | 0x80).toString(16)}${十六进制哈希.substr(18, 2)}-${十六进制哈希.substr(20, 12)}`;
        });
    }

    const 当前周数 = 获取当前周数(); // Get the current week number
    const 结束时间 = new Date(起始日期.getTime() + 当前周数 * 一周的毫秒数);

    // Generate two UUIDs
    const 当前UUIDPromise = 生成UUID(密钥 + 当前周数);
    const 上一个UUIDPromise = 生成UUID(密钥 + (当前周数 - 1));

    // Format the expiration time
    const 到期时间UTC = new Date(结束时间.getTime() - 时区偏移 * 60 * 60 * 1000); // UTC time
    const 到期时间字符串 = `Expiration time (UTC): ${到期时间UTC.toISOString().slice(0, 19).replace('T', ' ')} (UTC+8): ${结束时间.toISOString().slice(0, 19).replace('T', ' ')}\n`;

    return Promise.all([当前UUIDPromise, 上一个UUIDPromise, 到期时间字符串]);
}

async function 迁移地址列表(env, txt = 'ADD.txt') {
    const 旧数据 = await env.KV.get(`/${txt}`);
    const 新数据 = await env.KV.get(txt);

    if (旧数据 && !新数据) {
        // Write to the new location
        await env.KV.put(txt, 旧数据);
        // Delete the old data
        await env.KV.delete(`/${txt}`);
        return true;
    }
    return false;
}

async function KV(request, env, txt = 'ADD.txt') {
    try {
        // Handle POST requests
        if (request.method === "POST") {
            if (!env.KV) return new Response("KV namespace not bound", { status: 400 });
            try {
                const content = await request.text();
                await env.KV.put(txt, content);
                return new Response("Save successful");
            } catch (error) {
                console.error('Error saving KV:', error);
                return new Response("Save failed: " + error.message, { status: 500 });
            }
        }

        // GET request part
        let content = '';
        let hasKV = !!env.KV;

        if (hasKV) {
            try {
                content = await env.KV.get(txt) || '';
            } catch (error) {
                console.error('Error reading KV:', error);
                content = 'Error reading data: ' + error.message;
            }
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preferred Subscription List</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        margin: 0;
                        padding: 15px; /* Adjust padding */
                        box-sizing: border-box;
                        font-size: 13px; /* Set global font size */
                    }
                    .editor-container {
                        width: 100%;
                        max-width: 100%;
                        margin: 0 auto;
                    }
                    .editor {
                        width: 100%;
                        height: 520px; /* Adjust height */
                        margin: 15px 0; /* Adjust margin */
                        padding: 10px; /* Adjust padding */
                        box-sizing: border-box;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 13px;
                        line-height: 1.5;
                        overflow-y: auto;
                        resize: none;
                    }
                    .save-container {
                        margin-top: 8px; /* Adjust margin */
                        display: flex;
                        align-items: center;
                        gap: 10px; /* Adjust gap */
                    }
                    .save-btn, .back-btn {
                        padding: 6px 15px; /* Adjust padding */
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    }
                    .save-btn {
                        background: #4CAF50;
                    }
                    .save-btn:hover {
                        background: #45a049;
                    }
                    .back-btn {
                        background: #666;
                    }
                    .back-btn:hover {
                        background: #555;
                    }
                    .save-status {
                        color: #666;
                    }
                    .notice-content {
                        display: none;
                        margin-top: 10px;
                        font-size: 13px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                ################################################################<br>
                ${FileName} Preferred Subscription List:<br>
                ---------------------------------------------------------------<br>
                &nbsp;&nbsp;<strong><a href="javascript:void(0);" id="noticeToggle" onclick="toggleNotice()">Notice∨</a></strong><br>
                <div id="noticeContent" class="notice-content">
                    ${decodeURIComponent(atob('JTA5JTA5JTA5JTA5JTA5JTNDc3Ryb25nJTNFMS4lM0MlMkZzdHJvbmclM0UlMjBBRERBUEklMjAlRTUlQTYlODIlRTYlOUUlOUMlRTYlOTglQUYlRTUlOEYlOEQlRTQlQkIlQTNJUCVFRiVCQyU4QyVFNSU4RiVBRiVFNCVCRCU5QyVFNCVBOCVCQVBST1hZSVAlRTclOUElODQlRTglQUYlOUQlRUYlQkMlOEMlRTYlQTAlQkMlRTUlQkMlOEYlRTQlQjglQkElMjAlRTUlOUMlQjAlRTUlOUQlODAlM0ElRTclQUIlQUYlRTUlOEYlQTMlMjMlRTUlQTQlODclRTYlQjMlQTgKSVB2NiVFNSU5QyVCMCVFNSU5RCU4MCVFOSU5QyU4MCVFOCVBNiU4MSVFNyU5NCVBNiU5QyVBQiVFNSVCMCVCRSVFRiVCQyU4QyVFNCVCRSU4QiVFNSVBNiU4MiVFRiVCQyU5QSUzQ2JyJTNFCiUwOSUwOSUwOSUwOSUwOSUyNm5ic3AlM0IlMjZuYnNwJTNCaHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGY21saXUlMkZXb3JrZXJWbGVzczJzdWIlMkZtYWluJTJGYWRkcmVzc2VzYXBpLnR4dCUzQ3N0cm9uZyUzRSUzRnByb3h5aXAlM0R0cnVlJTNDJTJGc3Ryb25nJTNFJTNDYnIlM0UlM0NiciUzRQolMDklMDklMDklMDklMDklM0NzdHJvbmclM0UyLiUzQyUyRnN0cm9uZyUzRSUyMEFEREFQSSUyMCVFNSVBNiU4MiVFNiU5RSU5QyVFNiU5OCVBRiUyMCUzQyUyRnN0cm9uZyUzRSUyMCVFNyU5QSU4NCUyMGNzdiUyMCVFNyVCQiU5MyVFNiU5RSU5QyVFNiU5NiU4NyVFNCVCQiVCNiVFRiVCQyU4QyVFNCVCRSU4QiVFNSVBNiU4MiVFRiVCQyU5QSUzQ2JyJTNFCiUwOSUwOSUwOSUwOSUwOSUyNm5ic3AlM0IlMjZuYnNwJTNCaHR0cHMlM0ElMkYlMkZyYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tJTJGY21saXUlMkZXb3JrZXJWbGVzczJzdWIlMkZtYWluJTJGQ2xvdWRmbGFyZVNwZWVkVGVzdC5jc3YlM0NiciUzRSUzQ2JyJTNFCiUwOSUwOSUwOSUwOSUwOSUyNm5ic3AlM0IlMjZuYnNwJTNCJTIwJUU1JUE2JTgyJUU5JTlDJTgwJUU2JThDJTg3JUU1JUFFJTlBJUU4JThBJTgyJUU3JTgyJUI5JUU1JUE0JTg3JUU2JUIzJUE4JUU1JThGJUFGJUU1JUIwJTg2JTIyJTNGaWQlM0RDRiVFNCVCQyU5OCVFOSU4MCU4OSUzQ3N0cm9uZyUzRSUzQ2JyJTNFJTNDYnIlM0UKJTA5JTA5JTA5JTA5JTA5JTI2bmJzcCUzQiUyNm5ic3AlM0ItJTIwJUU1JUE2JTgyJUU5JTlDJTgwJUU2JThDJTg3JUU1JUFFJTlBJUU4JThBJTgyJUU3JTgyJUI5JUU1JUE0JTg3JUU2JUIzJUE4JUU1JThGJUFGJUU1JUIwJTg2JTIyJTJGJTIwJUU1JUE2JTgyJUU5JTlDJTgwJUU2JThDJTg3JUU1JUFFJTlBJUU4JThBJTgyJUU3JTgyJUI5JUU1JUE0JTg3JUU2JUIzJUE4JUU1JThGJUFGJUU1JUIwJTg2JTIyJTNGaWQlM0RDRiVFNCVCQyU5OCVFOSU4MCU4OSUzQ3N0cm9uZyUzRSUyNiUzQyUyRnN0cm9uZyUzRXBvcnQlM0QyMDUzJTNDYnIlM0U='))}"
                        id="content">${content}</textarea>
                <div class="save-container">
                    <button class="back-btn" onclick="goBack()">Return to Configuration</button>
                    <button class="save-btn" onclick="saveContent(this)">Save</button>
                    <span class="save-status" id="saveStatus"></span>
                </div>
                <br>
                ################################################################<br>
                ${cmad}
                ` : '<p>KV namespace not bound</p>'}
            </div>

            <script>
            if (document.querySelector('.editor')) {
                let timer;
                const textarea = document.getElementById('content');
                const originalContent = textarea.value;

                function goBack() {
                    const currentUrl = window.location.href;
                    const parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
                    window.location.href = parentUrl;
                }

                function replaceFullwidthColon() {
                    const text = textarea.value;
                    textarea.value = text.replace(/：/g, ':');
                }

                function saveContent(button) {
                    try {
                        const updateButtonText = (step) => {
                            button.textContent = `Saving: ${step}`;
                        };
                        // Detect if the device is iOS
                        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

                        // Only execute replaceFullwidthColon on non-iOS devices
                        if (!isIOS) {
                            replaceFullwidthColon();
                        }
                        updateButtonText('Starting save');
                        button.disabled = true;
                        // Get textarea content and original content
                        const textarea = document.getElementById('content');
                        if (!textarea) {
                            throw new Error('Text editing area not found');
                        }
                        updateButtonText('Getting content');
                        let newContent;
                        let originalContent;
                        try {
                            newContent = textarea.value || '';
                            originalContent = textarea.defaultValue || '';
                        } catch (e) {
                            console.error('Error getting content:', e);
                            throw new Error('Unable to get edited content');
                        }
                        updateButtonText('Preparing status update function');
                        const updateStatus = (message, isError = false) => {
                            const statusElem = document.getElementById('saveStatus');
                            if (statusElem) {
                                statusElem.textContent = message;
                                statusElem.style.color = isError ? 'red' : '#666';
                            }
                        };
                        updateButtonText('Preparing button reset function');
                        const resetButton = () => {
                            button.textContent = 'Save';
                            button.disabled = false;
                        };
                        if (newContent !== originalContent) {
                            updateButtonText('Sending save request');
                            fetch(window.location.href, {
                                method: 'POST',
                                body: newContent,
                                headers: {
                                    'Content-Type': 'text/plain;charset=UTF-8'
                                },
                                cache: 'no-cache'
                            })
                            .then(response => {
                                updateButtonText('Checking response status');
                                if (!response.ok) {
                                    throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                updateButtonText('Updating save status');
                                const now = new Date().toLocaleString();
                                document.title = `Edit saved ${now}`;
                                updateStatus(`Saved ${now}`);
                            })
                            .catch(error => {
                                updateButtonText('Handling error');
                                console.error('Save error:', error);
                                updateStatus(`Save failed: ${error.message}`, true);
                            })
                            .finally(() => {
                                resetButton();
                            });
                        } else {
                            updateButtonText('Checking content change');
                            updateStatus('Content unchanged');
                            resetButton();
                        }
                    } catch (error) {
                        console.error('Error during save process:', error);
                        button.textContent = 'Save';
                        button.disabled = false;
                        const statusElem = document.getElementById('saveStatus');
                        if (statusElem) {
                            statusElem.textContent = `Error: ${error.message}`;
                            statusElem.style.color = 'red';
                        }
                    }
                }

                textarea.addEventListener('blur', saveContent);
                textarea.addEventListener('input', () => {
                    clearTimeout(timer);
                    timer = setTimeout(saveContent, 5000);
                });
            }

            function toggleNotice() {
                const noticeContent = document.getElementById('noticeContent');
                const noticeToggle = document.getElementById('noticeToggle');
                if (noticeContent.style.display === 'none' || noticeContent.style.display === '') {
                    noticeContent.style.display = 'block';
                    noticeToggle.textContent = 'Notice∧';
                } else {
                    noticeContent.style.display = 'none';
                    noticeToggle.textContent = 'Notice∨';
                }
            }

            // Initialize the display property of noticeContent
            document.addEventListener('DOMContentLoaded', () => {
                document.getElementById('noticeContent').style.display = 'none';
            });
            </script>
            </body>
            </html>
        `;

        return new Response(html, {
            headers: { "Content-Type": "text/html;charset=utf-8" }
        });
    } catch (error) {
        console.error('Error processing request:', error);
        return new Response("Server error: " + error.message, {
            status: 500,
            headers: { "Content-Type": "text/plain;charset=utf-8" }
        });
    }
}
