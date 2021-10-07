import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Container, Typography } from '@mui/material';
import './styles.css'
import PropTypes from 'prop-types'

export default function Imprimir(props) {
    const [arrayDados, setArrayDados] = React.useState([])

    React.useEffect(() => {
        if (props.location.data !== undefined) {
            setArrayDados([props.location.data])
        }
        console.log([arrayDados])
        console.log(props)
    }, [])

    const renderOuterBody = (obj, index) => {
        const body = [];
        let contador = 0;
        Object.entries(obj).forEach(([key, value]) => {
            const nkey = String(key).replace('_', ' ')
            contador++
            const classePar = contador % 2 === 0 ? 'item item-par' : 'item item-impar'
            const subClassePar = contador % 2 === 0 ? 'sub-item item-par' : 'sub-item item-impar'
            body.push(
                <>
                    <Grid className={classePar} item xs={4} >
                        <Typography>{nkey}</Typography>
                    </Grid>
                    <Grid className={subClassePar} item xs={8} >
                        <Typography>{value}</Typography>
                    </Grid>

                </>
            )
        });

        return body;
    }
    return (

        <>
            <Container className="container">
                <Typography className="titulo" variant="h4">Informações do Cliente</Typography>
                <Box className="box">
                    <Grid container rowSpacing={0} spacing={0}>
                        {arrayDados.map((f, index) => {
                            return renderOuterBody(f, index)
                        })
                        }
                    </Grid>
                </Box>
            </Container>
        </>
    )
}

Imprimir.propTypes = {
    data: PropTypes.array
}

Imprimir.defaultProps = {
    data: []
};

