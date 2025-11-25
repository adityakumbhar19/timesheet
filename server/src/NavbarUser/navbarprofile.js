import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { Avatar } from "@mui/material";
import LogoPDF from '../time.png';
import { green } from '@mui/material/colors';

function Navbarprofile() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');
  const role = sessionStorage.getItem('role');
  const firstLetter = username ? username.charAt(0).toUpperCase() : "";

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  }

  const handleLogs = () => {
    navigate('/reports');
  }

  const handleTimeEntry = () => {
    navigate('/home');
  }

  return (
    <Box sx={{ flexGrow: 1 }} width={'100%'}>
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <img src={LogoPDF} alt='logo' style={{ width: '50px', height: '50px' }} />
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, marginLeft: '10px' }}>
            Time Sheet
          </Typography>
          <Avatar sx={{ bgcolor: '#00e676' }}>{firstLetter}</Avatar>
          <Button color="info" variant='outlined' shape="rounded-pill" style={{ marginLeft: '20px', borderRadius: '10px' }} onClick={handleTimeEntry}>Time Entry</Button>
          {(role === 'Team Leader' || role === 'ADMIN') && (
            <Button color="success" variant='outlined' shape="rounded-pill" style={{ marginLeft: '20px', borderRadius: '10px' }} onClick={handleLogs}>Reports</Button>
          )}
          <Button color="error" variant='outlined' shape="rounded-pill" style={{ marginLeft: '20px', marginRight: '30px', borderRadius: '10px' }} onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbarprofile;
