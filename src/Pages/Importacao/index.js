import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NavBar from '../../Componentes/Navbar';
import { Container, Grid } from '@mui/material';
import FileUpload from '../../Componentes/FileUpload';
import readXlsxFile from 'read-excel-file';
import { DataGrid } from '@mui/x-data-grid';

import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@material-ui/core';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const steps = ['Selecionar arquivo xlsx', 'Validar Informações', 'Salvar Listagem'];
const columns = [
    { field: 'CPF', headerName: 'CPF', width: 200 }
]


export default function HorizontalNonLinearStepper() {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const [newUserInfo, setNewUserInfo] = React.useState({
        profileImages: []
    });
    const [dataInfo, setDataInfo] = React.useState([]);
    const [dataGrid, setDataGrid] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [mensagem, setMensagem] = React.useState(null);

    const API = localStorage.getItem('API-URL');

    const updateUploadedFiles = async (files) => {
        setNewUserInfo({ ...newUserInfo, profileImages: files });
        console.log(...files)
        await leituraExcel(...files)
    }

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        if (dataGrid.length > 0 || dataInfo.length > 0) {
            const newActiveStep =
                isLastStep() && !allStepsCompleted()
                    ? // It's the last step, but not all steps have been completed,
                    // find the first step that has been completed
                    steps.findIndex((step, i) => !(i in completed))
                    : activeStep + 1;
            setActiveStep(newActiveStep);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleComletareFinalizar = () => {
        const newCompleted = completed;
        newCompleted[0] = true;
        newCompleted[1] = true;
        newCompleted[2] = true;
        setCompleted(newCompleted);
        setDataGrid([]);
        setDataInfo([]);
        handleNext();
        handleReset();
    }

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const leituraExcel = async (files) => {
        const rowss_ = [];
        new Promise(async resolve => {
            const rows = await readXlsxFile(files);
            const nrow = [...rows]

            nrow.map(f => {
                rowss_.push({
                    CPF: f[0],
                    ID: Math.random()
                })
            })
            resolve(true)
            setDataGrid(rowss_)
            setActiveStep(1)
        })
    }

    const enviarArquivo = () => {
        setOpenBackdrop(true)
        const datascond = new Date();
        Promise.all([
            fetch(`${API}insert/importacoes`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: dataGrid, nome: newUserInfo.profileImages[0].name + datascond.getFullYear() + datascond.getDate() + datascond.getMilliseconds() })
            }).then(async f => {
                const a = await f.json()
                if (a.mensagem === 'sucesso') {
                    handleComletareFinalizar()
                    setMensagem('Itens Incluidos na base!');
                    setOpen(true)
                    setOpenBackdrop(false)
                }
            })
        ])
    }

    const renderStep = (id) => {
        switch (id) {
            case 1:
                return (
                    <FileUpload
                        accept=".xls, .xlsx"
                        label="Arquivos Upload"
                        updateFilesCb={updateUploadedFiles}
                    />
                )
            case 2:
                return (
                    <DataGrid
                        rows={dataGrid}
                        columns={columns}
                        pageSize={100}
                        rowsPerPageOptions={[100, 200, 300, 400]}
                        checkboxSelection
                        getRowId={(row) => row.ID}
                    />
                )
            case 3:
                return (
                    <Container maxWidth="xl">
                        <Grid container>
                            <Grid item xl={12}>
                                <Typography>Clique em Salvar Base para finalizar a importação.</Typography>
                                <Button onClick={enviarArquivo} variant="contained">Salvar Base</Button>
                            </Grid>
                        </Grid>
                    </Container>
                )
            default:
                break;
        }
    }
    return (
        <>
            <NavBar />
            <Container maxWidth="xl" sx={{ mt: 5 }}>
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
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackdrop}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <Typography variant="h4" sx={{ mb: 5 }}>Fluxo de Importação </Typography>
                    <Box sx={{ flexGrow: 1, mb: 5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} >
                                <Box sx={{ width: '100%' }}>
                                    <Stepper nonLinear activeStep={activeStep}>
                                        {steps.map((label, index) => (
                                            <Step key={label} completed={completed[index]}>
                                                <StepButton color="inherit" >
                                                    {label}
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    <div>
                                        {allStepsCompleted() ? (
                                            <React.Fragment>
                                                <Typography sx={{ mt: 2, mb: 1 }}>
                                                    All steps completed - you&apos;re finished
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                    <Box sx={{ flex: '1 1 auto' }} />
                                                    <Button onClick={handleReset}>Reiniciar</Button>
                                                </Box>
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', pt: 2, minHeight: 500 }}>
                                                    {renderStep(activeStep + 1)}
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                    <Button
                                                        color="inherit"
                                                        disabled={activeStep === 0}
                                                        onClick={handleBack}
                                                        sx={{ mr: 1 }}
                                                    >
                                                        Voltar
                                                    </Button>
                                                    <Box sx={{ flex: '1 1 auto' }} />
                                                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                                                        Avançar
                                                    </Button>
                                                    {activeStep !== steps.length &&
                                                        (completed[activeStep] ? (
                                                            <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                                                Step {activeStep + 1} already completed
                                                            </Typography>
                                                        ) : (
                                                            <></>
                                                        ))}
                                                </Box>
                                            </React.Fragment>
                                        )}
                                    </div>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            </Container>
        </>
    );
}