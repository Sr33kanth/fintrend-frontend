import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ForumIcon from '@mui/icons-material/Forum';
import NewsCard from '../News/NewsCard';
import BreakoutStocks from '../Reddit/BreakoutStocks';
import BreakoutsCard from '../Reddit/BreakoutsCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`left-pane-tabpanel-${index}`}
      aria-labelledby={`left-pane-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `left-pane-tab-${index}`,
    'aria-controls': `left-pane-tabpanel-${index}`,
  };
}

interface LeftPaneProps {
  news: any;
  loading: boolean;
  selectedSource: string | null;
  onSourceChange: (source: string | null) => void;
  onAddToWatchlist: (symbol: string) => Promise<void>;
}

const LeftPane: React.FC<LeftPaneProps> = ({ 
  news, 
  loading, 
  selectedSource, 
  onSourceChange,
  onAddToWatchlist
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [breakoutsLoading, setBreakoutsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="left pane tabs"
          variant="fullWidth"
        >
          <Tab 
            icon={<NewspaperIcon />} 
            label="News" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<ForumIcon />} 
            label="Reddit Posts" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<TrendingUpIcon />} 
            label="Breakout Analysis" 
            {...a11yProps(2)} 
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <NewsCard 
          news={news} 
          loading={loading} 
          selectedSource={selectedSource}
          onSourceChange={onSourceChange}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <BreakoutsCard 
          loading={breakoutsLoading}
          setLoading={setBreakoutsLoading}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <BreakoutStocks onAddToWatchlist={onAddToWatchlist} />
      </TabPanel>
    </Box>
  );
};

export default LeftPane; 