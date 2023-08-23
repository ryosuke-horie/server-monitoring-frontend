import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            サーバー監視効率化ツール
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" passHref>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                サーバー監視記録ページ
              </button>
            </Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/report_list" passHref>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                月別監視記録レポート一覧
              </button>
            </Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/signin" passHref>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                SignIn
              </button>
            </Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/signup" passHref>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                SignUp
              </button>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
