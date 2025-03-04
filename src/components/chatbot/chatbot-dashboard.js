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
const ChatbotDashboard = () => {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const handleMinimize = () => setMinimized(!minimized);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [chatMode, setChatMode] = useState('inactive')
    const [typingState, setTypingState] = useState(false)
    const [message, setMessage] = useState('')
    const [chatData, setChatData] = useState([
        { id: 1, message: "Hello, how can I help you today?", sender: "bot" },
    ]);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth", // Adds smooth scrolling
            });
        }
    }, [chatData]);

    const function1 = () => {
        console.log('message sent', message)
        if (!(message.trim())) return;
        if (chatMode !== 'active') {
            setChatMode('active')
        }
        setTypingState(true)
        setChatData((prevChatData) => [
            ...prevChatData,
            { id: prevChatData.length + 1, message, sender: "user" },
        ]);
        setMessage(""); // Clear input after sending
        response()
    }


    const response = () => {
        setTimeout(() => {
            setChatData((prevChatData) => [
                ...prevChatData,
                {
                    id: prevChatData.length + 1, // Use prevChatData.length to keep IDs correct
                    message: "Acknowledged... here is your response",
                    sender: "bot",
                },
            ]);
            setTypingState(false);
        }, 2000);
    }

    const preDefinedMessages = (message) => {
        setMessage(message)



        setTimeout(() => {
            console.log('message sent', message)
            if (!(message.trim())) return;
            if (chatMode !== 'active') {
                setChatMode('active')
            }
            setTypingState(true)
            setChatData((prevChatData) => [
                ...prevChatData,
                { id: prevChatData.length + 1, message, sender: "user" },
            ]);
            setMessage(""); // Clear input after sending
            response()
        }, 0);
    }









    return (
        <>
            {/* Floating Chat Button */}
            <Fab
                onClick={handleOpen}
                disableRipple
                sx={{
                    position: "fixed",
                    bottom: 19,
                    right: 19,
                    backgroundColor: 'transparent',
                    boxShadow: 'none',  // Removes the shadow
                    '&:hover': {
                        backgroundColor: 'transparent', // Prevents background change on hover
                        boxShadow: 'none', // Ensures no shadow on hover
                    }
                }}
            >
                <img src={BotModalIcon} alt="user" style={{ width: '80px', height: '80px' }} />
            </Fab>

            {/* Modal */}
            <Modal
                open={open}
                onClose={handleClose}
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
                            <ChatHeadingText>Supplier Profile</ChatHeadingText>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '10px',
                                justifyContent: 'center',
                                textAlign: 'center',


                            }}>
                                <IconButton onClick={handleMinimize} sx={{ color: "white" }}>
                                    <RemoveIcon />
                                </IconButton>
                                <IconButton onClick={handleClose} sx={{ color: "white" }}>
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
                                <IconButton onClick={handleMinimize} sx={{ color: "white" }}>
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
                            //overflowX: 'auto',
                            scrollbarWidth: 'none',
                            '&::-webkit-scrollbar': {
                                display: 'none',
                            },
                        }}>
                            <CustomOptionButton onClick={() => preDefinedMessages('how chatbot works?')}  >
                                <CustomOPtionText>how chatbot works?</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages('vendors services')}>
                                <CustomOPtionText>vendors services</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages('supplier profile')}>
                                <CustomOPtionText>supplier profile</CustomOPtionText>
                            </CustomOptionButton>
                            <CustomOptionButton onClick={() => preDefinedMessages('contractors')}>
                                <CustomOPtionText>contractors</CustomOPtionText>
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

                                    {chatData.map((item) => (
                                        <Box key={item.id} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignSelf: item.sender === 'bot' ? 'flex-start' : 'flex-end',
                                            width: '70%',
                                            paddingX: '15px',
                                        }}>
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: item.sender === 'bot' ? 'flex-start' : 'flex-end',
                                            }}>
                                                {item.sender === 'bot' && <>
                                                    <Box>
                                                        <img src={BotIcon} alt="user" />
                                                    </Box>
                                                    <ChatbotTime>Chatbot 02:12pm</ChatbotTime>
                                                </>}

                                                {item.sender === 'user' && <>
                                                    <ChatbotTime>visitor 02:12pm</ChatbotTime>
                                                </>}
                                            </Box>

                                            <Box sx={{
                                                width: '100%',
                                            }}>
                                                {item.sender === 'bot' ? (
                                                    <BotChatMessage>
                                                        <Typography>{item.message}</Typography>
                                                    </BotChatMessage>
                                                ) : (
                                                    <UserChatMessage>
                                                        <Typography sx={{
                                                            color: 'white',
                                                        }}>{item.message}</Typography>
                                                    </UserChatMessage>
                                                )}
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                width: '100%',
                                                justifyContent: item.sender === 'bot' ? 'flex-start' : 'flex-end',
                                                gap: '5px',
                                            }}>
                                                {
                                                    item.sender === 'bot' && <>
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

                                                {item.sender === 'user' && <>
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
                                chatMode={chatMode}
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value || '')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton disabled={!(message.trim())} onClick={function1}>
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





























































            </Modal>
        </>
    );
};



const ChatInput = styled(TextField)(({ chatMode }) => ({
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

export default ChatbotDashboard;