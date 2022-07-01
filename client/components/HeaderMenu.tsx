import React, { useState } from 'react'
import { AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { ChevronLeft, MenuOpen, MenuBook, Add } from '@mui/icons-material'

const drawerWidth = 240;

const listItems = [
  { title: 'Saved Recipes', icon: <MenuBook />},
  { title: 'New Recipe', icon: <Add />}
]

export const HeaderMenu = () => {
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <>
      <AppBar 
        position={'fixed'}
        sx={{
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        }}
        >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2,
                display: open && 'none'
              }}
            >
            <MenuOpen />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Recipe App Name
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Paper
          sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>

          <IconButton onClick={handleDrawerClose}>
            <ChevronLeft />
          </IconButton>
        </Paper>
        <Divider />
        <List>
          <ListItem sx={{ py: 2, px: 2 }}>
            <ListItemText>Home</ListItemText>
          </ListItem>
          {listItems.map(({title, icon}) => (
            <ListItem key={title} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
