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
import { useRef, useEffect } from "react";
import { DoneAll } from "@mui/icons-material";
import { useDashboardAI } from '../../context/AIAssistant/dashboardAIContext';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 
import { useUser } from "../../context/userContext";

const ChatbotDashboard = () => {
    const { user } = useUser();
    let role = 'guest';
    if (user) {
      if (typeof user.role === 'string') {
        role = user.role.split('_')[0];
      } else if (user.role && typeof user.role.name === 'string') {
        role = user.role.name.split('_')[0];
      }
    }

    const {
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        chatData,
        setChatData,
        typingState,
        setTypingState,
        message,
        setMessage,
        sendMessage,
        preDefinedMessages
    } = useDashboardAI();

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

    const chatSuggestions = {
        "admin": [
            "available vendors",
            "recent bookings",
            "recent orders",
            "recent complaints"
        ],
        "crew": [
            "my bookings for this month",
            "my account",
            "crew profile",
            "contractors"
        ],
        "guest": [
            "how to sign up",
            "available services",
            "vendor information",
            "contact support"
        ]
    }

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
                            <ChatHeadingText>{(role).charAt(0).toUpperCase() + role.slice(1)} Profile</ChatHeadingText>
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

                            <Box>
                                {/* <IconButton onClick={() => setIsAIAssistantOpen(false)} sx={{ color: "white" }}>
                                    <OptionsIcon />
                                </IconButton> */}
                            </Box>
                        </Box>

                        {/* List of buttons options */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            backgroundColor: '#F3F3F3',
                            padding: '15px 20px 10px 20px',
                            gap: '10px',
                            flexWrap: 'nowrap',
                            overflowX: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[0] || 'my bookings for this month')}  >
                                <CustomOPtionText>{chatData.chatSuggestions[0] || (chatSuggestions[role] && chatSuggestions[role][0]) || chatSuggestions.guest[0]}</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[1] || chatSuggestions[role]?.[1] || chatSuggestions.guest[1])}>
                                <CustomOPtionText>{chatData.chatSuggestions[1] || (chatSuggestions[role] && chatSuggestions[role][1]) || chatSuggestions.guest[1]}</CustomOPtionText>
                            </CustomOptionButton>   
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[2] || chatSuggestions[role]?.[2] || chatSuggestions.guest[2])}>
                                <CustomOPtionText> {chatData.chatSuggestions[2] || (chatSuggestions[role] && chatSuggestions[role][2]) || chatSuggestions.guest[2]}</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[3] || chatSuggestions[role]?.[3] || chatSuggestions.guest[3])}>
                                <CustomOPtionText> {chatData.chatSuggestions[3] || (chatSuggestions[role] && chatSuggestions[role][3]) || chatSuggestions.guest[3]}</CustomOPtionText>
                            </CustomOptionButton>
                        </Box>

                        {/* Main chat section */}
                        <Box sx={{
                            display: 'flex',
                            height: '250px',
                            width: '100%',
                            backgroundColor: '#F3F3F3',
                            padding: '5px'
                        }}>
                            <SimpleBar style={{ maxHeight: "100%", width: "100vw", overflowX: "hidden" }} scrollableNodeProps={{ ref: chatContainerRef }}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    height: '300px',
                                    backgroundColor: '#F3F3F3',
                                }}>

                                    {chatData.messages.map((item) => (
                                        <Box key={item.id} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignSelf: item.role === 'assistant' ? 'flex-start' : 'flex-end',
                                            width: '70%',
                                            paddingX: '15px',
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: item.role === 'assistant' ? 'flex-start' : 'flex-end',
                                            }}>
                                                {item.role === 'assistant' && <>
                                                    <Box>
                                                        {/* Bot icon would go here if needed */}
                                                    </Box>
                                                    <ChatbotTime>Chatbot {formatUtcTo12Hour(item.createdAt ? item.createdAt : new Date().toISOString())}</ChatbotTime>
                                                </>}

                                                {item.role === 'user' && <>
                                                    <ChatbotTime>visitor {formatUtcTo12Hour(item.createdAt ? item.createdAt : new Date().toISOString())}</ChatbotTime>
                                                </>}
                                            </Box>

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

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: item.role === 'assistant' ? 'flex-start' : 'flex-end',
                                                gap: '5px',
                                            }}>
                                                {
                                                    item.role === 'assistant' && <>
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
                                                }

                                                {item.role === 'user' && <>
                                                    <ChatbotTime><DoneAll sx={{ height: '13px', width: '13px' }} />Read</ChatbotTime>
                                                </>}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </SimpleBar>
                        </Box>

                        {/* Typing state */}
                        {typingState && <Box sx={{
                            display: 'flex',
                            width: '100%',
                            padding: '10px 30px',
                            borderLeft: '1px solid #A6C2D4',
                            borderRight: '1px solid #A6C2D4',
                            backgroundColor: '#F3F3F3'
                        }}>
                            <Typography>Typing <img src={chatbotTypingLoader} alt="Typing indicator" /> </Typography>
                        </Box>}

                        {/* Chat input */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            backgroundColor: 'transparent',
                        }}>
                            <ChatInput
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value || '')}
                                onKeyDown={(e) => {
                                    if ((e.key === 'Enter' && !e.shiftKey) || message.trim() === '') {
                                        sendMessage();
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={!message.trim()} onClick={sendMessage}>
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

                        {/* Footer text */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            backgroundColor: '#F3F3F3',
                            borderBottomLeftRadius: '24px',
                            borderBottomRightRadius: '24px',
                            padding: '10px',
                        }}>
                            <ChatbotFooterText>
                                By chatting, you agree to our <a href="/privacy-policy" style={{ color: 'inherit' }}>Privacy Policy</a>.
                            </ChatbotFooterText>
                        </Box>
                    </Box>
                </Box>

            </Modal>
        </>
    );
};

