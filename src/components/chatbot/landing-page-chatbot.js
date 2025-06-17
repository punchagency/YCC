import { Fab, Modal, Box, IconButton, styled, TextField, Button, InputAdornment, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '../../assets/images/chatbot/send-icon.png'
import RemoveIcon from '@mui/icons-material/Remove';
import OptionsIcon from '@mui/icons-material/MoreVert';

import BotModalIcon from '../../assets/images/chatbot/chatbot-modal-icon.png'
import BotOnlineIcon from '../../assets/images/chatbot/chatbot-online-icon.png'
import chatbotTypingLoader from '../../assets/images/chatbot/chatbot-typing-state.png'
import SimpleBar from 'simplebar-react'
import "simplebar-react/dist/simplebar.min.css";
import { useRef, useEffect, useState } from "react";
import { DoneAll } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 

const LandingPageChatbot = () => {
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [chatData, setChatData] = useState({
        messages: [],
        chatSuggestions: ["how to sign up", "available services", "vendor information", "contact support"]
    });
    const [typingState, setTypingState] = useState(false);
    const [message, setMessage] = useState('');

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            const scrollableNode = chatContainerRef.current.getScrollElement();
            if (scrollableNode) {
                scrollableNode.scrollTo({
                    top: scrollableNode.scrollHeight,
                    behavior: "smooth",
                });
            }
        }
    }, [chatData]);

    const sendMessage = async () => {
        if (!(message.trim())) return;
        if (!isAIAssistantOpen) {
            setIsAIAssistantOpen(true);
        }
        setTypingState(true);
        let previousChatData = { ...chatData };
        previousChatData.messages = [...previousChatData.messages, { role: 'user', content: message }];
        setChatData(previousChatData);
        setMessage("");
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: message })
            });
            const data = await response.json();
            setChatData(prev => ({
                ...prev,
                messages: [...prev.messages, { role: 'assistant', content: data.generated_text || "Sorry, I didn't get that." }]
            }));
        } catch (error) {
            setChatData(prev => ({
                ...prev,
                messages: [...prev.messages, { role: 'assistant', content: "Sorry, I couldn't connect to the AI service." }]
            }));
        }
        setTypingState(false);
    };

    const preDefinedMessages = async (predefinedMessage) => {
        if (!(predefinedMessage.trim())) return;
        if (!isAIAssistantOpen) {
            setIsAIAssistantOpen(true);
        }
        setTypingState(true);
        let previousChatData = { ...chatData };
        previousChatData.messages = [...previousChatData.messages, { role: 'user', content: predefinedMessage }];
        setChatData(previousChatData);
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: predefinedMessage })
            });
            const data = await response.json();
            setChatData(prev => ({
                ...prev,
                messages: [...prev.messages, { role: 'assistant', content: data.generated_text || "Sorry, I didn't get that." }]
            }));
        } catch (error) {
            setChatData(prev => ({
                ...prev,
                messages: [...prev.messages, { role: 'assistant', content: "Sorry, I couldn't connect to the AI service." }]
            }));
        }
        setTypingState(false);
    };

    const parseAIMessage = (message) => {
        return (
            <ReactMarkdown
                children={message} 
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
                    ul: ({ node, ...props }) => <ul style={{ paddingLeft: "20px" }} {...props} />, 
                    ol: ({ node, ...props }) => <ol style={{ paddingLeft: "20px" }} {...props} />,
                    li: ({ node, ...props }) => <li {...props} />, 
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props}>{props.children}</a>,
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
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    display: 'block',
                    animation: 'chatbotPulse 1.5s infinite',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        animation: 'chatbotPulse 0.7s infinite',
                        transform: 'scale(1.1)',
                        opacity: 0.9,
                    },
                    zIndex: 1300,
                }}
            >
                <img src={BotModalIcon} alt="Chat Bot" style={{ width: '80px', height: '80px' }} />
            </Fab>

            {/* Modal */}
            <Modal
                open={isAIAssistantOpen}
                onClose={() => setIsAIAssistantOpen(false)}
                aria-labelledby="chat-modal-title"
                aria-describedby="chat-modal-description"
                sx={{
                    border: 'none',
                }}
            >
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: {
                        xs: '97vw',
                        sm: '97vw',
                        md: '80vw',
                        lg: '900px',
                        xl: '900px',
                        '@media (max-width:1100px)': '97vw',
                    },
                    maxWidth: {
                        xs: '99vw',
                        sm: '99vw',
                        md: '900px',
                        lg: '900px',
                        xl: '900px',
                        '@media (max-width:1100px)': '99vw',
                    },
                    minWidth: {
                        xs: '280px',
                        sm: '320px',
                        md: '400px',
                        lg: '400px',
                        xl: '400px',
                        '@media (max-width:1100px)': '280px',
                    },
                    maxHeight: '85vh',
                    minHeight: '200px',
                }}>
                    {/* Chat section */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        flexDirection: 'column',
                    }}>
                        {/* Header section */}
                        <Box
                            sx={{
                                display: "flex",
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 1,
                                bgcolor: "#034D92",
                                borderTopLeftRadius: '24px',
                                borderTopRightRadius: '24px',
                                paddingLeft: '20px',
                            }}
                        >
                            <ChatHeadingText>Guest Profile</ChatHeadingText>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}>
                                <IconButton onClick={() => setIsAIAssistantOpen(false)} sx={{ color: "white" }}>
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton onClick={() => setIsAIAssistantOpen(false)} sx={{ color: "white" }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {/* subheader section */}
                        <Box
                            sx={{
                                display: "flex",
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: "space-between",
                                alignItems: "center",
                                p: 2,
                                background: "linear-gradient(79.56deg, #034D92 12.26%, #0487D9 71.92%)",
                            }}
                        >
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                            }}>
                                <img src={BotOnlineIcon} alt="Bot Online" />
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '3px',
                                }}>
                                    <Typography sx={{ color: 'white', padding: '0px', fontSize: '20px' }}>Chatbot</Typography>
                                    <Typography sx={{ color: 'white', padding: '0px', fontSize: '15px' }}>Support Agent</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Chat messages */}
                        <Box sx={{
                            width: '100%',
                            height: '300px',
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: '#f5f8fa',
                        }}>
                            <SimpleBar ref={chatContainerRef} style={{ height: '100%' }}>
                                {chatData.messages.map((item, index) => (
                                    <Box key={index} sx={{
                                        display: 'flex',
                                        justifyContent: item.role === 'assistant' ? 'flex-start' : 'flex-end',
                                        mb: 2,
                                    }}>
                                        <Box sx={{
                                            width: '100%',
                                        }}>
                                            {item.role === 'assistant' ? (
                                                <BotChatMessage>
                                                    <Typography>{parseAIMessage(item.content)}</Typography>
                                                </BotChatMessage>
                                            ) : (
                                                <UserChatMessage>
                                                    <Typography sx={{
                                                        color: 'white',
                                                    }}>{item.content}</Typography>
                                                </UserChatMessage>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                                {typingState && (
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                        mb: 2,
                                    }}>
                                        <BotChatMessage>
                                            <img src={chatbotTypingLoader} alt="Typing..." style={{ width: '40px', height: '40px' }} />
                                        </BotChatMessage>
                                    </Box>
                                )}
                            </SimpleBar>
                        </Box>

                        {/* Chat suggestions */}
                        <Box sx={{
                            width: '100%',
                            p: 2,
                            bgcolor: '#fff',
                            borderTop: '1px solid #e0e0e0',
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                mb: 2,
                            }}>
                                {chatData.chatSuggestions.map((suggestion, index) => (
                                    <Button
                                        key={index}
                                        variant="outlined"
                                        onClick={() => preDefinedMessages(suggestion)}
                                        sx={{
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            borderColor: '#0487D9',
                                            color: '#0487D9',
                                            '&:hover': {
                                                borderColor: '#034D92',
                                                backgroundColor: '#f5f8fa',
                                            },
                                        }}
                                    >
                                        {suggestion}
                                    </Button>
                                ))}
                            </Box>

                            {/* Message input */}
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                            }}>
                                <TextField
                                    fullWidth
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={sendMessage}>
                                                    <img src={SendIcon} alt="Send" style={{ width: '24px', height: '24px' }} />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '24px',
                                            backgroundColor: '#f5f8fa',
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

const ChatHeadingText = styled(Typography)({
    color: '#fff',
    fontSize: '20px',
    fontWeight: 600,
});

const BotChatMessage = styled(Box)({
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '12px 16px',
    maxWidth: '80%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

const UserChatMessage = styled(Box)({
    backgroundColor: '#0487D9',
    borderRadius: '16px',
    padding: '12px 16px',
    maxWidth: '80%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

export default LandingPageChatbot; 