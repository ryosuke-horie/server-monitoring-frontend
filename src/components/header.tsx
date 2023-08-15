import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            サーバー監視効率化ツール
          </Typography>
          <Button color="inherit"><Link href="/signin">SignIn</Link></Button>
          <Button color="inherit"><Link href="/signup">SignUp</Link></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}