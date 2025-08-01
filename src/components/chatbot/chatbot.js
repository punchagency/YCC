import {
  Fab,
  Modal,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  styled,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SendIcon from "../../assets/images/chatbot/send-icon.png";
import BotIcon from "../../assets/images/chatbot/chatbot-profile-icon.png";
import chatbotTypingLoader from "../../assets/images/chatbot/chatbot-typing-state.png";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useState, useRef, useEffect } from "react";
import { DoneAll } from "@mui/icons-material";
import { useLandingPageAI } from "../../context/AIAssistant/landingPageAIContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Ensure you import KaTeX CSS for proper styling
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import OptionsIcon from "@mui/icons-material/MoreVert";
import BotModalIcon from "../../assets/images/chatbot/chatbot-modal-icon.png";
import BotOnlineIcon from "../../assets/images/chatbot/chatbot-online-icon.png";

const Chatbot = (props) => {
  const { isAIAssistantOpen: _, ...rest } = props;
  // Destructure only what we need, comment out unused variables
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    chatData,
    setChatData,
    typingState,
    message,
    setMessage,
    sendMessage,
    preDefinedMessages,
  } = useLandingPageAI();

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth", // Adds smooth scrolling
      });
    }
  }, [chatData]);

  function formatUtcTo12Hour(utcTimestamp) {
    const date = new Date(utcTimestamp);

    // Extract hours, minutes, and determine AM/PM
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format minutes to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${hours}:${formattedMinutes} ${amPm}`;
  }

  const [mobileChatbotOpen, setMobileChatbotOpen] = useState(false);
  const handleClose = () => {
    setMobileChatbotOpen(false);
  };

  const [mobileTyping, setMobileTyping] = useState(false);

  const sendMobileMessage = () => {
    if (!message.trim()) return;
    setMobileTyping(true);
    let previousChatData = { ...chatData };
    previousChatData.messages.push({ role: "user", content: message });
    setMessage("");
    setChatData(previousChatData);
    // Simulate AI response for now (will be replaced with API)
    setTimeout(() => {
      setChatData((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: "assistant",
            content: "Thank you for your message. This is a demo response.",
          },
        ],
      }));
      setMobileTyping(false);
    }, 1200);
  };

  // Add chatbotPulse keyframes for the pulsing animation if not already present
  useEffect(() => {
    if (!document.getElementById("chatbot-pulse-keyframes")) {
      const style = document.createElement("style");
      style.id = "chatbot-pulse-keyframes";
      style.innerHTML = `
          @keyframes chatbotPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.08); opacity: 0.85; }
            100% { transform: scale(1); opacity: 1; }
          }
        `;
      document.head.appendChild(style);
    }
  }, []);

  const [minimized, setMinimized] = useState(false);

  return (
    <>
      {/* Chatbot for wide screen */}
      <Container
        maxWidth="md"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
        {...rest}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            // overflowX: 'visible',
          }}
        >
          {/* Chat section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              backgroundColor: "white",
              flexDirection: "column",
            }}
          >
            {/* Chatbot header with close and minimize buttons */}
            {isAIAssistantOpen && !minimized && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  background:
                    "linear-gradient(79.56deg, #034D92 12.26%, #0487D9 71.92%)",
                  borderTopLeftRadius: "24px",
                  borderTopRightRadius: "24px",
                  borderTop: "1px solid #A6C2D4",
                  borderLeft: "1px solid #A6C2D4",
                  borderRight: "1px solid #A6C2D4",
                  padding: "8px 16px 8px 0",
                }}
              >
                <IconButton
                  onClick={() => setMinimized(true)}
                  sx={{ color: "white" }}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={() => setIsAIAssistantOpen(false)}
                  sx={{ color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {/* Minimized bar */}
            {isAIAssistantOpen && minimized && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background:
                    "linear-gradient(79.56deg, #034D92 12.26%, #0487D9 71.92%)",
                  borderRadius: "24px",
                  border: "1px solid #A6C2D4",
                  padding: "8px 20px",
                  cursor: "pointer",
                }}
                onClick={() => setMinimized(false)}
              >
                <Typography
                  sx={{ color: "white", fontWeight: 600, fontSize: 16 }}
                >
                  Chatbot (Click to restore)
                </Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAIAssistantOpen(false);
                  }}
                  sx={{ color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
            {/* Main chat section */}
            {isAIAssistantOpen && !minimized && (
              <Box
                sx={{
                  display: "flex",
                  height: "350px",
                  width: "100%",
                  backgroundColor: "#F3F3F3",
                  padding: "5px",
                  borderLeft: "1px solid #A6C2D4",
                  borderRight: "1px solid #A6C2D4",
                }}
              >
                <SimpleBar
                  style={{
                    maxHeight: "100%",
                    width: "100vw",
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
                    {chatData.messages.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignSelf:
                            item.role === "assistant"
                              ? "flex-start"
                              : "flex-end",
                          width: "70%",
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
                              <Box>
                                <img src={BotIcon} alt="Chatbot Icon" />
                              </Box>
                              <ChatbotTime>
                                Chatbot{" "}
                                {formatUtcTo12Hour(
                                  item.createdAt
                                    ? item.createdAt
                                    : new Date().toISOString()
                                )}
                              </ChatbotTime>
                            </>
                          )}

                          {item.role === "user" && (
                            <>
                              <ChatbotTime>
                                visitor{" "}
                                {formatUtcTo12Hour(
                                  item.createdAt
                                    ? item.createdAt
                                    : new Date().toISOString()
                                )}
                              </ChatbotTime>
                            </>
                          )}
                        </Box>

                        <Box
                          sx={{
                            width: "100%",
                          }}
                        >
                          {item.role === "assistant" ? (
                            <BotChatMessage>
                              <Typography>
                                {parseAIMessage(item.content)}
                              </Typography>
                            </BotChatMessage>
                          ) : (
                            <UserChatMessage>
                              <Typography
                                sx={{
                                  color: "white",
                                }}
                              >
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
                            <>
                              <Box>
                                <img
                                  src={SendIcon}
                                  alt="Send Icon"
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                  }}
                                />
                              </Box>
                              <ChatbotTime>sent</ChatbotTime>
                            </>
                          )}

                          {item.role === "user" && (
                            <>
                              <ChatbotTime>
                                <DoneAll
                                  sx={{ height: "13px", width: "13px" }}
                                />
                                Read
                              </ChatbotTime>
                            </>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </SimpleBar>
              </Box>
            )}

            {typingState && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  padding: "10px 30px",
                  borderLeft: "1px solid #A6C2D4",
                  borderRight: "1px solid #A6C2D4",
                  backgroundColor: "#F3F3F3",
                }}
              >
                <Typography>
                  Typing{" "}
                  <img src={chatbotTypingLoader} alt="Typing Indicator" />{" "}
                </Typography>
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
                isAIAssistantOpen={isAIAssistantOpen}
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
                      >
                        <img
                          src={SendIcon}
                          alt="Send"
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* List of buttons options */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                backgroundColor: "#F3F3F3",
                padding: "15px 20px 10px 20px",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
                borderLeft: "1px solid #A6C2D4",
                borderRight: "1px solid #A6C2D4",
                borderBottom: "1px solid #A6C2D4",
                gap: "10px",
                flexWrap: "nowrap",
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[0] || "how chatbot works?"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[0] || "how chatbot works?"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[1] || "vendors services"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[1] || "vendors services"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[2] || "supplier profile"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[2] || "supplier profile"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[3] || "contractors"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[3] || "contractors"}
                </CustomOPtionText>
              </CustomOptionButton>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Chatbot for mobile screen */}
      {!isAIAssistantOpen && (
        <Fab
          variant="extended"
          sx={{
            position: "fixed",
            bottom: 19,
            right: 19,
            display: {
              xs: "flex",
              md: "none",
            },
            backgroundColor: "transparent",
            boxShadow: "none", // Removes the shadow
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
          onClick={() => setIsAIAssistantOpen(true)}
          {...rest}
        >
          <img
            src={BotIcon}
            alt="Chatbot Button"
            style={{ width: "80px", height: "80px" }}
          />
        </Fab>
      )}
      <Modal
        open={isAIAssistantOpen}
        onClose={handleClose}
        aria-labelledby="chat-modal-title"
        aria-describedby="chat-modal-description"
        sx={{
          border: "none",
          display: {
            xs: "block",
            md: "none",
          },
        }}
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
            maxHeight: "85vh",
            minHeight: "200px",
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
            {/* Header section */}

            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
                bgcolor: "#034D92",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                paddingLeft: "20px",
              }}
            >
              <ChatHeadingText>Supplier Profile</ChatHeadingText>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "10px",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                <IconButton
                  onClick={() => setIsAIAssistantOpen(false)}
                  sx={{ color: "white" }}
                >
                  <RemoveIcon />
                </IconButton>
                <IconButton
                  onClick={() => setIsAIAssistantOpen(false)}
                  sx={{ color: "white" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

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
                <img src={BotOnlineIcon} alt="user" />
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
                    Chatbot
                  </Typography>
                  <Typography
                    sx={{ color: "white", padding: "0px", fontSize: "15px" }}
                  >
                    Support Agent
                  </Typography>
                </Box>
              </Box>

              <Box>
                <IconButton
                  onClick={() => setIsAIAssistantOpen(false)}
                  sx={{ color: "white" }}
                >
                  <OptionsIcon />
                </IconButton>
              </Box>
            </Box>

            {/* List of buttons options */}

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
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[0] || "how chatbot works?"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[0] || "how chatbot works?"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[1] || "vendors services"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[1] || "vendors services"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[2] || "supplier profile"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[2] || "supplier profile"}
                </CustomOPtionText>
              </CustomOptionButton>
              <CustomOptionButton
                onClick={() =>
                  preDefinedMessages(
                    chatData.chatSuggestions[3] || "contractors"
                  )
                }
              >
                <CustomOPtionText>
                  {" "}
                  {chatData.chatSuggestions[3] || "contractors"}
                </CustomOPtionText>
              </CustomOptionButton>
            </Box>

            {/* Main chat section */}

            <Box
              sx={{
                display: "flex",
                height: "250px",
                width: "100%",
                backgroundColor: "#F3F3F3",
                padding: "5px",
              }}
            >
              <SimpleBar
                style={{
                  maxHeight: "100%",
                  width: "100vw",
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
                    height: "300px",
                    backgroundColor: "#F3F3F3",
                  }}
                >
                  {chatData.messages.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignSelf:
                          item.role === "assistant" ? "flex-start" : "flex-end",
                        width: "70%",
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
                            <Box>
                              <img src={BotIcon} alt="user" />
                            </Box>
                            <ChatbotTime>
                              Chatbot{" "}
                              {formatUtcTo12Hour(
                                item.createdAt
                                  ? item.createdAt
                                  : new Date().toISOString()
                              )}
                            </ChatbotTime>
                          </>
                        )}

                        {item.role === "user" && (
                          <>
                            <ChatbotTime>
                              visitor{" "}
                              {formatUtcTo12Hour(
                                item.createdAt
                                  ? item.createdAt
                                  : new Date().toISOString()
                              )}
                            </ChatbotTime>
                          </>
                        )}
                      </Box>

                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        {item.role === "assistant" ? (
                          <BotChatMessage>
                            {mobileTyping && (
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                  mb: 2,
                                }}
                              >
                                <img
                                  src={chatbotTypingLoader}
                                  alt="Typing..."
                                  style={{ width: "40px", height: "40px" }}
                                />
                              </Box>
                            )}
                            <Typography>
                              {parseAIMessage(item.content)}
                            </Typography>
                          </BotChatMessage>
                        ) : (
                          <UserChatMessage>
                            <Typography
                              sx={{
                                color: "white",
                              }}
                            >
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
                          <>
                            <Box>
                              <img
                                src={SendIcon}
                                alt="Send"
                                style={{
                                  width: "10px",
                                  height: "10px",
                                }}
                              />
                            </Box>
                            <ChatbotTime>sent</ChatbotTime>
                          </>
                        )}

                        {item.role === "user" && (
                          <>
                            <ChatbotTime>
                              <DoneAll sx={{ height: "13px", width: "13px" }} />
                              Read
                            </ChatbotTime>
                          </>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </SimpleBar>
            </Box>

            {/* Typing state */}

            {typingState && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  padding: "10px 30px",
                  borderLeft: "1px solid #A6C2D4",
                  borderRight: "1px solid #A6C2D4",
                  backgroundColor: "#F3F3F3",
                }}
              >
                <Typography>
                  Typing{" "}
                  <img src={chatbotTypingLoader} alt="Typing Indicator" />{" "}
                </Typography>
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
                isAIAssistantOpen={isAIAssistantOpen}
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value || "")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={sendMobileMessage}
                        disabled={!message.trim()}
                      >
                        <img
                          src={SendIcon}
                          alt="Send"
                          style={{ width: "24px", height: "24px" }}
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
              <ChatbotFooterText>
                By chatting, you agree to our{" "}
                <a href="/privacy-policy" style={{ color: "inherit" }}>
                  Privacy Policy
                </a>
                .
              </ChatbotFooterText>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

const ChatInput = styled(TextField)(({ isAIAssistantOpen }) => ({
  width: "100%",
  backgroundColor: "white",
  borderTopLeftRadius: isAIAssistantOpen ? "0px" : "24px",
  borderTopRightRadius: isAIAssistantOpen ? "0px" : "24px",
  padding: "10px",
  borderTop: isAIAssistantOpen ? "none" : "1px solid #A6C2D4",
  borderLeft: "1px solid #A6C2D4",
  borderRight: "1px solid #A6C2D4",
  borderBottom: "none",
  outline: "none",
  //boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',

  // ✅ Correct way to style the placeholder
  "& .MuiInputBase-input::placeholder": {
    color: "#1E1E1E",
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
    letterSpacing: "0%",
  },

  // ✅ Fixes issue with the Send icon alignment
  "& .MuiOutlinedInput-root": {
    maxHeight: "36px", // ✅ Reduce input height
    padding: "0 10px", // ✅ Ensure text stays centered
    display: "flex",
    alignItems: "center", // ✅ Center text vertically
    "& fieldset": {
      border: "none",
    },
  },

  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));
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
        a: ({ node, children, ...props }) => (
          <a
            target="_blank"
            rel="noopener noreferrer"
            {...props}
            href={props.href}
            aria-label={props.href}
          >
            {children}
          </a>
        ),
      }}
    />
  );
};

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
  textAlign: "left",
  width: "100%",
  padding: "16px 10px",
  borderRadius: "14px",
  border: "1px solid #E3E3E3",
});

const UserChatMessage = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  textAlign: "left",
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

const ChatHeadingText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: "500",
  fontSize: "20px",
  lineHeight: "30px",
  letterSpacing: "0%",
  color: "white",
});

const ChatbotFooterText = styled(Typography)({
  fontFamily: "Inter",
  fontWeight: "400",
  fontSize: "12px",
  lineHeight: "30px",
  letterSpacing: "0%",
  color: "#667085",
});

export default Chatbot;
