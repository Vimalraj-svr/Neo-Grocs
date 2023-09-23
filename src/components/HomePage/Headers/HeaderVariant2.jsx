import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import logo from './header.png';
import SearchIcon from '@mui/icons-material/Search';
import './Header.css';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%', 
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%', // Increase the width as needed
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function HeaderVariant2() {
  const [typedText, setTypedText] = useState('');
  const fullText = "Your Grocery Delivery Partner !!";
  const delay = 150;
  const [effVar, setEffVar] = useState(true);
  const [searchInput, setSearchInput] = useState(''); // State variable to receive user input

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, delay);

    return () => {
      clearInterval(typingInterval);
    };
  }, [effVar]);

  useEffect(() => {
    const toggleInterval = setInterval(() => {
      setEffVar((prevEffVar) => !prevEffVar);
    }, 10000);

    return () => {
      clearInterval(toggleInterval);
    };
  }, []);

  const handleSearch = () => {
    // Handle the search query here, e.g., perform a search or update state.
    console.log(`Searching for: ${searchInput}`);
  };

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchInput(query); // Update the state with user input
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'black', height: '100px' }}>
        <Toolbar sx={{ display: 'flex', marginTop: 'auto', marginBottom: 'auto', alignItems: 'center' }}>
          <img src={logo} style={{ width: "120px" }} alt="Logo" />
          <Typography variant="h7" component="div" sx={{ flexGrow: 1, fontFamily: 'unset', color: 'grey' }}>
            {typedText}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: '#eeb03d' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for products..."
              inputProps={{ 'aria-label': 'search' }}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              value={searchInput}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
