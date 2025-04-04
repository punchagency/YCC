import { Box, Typography, styled, LinearProgress, Button, Select } from "@mui/material";
import icon1 from "../../../../assets/images/icons/financial-management/Icon1.png";
import icon2 from "../../../../assets/images/icons/financial-management/Icon2.png";
import icon3 from "../../../../assets/images/icons/financial-management/Icon3.png";
import { useTheme } from "../../../../context/theme/themeContext";

const Section1FinancialManagement = () => {
  const { theme } = useTheme();
    const data = [
        {
            title: "Outstanding Invoices",
            value: "50,000",
            backgroundColor: "#E3E7FF",
            icon: icon1,
        },
        {
            title: "Completed Invoices",
            value: "120,000",
            backgroundColor: "#FFFFD0",
            icon: icon2,
        },
        {
            title: "Total Invoices",    
            value: "170,000",
            backgroundColor: "#E0F1E0",
            icon: icon3,
        }
    ]

  return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "15px",
          width: "100%",
          height: "160px",
          padding: "20px",
        }}
      > 
        {data.map((item, index) => (
            <Box
                key={index}
                sx={{
                    backgroundColor: item.backgroundColor,
                    borderRadius: "8px",
                    padding: "17px",
                    height: "100%",
            width: "100%",
            alignContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0px",
              textAlign: "start",
            }}
          >
            <img src={item.icon} alt={item.title} style={{ width: "25px", height: "25px", marginBottom: "5px" }} />
              <DashBoardTitleText>{item.title}</DashBoardTitleText>
              <DashBoardDescriptionText>${item.value}</DashBoardDescriptionText>
        
          </Box>
        </Box>
        ))}

      </Box>
 
  );
};

export const DashBoardTitleText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "17px",
    lineHeight: "32px",
    letterSpacing: "0px",
    color: "#212121",
    padding: "0px",
    margin: "0px",
  });
  
  export const DashBoardDescriptionText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "24px",
    letterSpacing: "0px",
    color: "#212121",
    padding: "0px",
    margin: "0px",
  });

  
  export const FinancialSummaryDescriptionText = styled(Typography)({
    fontFamily: "Plus Jakarta Sans",
    fontWeight: 400,
    fontSize: "12px",
    color: "#212121",
  });
  
  
export default Section1FinancialManagement;
