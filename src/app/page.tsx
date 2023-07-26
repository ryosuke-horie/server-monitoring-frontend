import * as React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import AddTaskIcon from '@mui/icons-material/AddTask';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import Typography from '@mui/material/Typography';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';


export default function Home() {

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={12}>
          <Typography sx={{ fontSize: 40 }} color="text.first">サーバー監視</Typography>
        </Grid>

        <Grid xs={2}>
          <KeyboardArrowLeftIcon sx={{ fontSize: 32 }}/>  
        </Grid>
        <Grid xs={4}>
          <Typography sx={{ fontSize: 32 }} color="text.secondary">2023/07/27</Typography>
        </Grid>
        <Grid xs={2}>
          <KeyboardArrowRightIcon sx={{ fontSize: 32 }}/>  
        </Grid>
        <Grid xs={2}>
          <AddTaskIcon sx={{ fontSize: 32 }}/>
        </Grid>
        <Grid xs={2}>
          <RestartAltIcon sx={{ fontSize: 32 }}/>
        </Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 24 }}>監視対象</Typography></Grid>
        <Grid xs={2}><Typography sx={{ fontSize: 24 }}>項目1</Typography></Grid>
        <Grid xs={2}><Typography sx={{ fontSize: 24 }}>項目2</Typography></Grid>
        <Grid xs={2}><Typography sx={{ fontSize: 24 }}>項目3</Typography></Grid>
        <Grid xs={4}><Typography sx={{ fontSize: 24 }}>特記事項など</Typography></Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 20 }}>ビスタ</Typography></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={4}><TextField id="outlined-basic" /></Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 20 }}>ビスタ</Typography></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={4}><TextField id="outlined-basic" /></Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 20 }}>ビスタ</Typography></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={4}><TextField id="outlined-basic" /></Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 20 }}>ビスタ</Typography></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={4}><TextField id="outlined-basic" /></Grid>

        <Grid xs={2}><Typography sx={{ fontSize: 20 }}>ビスタ</Typography></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={2}><Checkbox sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }} /></Grid>
        <Grid xs={4}><TextField id="outlined-basic" /></Grid>
      </Grid>
    </Box>
  )
}
