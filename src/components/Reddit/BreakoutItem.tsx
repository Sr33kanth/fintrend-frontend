import React from 'react';
import { 
  Paper, 
  Typography, 
  Link, 
  Box, 
  Chip, 
  Stack,
  Tooltip
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import CommentIcon from '@mui/icons-material/Comment';
import RedditIcon from '@mui/icons-material/Reddit';

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

interface BreakoutItemProps {
  post: RedditPost;
}

const BreakoutItem: React.FC<BreakoutItemProps> = ({ post }) => {
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          <Link href={post.url} target="_blank" rel="noopener noreferrer" underline="hover" color="inherit">
            {post.headline}
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Upvotes">
            <Chip 
              icon={<ArrowUpwardIcon />} 
              label={post.upvotes} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Tooltip>
          <Tooltip title="Comments">
            <Chip 
              icon={<CommentIcon />} 
              label={post.comments} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
          </Tooltip>
        </Box>
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {post.summary}
      </Typography>
      
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Chip 
          icon={<RedditIcon />} 
          label={`r/${post.subreddit}`} 
          size="small" 
          color="default" 
          variant="outlined"
        />
        {post.flair && (
          <Chip 
            label={post.flair} 
            size="small" 
            color="success" 
            variant="outlined"
          />
        )}
        <Chip 
          label={formatDate(post.datetime)} 
          size="small" 
          color="default" 
          variant="outlined"
        />
      </Stack>
    </Paper>
  );
};

export default BreakoutItem; 