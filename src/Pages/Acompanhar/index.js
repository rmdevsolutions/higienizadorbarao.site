import * as React from 'react';
// import { styled } from '@mui/material/styles';
import NavBar from '../../Componentes/Navbar'
import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button, Container, Typography } from '@mui/material';
// import { grey } from '@mui/material/colors';
import CloudDownload from '@material-ui/icons/CloudDownload';
import ErrorZero from '@material-ui/icons/Error'
import Tables from '../../Componentes/Tabela';
import LinearProgress from '@mui/material/LinearProgress';
import './styles.css'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import aguardandoPesquisa from '../../assets/imagens/aguardandoPesquisa.png';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@material-ui/core';
import BackDrop from '../../Componentes/Backdrop';

export default function Acompanhar() {
    const [listagens, setListagens] = React.useState([]);
    const [exibir, setExibicao] = React.useState(false);
    const [dataTable, setDataTable] = React.useState([]);
    const [feitos, setFeitos] = React.useState(0);
    const [total, setTotal] = React.useState(0);
    const [idListagem, setIdListagem] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [mensagem, setMensagem] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const API = localStorage.getItem('API-URL');

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (csvData, fileName) => {
        setLoading(true)
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });

        FileSaver.saveAs(data, fileName + fileExtension);
        setLoading(false)
    }

    const consultarListagem = ({ key }) => {
        if (key !== null) {
            setIdListagem(key)
            Promise.all([
                fetch(`${API}get/clientes/${key}`).then(async e => {
                    const lista = await e.json();
                    if (lista.length > 0) {
                        const { data, quantidadeImputados, quantidadeRealizados } = lista;
                        setDataTable(data);
                        setFeitos(quantidadeRealizados);
                        setTotal(quantidadeImputados);
                        setExibicao(true)
                    } else {
                        setExibicao(false)
                    }
                }).catch(e => console.log(e))
            ]).finally(f => {
                setLoading(false)
            })
        }
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    const zerarErros = () => {
        setLoading(true)
        fetch(`${API}zerarerros/${idListagem}`).then(async f => {
            const data = await f.json();
            const { success } = data;
            if (success) {
                setMensagem('Os Itens com erros foram zerados na base de dados');
                setOpen(true)
            }
        }).finally(() => setLoading(false))
    }

    React.useEffect(() => {
        fetch(`${API}get/importacoes`).then(async e => {
            const lista = await e.json();
            setListagens(lista)
        })
    }, [])

    // const Item = styled(Paper)(({ theme }) => ({
    //     ...theme.typography.body2,
    //     padding: theme.spacing(1),
    //     textAlign: 'center',
    //     color: theme.palette.text.secondary,
    //     height: 150,
    //     display: 'flex',
    //     justifyContent: 'start',
    //     alignItems: 'center',
    //     background: grey[200],

    // }));

    return (
        <>
            <NavBar />
            <BackDrop open={loading} />
            <Container maxWidth="xl" sx={{ mt: 5 }}>
                <>
                    <Box sx={{ flexGrow: 1, mb: 5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={listagens}
                                    onChange={(event, value) => {
                                        if (value !== null) {
                                            setLoading(true);
                                            consultarListagem(value)
                                        } else {
                                            setExibicao(false)
                                        }
                                    }}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => <TextField {...params} label="Selecione a Listagem" />}
                                />
                            </Grid>



                            {exibir ? (
                                <>
                                    <Snackbar
                                        open={open}
                                        autoHideDuration={6000}
                                        onClose={handleClose}

                                    >
                                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                                            {mensagem}
                                        </Alert>
                                    </Snackbar>
                                    <Grid item xs={12}>
                                        <Typography>Processando...</Typography>
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                        </Box>
                                        <Typography sx={{ textAlign: 'right' }}>{feitos}/{total}</Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={12} lg={12} md={12}>
                                        <div className="contained">
                                            <Button variant="contained" onClick={(e) => exportToCSV(dataTable, 'Exportacao')} color="success">
                                                <CloudDownload />&nbsp;&nbsp;Exportar
                                            </Button>

                                            <Button sx={{ ml: 2 }} variant="contained" onClick={(e) => zerarErros()} color="error">
                                                <ErrorZero />&nbsp;&nbsp;Zerar Erros
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        {exibir && <Tables data={dataTable} />}
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <h1 style={{ textAlign: 'center' }}>Aguardando filtro</h1>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <img style={{
                                                width: 300,
                                                display: 'flex',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }} src={aguardandoPesquisa} />
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Grid>

                    </Box>

                </>

            </Container>
        </>
    );
}
