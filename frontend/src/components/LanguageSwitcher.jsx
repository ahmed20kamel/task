import React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Language } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    
    // Update HTML dir attribute
    document.documentElement.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lng);
    
    // Update body direction
    document.body.setAttribute('dir', lng === 'ar' ? 'rtl' : 'ltr');
    
    handleClose();
  };

  const currentLang = i18n.language || localStorage.getItem('language') || 'ar';

  return (
    <>
      <Tooltip title={currentLang === 'ar' ? 'English' : 'العربية'}>
        <IconButton color="inherit" onClick={handleClick} sx={{ mr: 1 }}>
          <Language />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => changeLanguage('ar')} selected={currentLang === 'ar'}>
          العربية
        </MenuItem>
        <MenuItem onClick={() => changeLanguage('en')} selected={currentLang === 'en'}>
          English
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;

