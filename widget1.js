(function () {
  //#region Style

  const style = document.createElement("style");
  style.textContent = `
    @keyframes pulse {
	0% {
		transform: scale(1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	50% {
		transform: scale(1.05);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
	}

	100% {
		transform: scale(1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes typing-bounce {

	0%,
	80%,
	100% {
		transform: scale(0);
	}

	40% {
		transform: scale(1.0);
	}
}

.mychat-launcher {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	background: #00b67a;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	z-index: 9999;
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
	animation: pulse 2.5s infinite;
}

.mychat-launcher:hover {
	transform: scale(1.1);
	animation-play-state: paused;
}

.mychat-launcher.open {
	transform: rotate(90deg);
	animation: none;
}

.mychat-launcher svg {
	width: 32px;
	height: 32px;
	fill: white;
	transition: transform 0.3s ease;
}

.mychat-popup {
	position: fixed;
	bottom: 90px;
	right: 20px;
	width: 370px;
	max-width: 90vw;
	max-height: 70vh;
	background: #ffffff;
	border-radius: 15px;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	overflow: hidden;
	display: flex;
	flex-direction: column;
	z-index: 9999;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	transform: translateY(20px);
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease-out, transform 0.3s ease-out, visibility 0.3s;
}

.mychat-popup.open {
	opacity: 1;
	transform: translateY(0);
	visibility: visible;
}

.mychat-header {
	background: #00b67a;
	background-image: linear-gradient(to right, #00b67a, #009d6e);
	color: white;
	padding: 20px;
	font-size: 1.2em;
	font-weight: bold;
	text-align: center;
	position: relative;
}

.mychat-close-btn {
	position: absolute;
	top: 50%;
	right: 20px;
	transform: translateY(-50%);
	width: 24px;
	height: 24px;
	cursor: pointer;
	opacity: 0.8;
	transition: opacity 0.2s;
}

.mychat-close-btn:hover {
	opacity: 1;
}

.mychat-body {
	flex: 1;
	padding: 20px;
	overflow-y: auto;
	background-color: #f4f7f9;
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.mychat-message {
	display: flex;
	align-items: flex-end;
	max-width: 85%;
	animation: fadeIn 0.4s ease-in-out;
}

.mychat-message-content {
	padding: 10px 15px;
	border-radius: 18px;
	word-wrap: break-word;
	line-height: 1.4;
	white-space: pre-wrap;
}

.mychat-message.bot {
	align-self: flex-start;
}

.mychat-message.bot .mychat-message-content {
	background: #e9eef2;
	color: #2c3e50;
	border-bottom-left-radius: 4px;
}

.mychat-message.user {
	align-self: flex-end;
	flex-direction: row-reverse;
}

.mychat-message.user .mychat-message-content {
	background: #00b67a;
	color: white;
	border-bottom-right-radius: 4px;
}

.typing-indicator {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	background: #e9eef2;
	border-radius: 18px;
	border-bottom-left-radius: 4px;
}

.typing-indicator span {
	height: 8px;
	width: 8px;
	background-color: #9db2c2;
	border-radius: 50%;
	display: inline-block;
	margin: 0 2px;
	animation: typing-bounce 1.4s infinite;
}

.mychat-footer {
	padding: 15px 20px;
	display: flex;
	align-items: center;
	gap: 10px;
	border-top: 1px solid #e0e0e0;
	background: #fff;
}

.mychat-footer input {
	flex: 1;
	padding: 12px;
	border: 1px solid #ccc;
	border-radius: 20px;
	font-size: 1em;
	transition: border-color 0.2s;
}

.mychat-footer input:focus {
	border-color: #00b67a;
	outline: none;
}

.mychat-footer button {
	background: #00b67a;
	color: white;
	border: none;
	width: 44px;
	height: 44px;
	border-radius: 50%;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: background-color 0.2s;
}

.mychat-footer button:hover {
	background-color: #009d6e;
}
  `;
  document.head.appendChild(style);

  //#endregion

  //#region Constants

  const ICONS = {
    chat: `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>`,
    close: `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`,
    send: `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>`,
  };

  const CONFIG = {
    API_BASE_URL: "http://localhost:5093",
    HEADER_TITLE: "Welcome to Support 👋",
    WELCOME_MESSAGE: "Hi there! How can we help you today?",
    LOCAL_STORAGE_KEY: "mychat_session_id",
    LOCAL_STORAGE_KEY_USER: "mychat_session_id_user",
  };
  CONFIG.API_SESSION_URL = `${CONFIG.API_BASE_URL}/api/chat-messages`;
  CONFIG.API_SESSION_GET_URL_TEMPLATE = `${CONFIG.API_BASE_URL}/api/chat-messages/chatSessionId?chatSessionId={sessionId}`;
  CONFIG.API_MESSAGE_URL_TEMPLATE = `${CONFIG.API_BASE_URL}/api/chat-messages/message`;

  const chatState = {
    isOpen: true,
    hasBeenOpened: false,
    sessionId: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY) || null,
    userId: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY_USER) || null,
    isLoadingHistory: false,
  };
  const elements = {};

  //#endregion

  //#region Render

  function render() {
    const launcher = document.createElement("div");
    launcher.className = "mychat-launcher";
    launcher.innerHTML = ICONS.chat;
    document.body.appendChild(launcher);

    const popup = document.createElement("div");
    popup.className = "mychat-popup";
    popup.innerHTML = `
      <div class="mychat-header">
        ${CONFIG.HEADER_TITLE}
        <span class="mychat-close-btn">${ICONS.close}</span>
      </div>
      <div class="mychat-body"></div>
      <div class="mychat-footer">
        <input type="text" placeholder="Type a message..." />
        <button>${ICONS.send}</button>
      </div>
    `;
    document.body.appendChild(popup);

    elements.launcher = launcher;
    elements.popup = popup;
    elements.closeBtn = popup.querySelector(".mychat-close-btn");
    elements.messages = popup.querySelector(".mychat-body");
    elements.input = popup.querySelector("input");
    elements.sendBtn = popup.querySelector("button");
  }

  //#endregion

  //#region Toggle Chat

  async function toggleChat(isOpen) {
    chatState.isOpen = isOpen;
    if (isOpen) {
      elements.popup.classList.add("open");
      elements.launcher.classList.add("open");
      elements.launcher.innerHTML = ICONS.close;
      elements.input.focus();

      if (!chatState.hasBeenOpened) {
        chatState.hasBeenOpened = true;

        if (chatState.sessionId) {
          const loaded = await loadExistingSession();
          if (!loaded) {
            await createChatSession();
            setTimeout(() => addMessage(CONFIG.WELCOME_MESSAGE, "bot"), 300);
          }
        } else {
          await createChatSession();
          setTimeout(() => addMessage(CONFIG.WELCOME_MESSAGE, "bot"), 300);
        }
      }
    } else {
      elements.popup.classList.remove("open");
      elements.launcher.classList.remove("open");
      elements.launcher.innerHTML = ICONS.chat;
    }
  }

  //#endregion

  //#region Strip Metadata

  function stripMetadata(messageText) {
    return messageText.replace(/\n\n\[Browser: .*?, OS: .*?\]$/, "").trim();
  }

  //#endregion

  //#region Get Sender Type

  function getSenderType(senderInfo) {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipRegex.test(senderInfo)) {
      return "user";
    }
    return "bot";
  }

  //#endregion

  //#region RenderSessionHistory

  function renderSessionHistory(messages) {
    if (!messages || messages.length === 0) return;

    elements.messages.innerHTML = "";

    messages.forEach((msg) => {
      const cleanMessage = stripMetadata(msg.chatMessage);
      const senderType = msg.senderType === 1 ? "bot" : "user";
      addMessage(cleanMessage, senderType);
    });
  }

  //#endregion

  //#region Add Message

  function addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `mychat-message ${sender}`;
    const contentElement = document.createElement("div");
    contentElement.className = "mychat-message-content";
    contentElement.textContent = text;
    messageElement.appendChild(contentElement);
    elements.messages.appendChild(messageElement);
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  //#endregion

  //#region Show Typing Indicator

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "mychat-message bot typing-indicator";
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    elements.messages.appendChild(indicator);
    elements.messages.scrollTop = elements.messages.scrollHeight;
    return indicator;
  }

  //#endregion

  //#region Get Ip

  async function getIp() {
    try {
      const response = await fetch("https://ipwhois.app/json/");
      if (!response.ok) throw new Error(`IP API failed: ${response.status}`);
      const data = await response.json();
      return {
        ip: data.ip,
      };
    } catch (error) {
      console.error("Could not fetch location info:", error);
      return { ip: "N/A", city: "N/A", region: "N/A", country_name: "N/A" };
    }
  }

  //#endregion

  //#region Get Browser Info

  async function getBrowserInfo() {
    let browser = "Unknown";
    let platform = navigator.platform;

    if (navigator.userAgentData) {
      const brands = navigator.userAgentData.brands;
      const brandNames = brands.map((b) => b.brand);

      if (brandNames.includes("Brave")) browser = "Brave";
      else if (brandNames.includes("Chromium")) browser = "Chrome";
      else if (brandNames.includes("Microsoft Edge")) browser = "Edge";
      else if (brandNames.includes("Firefox")) browser = "Firefox";
      else if (brandNames.includes("Safari")) browser = "Safari";
    } else {
      const ua = navigator.userAgent;
      if (/Brave/i.test(ua)) browser = "Brave";
      else if (/Edg/i.test(ua)) browser = "Edge";
      else if (/Chrome/i.test(ua)) browser = "Chrome";
      else if (/Firefox/i.test(ua)) browser = "Firefox";
      else if (/Safari/i.test(ua)) browser = "Safari";
    }

    return { browser, platform };
  }

  //#endregion

  //#region Load Existing Session

  async function loadExistingSession() {
    if (!chatState.sessionId || chatState.isLoadingHistory) return false;

    chatState.isLoadingHistory = true;
    const typingIndicator = showTypingIndicator();
    const url = CONFIG.API_SESSION_GET_URL_TEMPLATE.replace(
      "{sessionId}",
      chatState.sessionId
    );

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) {
          localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY);
          localStorage.removeItem(CONFIG.LOCAL_STORAGE_KEY_USER);
          chatState.sessionId = null;
          return false;
        }
        throw new Error(`Failed to fetch session: ${response.status}`);
      }

      const sessionData = await response.json();
      console.log(sessionData);
      renderSessionHistory(sessionData.data);
      return true;
    } catch (error) {
      console.error("Error loading session history:", error);
      return false;
    } finally {
      typingIndicator.remove();
      chatState.isLoadingHistory = false;
    }
  }

  //#endregion

  //#region Create Chat Session

  async function createChatSession() {
    const [locationInfo, browserInfo] = await Promise.all([
      getIp(),
      Promise.resolve(getBrowserInfo()),
    ]);

    const payload = {
      projectId: 2,
      chatIpAddress: locationInfo.ip,
      operatingSystem: browserInfo.platform,
      browser: browserInfo.browser,
    };

    const response = await fetch(CONFIG.API_SESSION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`Session creation failed: ${response.status}`);

    const sessionData = await response.json();
    chatState.sessionId = sessionData.data.affectedId;
    chatState.userId = sessionData.data.message;
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, chatState.sessionId);
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY_USER, chatState.userId);

    console.log(`Chat session created with ID: ${chatState.sessionId}`);
  }

  //#endregion

  //#region Post Message To Session

  async function postMessageToSession(payload) {
    if (!chatState.sessionId)
      throw new Error("Cannot send message, no active session ID.");

    const url = CONFIG.API_MESSAGE_URL_TEMPLATE;

    const formData = new FormData();
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok)
      throw new Error(`Sending message failed: ${response.status}`);

    console.log("Message sent successfully to backend.");
  }

  //#endregion

  //#region  Handle Send Message

  async function handleSendMessage() {
    const text = elements.input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    elements.input.value = "";
    elements.input.focus();

    const typingIndicator = showTypingIndicator();

    try {
      if (!chatState.sessionId) {
        await createChatSession();
      }

      const [locationInfo, browserInfo] = await Promise.all([
        getIp(),
        Promise.resolve(getBrowserInfo()),
      ]);

      // Construct correct payload for API
      const payload = {
        chatSessionId: parseInt(chatState.sessionId),
        senderId: parseInt(chatState.userId),
        senderType: 2,
        message: text,
        messageType: 1,
        visibleTo: 0,
        isDeleted: false,
      };

      await postMessageToSession(payload);

      addMessage(
        "Thanks! We've received your message and will get back to you shortly.",
        "bot"
      );
    } catch (err) {
      console.error("Send message process failed:", err);
      addMessage(
        "Sorry, we couldn't send your message. Please try again later.",
        "bot"
      );
    } finally {
      typingIndicator.remove();
    }
  }

  //#endregion

  //#region  Bind Events

  function bindEvents() {
    elements.launcher.addEventListener("click", () =>
      toggleChat(!chatState.isOpen)
    );
    elements.closeBtn.addEventListener("click", () => toggleChat(false));
    elements.sendBtn.addEventListener("click", handleSendMessage);
    elements.input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  //#endregion

  //#region Default

  function init() {
    render();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);

  //#endregion
})();
