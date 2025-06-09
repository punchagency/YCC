import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Avatar, Chip, Stack } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import EmailIcon from '@mui/icons-material/Email'
import YachtIcon from '@mui/icons-material/DirectionsBoat'
import CaptainIcon from '@mui/icons-material/Person'
import EngineeringIcon from '@mui/icons-material/Build'

const cardData = [
  {
    logo: '', // Placeholder for logo image, use Avatar fallback
    company: 'Oceanic Yacht Services',
    categories: ['Captain', 'Engineering'],
    description: 'Premium yacht maintenance, navigation and crew services for luxury vessels worldwide.',
    location: 'Fort Lauderdale, FL',
    rating: 4.9,
    reviews: 86,
    email: 'info@oceanic.yacht.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <YachtIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'Oceanic Yacht Services',
    categories: ['Captain', 'Engineering'],
    description: 'Premium yacht maintenance, navigation and crew services for luxury vessels worldwide.',
    location: 'Fort Lauderdale, FL',
    rating: 4.9,
    reviews: 86,
    email: 'info@oceanic.yacht.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <CaptainIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'Oceanic Yacht Services',
    categories: ['Captain', 'Engineering'],
    description: 'Premium yacht maintenance, navigation and crew services for luxury vessels worldwide.',
    location: 'Fort Lauderdale, FL',
    rating: 4.9,
    reviews: 86,
    email: 'info@oceanic.yacht.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <EngineeringIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
  {
    logo: '',
    company: 'Oceanic Yacht Services',
    categories: ['Captain', 'Engineering'],
    description: 'Premium yacht maintenance, navigation and crew services for luxury vessels worldwide.',
    location: 'Fort Lauderdale, FL',
    rating: 4.9,
    reviews: 86,
    email: 'info@oceanic.yacht.com',
    avatarBg: '#e3f2fd',
    avatarIcon: <YachtIcon sx={{ color: '#0487D9', fontSize: 32 }} />,
  },
];

const gradientButton = {
  background: 'linear-gradient(90deg, #0487D9 0%, #034D92 100%)',
  color: '#fff',
  fontWeight: 600,
  borderRadius: 2,
  textTransform: 'none',
  fontSize: 16,
  boxShadow: 'none',
  mt: 2,
  '&:hover': {
    background: 'linear-gradient(90deg, #034D92 0%, #0487D9 100%)',
    boxShadow: 'none',
  },
};

const ResourceCenterSection4 = () => (
  <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, py: 6 }}>
    <Grid container spacing={4} sx={{ maxWidth: 1200 }}>
      {cardData.map((card, idx) => (
        <Grid item xs={12} md={6} key={idx}>
          <Card sx={{ borderRadius: 4, boxShadow: 0, background: '#f5f8fa', p: 2 }}>
            <CardContent sx={{ pb: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: card.avatarBg }}>
                  {card.avatarIcon}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0 }}>{card.company}</Typography>
                  <Stack direction="row" spacing={1} mt={0.5}>
                    {card.categories.map((cat) => (
                      <Chip
                        key={cat}
                        label={cat}
                        size="small"
                        sx={{ bgcolor: '#b3e0fc', color: '#034D92', fontWeight: 600, fontSize: 14 }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
              <Typography sx={{ color: '#222', fontSize: 16, mb: 2, mt: 1 }}>{card.description}</Typography>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <LocationOnIcon sx={{ color: '#0487D9' }} />
                <Typography sx={{ color: '#222', fontWeight: 500, fontSize: 15 }}>{card.location}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <StarIcon sx={{ color: '#FFD600', fontSize: 22 }} />
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>{card.rating}</Typography>
                <Typography sx={{ color: '#555', fontSize: 15 }}>({card.reviews} reviews)</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <EmailIcon sx={{ color: '#0487D9' }} />
                <Typography sx={{ color: '#222', fontSize: 15, wordBreak: 'break-all' }}>{card.email}</Typography>
              </Stack>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
              <Button fullWidth variant="contained" sx={gradientButton}>
                Request Quote
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default ResourceCenterSection4;
