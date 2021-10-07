import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';


import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import IconCPF from '@material-ui/icons/RecentActors';
import IconConfiguracoes from '@material-ui/icons/Settings';
import IconExport from '@material-ui/icons/CloudDownload';

import User from '../../assets/imagens/usuario.png'

import PropTypes from 'prop-types';
import './style.css';
import { Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

Menu.propTypes = {
    opened: PropTypes.bool.isRequired,
    closeMenu: PropTypes.func.isRequired,
    openMenu: PropTypes.func.isRequired
}

export default function Menu(props) {
    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={props.closeMenu}
            onKeyDown={props.closeMenu}
        >
            <img className="user" src={User} alt="" />
            <Typography className="title">
                Barão Cred
            </Typography>
            <Divider />
            <List>
                <Link to="/importar">
                    <ListItem button key={'Adicionar CPFS'}>
                        <ListItemIcon>
                            <IconCPF />
                        </ListItemIcon>
                        <ListItemText primary="Adicionar CPFS" />
                    </ListItem>
                </Link>
                <Link to="/configuracoes">
                    <ListItem button key={'Configurações'}>
                        <ListItemIcon>
                            <IconConfiguracoes />
                        </ListItemIcon>
                        <ListItemText primary="Configurações" />
                    </ListItem>
                </Link>
                <Link to="/acompanhar">
                    <ListItem button key={'Andamento'}>
                        <ListItemIcon>
                            <IconExport />
                        </ListItemIcon>
                        <ListItemText primary="Acompanhar e Exportar" />
                    </ListItem>
                </Link>
                <Link to="/">
                    <ListItem button key={'Equatorial'}>
                        <ListItemIcon>
                            <IconExport />
                        </ListItemIcon>
                        <ListItemText primary="Equatorial" />
                    </ListItem>
                </Link>

            </List>
        </Box>
    );

    return (
        <div>
            <React.Fragment key={'left'}>
                <SwipeableDrawer
                    anchor={'left'}
                    open={props.opened}
                    onClose={props.closeMenu}
                    onOpen={props.openMenu}
                >
                    {list('left')}
                </SwipeableDrawer>
            </React.Fragment>
        </div>
    );
}

