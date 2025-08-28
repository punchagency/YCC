import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

const ServiceCardSkeleton = () => {
  return (
    <Card 
      sx={{ 
        borderRadius: 4, 
        boxShadow: 0, 
        background: '#f5f8fa', 
        p: 2, 
        height: '400px',
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <CardContent 
        sx={{ 
          p: 0,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 0 }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Skeleton variant="circular" width={56} height={56} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={28} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3, mt: 0.5 }} />
          </Box>
        </Stack>
        
        <Box sx={{ flex: 1, mt: 1 }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="text" width="70%" height={20} />
        </Box>
        
        <Stack spacing={1} mt={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="60%" height={20} />
          </Stack>
          {/* <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="70%" height={20} />
          </Stack> */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="40%" height={20} />
          </Stack>
        </Stack>
        
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height={40} 
          sx={{ borderRadius: 2, mt: 2 }} 
        />
      </CardContent>
    </Card>
  );
};

export default ServiceCardSkeleton;