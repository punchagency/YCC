import { Box, Typography, styled,Skeleton } from "@mui/material";
import icon1 from "../../../../assets/images/icons/financial-management/Icon1.png";
import icon2 from "../../../../assets/images/icons/financial-management/Icon2.png";
import icon3 from "../../../../assets/images/icons/financial-management/Icon3.png";

const Section1FinancialManagement = ({ metrics, loading }) => {
    const data = metrics && metrics.length > 0
    ?[
        {
          title: metrics[0]?.title || "N/A",
          value: metrics[0]?.total || 0,
          backgroundColor: "#E3E7FF",
          icon: icon1,
        },
        {
          title: metrics[1]?.title || "N/A",
          value: metrics[1]?.total || 0,
          backgroundColor: "#FFFFD0",
          icon: icon2,
        },
        {
          title: metrics[2]?.title || "N/A",
          value: metrics[2]?.total || 0,
          backgroundColor: "#E0F1E0",
          icon: icon3,
        }
      ]
    : [];
      
  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((item, index) => (
        <Box
          key={index}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "17px",
            height: "100%",
            width: "100%",
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
            <Skeleton variant="circular" width={25} height={25} sx={{ marginBottom: "5px" }} />
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} />
          </Box>
        </Box>
      ))}
    </>
  );
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
        { loading ? renderSkeletons() : metrics && data.map((item, index) => (
            <Box
                key={index}
                sx={{
                    backgroundColor: item?.backgroundColor,
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
            <img src={item?.icon} alt={item?.title} style={{ width: "25px", height: "25px", marginBottom: "5px" }} />
              <DashBoardTitleText>{item?.title}</DashBoardTitleText>
              <DashBoardDescriptionText>${item?.value}</DashBoardDescriptionText>
        
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
