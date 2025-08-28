import {
  Fab,
  Modal,
  Box,
  IconButton,
  styled,
  TextField,
  Button,
  InputAdornment,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendRounded from "@mui/icons-material/SendRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

import BotModalIcon from "../../assets/images/chatbot/chatbot-modal-icon.png";
import BotOnlineIcon from "../../assets/images/chatbot/chatbot-online-icon.png";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useRef, useEffect, useState, useCallback } from "react";
import { DoneAll } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { getResponseFromAI } from "../../services/AIAssistant/landingPageAIService";
import TypingDots from "./TypingDots";

const LandingPageChatbot = () => {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [chatData, setChatData] = useState({
    messages: [],
    chatSuggestions: [
      "What is YCC?",
      "How does YCC work?",
      "How to become a vendor?",
      "How to register as a supplier?",
      "How to become a crew member?",
      "Getting started guide",
    ],
  });
  const [typingState, setTypingState] = useState(false);
  const [message, setMessage] = useState("");

  const chatContainerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Robust scroll to bottom function (mirrors dashboard behavior)
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatData, typingState, scrollToBottom]);

  // Auto-scroll to bottom when modal opens
  useEffect(() => {
    if (isAIAssistantOpen) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      const timeouts = [0, 50, 150, 300, 500, 1000];
      timeouts.forEach((delay) => {
        scrollTimeoutRef.current = setTimeout(() => {
          scrollToBottom();
        }, delay);
      });
      if (chatContainerRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          scrollToBottom();
        });
        resizeObserver.observe(chatContainerRef.current);
        return () => {
          resizeObserver.disconnect();
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
        };
      }
    }
  }, [isAIAssistantOpen, scrollToBottom]);

  function formatUtcTo12Hour(utcTimestamp) {
    const date = new Date(utcTimestamp);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${formattedMinutes} ${amPm}`;
  }

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    const previousChatData = {
      ...chatData,
      messages: [...chatData.messages, { role: "user", content: message }],
    };
    setChatData(previousChatData);
    setMessage("");
    try {
      const updatedChat = await getResponseFromAI(previousChatData);
      setChatData(updatedChat);
    } catch (_error) {
      setChatData((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "Sorry, I couldn't connect to the AI service.",
          },
        ],
      }));
    } finally {
      setTypingState(false);
    }
  };

  const preDefinedMessages = async (predefinedMessage) => {
    if (!predefinedMessage.trim()) return;
    if (!isAIAssistantOpen) {
      setIsAIAssistantOpen(true);
    }
    setTypingState(true);
    const previousChatData = {
      ...chatData,
      messages: [
        ...chatData.messages,
        { role: "user", content: predefinedMessage },
      ],
    };
    setChatData(previousChatData);
    try {
      const updatedChat = await getResponseFromAI(previousChatData);
      setChatData(updatedChat);
    } catch (_error) {
      setChatData((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "Sorry, I couldn't connect to the AI service.",
          },
        ],
      }));
    } finally {
      setTypingState(false);
    }
  };

  const parseAIMessage = (message) => {
    return (
      <ReactMarkdown
        children={message}
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
          ul: ({ node, ...props }) => (
            <ul style={{ paddingLeft: "20px" }} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol style={{ paddingLeft: "20px" }} {...props} />
          ),
          li: ({ node, ...props }) => <li {...props} />,
          a: ({ node, ...props }) => (
            <a target="_blank" rel="noopener noreferrer" {...props}>
              {props.children}
            </a>
          ),
        }}
      />
    );
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        onClick={() => setIsAIAssistantOpen(true)}
        disableRipple
        sx={{
          position: "fixed",
          bottom: 19,
          right: 19,
          backgroundColor: "transparent",
          boxShadow: "none",
          display: "block",
          animation: "chatbotPulse 1.5s infinite",
          transition: "transform 0.3s ease, opacity 0.3s ease",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
            animation: "chatbotPulse 0.7s infinite",
            transform: "scale(1.1)",
            opacity: 0.9,
          },
          zIndex: 1300,
        }}
      >
        <img
          src={BotModalIcon}
          alt="Chat Bot"
          style={{ width: "80px", height: "80px" }}
        />
      </Fab>

      {/* Modal */}
      <Modal
        open={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
        sx={{
          border: "none",
        }}
        BackdropProps={{ sx: { backgroundColor: "rgba(3,77,146,0.24)" } }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: {
              xs: "97vw",
              sm: "97vw",
              md: "80vw",
              lg: "900px",
              xl: "900px",
              "@media (max-width:1100px)": "97vw",
            },
            maxWidth: {
              xs: "99vw",
              sm: "99vw",
              md: "900px",
              lg: "900px",
              xl: "900px",
              "@media (max-width:1100px)": "99vw",
            },
            minWidth: {
              xs: "280px",
              sm: "320px",
              md: "400px",
              lg: "400px",
              xl: "400px",
              "@media (max-width:1100px)": "280px",
            },
            height: "90vh",
            maxHeight: "90vh",
            minHeight: "60vh",
            borderRadius: "24px",
            overflow: "hidden",
          }}
        >
          {/* Chat section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              flexDirection: "column",
            }}
          >
            {/* subheader section */}
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                background:
                  "linear-gradient(79.56deg, #034D92 12.26%, #0487D9 71.92%)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img src={BotOnlineIcon} alt="Bot Online" />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <Typography
                    sx={{ color: "white", padding: "0px", fontSize: "20px" }}
                  >
                    Yacht Agent
                  </Typography>
                  <Typography
                    sx={{ color: "white", padding: "0px", fontSize: "15px" }}
                  >
                    AI assistant
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton
                  onClick={() => setIsAIAssistantOpen(false)}
                  sx={{ color: "white" }}
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            {/* List of buttons options (scrollable) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                width: "100%",
                backgroundColor: "#F3F3F3",
                padding: "15px 20px 10px 20px",
                gap: "10px",
                flexWrap: "nowrap",
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {Array.isArray(chatData.chatSuggestions) &&
                chatData.chatSuggestions.map((suggestion, index) => (
                  <CustomOptionButton
                    key={index}
                    onClick={() => preDefinedMessages(suggestion)}
                  >
                    <CustomOPtionText>{suggestion}</CustomOPtionText>
                  </CustomOptionButton>
                ))}
            </Box>

            {/* Main chat section */}
            <Box
              sx={{
                display: "flex",
                height: "55vh",
                width: "100%",
                backgroundColor: "#F3F3F3",
                padding: "5px",
              }}
            >
              <SimpleBar
                style={{
                  maxHeight: "100%",
                  width: "100%",
                  overflowX: "hidden",
                }}
                scrollableNodeProps={{ ref: chatContainerRef }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#F3F3F3",
                  }}
                >
                  {chatData.messages.length === 0 ? (
                    <Box
                      sx={{
                        width: "85%",
                        paddingX: "15px",
                        mt: 2,
                        alignSelf: "flex-start",
                      }}
                    >
                      <BotChatMessage>
                        <Typography sx={{ fontSize: 14, lineHeight: "20px" }}>
                          Welcome! I'm your AI assistant. Ask anything or tap a
                          suggestion above to get started.
                        </Typography>
                      </BotChatMessage>
                    </Box>
                  ) : (
                    chatData.messages.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignSelf:
                            item.role === "assistant"
                              ? "flex-start"
                              : "flex-end",
                          width: "85%",
                          paddingX: "15px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent:
                              item.role === "assistant"
                                ? "flex-start"
                                : "flex-end",
                          }}
                        >
                          {item.role === "assistant" && (
                            <>
                              <Box></Box>
                              <ChatbotTime>
                                Yacht Agent{" "}
                                {formatUtcTo12Hour(new Date().toISOString())}
                              </ChatbotTime>
                            </>
                          )}
                          {item.role === "user" && (
                            <>
                              <ChatbotTime>
                                you{" "}
                                {formatUtcTo12Hour(new Date().toISOString())}
                              </ChatbotTime>
                            </>
                          )}
                        </Box>

                        <Box sx={{ width: "100%" }}>
                          {item.role === "assistant" ? (
                            <BotChatMessage>
                              <Typography>
                                {parseAIMessage(item.content)}
                              </Typography>
                            </BotChatMessage>
                          ) : (
                            <UserChatMessage>
                              <Typography sx={{ color: "white" }}>
                                {item.content}
                              </Typography>
                            </UserChatMessage>
                          )}
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "100%",
                            justifyContent:
                              item.role === "assistant"
                                ? "flex-start"
                                : "flex-end",
                            gap: "5px",
                          }}
                        >
                          {item.role === "assistant" && (
                            <ChatbotTime>sent</ChatbotTime>
                          )}
                          {item.role === "user" && (
                            <ChatbotTime>
                              <DoneAll sx={{ height: "13px", width: "13px" }} />
                              Read
                            </ChatbotTime>
                          )}
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </SimpleBar>
            </Box>

            {/* Typing state */}
            {typingState && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  px: 2,
                  py: 1,
                  borderLeft: "1px solid #A6C2D4",
                  borderRight: "1px solid #A6C2D4",
                  backgroundColor: "#F3F3F3",
                }}
              >
                <Box sx={{ width: "85%", pl: "15px" }}>
                  <TypingDots />
                </Box>
              </Box>
            )}

            {/* Chat input */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                backgroundColor: "transparent",
              }}
            >
              <ChatInput
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value || "")}
                onKeyDown={(e) => {
                  if (
                    (e.key === "Enter" && !e.shiftKey) ||
                    message.trim() === ""
                  ) {
                    sendMessage();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        disabled={!message.trim()}
                        onClick={sendMessage}
                        disableRipple
                        sx={{
                          cursor: "pointer",
                          transition:
                            "background-color 0.2s ease, transform 0.15s ease",
                          "&:hover": {
                            backgroundColor: "rgba(4,135,217,0.08)",
                          },
                          "&:active": { transform: "scale(0.98)" },
                        }}
                      >
                        <SendRounded
                          sx={{ color: "#0487D9", width: 24, height: 24 }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Footer text */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#F3F3F3",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                padding: "10px",
              }}
            >
              <ChatbotFooterText
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  whiteSpace: "nowrap",
                }}
              >
                <InfoOutlined sx={{ fontSize: 14, color: "#9BBAD0" }} />
                AI may make mistakes. Consider checking important info.
              </ChatbotFooterText>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const ChatInput = styled(TextField)(() => ({
  width: "100%",
  backgroundColor: "white",
  padding: "10px",
  borderBottom: "none",
  outline: "none",
  "& .MuiInputBase-input::placeholder": {
    color: "#1E1E1E",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
  },
  "& .MuiOutlinedInput-root": {
    maxHeight: "36px",
    padding: "0 10px",
    display: "flex",
    alignItems: "center",
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));

const CustomOptionButton = styled(Button)({
  height: "50px",
  gap: "10px",
  borderRadius: "14px",
  borderWidth: "1px",
  padding: "10px",
  border: "1px solid #E3E3E3",
  backgroundColor: "#FFFFFF",
  textTransform: "none",
  minWidth: "200px",
  flex: "0 0 auto",
  "&:hover": {
    backgroundColor: "#f0f0f0",
  },
});

const CustomOPtionText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: "400",
  fontSize: "16px",
  lineHeight: "24px",
  letterSpacing: "0%",
  color: "#353535",
  textAlign: "center",
  width: "100%",
  overflow: "visible",
  textOverflow: "clip",
  whiteSpace: "nowrap",
});

const BotChatMessage = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  backgroundColor: "white",
  width: "100%",
  padding: "16px 10px",
  borderRadius: "14px",
  border: "1px solid #E3E3E3",
});

const UserChatMessage = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  background: "linear-gradient(80.24deg, #034D92 12.46%, #0487D9 84.7%)",
  width: "100%",
  padding: "16px 10px",
  borderRadius: "14px",
  border: "1px solid #E3E3E3",
});

const ChatbotTime = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "30px",
  letterSpacing: "0%",
  color: "#646464",
});

const ChatbotFooterText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "30px",
  letterSpacing: "0%",
  color: "#667085",
});

export default LandingPageChatbot;
