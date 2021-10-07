import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';

export default function BackDrop(props) {

    // const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const { open } = props;
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

BackDrop.propTypes = {
    open: PropTypes.bool.isRequired
}