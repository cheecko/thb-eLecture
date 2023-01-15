import { useState } from 'react'
import { AppBar, Toolbar, Box, Menu, MenuItem, Typography, IconButton, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { MdMenu, MdViewModule } from 'react-icons/md'

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState()

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  return (
    <Box>
      <AppBar position='static' sx={{ backgroundColor: '#CC0A2F', color: 'white', boxShadow: 'none' }}>
        <Toolbar variant='dense' sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}> 
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MdMenu />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <Link to={{ pathname: '/lectures/add' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>Vorlesung anlegen</Typography>
                </MenuItem>
              </Link>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Link to={{ pathname: '/lectures/add' }} style={{ color: 'inherit', textDecoration: 'unset' }} >
              <Button 
                sx={{ display: 'flex', alignItems: 'center', color: 'white', gap: 1 }}
              >
                <MdViewModule />
                <Typography variant='subtitle2' sx={{ display: { xs: 'none', sm: 'block'} }}>
                  Vorlesung anlegen
                </Typography>
              </Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Header