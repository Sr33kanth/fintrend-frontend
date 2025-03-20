import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MessageIcon from '@mui/icons-material/Message';

interface RedditTrendsProps {
  data: any;
  onAddToWatchlist: (symbol: string) => Promise<void>;
}

export const RedditTrends: React.FC<RedditTrendsProps> = ({ data, onAddToWatchlist }) => {
  if (!data || !data.length) {
    return (
      <Typography variant="body1" color="text.secondary" textAlign="center">
        No trending stocks found
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {data.map((item: any, index: number) => (
        <React.Fragment key={item.symbol}>
          <ListItem
            alignItems="flex-start"
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {item.symbol}
                  </Typography>
                  <Chip
                    label="Add to Watchlist"
                    onClick={() => onAddToWatchlist(item.symbol)}
                    color="primary"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUpIcon color="success" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Mentions: {item.mentions}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <MessageIcon color="info" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      Sentiment: {item.sentiment}
                    </Typography>
                  </Box>
                </Box>

                {item.topPosts && item.topPosts.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Top Posts:
                    </Typography>
                    <List dense>
                      {item.topPosts.slice(0, 3).map((post: any, postIndex: number) => (
                        <ListItem key={postIndex} sx={{ px: 0 }}>
                          <ListItemText
                            primary={post.title}
                            secondary={`${post.subreddit} • ${post.score} points`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </ListItem>
          {index < data.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default RedditTrends; 