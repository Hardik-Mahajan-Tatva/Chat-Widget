(function () {
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
  };
  CONFIG.API_SESSION_URL = `${CONFIG.API_BASE_URL}/api/ChatSession/sessions`;
  CONFIG.API_SESSION_GET_URL_TEMPLATE = `${CONFIG.API_BASE_URL}/api/ChatSession/sessions/{sessionId}`;
  CONFIG.API_MESSAGE_URL_TEMPLATE = `${CONFIG.API_BASE_URL}/api/ChatSession/message`;

  const chatState = {
    isOpen: true,
    hasBeenOpened: false,
    sessionId: localStorage.getItem(CONFIG.LOCAL_STORAGE_KEY) || null,
    isLoadingHistory: false,
  };
  const elements = {};

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
          // Try to load session, but only create new session if loading fails
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

  function stripMetadata(messageText) {
    return messageText.replace(/\n\n\[Browser: .*?, OS: .*?\]$/, "").trim();
  }

  function getSenderType(senderInfo) {
    const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
    if (ipRegex.test(senderInfo)) {
      return "user";
    }
    return "bot";
  }

  function renderSessionHistory(messages) {
    if (!messages || messages.length === 0) return;

    elements.messages.innerHTML = "";

    messages.forEach((msg) => {
      const cleanMessage = stripMetadata(msg.message);
      const senderType = getSenderType(msg.sender);
      addMessage(cleanMessage, senderType);
    });
  }

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

  function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.className = "mychat-message bot typing-indicator";
    indicator.innerHTML = `<span></span><span></span><span></span>`;
    elements.messages.appendChild(indicator);
    elements.messages.scrollTop = elements.messages.scrollHeight;
    return indicator;
  }

  async function getIpAndLocationInfo() {
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) throw new Error(`IP API failed: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Could not fetch location info:", error);
      return { ip: "N/A", city: "N/A", region: "N/A", country_name: "N/A" };
    }
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = "Unknown";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome"))
      browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    return { browser: browser, platform: navigator.platform };
  }

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
          chatState.sessionId = null;
          return false;
        }
        throw new Error(`Failed to fetch session: ${response.status}`);
      }

      const sessionData = await response.json();
      renderSessionHistory(sessionData.messages);
      return true;
    } catch (error) {
      console.error("Error loading session history:", error);
      return false;
    } finally {
      typingIndicator.remove();
      chatState.isLoadingHistory = false;
    }
  }

  async function createChatSession() {
    const [locationInfo, browserInfo] = await Promise.all([
      getIpAndLocationInfo(),
      Promise.resolve(getBrowserInfo()),
    ]);

    const payload = {
      projectId: 2,
      personId: 1,
      userId: 1,
      countryId: 1,
      hostName: window.location.hostname,
      chatIpAddress: locationInfo.ip,
      operatingSystem: browserInfo.platform,
      browser: browserInfo.browser,
      chatSessionStatus: 1,
      isBotAnswered: true,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    const response = await fetch(CONFIG.API_SESSION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`Session creation failed: ${response.status}`);

    const sessionData = await response.json();
    console.log(sessionData);
    chatState.sessionId = sessionData.data.affectedId;
    localStorage.setItem(CONFIG.LOCAL_STORAGE_KEY, chatState.sessionId);

    console.log(`Chat session created with ID: ${chatState.sessionId}`);
  }

  async function postMessageToSession(payload) {
    if (!chatState.sessionId)
      throw new Error("Cannot send message, no active session ID.");

    const url = CONFIG.API_MESSAGE_URL_TEMPLATE; // no need to replace sessionId here

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`Sending message failed: ${response.status}`);

    console.log("Message sent successfully to backend.");
  }

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
        getIpAndLocationInfo(),
        Promise.resolve(getBrowserInfo()),
      ]);

      // Construct correct payload for API
      const payload = {
        chatSessionId: parseInt(chatState.sessionId),
        senderId: 1,
        senderType: 1,
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

  function init() {
    render();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
