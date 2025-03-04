import { Box, Container, Typography, TextField, Button, styled, InputAdornment, IconButton } from "@mui/material";
import SendIcon from '../../assets/images/chatbot/send-icon.png'
import BotIcon from '../../assets/images/chatbot/chatbot-profile-icon.png'
import chatbotTypingLoader from '../../assets/images/chatbot/chatbot-typing-state.png'
import SimpleBar from 'simplebar-react'
import "simplebar-react/dist/simplebar.min.css";
import { useState, useRef, useEffect } from "react";
import { DoneAll } from "@mui/icons-material";

const Chatbot = () => {

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
    <Container maxWidth="md">
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // overflowX: 'visible',
      }}>














        {/* Chat section */}

        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'white',
          flexDirection: 'column',
        }}>

          {/* Main chat section */}

          {chatMode === 'active' && <Box sx={{
            display: 'flex',
            height: '250px',
            width: '100%',
            backgroundColor: '#F3F3F3',
            padding: '5px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderTop: '1px solid #A6C2D4',
            borderLeft: '1px solid #A6C2D4',
            borderRight: '1px solid #A6C2D4',
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
                          <ChatbotTime><DoneAll sx={{height: '13px', width: '13px' }} />Read</ChatbotTime>
                        </>}
                    </Box>



                  </Box>
                ))}

              </Box>

            </SimpleBar>

          </Box>}







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


          {/* List of buttons options */}

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            backgroundColor: '#F3F3F3',
            padding: '15px 20px 10px 20px',
            borderBottomLeftRadius: '24px',
            borderBottomRightRadius: '24px',
            borderLeft: '1px solid #A6C2D4',
            borderRight: '1px solid #A6C2D4',
            borderBottom: '1px solid #A6C2D4',
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



        </Box>












      </Box>
    </Container>
  )
};

const ChatInput = styled(TextField)(({ chatMode }) => ({
  width: '100%',
  backgroundColor: 'white',
  borderTopLeftRadius: chatMode === 'active' ? '0px' : '24px',
  borderTopRightRadius: chatMode === 'active' ? '0px' : '24px',
  padding: '10px',
  borderTop: chatMode === 'active' ? 'none' : '1px solid #A6C2D4',
  borderLeft: '1px solid #A6C2D4',
  borderRight: '1px solid #A6C2D4',
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
  maxWidth: '200px',
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

export default Chatbot;
