import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import IconOk from '@material-ui/icons/VerifiedUser'
import IconPrint from '@material-ui/icons/Print'
import IconFile from '@material-ui/icons/FileCopy'
import { green } from '@mui/material/colors';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@material-ui/core';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));




let index = 0;

export default function Tables(props) {
    const [rows, setRows] = React.useState([])
    const [lines, setLines] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [mensagem, setMensagem] = React.useState(null);


    const API = localStorage.getItem('API-URL');

    React.useEffect(() => {
        index = 0;
        setRows([])
        resolveData();
        setLines(props.data.length)
    }, [])

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setRows([]);
        setPage(newPage);
        let contador = 0;
        for (let index = (newPage * rowsPerPage) + 1; index < props.data.length; index++) {
            if (contador < rowsPerPage) {
                const f = props.data[index];
                setRows(oldRow => [...oldRow, createData(f)])
            }
            contador++
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const resolveData = () => {
        for (let index = 0; index < rowsPerPage; index++) {
            const f = props.data[index];
            setRows(oldRow => [...oldRow, createData(f)])
        }
    }

    const iconOk = () => <IconOk sx={{ color: green[700] }} />;
    const Print = (ID) => {
        return (
            <Link to={{ pathname: "/imprimir", data: props.data[ID - 1] }}>
                <IconPrint />
            </Link>
        )
    }

    const getDocumentos = (CPF) => {
        const CPFValido = parseInt(CPF.replace(/[.-]/g, ''))
        const path = `${API}get/documento/${CPFValido}`;
        fetch(path).then(async f => {
            const data = await f.json()
            const { mensagem } = data;
            console.log(mensagem)
            if (mensagem === 'download iniciado') {
                window.location.assign(path)
            } else {
                setOpen(true);
                setMensagem(mensagem)
            }
        }).catch(f => {
            console.log(f)
        })
    }

    const DownloadDoc = (CPF) => {
        const CPFValido = CPF.replace(/[.-]/g, '')
        return (
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => getDocumentos(CPFValido)}>
                <IconFile />
            </button>
        )
    }

    function createData({ CPF, NOME, ID }) {
        index++
        const nIndex = (parseInt(CPF) * index).toString()
        return { CPF, NOME, ID, index, nIndex };
    }
    return (
        <>
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}

            >
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {mensagem}
                </Alert>
            </Snackbar>
            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>CPF Cliente</StyledTableCell>
                            <StyledTableCell align="right">Nome</StyledTableCell>
                            <StyledTableCell align="right">Status</StyledTableCell>
                            <StyledTableCell align="right">Documento</StyledTableCell>
                            <StyledTableCell align="right">Ações</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.nIndex}>
                                <StyledTableCell component="th" scope="row">{row.CPF}</StyledTableCell>
                                <StyledTableCell align="right">{row.NOME}</StyledTableCell>
                                <StyledTableCell align="right">{iconOk()}</StyledTableCell>
                                <StyledTableCell align="right">{DownloadDoc(row.CPF)}</StyledTableCell>
                                <StyledTableCell align="right">{Print(row.index)}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={lines}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Registros por página"
                labelDisplayedRows={
                    ({ from, to, count }) => {
                        return '' + from + '-' + to + ' de ' + count
                    }
                }
                sx={{ mb: 5 }}
            />
        </>
    );
}


Tables.propTypes = {
    data: PropTypes.array.isRequired
}