const ChatInput = styled(TextField)(() => ({
    width: '100%',
    backgroundColor: 'white',
    padding: '10px',
    borderBottom: 'none',
    outline: 'none',
    //boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',

    // ✅ Correct way to style the placeholder
    '& .MuiInputBase-input::placeholder': {
        color: '#1E1E1E',
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: '16px',
        lineHeight: '24px',
        letterSpacing: '0%',
    },

    // ✅ Fixes issue with the Send icon alignment
    '& .MuiOutlinedInput-root': {
        maxHeight: '36px', // ✅ Reduce input height
        padding: '0 10px', // ✅ Ensure text stays centered
        display: 'flex',
        alignItems: 'center', // ✅ Center text vertically
        '& fieldset': {
            border: 'none',
        },
    },

    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}));

const CustomOptionButton = styled(Button)({
    height: '50px',
    gap: '10px',
    borderRadius: '14px',
    borderWidth: '1px',
    padding: '10px',
    border: '1px solid #E3E3E3',
    backgroundColor: '#FFFFFF',
    textTransform: 'none',
    minWidth: '200px',
    flex: '0 0 auto',
    '&:hover': {
        backgroundColor: '#f0f0f0',
    },
});

const CustomOPtionText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0%',
    color: '#353535',
    textAlign: 'center',
    width: '100%',
    overflow: 'visible',
    textOverflow: 'clip',
    whiteSpace: 'nowrap',
});

const BotChatMessage = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    padding: "16px 10px",
    borderRadius: '14px',
    border: '1px solid #E3E3E3',
});

const UserChatMessage = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    background: 'linear-gradient(80.24deg, #034D92 12.46%, #0487D9 84.7%)',
    width: '100%',
    padding: "16px 10px",
    borderRadius: '14px',
    border: '1px solid #E3E3E3',
});

const ChatbotTime = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: '#646464',
});

const ChatHeadingText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: 'white',
});

const ChatbotFooterText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: '#667085',
});

// Add keyframes for chatbotPulse animation
if (typeof window !== 'undefined' && !document.getElementById('chatbotPulseKeyframes')) {
    const style = document.createElement('style');
    style.id = 'chatbotPulseKeyframes';
    style.innerHTML = `
        @keyframes chatbotPulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(4,135,217,0.4); }
            70% { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(4,135,217,0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(4,135,217,0); }
        }
    `;
    document.head.appendChild(style);
}

export default ChatbotDashboard;