import { Box, Card, CardContent, CardActions, Skeleton, Stack } from '@mui/material';

const ServiceCardSkeleton = () => {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: '#f5f5f5',
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Image Section Skeleton */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            transition: 'opacity 0.2s ease-in-out',
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {/* Header Section Skeleton */}
        <Box>
          <Skeleton
            variant="text"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              mb: 1,
            }}
            width="85%"
          />

          {/* Categories Skeleton */}
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 3 }} />
          </Stack>
        </Box>

        {/* Description Skeleton */}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="100%" height={16} />
          <Skeleton variant="text" width="95%" height={16} />
          <Skeleton variant="text" width="75%" height={16} />
        </Box>

        {/* Contact Information Skeleton */}
        <Stack spacing={1.5}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width="70%" height={16} />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="text" width="60%" height={16} />
          </Stack>
        </Stack>
      </CardContent>

      {/* Action Button Skeleton */}
      <CardActions
        sx={{
          p: 2,
          pt: 0,
          mt: 'auto',
          justifyContent: 'stretch',
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          sx={{
            borderRadius: 1.5,
            background: 'linear-gradient(90deg, #0487D9 0%, #034D92 100%)',
          }}
        />
      </CardActions>
    </Card>
  );
};

export default ServiceCardSkeleton;