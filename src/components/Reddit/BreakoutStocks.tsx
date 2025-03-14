import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    Collapse,
    Tooltip,
    Link,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Autocomplete
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Launch as LaunchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import api from '../../services/api';

interface BreakoutStock {
    symbol: string;
    breakout_reason: string;
    catalysts: string[];
    risks: string[];
    confidence_score: number;
    source_urls: string[];
}

interface BreakoutStocksProps {
    onAddToWatchlist?: (symbol: string) => Promise<void>;
}

// Default subreddits and flairs
const DEFAULT_SUBREDDITS = ['wallstreetbetselite', 'wallstreetbets', 'stocks', 'investing', 'pennystocks'];

const BreakoutStocks: React.FC<BreakoutStocksProps> = ({ onAddToWatchlist }) => {
    const [breakoutStocks, setBreakoutStocks] = useState<BreakoutStock[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedStocks, setExpandedStocks] = useState<Set<string>>(new Set());
    
    // Filter states
    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>(['wallstreetbetselite']);
    const [limit, setLimit] = useState<number>(20);

    useEffect(() => {
        fetchBreakoutStocks();
    }, []);

    const fetchBreakoutStocks = async () => {
        try {
            setLoading(true);
            const params = {
                subreddits: selectedSubreddits.join(','),
                limit
            };
            
            console.log('API Request Parameters:', params);
            
            const response = await api.getBreakoutSuggestions(params);
            console.log('Raw API Response:', response);
            console.log('Response Type:', typeof response);
            console.log('Response Keys:', Object.keys(response));
            
            if (!response) {
                console.error('Empty response received from server');
                setError('No response received from the server');
                setBreakoutStocks([]);
                return;
            }

            if (!response.analysis) {
                console.error('Response missing analysis field. Full response:', response);
                setError('Server response missing analysis data');
                setBreakoutStocks([]);
                return;
            }

            try {
                console.log('Analysis field content:', response.analysis);
                const analysis = JSON.parse(response.analysis);
                console.log('Parsed analysis:', analysis);
                
                if (!analysis.breakout_candidates || analysis.breakout_candidates.length === 0) {
                    setError('No breakout stocks identified in the current analysis');
                    setBreakoutStocks([]);
                } else {
                    setBreakoutStocks(analysis.breakout_candidates);
                    setError(null);
                }
            } catch (parseError) {
                console.error('Error parsing analysis:', parseError);
                console.error('Raw analysis string:', response.analysis);
                setError('Invalid analysis data received from the server');
                setBreakoutStocks([]);
            }
        } catch (err: any) {
            console.error('Error fetching breakout stocks:', err);
            if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
            }
            setError('Failed to connect to the server. Please try again later.');
            setBreakoutStocks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleExpandClick = (symbol: string) => {
        setExpandedStocks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(symbol)) {
                newSet.delete(symbol);
            } else {
                newSet.add(symbol);
            }
            return newSet;
        });
    };

    const handleAddToWatchlist = async (symbol: string) => {
        if (onAddToWatchlist) {
            try {
                await onAddToWatchlist(symbol);
            } catch (err) {
                console.error('Error adding to watchlist:', err);
            }
        }
    };

    const handleRefresh = () => {
        fetchBreakoutStocks();
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TrendingUpIcon color="primary" />
                        Potential Breakout Stocks
                    </Typography>
                    <Button
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Box>

                {/* Filters */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                    <Autocomplete
                        multiple
                        options={DEFAULT_SUBREDDITS}
                        value={selectedSubreddits}
                        onChange={(_, newValue) => setSelectedSubreddits(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Subreddits"
                                placeholder="Select subreddits"
                                size="small"
                            />
                        )}
                        size="small"
                    />
                    <TextField
                        type="number"
                        label="Post Limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        size="small"
                        inputProps={{ min: 1, max: 100 }}
                    />
                </Stack>

                {loading ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : breakoutStocks.length === 0 ? (
                    <Alert severity="info">No breakout stock candidates found at the moment.</Alert>
                ) : (
                    <List>
                        {breakoutStocks.map((stock) => (
                            <React.Fragment key={stock.symbol}>
                                <ListItem
                                    divider
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleExpandClick(stock.symbol)}
                                        >
                                            {expandedStocks.has(stock.symbol) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    }
                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="subtitle1" component="span">
                                                    {stock.symbol}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    label={`${(stock.confidence_score * 100).toFixed(0)}% confidence`}
                                                    color={stock.confidence_score > 0.7 ? 'success' : 'warning'}
                                                />
                                                {onAddToWatchlist && (
                                                    <Tooltip title="Add to Watchlist">
                                                        <Chip
                                                            size="small"
                                                            label="Add to Watchlist"
                                                            onClick={() => handleAddToWatchlist(stock.symbol)}
                                                            sx={{ cursor: 'pointer' }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        }
                                        secondary={stock.breakout_reason}
                                    />
                                </ListItem>
                                <Collapse in={expandedStocks.has(stock.symbol)}>
                                    <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Catalysts:
                                        </Typography>
                                        <List dense>
                                            {stock.catalysts.map((catalyst, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={catalyst} />
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                                            Risks:
                                        </Typography>
                                        <List dense>
                                            {stock.risks.map((risk, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText primary={risk} />
                                                </ListItem>
                                            ))}
                                        </List>

                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Sources:
                                            </Typography>
                                            {stock.source_urls.map((url, index) => (
                                                <Link
                                                    key={index}
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={0.5}
                                                    mb={0.5}
                                                >
                                                    Reddit Discussion <LaunchIcon fontSize="small" />
                                                </Link>
                                            ))}
                                        </Box>
                                    </Box>
                                </Collapse>
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default BreakoutStocks; 