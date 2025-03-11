import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Divider, 
  Typography, 
  Box, 
  CircularProgress, 
  Stack,
  Chip
} from '@mui/material';
import RedditIcon from '@mui/icons-material/Reddit';
import api from '../../services/api';
import BreakoutItem from './BreakoutItem';

interface BreakoutsCardProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

interface RedditPost {
  headline: string;
  summary: string;
  url: string;
  source: string;
  subreddit: string;
  datetime: string;
  upvotes: number;
  comments: number;
  platform: string;
  flair?: string;
}

const BreakoutsCard: React.FC<BreakoutsCardProps> = ({ loading, setLoading }) => {
  const [breakoutPosts, setBreakoutPosts] = useState<RedditPost[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBreakoutPosts = async () => {
      try {
        setLoading(true);
        const data = await api.getRedditBreakouts(20);
        setBreakoutPosts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching breakout posts:", err);
        setError(err.detail || 'Failed to load breakout posts');
        setBreakoutPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakoutPosts();
  }, [setLoading]);

  return (
    <Card elevation={2}>
      <CardHeader
        avatar={<RedditIcon color="primary" />}
        title="Reddit Breakouts"
        subheader={loading ? 'Loading posts...' : `${breakoutPosts.length} posts`}
      />
      <Divider />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ py: 2 }}>
            {error}
          </Typography>
        ) : breakoutPosts.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
            No breakout posts found.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {breakoutPosts.map((post, index) => (
              <BreakoutItem key={index} post={post} />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default BreakoutsCard; 