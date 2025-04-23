import { Fab, Modal, Box, IconButton, styled, TextField, Button, InputAdornment, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from '../../assets/images/chatbot/send-icon.png'
import RemoveIcon from '@mui/icons-material/Remove';
import OptionsIcon from '@mui/icons-material/MoreVert';
import BotIcon from '../../assets/images/chatbot/chatbot-profile-icon.png'
import BotModalIcon from '../../assets/images/chatbot/chatbot-modal-icon.png'
import BotOnlineIcon from '../../assets/images/chatbot/chatbot-online-icon.png'
import chatbotTypingLoader from '../../assets/images/chatbot/chatbot-typing-state.png'
import SimpleBar from 'simplebar-react'
import "simplebar-react/dist/simplebar.min.css";
import { useState, useRef, useEffect } from "react";
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
    const role = user.role.split('_')[0]

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
    getResponse,
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
                    boxShadow: 'none',  // Removes the shadow
                    '&:hover': {
                        backgroundColor: 'red', // Prevents background change on hover
                        boxShadow: 'none', // Ensures no shadow on hover
                    }
                }}
            >
                <img src={BotModalIcon} alt="user" style={{ width: '80px', height: '80px' }} />
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
                <>

                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                     display: role !== 'service' ? 'none' : 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '900px',
                    maxHeight: '40vh',
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
                            <ChatHeadingText>Vendor Profile</ChatHeadingText>
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
                                <img src={BotOnlineIcon} alt="user" />
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
                                <IconButton onClick={() => setIsAIAssistantOpen(false)} sx={{ color: "white" }}>
                                    <OptionsIcon />
                                </IconButton>
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
                                <CustomOPtionText>{chatData.chatSuggestions[0] || 'my bookings for this month'}</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[1] || 'my account')}>
                                <CustomOPtionText>{chatData.chatSuggestions[1] || 'my account'}</CustomOPtionText>
                            </CustomOptionButton>   
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[2] || 'supplier profile')}>
                                <CustomOPtionText> {chatData.chatSuggestions[2] || 'supplier profile'}</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages(chatData.chatSuggestions[3] || 'contractors')}>
                                <CustomOPtionText> {chatData.chatSuggestions[3] || 'contractors'}</CustomOPtionText>
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
                                                        {/* <img src={BotIcon} alt="user" /> */}
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
                                                                alt="Send"
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
                            <Typography>Typing <img src={chatbotTypingLoader} /> </Typography>
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
                                    if (e.key === 'Enter' && !e.shiftKey || message.trim() === '') {
                                        sendMessage()
                                    }
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={!(message.trim())} onClick={sendMessage}>
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

                            <ChatbotFooterText>By chatting, you agree to our privacy_policy.</ChatbotFooterText>



                        </Box>





                    </Box>












                </Box>

                <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                     display: role !== 'service' ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '900px',
                    maxHeight: '40vh',
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    border: '1px solid #E3E3E3',
                    padding: '20px',
                }}
                >
                    <Typography sx={{
                        fontFamily: 'Inter',
                        fontWeight: '500',
                        fontSize: '20px',
                        lineHeight: '30px',
                        letterSpacing: '0%',
                        color: 'red',
                    }}>Only Available to Vendors</Typography>
                </Box>

                </>















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
})

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
})

const BotChatMessage = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    padding: "16px 10px",
    borderRadius: '14px',
    border: '1px solid #E3E3E3',
})


const UserChatMessage = styled(Box)({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    background: 'linear-gradient(80.24deg, #034D92 12.46%, #0487D9 84.7%)',
    width: '100%',
    padding: "16px 10px",
    borderRadius: '14px',
    border: '1px solid #E3E3E3',
})

const ChatbotTime = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: '#646464',
})

const ChatHeadingText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: 'white',

})

const ChatbotFooterText = styled(Typography)({
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '30px',
    letterSpacing: '0%',
    color: '#667085',
})

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
                a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
            }}
        />
    );
};


export default ChatbotDashboard;